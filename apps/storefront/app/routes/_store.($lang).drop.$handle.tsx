import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoaderData, useParams } from "@remix-run/react";
import { SeoConfig, type SeoHandleFunction } from "@shopify/hydrogen";
import { defer, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import clsx from "clsx";
import { SanityPreview } from "hydrogen-sanity";
import { useContext, useEffect, useState } from "react";
import invariant from "tiny-invariant";

import DropHero from "~/components/drop/Hero";
import Banner from "~/components/global/Banner";
import { Link } from "~/components/Link";
import SanityImage from "~/components/media/SanityImage";
import PortableText from "~/components/portableText/PortableText";
import ProductCollection from "~/components/product/ProductCollection";
import RelatedProducts from "~/components/product/RelatedProducts";
import VideoPlayerPreview from "~/components/video/PreviewPlayer";
import { baseLanguage } from "~/data/countries";
import type { SanityDrop } from "~/lib/sanity";
import type { SanityProductPreview } from "~/lib/sanity";
import { notFound, validateLocale } from "~/lib/utils";
import { DROP_BY_NUMBER_QUERY, DROP_PAGE_QUERY } from "~/queries/sanity/drop";
import { PRODUCTS_IN_DROP_QUERY } from "~/queries/sanity/product";
import { useRootLoaderData } from "~/root";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.page?.seo?.title || data?.page?.name,
  description: data?.page?.seo?.description,
  media: data?.page?.seo?.image,
});

export const handle = {
  seo,
};

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const { handle } = params;
  invariant(handle, "Missing handle param, check route filename");

  // const cache = context.storefront.CacheCustom({
  //   mode: "public",
  //   maxAge: 60,
  //   staleWhileRevalidate: 60,
  // });

  const page = await context.sanity.query<SanityDrop>({
    query: DROP_PAGE_QUERY,
    params: {
      slug: params.handle,
      language,
      baseLanguage,
    },
    // cache,
  });

  if (!page) {
    throw notFound();
  }

  const nextDrop = await context.sanity.query<SanityDrop>({
    query: DROP_BY_NUMBER_QUERY,
    params: {
      number: Number(page.number) + 1,
      language,
      baseLanguage,
    },
    // cache,
  });

  const previousDrop = await context.sanity.query<SanityDrop>({
    query: DROP_BY_NUMBER_QUERY,
    params: {
      number: Number(page.number) - 1,
      language,
      baseLanguage,
    },
    // cache,
  });

  // Fetch related print IDs from this drop
  const productsInDrop =
    page && page._id
      ? await context.sanity.query<SanityProductPreview>({
          query: PRODUCTS_IN_DROP_QUERY,
          params: {
            dropId: page?._id,
          },
          // cache,
        })
      : {};

  const products = productsInDrop?.prints || [];

  return defer({
    language,
    page,
    products,
    nextDrop,
    previousDrop,
    // analytics: {
    //   pageType: AnalyticsPageType.product,
    //   resourceId: product.id,
    //   products: [productAnalytics],
    //   totalValue: parseFloat(selectedVariant.price.amount),
    // },
  });
}

export default function DropHandle() {
  const { language, page, nextDrop, previousDrop, products } =
    useLoaderData<typeof loader>();

  const { handle } = useParams();
  return (
    <SanityPreview
      data={page}
      query={DROP_PAGE_QUERY}
      params={{ slug: handle, language, baseLanguage }}
    >
      {(page) => (
        <>
          {page.message && <Banner text={page.message} />}

          <DropHero drop={page} />

          {products?.length >= 1 && (
            <section className="drop-products narrow-section product-section">
              <p className="semi-bold-24 section-header">Explore this drop</p>
              <ProductCollection products={products} style="collage" />
            </section>
          )}

          {page?.gallery && (
            <section className="drop-gallery narrow-section product-section">
              <p className="semi-bold-24 section-header">Behind the scenes</p>
              <PortableText blocks={page.gallery} className="gallery" />
            </section>
          )}

          {page?.notes && (
            <section className="drop-notes very-narrow-section product-section">
              <p className="semi-bold-24 section-header">Curator notes</p>
              <PortableText blocks={page.notes} className="notes" />
            </section>
          )}

          {page?.credits && (
            <section className="drop-credits very-narrow-section product-section">
              <p className="semi-bold-24 section-header">Credits</p>
              <PortableText blocks={page.credits} className="credits" />
            </section>
          )}

          <section className="more-drops product-section">
            {nextDrop && nextDrop._id && (
              <Link to={nextDrop.slug} className="next-drop">
                <p className="semi-bold-24">
                  Next drop
                  <FontAwesomeIcon icon={faAngleRight} />
                </p>
                <p className="bold-24">{nextDrop.title}</p>
              </Link>
            )}
            {previousDrop && previousDrop._id && (
              <Link to={previousDrop.slug} className="previous-drop">
                <p className="semi-bold-24">
                  <FontAwesomeIcon icon={faAngleLeft} />
                  Previous drop
                </p>
                <p className="bold-24">{previousDrop.title}</p>
              </Link>
            )}
          </section>
        </>
      )}
    </SanityPreview>
  );
}
