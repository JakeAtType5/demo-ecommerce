import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { defer, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { SanityPreview } from "hydrogen-sanity";
import invariant from "tiny-invariant";

import DropCollection from "~/components/drop/DropCollection";
import { baseLanguage } from "~/data/countries";
import type { SanityDrop } from "~/lib/sanity";
import { notFound, validateLocale } from "~/lib/utils";
import { DROPS_QUERY } from "~/queries/sanity/drop";

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [drops] = await Promise.all([
    context.sanity.query<SanityDrop>({
      query: DROPS_QUERY,
      params: {
        language,
        baseLanguage,
      },
      cache,
    }),
  ]);

  if (!drops) {
    throw notFound();
  }

  return defer({
    language,
    drops,
  });
}

export default function ProductHandle() {
  const { language, drops } = useLoaderData<typeof loader>();
  console.log(drops);
  return (
    <SanityPreview
      data={drops}
      query={DROPS_QUERY}
      params={{ language, baseLanguage }}
    >
      {(drops) => (
        <>
          <section className="drops-hero">
            <div className="page-background" />
            <h1 className="bold-110">drops.</h1>
            <p className="semi-bold-24">
              weekly releases from our favourite artists.
            </p>
          </section>

          <section className="drops-grid">
            <div className="collection-options">
              <div className="collection-filters semi-bold-20">
                <div className="filter-dropdown">
                  style
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
                <div className="filter-dropdown">
                  location
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
                <div className="filter-dropdown">
                  availability
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
              </div>

              <div className="collection-sorting semi-bold-20">
                <div className="filter-dropdown">
                  sort by: latest
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
              </div>
            </div>

            <DropCollection drops={drops} style="grid" />
          </section>
        </>
      )}
    </SanityPreview>
  );
}
