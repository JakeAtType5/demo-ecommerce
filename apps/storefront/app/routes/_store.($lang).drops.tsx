import { faAngleDown, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Await, useLoaderData } from "@remix-run/react";
import { defer, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { SanityPreview } from "hydrogen-sanity";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import Filter from "~/components/collection/Filter";
import DropCollection from "~/components/drop/DropCollection";
import { baseLanguage } from "~/data/countries";
import type { SanityDrop } from "~/lib/sanity";
import { notFound, validateLocale } from "~/lib/utils";
import { DROPS_QUERY } from "~/queries/sanity/drop";
import {
  LOCATIONS_FOR_DROP_QUERY,
  STYLES_FOR_DROP_QUERY,
} from "~/queries/sanity/productFilters";

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const drops = await context.sanity.query<SanityDrop>({
    query: DROPS_QUERY,
    params: {
      language,
      baseLanguage,
    },
    cache,
  });

  if (!drops) {
    throw notFound();
  }

  const styles = context.sanity.query<SanityFilter>({
    query: STYLES_FOR_DROP_QUERY,
    cache,
  });

  const locations = context.sanity.query<SanityFilter>({
    query: LOCATIONS_FOR_DROP_QUERY,
    cache,
  });

  return defer({
    language,
    drops,
    styles,
    locations,
  });
}

export default function ProductHandle() {
  const { language, drops, styles, locations } = useLoaderData<typeof loader>();

  return (
    <SanityPreview
      data={drops}
      query={DROPS_QUERY}
      params={{ language, baseLanguage }}
    >
      {(drops) => (
        <>
          <section className="page-hero drops-hero">
            <div className="page-background" />
            <h1 className="bold-110">drops.</h1>
            <p className="semi-bold-24">
              weekly releases from our favourite artists.
            </p>
          </section>

          <section className="drops-grid">
            <div className="collection-options desktop-only">
              <div className="collection-filters semi-bold-20">
                <Suspense>
                  <Await resolve={styles}>
                    {(styles) => <Filter items={styles} title="Styles" />}
                  </Await>
                </Suspense>

                <Suspense>
                  <Await resolve={locations}>
                    {(locations) => (
                      <Filter items={locations} title="Locations" />
                    )}
                  </Await>
                </Suspense>

                <Filter title="Availability" />
              </div>

              <div className="collection-sorting semi-bold-20">
                <Filter title="Sort by: Latest" />
              </div>
            </div>
            <div className="button--large semi-bold-20 mobile-only collection-mobile-filter">
              <FontAwesomeIcon icon={faSliders} />
              Filter drops
            </div>

            <DropCollection drops={drops} style="grid" />
          </section>
        </>
      )}
    </SanityPreview>
  );
}
