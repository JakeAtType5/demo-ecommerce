import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Await, useLoaderData } from "@remix-run/react";
import { AnalyticsPageType, type SeoHandleFunction } from "@shopify/hydrogen";
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { SanityPreview } from "hydrogen-sanity";
import { Suspense } from "react";
import { useEffect, useState } from "react";

import Filter from "~/components/collection/Filter";
import ProductCollection from "~/components/product/ProductCollection";
import type { SanityFilter, SanityProductPreview } from "~/lib/sanity";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { ALL_PRODUCTS_QUERY } from "~/queries/sanity/product";
import {
  COLOURS_FOR_PRODUCT_QUERY,
  STYLES_FOR_PRODUCT_QUERY,
} from "~/queries/sanity/productFilters";
import { INVENTORY_BY_PRODUCT_IDS } from "~/queries/shopify/product";

// const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
//   title: data?.page?.seo?.title || "Sanity x Hydrogen",
//   description:
//     data?.page?.seo?.description ||
//     "A custom storefront powered by Hydrogen and Sanity",
// });

// export const handle = {
//   seo,
// };

export async function loader({ context, params }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  // Fetch available products from Sanity
  const sanityProducts = await context.sanity.query<SanityProductPreview>({
    query: ALL_PRODUCTS_QUERY,
    cache,
  });

  // Fetch shopify products
  const shopifyInventories = await context.storefront.query(
    INVENTORY_BY_PRODUCT_IDS,
    {
      variables: {
        ids: sanityProducts?.map((product) => product.gid),
      },
    }
  );

  // merges shopify and sanity data into a single object
  const products = sanityProducts.map((product) => {
    const inventoryForId = shopifyInventories.products.filter(
      (inventory) => inventory && inventory.id == product.gid
    );
    return {
      ...product,
      inventory: inventoryForId ? inventoryForId[0] : {},
    };
  });

  const styles = context.sanity.query<SanityFilter>({
    query: STYLES_FOR_PRODUCT_QUERY,
    cache,
  });

  const colours = context.sanity.query<SanityFilter>({
    query: COLOURS_FOR_PRODUCT_QUERY,
    cache,
  });

  return defer({
    language,
    products,
    styles,
    colours,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const { products, styles, colours } =
    useLoaderData<SerializeFrom<typeof loader>>();

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
    <div onClick={() => resetFilters()}>
      <section className="page-hero products-hero">
        <h1 className="bold-110">artworks.</h1>
        <p className="semi-bold-24">explore our full catalogue of artworks.</p>

        <button
          className="button--large semi-bold-20 mobile-only collection-mobile-filter"
          onClick={() => openMobileMenu()}
        >
          <FontAwesomeIcon icon={faSliders} />
          Filter art
        </button>
      </section>

      <section className="products-grid">
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
                    onClickHeading={(event) => toggleFilter(event, "styles")}
                  />
                )}
              </Await>
            </Suspense>
            <Suspense>
              <Await resolve={colours}>
                {(colours) => (
                  <Filter
                    items={colours}
                    title="Colours"
                    isExpanded={expandedFilter === "colours"}
                    onClickHeading={(event) => toggleFilter(event, "colours")}
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

        <ProductCollection
          filter="upcoming available unavailable"
          products={products}
          style="grid"
        />
      </section>
    </div>
    // <SanityPreview data={page} query={HOME_PAGE_QUERY} params={{ language }}>
    //   {(page) => (
    //     <Suspense>
    //       <Await resolve={gids}>
    //         <div></div>
    //       </Await>
    //     </Suspense>
    //   )}
    // </SanityPreview>
  );
}
