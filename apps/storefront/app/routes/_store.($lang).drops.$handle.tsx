import { useLoaderData, useParams } from "@remix-run/react";
import { SeoConfig, type SeoHandleFunction } from "@shopify/hydrogen";
import { defer, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { SanityPreview } from "hydrogen-sanity";
import invariant from "tiny-invariant";

import DropMetadata from "~/components/drop/Metadata";
import VideoPlayerPreview from "~/components/video/PreviewPlayer";
import { baseLanguage } from "~/data/countries";
import type { SanityDrop } from "~/lib/sanity";
import type { SanityProductPreview } from "~/lib/sanity";
import { notFound, validateLocale } from "~/lib/utils";
import { DROP_PAGE_QUERY } from "~/queries/sanity/drop";
import { PRODUCTS_IN_DROP_QUERY } from "~/queries/sanity/product";

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

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page] = await Promise.all([
    context.sanity.query<SanityDrop>({
      query: DROP_PAGE_QUERY,
      params: {
        slug: params.handle,
        language,
        baseLanguage,
      },
      cache,
    }),
  ]);

  if (!page) {
    throw notFound();
  }

  // Fetch related print IDs from this drop
  const productsInDrop =
    page && page._id
      ? await context.sanity.query<SanityProductPreview>({
          query: PRODUCTS_IN_DROP_QUERY,
          params: {
            dropId: page?._id,
            slug: page.slug,
          },
        })
      : {};

  const relatedProducts = productsInDrop?.prints || [];

  return defer({
    language,
    page,
    relatedProducts,
    // analytics: {
    //   pageType: AnalyticsPageType.product,
    //   resourceId: product.id,
    //   products: [productAnalytics],
    //   totalValue: parseFloat(selectedVariant.price.amount),
    // },
  });
}

export default function ProductHandle() {
  const { language, page, relatedProducts } = useLoaderData<typeof loader>();

  const { handle } = useParams();

  return (
    <SanityPreview
      data={page}
      query={DROP_PAGE_QUERY}
      params={{ slug: handle, language, baseLanguage }}
    >
      {(page) => (
        <>
          <section className="drop-hero">
            <div className="page-background" />
            {page?.episode?.playBackId ? (
              <VideoPlayerPreview
                playbackId={page.episode.playbackId}
                assetId={page.episode.assetId}
                duration={page.episode.duration}
                // startTime
              />
            ) : (
              <div className="video-empty-state">
                <p className="semi-bold-32">Video not found</p>
              </div>
            )}

            <div className="drop-content">
              <p className="drop-title bold-56">{page.title}</p>
              <div>
                {page.description && (
                  <p className="semi-bold-16 drop-description">
                    {page.description}
                  </p>
                )}
                <DropMetadata
                  location={page.location}
                  number={page.number}
                  releaseDate={page.release_date}
                />
              </div>
            </div>
          </section>

          <section className="drop-prints product-section">
            <p className="semi-bold-24 section-header">Explore this drop</p>
          </section>
        </>
      )}
    </SanityPreview>
  );
}
