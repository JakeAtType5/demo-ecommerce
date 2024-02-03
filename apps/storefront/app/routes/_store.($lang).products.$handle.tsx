import shopify from "@demo-ecommerce/sanity/src/schema/objects/seo/shopify";
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
import AccordionBlock from "~/components/portableText/blocks/Accordion";
import PortableText from "~/components/portableText/PortableText";
import CustomiseProduct from "~/components/product/Customise";
import ProductDetails from "~/components/product/Details";
import ProductCollection from "~/components/product/ProductCollection";
import StickyProductHeader from "~/components/product/StickyHeader";
import { baseLanguage } from "~/data/countries";
import type {
  SanityFaqs,
  SanityProductPage,
  SanityProductPreview,
} from "~/lib/sanity";
import {
  fetchGids,
  fetchGidsForProductIds,
  notFound,
  useGids,
  validateLocale,
} from "~/lib/utils";
import {
  PRODUCT_PAGE_QUERY,
  PRODUCTS_IN_DROP_QUERY,
} from "~/queries/sanity/product";
import {
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
  VARIANTS_QUERY,
} from "~/queries/shopify/product";

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

  // if (!product.selectedVariant) {
  //   return redirectToFirstVariant({ product, request });
  // }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page, context });

  // fetch bundles
  // we use one bundles for each size option to overcome
  // shopify option limits for our customisation builder
  const bundles = page.bundles.map((x) => x.gid);

  const conntectProductIds = [...bundles, product.id];

  const variantsRequest = await context.storefront.query(VARIANTS_QUERY, {
    variables: {
      ids: conntectProductIds,
    },
  });

  const variants = variantsRequest.products;

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

  const firstVariant = product.variants.nodes[0];
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

function redirectToFirstVariant({
  product,
  request,
}: {
  product: Product;
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams();
  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  throw redirect(`${url.pathname}?${searchParams.toString()}`, 302);
}

const SECTIONS = [
  {
    label: "The Art",
    target: "the-art",
  },
  {
    label: "The Story",
    target: "the-story",
  },
  {
    label: "Materials",
    target: "materials",
  },
  {
    label: "The Drop",
    target: "the-drop",
  },
  {
    label: "More from this drop",
    target: "more-prints",
  },
];

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

  return (
    <SanityPreview
      data={page}
      query={PRODUCT_PAGE_QUERY}
      params={{ slug: handle, language, baseLanguage }}
    >
      {(page) => (
        <>
          <Suspense
            fallback={
              <ProductDetails
                selectedVariant={selectedVariant}
                sanityProduct={page as SanityProductPage}
                storefrontProduct={product}
                storefrontVariants={[]}
                analytics={analytics as ShopifyAnalyticsPayload}
                anchorLinkID={"the-art"}
              />
            }
          >
            <Await
              errorElement="There was a problem loading product variants"
              resolve={variants}
            >
              {(resp) => (
                <ProductDetails
                  selectedVariant={selectedVariant}
                  sanityProduct={page as SanityProductPage}
                  storefrontProduct={product}
                  storefrontVariants={resp.product?.variants.nodes || []}
                  analytics={analytics as ShopifyAnalyticsPayload}
                  anchorLinkID={"the-art"}
                />
              )}
            </Await>
          </Suspense>

          <StickyProductHeader sections={SECTIONS} />

          {/* Story */}
          <section className="product-section" id="the-story">
            <p className="semi-bold-24 section-header">The story</p>
            {page?.story && <PortableText blocks={page.story} />}
          </section>

          {/* The Drop */}
          <section className="product-section" id="the-drop">
            {page?.drop && (
              <DropPreview drop={page.drop} sectionTitle="Featured in" />
            )}
          </section>

          {/* Shipping info and FAQs
          <div
            className={clsx(
              "w-full", //
              "lg:w-[calc(100%-315px)]",
              "mb-10 mt-8 p-5"
            )}
          >
            <div className="mb-10 grid grid-cols-3 gap-10 md:grid-cols-4 lg:grid-cols-6">
              <div className="hidden aspect-square xl:block" />
              <div className="col-span-3 md:col-span-4 lg:col-span-3 xl:col-span-2">
                {page?.sharedText?.deliveryAndReturns && (
                  <SanityProductShipping
                    blocks={page?.sharedText?.deliveryAndReturns}
                  />
                )}
              </div>
              <div className="col-span-3 md:col-span-4 lg:col-span-3">
                {page?.faqs?.groups && page?.faqs?.groups.length > 0 && (
                  <SanityProductFaqs faqs={page.faqs} />
                )}
              </div>
            </div>
          </div> */}

          {/* Customise */}
          <Suspense>
            <Await
              errorElement="There was a problem loading related products"
              resolve={variants}
            >
              <section className="product-section" id="customise">
                <p className="semi-bold-24 section-header">
                  Customise your print
                </p>
                <CustomiseProduct variants={variants} image={page.printImage}  />
              </section>
            </Await>
          </Suspense>

          {/* Related prints */}
          <Suspense>
            <Await
              errorElement="There was a problem loading related products"
              resolve={relatedProducts}
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
        </>
      )}
    </SanityPreview>
  );
}

// const SanityProductShipping = ({ blocks }: { blocks: PortableTextBlock[] }) => {
//   return (
//     <>
//       <h2
//         className={clsx(
//           "first:mt-0 last:mb-0", //
//           "mb-6 mt-16 text-xl font-bold"
//         )}
//       >
//         <Label _key="shipping.shippingReturns" />
//       </h2>
//       <PortableText blocks={blocks} />
//     </>
//   );
// };

// const SanityProductFaqs = ({ faqs }: { faqs: SanityFaqs }) => {
//   return (
//     <>
//       <h2
//         className={clsx(
//           "first:mt-0 last:mb-0", //
//           "-mb-6 mt-16 text-xl font-bold"
//         )}
//       >
//         <Label _key="faqs.title" />
//       </h2>
//       <AccordionBlock value={faqs} />
//     </>
//   );
// };
