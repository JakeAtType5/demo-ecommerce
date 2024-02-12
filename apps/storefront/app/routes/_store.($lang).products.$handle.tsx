import shopify from "@demo-ecommerce/sanity/src/schema/objects/seo/shopify";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PortableTextBlock } from "@portabletext/types";
import { Await, useLoaderData, useParams } from "@remix-run/react";
import type { ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import {
  flattenConnection,
  getSelectedProductOptions,
  Money,
  type SeoConfig,
  type SeoHandleFunction,
  ShopifyAnalyticsProduct,
} from "@shopify/hydrogen";
import type {
  MediaConnection,
  MediaImage,
  Product,
  ProductOption,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import { AnalyticsPageType } from "@shopify/hydrogen-react";
import {
  defer,
  type LoaderFunctionArgs,
  redirect,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { SanityPreview } from "hydrogen-sanity";
import { Suspense, useEffect, useState } from "react";
import invariant from "tiny-invariant";

import DropPreview from "~/components/drop/Preview";
import PortableText from "~/components/portableText/PortableText";
import CustomiseProduct from "~/components/product/Customise";
import ProductHero from "~/components/product/Hero";
import ProductCollection from "~/components/product/ProductCollection";
import StickyProductHeader from "~/components/product/StickyHeader";
import { baseLanguage } from "~/data/countries";
import {
  addWorkingDays,
  getIpData,
  getZone,
  shippingZones,
} from "~/lib/delivery-utils";
import type {
  SanityFaqs,
  SanityProductPage,
  SanityProductPreview,
} from "~/lib/sanity";
import {
  fetchGids,
  fetchGidsForProductIds,
  formatDate,
  notFound,
  useGids,
  validateLocale,
} from "~/lib/utils";
import { getAllVariants } from "~/lib/variants";
import {
  PRODUCT_PAGE_QUERY,
  PRODUCTS_IN_DROP_QUERY,
} from "~/queries/sanity/product";
import { PRODUCT_QUERY, VARIANTS_QUERY } from "~/queries/shopify/product";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => {
  const media = flattenConnection<MediaConnection>(data.product?.media).find(
    (media) => media.mediaContentType === "IMAGE"
  ) as MediaImage | undefined;

  return {
    title:
      data?.page?.seo?.title ??
      data?.product?.seo?.title ??
      data?.product?.title,
    media: data?.page?.seo?.image ?? media?.image,
    description:
      data?.page?.seo?.description ??
      data?.product?.seo?.description ??
      data?.product?.description,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      brand: data?.product?.vendor,
      name: data?.product?.title,
    },
  } satisfies SeoConfig<Product>;
};

export const handle = {
  seo,
};

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const { handle } = params;
  invariant(handle, "Missing handle param, check route filename");

  const selectedOptions = getSelectedProductOptions(request);

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page, { product }] = await Promise.all([
    context.sanity.query<SanityProductPage>({
      query: PRODUCT_PAGE_QUERY,
      params: {
        slug: params.handle,
        language,
        baseLanguage,
      },
      cache,
    }),
    context.storefront.query<{
      product: Product & {
        selectedVariant?: ProductVariant;
        translatedOptions?: ProductOption[];
      };
    }>(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
      },
    }),
  ]);

  if (!page || !product?.id) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page, context });

  // fetch bundles
  // we use one bundles for each size option to overcome
  // shopify option limits for our customisation builder
  const bundles = page.bundles ? page.bundles.map((x) => x.gid) : [];

  const conntectProductIds = [...bundles, product.id];

  const variantsRequest = await context.storefront.query(VARIANTS_QUERY, {
    variables: {
      ids: conntectProductIds,
    },
  });

  // fill gaps in Shopify data as a result of merging bundles into a single product
  // this lets us overcome Shopify limits on # of options
  // todo: this can be simplified from May 2024 with higher Shopify variant limits.
  const variants = getAllVariants(variantsRequest.products);

  // Fetch related print IDs from this drop
  const relatedProducts =
    page && page.drop && page.drop._id
      ? await context.sanity.query<SanityProductPreview>({
          query: PRODUCTS_IN_DROP_QUERY,
          params: {
            dropId: page?.drop?._id,
            slug: page.slug,
          },
        })
      : {
          products: [],
        };

  const firstVariant = variants[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  return defer({
    language,
    page,
    product,
    variants,
    // gids,
    selectedVariant,
    relatedProducts,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
  });
}

