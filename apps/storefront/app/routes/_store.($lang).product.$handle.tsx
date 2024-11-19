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
import { getSeoMeta } from "@shopify/hydrogen";
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
import { Suspense, useContext, useEffect, useState } from "react";
import invariant from "tiny-invariant";

import DropHero from "~/components/drop/Hero";
import Banner from "~/components/global/Banner";
import PortableText from "~/components/portableText/PortableText";
import ProductHero from "~/components/product/Hero";
import Materials from "~/components/product/Materials";
import ProductCollection from "~/components/product/ProductCollection";
import StickyProductHeader from "~/components/product/StickyHeader";
import { baseLanguage } from "~/data/countries";
import type {
  SanityFaqs,
  SanityProductPage,
  SanityProductPreview,
} from "~/lib/sanity";
import {
  addWorkingDays,
  getIpData,
  getZone,
  shippingZones,
} from "~/lib/shipping";
import {
  fetchGids,
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

export const meta = ({ data }) => {
  const mediaURL = data?.page?.seo?.image?.url;
  const description = data?.page?.seo?.description ?? data?.page?.description;

  const seo = {
    title:
      data?.page?.seo?.title ??
      data?.product?.seo?.title ??
      data?.product?.title,
    media: {
      type: "image",
      url: mediaURL,
    },
    description: description.trim() + " Only on Ready for Collection",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      brand: data?.product?.vendor,
      name: data?.product?.title,
      image: mediaURL,
      description: description.trim(),
    },
    url: `https://www.readyforcollection.com${data?.page.slug}`,
  };

  return getSeoMeta(seo);
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

  // fetch bundles
  // we use one bundles for each size option to overcome
  // shopify option limits for our customisation builder
  const bundles = page.bundles ? page.bundles.map((x) => x.gid) : [];

  const conntectedProductIds = [...bundles, product.id];

  const variantsRequest = await context.storefront.query(VARIANTS_QUERY, {
    variables: {
      ids: conntectedProductIds,
    },
  });

  // fill gaps in Shopify data as a result of merging bundles into a single product
  // this lets us overcome Shopify limits on # of options
  // todo: this can be simplified from May 2024 with higher Shopify variant limits.
  const variants = getAllVariants(variantsRequest.products);

  // Fetch related print IDs from this drop
  const productsInDrop =
    page && page.drop && page.drop._id
      ? await context.sanity.query<SanityProductPreview>({
          query: PRODUCTS_IN_DROP_QUERY,
          params: {
            dropId: page?.drop?._id,
          },
        })
      : {};

  const relatedProducts = productsInDrop?.prints || [];

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

  // Resolve any references to products on the Storefront API
  const gids = await fetchGids({ page, context });

  return defer({
    language,
    page,
    product,
    variants,
    gids,
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
    analytics,
    relatedProducts,
    gids,
  } = useLoaderData<typeof loader>();

  const { handle } = useParams();
  const isInStock = variants.some(
    (variant) => variant.availableForSale == true
  );

  const releaseDate = new Date(page?.drop?.releaseDate);
  const isFutureRelease = page?.drop?.releaseDate
    ? releaseDate > new Date()
    : "";

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
    if (!shipping?.city) {
      fetchShippingData();
    }
  }, [shipping]);

  const SECTIONS = [
    {
      label: "The Art",
      target: "the-art",
    },
    {
      label: "Gallery",
      target: "the-gallery",
      condition: !!page?.gallery,
    },
    {
      label: "The Story",
      target: "the-story",
      condition: !!page?.notes,
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
  ];

  const backgroundColor =
    page.artwork?.palette.dominant.population > 2.7
      ? `${page.artwork?.palette.dominant.background}`
      : `${page.artwork?.palette.lightMuted.background}`;

  return (
    <SanityPreview
      data={page}
      query={PRODUCT_PAGE_QUERY}
      params={{ slug: handle, language, baseLanguage }}
    >
      {(page) => (
        <div
          className="product-color-theme"
          style={{
            "--product-primary-color": `${backgroundColor}1c`,
            "--product-primary-color-faded": `${backgroundColor}08`,
          }}
        >
          <Banner
            text={
              "Collectible museum-grade art from seriously talented artists."
            }
            className="--on-product-page"
          />

          <ProductHero
            sanityProduct={page as SanityProductPage}
            storefrontProduct={product}
            analytics={analytics as ShopifyAnalyticsPayload}
            anchorLinkID={"the-art"}
            shipping={shipping}
            isInStock={isInStock}
            isFutureRelease={isFutureRelease}
            storefrontVariants={variants}
          />

          <StickyProductHeader
            productTitle={product.title}
            sections={SECTIONS}
            isInStock={isInStock}
            isFutureRelease={isFutureRelease}
            onCustomiseClick={() => {
              // todo: trigger stage 1?? how to?
              window.scrollTo(0, 0);
            }}
          />

          <Await resolve={gids}>
            {page?.gallery && (
              <section
                className="drop-gallery product-section"
                id="the-gallery"
              >
                <p className="semi-bold-24 section-header">Gallery</p>
                <PortableText blocks={page.gallery} className="gallery" />
              </section>
            )}
          </Await>

          {/* Story */}
          {page?.notes && (
            <section
              className="product-section curator-notes very-narrow-section"
              id="the-story"
            >
              <p className="semi-bold-24 section-header">The story</p>
              <PortableText blocks={page.notes} />
            </section>
          )}

          {/* Materials */}
          <section className="product-section" id="materials">
            <p className="semi-bold-24 section-header">Materials</p>
            <Materials />
          </section>

          {/* The Drop */}
          <section className="product-section" id="the-drop">
            <p className="semi-bold-24 section-header">The drop</p>
            {page?.drop && <DropHero drop={page.drop} onlyHeader={true} />}

            <Suspense>
              <Await
                errorElement="There was a problem loading products for this drop"
                resolve={relatedProducts}
              >
                {relatedProducts?.length >= 1 && (
                  <ProductCollection
                    products={relatedProducts}
                    style="row"
                    idsToHide={[page._id]}
                  />
                )}
              </Await>
            </Suspense>
          </section>
        </div>
      )}
    </SanityPreview>
  );
}
