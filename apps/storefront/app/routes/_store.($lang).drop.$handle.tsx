import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoaderData, useParams } from "@remix-run/react";
import { SeoConfig, type SeoHandleFunction } from "@shopify/hydrogen";
import { defer, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { SanityPreview } from "hydrogen-sanity";
import { useContext, useEffect } from "react";
import invariant from "tiny-invariant";

import DropMetadata from "~/components/drop/Metadata";
import { ThemeStateContext } from "~/components/global/ThemeStateWrapper";
import { Link } from "~/components/Link";
import SanityImage from "~/components/media/SanityImage";
import ProductCollection from "~/components/product/ProductCollection";
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

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityDrop>({
    query: DROP_PAGE_QUERY,
    params: {
      slug: params.handle,
      language,
      baseLanguage,
    },
    cache,
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
    cache,
  });

  const previousDrop = await context.sanity.query<SanityDrop>({
    query: DROP_BY_NUMBER_QUERY,
    params: {
      number: Number(page.number) - 1,
      language,
      baseLanguage,
    },
    cache,
  });

  // Fetch related print IDs from this drop
  const productsInDrop =
    page && page._id
      ? await context.sanity.query<SanityProductPreview>({
          query: PRODUCTS_IN_DROP_QUERY,
          params: {
            dropId: page?._id,
            slug: page.slug,
          },
          cache,
        })
      : {};

  const relatedProducts = productsInDrop?.prints || [];

  return defer({
    language,
    page,
    relatedProducts,
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
  const { language, page, relatedProducts, nextDrop, previousDrop } =
    useLoaderData<typeof loader>();

  const { handle } = useParams();

  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  return (
    <SanityPreview
      data={page}
      query={DROP_PAGE_QUERY}
      params={{ slug: handle, language, baseLanguage }}
    >
      {(page) => (
        <>
          <section className="drop-hero">
            <div className="drop-image">
              <SanityImage
                dataset={sanityDataset}
                layout="responsive"
                projectId={sanityProjectID}
                sizes={["100vw"]}
                src={page.previewImage?.asset?._ref}
              />
            </div>

            {page?.video?.playbackId ? (
              <VideoPlayerPreview
                playbackId={page.video.playbackId}
                assetId={page.video.assetId}
                duration={page.video.duration}
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
                  releaseDate={page?.releaseDate}
                />
              </div>
            </div>
          </section>

          {relatedProducts?.length >= 1 && (
            <section className="drop-prints product-section">
              <p className="semi-bold-24 section-header">Explore this drop</p>
              <ProductCollection products={relatedProducts}></ProductCollection>
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