export default function ProductHandle() {
  const {
    language,
    page,
    product,
    variants,
    selectedVariant,
    analytics,
    relatedProducts,
  } = useLoaderData<typeof loader>();

  const { handle } = useParams();

  const isInStock = variants.some(
    (variant) => variant.availableForSale == true
  );

  const releaseDate = new Date(page?.drop.release_date);
  const isFutureRelease = releaseDate > new Date();

  const [showCustomiseModal, setShowCustomiseModal] = useState(false);

  const [shipping, setShipping] = useState({
    city: "",
    date: "",
    price: 0,
  });

  const fetchShippingData = async () => {
    const locationData = await getIpData();
    const zone = getZone(locationData.country);
    // extract static number to delivery helpers and config
    const daysToFulfil = 2 + zone.daysToShip;

    const deliveryDate = addWorkingDays(daysToFulfil);

    const formattedDeliveryDate = formatDate({
      value: deliveryDate,
      format: "w do m",
    });

    setShipping({
      city: locationData.city,
      date: formattedDeliveryDate,
      price: zone.additionalFee,
    });
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  const SECTIONS = [
    {
      label: "The Art",
      target: "the-art",
    },
    {
      label: "The Story",
      target: "the-story",
      condition: !!page?.story,
    },
    {
      label: "Materials",
      target: "materials",
    },
    {
      label: "The Drop",
      target: "the-drop",
      condition: !!page?.drop,
    },
    {
      label: "More from this drop",
      target: "more-prints",
      condition: !!relatedProducts?.length,
    },
  ];

  return (
    <SanityPreview
      data={page}
      query={PRODUCT_PAGE_QUERY}
      params={{ slug: handle, language, baseLanguage }}
    >
      {(page) => (
        <div
          className={clsx(
            showCustomiseModal && "--with-customisation-modal",
            "color-theme"
          )}
          style={{
            "--product-primary-color": `${page.printImage?.palette.vibrant.background}1c`,
            "--product-secondary-color": `${page.printImage?.palette.vibrant.background}1f`,
          }}
        >
          {/* Customise Modal */}
          {showCustomiseModal && isInStock && !isFutureRelease && (
            <Suspense>
              <Await
                errorElement="There was a problem loading related products"
                resolve={variants}
              >
                <section className="product-section" id="customise">
                  <button
                    className="semi-bold-16 back-button"
                    onClick={() => setShowCustomiseModal(false)}
                  >
                    <FontAwesomeIcon icon={faAngleLeft} />
                    back
                  </button>

                  <p className="semi-bold-24 section-header">
                    Customise your print
                  </p>

                  <CustomiseProduct
                    variants={variants}
                    image={page.printImage}
                    shipping={shipping}
                  />
                </section>
              </Await>
            </Suspense>
          )}

          <ProductHero
            sanityProduct={page as SanityProductPage}
            storefrontProduct={product}
            analytics={analytics as ShopifyAnalyticsPayload}
            anchorLinkID={"the-art"}
            shipping={shipping}
            isInStock={isInStock}
            isFutureRelease={isFutureRelease}
            onCustomiseClick={() => setShowCustomiseModal(true)}
          />

          <StickyProductHeader
            productTitle={product.title}
            sections={SECTIONS}
            isInStock={isInStock}
            isFutureRelease={isFutureRelease}
            onCustomiseClick={() => {
              setShowCustomiseModal(true);
              window.scrollTo(0, 0);
            }}
          />

          {/* Story */}
          {page?.story && (
            <section className="product-section" id="the-story">
              <p className="semi-bold-24 section-header">
                The story behind the art
              </p>
              <PortableText blocks={page.story} />
            </section>
          )}

          {/* The Drop */}
          <section className="product-section" id="the-drop">
            <p className="semi-bold-24 section-header">Featured in</p>
            {page?.drop && <DropPreview drop={page.drop} />}
          </section>

          {/* Related prints */}
          <Suspense>
            <Await
              errorElement="There was a problem loading related products"
              resolve={relatedProducts.prints}
            >
              <section className="product-section" id="more-prints">
                <p className="semi-bold-24 section-header">
                  More from this drop
                </p>
                <ProductCollection
                  products={relatedProducts?.prints}
                  style="row"
                  idsToHide={[page._id]}
                />
              </section>
            </Await>
          </Suspense>
        </div>
      )}
    </SanityPreview>
  );
}
