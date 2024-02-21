import { faAngleDown, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Await, useLoaderData } from "@remix-run/react";
import { defer, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import clsx from "clsx";
import { SanityPreview } from "hydrogen-sanity";
import { Suspense } from "react";
import { useEffect, useState } from "react";
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

  const [expandedFilter, setExpandedFilter] = useState();
  const [expandedMobileMenu, setExpandedMobileMenu] = useState();

  const toggleFilter = (event, filter) => {
    event.stopPropagation();
    if (expandedFilter === filter) {
      setExpandedFilter();
    } else {
      setExpandedFilter(filter);
    }
  };

  const resetFilters = () => {
    setExpandedFilter();
  };

  const openMobileMenu = () => {
    document.body.classList.add("--prevent-scrolling");
    setExpandedMobileMenu(true);
  };

  const closeMobileMenu = () => {
    document.body.classList.remove("--prevent-scrolling");
    setExpandedMobileMenu(false);
  };

  return (
    <SanityPreview
      data={drops}
      query={DROPS_QUERY}
      params={{ language, baseLanguage }}
    >
      {(drops) => (
        <div onClick={() => resetFilters()}>
          <section className="page-hero drops-hero">
            <div className="page-background" />
            <h1 className="bold-110">drops.</h1>
            <p className="semi-bold-24">
              weekly releases from our favourite artists.
            </p>
            <button
              className="button--large semi-bold-20 mobile-only collection-mobile-filter"
              onClick={() => openMobileMenu()}
            >
              <FontAwesomeIcon icon={faSliders} />
              Filter drops
            </button>
          </section>

          <section className="drops-grid">
            <div
              className={clsx(
                "collection-options-background mobile-only",
                expandedMobileMenu ? "--is-visible" : ""
              )}
              onClick={() => closeMobileMenu()}
            />
            <div
              className={clsx(
                "collection-options",
                expandedMobileMenu ? "--is-visible" : ""
              )}
            >
              <div className="collection-filters semi-bold-20">
                <Suspense>
                  <Await resolve={styles}>
                    {(styles) => (
                      <Filter
                        items={styles}
                        title="Styles"
                        isExpanded={expandedFilter === "styles"}
                        onClickHeading={(event) =>
                          toggleFilter(event, "styles")
                        }
                      />
                    )}
                  </Await>
                </Suspense>
                <Suspense>
                  <Await resolve={locations}>
                    {(locations) => (
                      <Filter
                        items={locations}
                        title="Locations"
                        isExpanded={expandedFilter === "locations"}
                        onClickHeading={(event) =>
                          toggleFilter(event, "locations")
                        }
                      />
                    )}
                  </Await>
                </Suspense>

                <Filter title="Availability" />
              </div>

              <div className="collection-sorting semi-bold-20">
                <Filter title="Sort by: Latest" />
              </div>

              <button className="button--large semi-bold-20 mobile-only">
                Apply
              </button>
            </div>

            <DropCollection drops={drops} style="grid" />
          </section>
        </div>
      )}
    </SanityPreview>
  );
}
