import style from "@demo-ecommerce/sanity/src/schema/documents/style";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { AnalyticsPageType, type SeoHandleFunction } from "@shopify/hydrogen";
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { useState } from "react";

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

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get("cursor");
  const count = searchParams.get("count");
  const urlFilters = searchParams.get("filters")?.split("+");

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  // todo: extract into helper
  // gets an array of filter IDs from an array of slugs
  const getFilterIDsFromSlugs = (slugs, allOptions) => {
    if (!slugs || !allOptions) {
      return [];
    }

    return allOptions
      .filter((filter) => slugs.includes(filter.slug))
      .map((filter) => filter._id);
  };

  // fetch all possible styles
  const stylesPlaceholder = await context.sanity.query<SanityFilter>({
    query: STYLES_FOR_PRODUCT_QUERY,
    params: {
      colours: [],
    },
    cache,
  });

  // convert slugs from URL query into usable IDs
  const styleIDsInSearchQuery = getFilterIDsFromSlugs(
    urlFilters,
    stylesPlaceholder
  );

  // gets all colour options that match the existing style URL param
  const colours = await context.sanity.query<SanityFilter>({
    query: COLOURS_FOR_PRODUCT_QUERY,
    params: {
      styles: styleIDsInSearchQuery.length > 0 ? styleIDsInSearchQuery : null,
    },
    cache,
  });

  // convert slugs from URL query into usable IDs
  const colourIDsInSearchQuery =
    getFilterIDsFromSlugs(urlFilters, colours) || [];

  // query styles again but this time with the right colours
  // to get accurate count data
  const styles = await context.sanity.query<SanityFilter>({
    query: STYLES_FOR_PRODUCT_QUERY,
    params: {
      colours:
        colourIDsInSearchQuery.length > 0 ? colourIDsInSearchQuery : null,
    },
    cache,
  });

  // Fetch available products from Sanity
  const sanityProducts = await context.sanity.query<SanityProductPreview>({
    query: ALL_PRODUCTS_QUERY,
    params: {
      styles: styleIDsInSearchQuery.length > 0 ? styleIDsInSearchQuery : null,
      colours:
        colourIDsInSearchQuery.length > 0 ? colourIDsInSearchQuery : null,
    },
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

  return defer({
    language,
    products,
    styles,
    colours,
    urlFilters,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const { products, styles, colours, urlFilters } =
    useLoaderData<SerializeFrom<typeof loader>>();

  // expanses or collapses a filter set
  const [expandedFilter, setExpandedFilter] = useState(urlFilters);

  const toggleExpandFilter = (event, filter) => {
    event.stopPropagation();
    if (expandedFilter === filter) {
      setExpandedFilter();
    } else {
      setExpandedFilter(filter);
    }
  };

  const collapseFilters = () => {
    setExpandedFilter();
  };

  // opens or closes the mobile option menu
  const [expandedMobileMenu, setExpandedMobileMenu] = useState();

  const openMobileMenu = () => {
    document.body.classList.add("--prevent-scrolling");
    setExpandedMobileMenu(true);
  };

  const closeMobileMenu = () => {
    document.body.classList.remove("--prevent-scrolling");
    setExpandedMobileMenu(false);
  };

  const [activeFilters, setActiveFilters] = useState(urlFilters || []);

  // manages adding/removing filters
  const addFilter = (slug) => {
    if (activeFilters.includes(slug)) {
      return false;
    }

    return [...activeFilters, slug];
  };

  const removeFilter = (slug) => {
    if (!activeFilters.includes(slug)) {
      return false;
    }

    return activeFilters.filter((x) => x !== slug);
  };

  const toggleFilter = ({ event, slug }) => {
    event.stopPropagation();

    const newFilters = activeFilters.includes(slug)
      ? removeFilter(slug)
      : addFilter(slug);

    updateURLSearchParams(newFilters);

    setActiveFilters(newFilters);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  // updates URL search parameters with active state
  const updateURLSearchParams = (filters) => {
    const params = new URLSearchParams();
    if (filters.length) {
      params.set("filters", filters.join("+"));
    } else {
      params.delete("filters");
    }

    setSearchParams(params, {
      preventScrollReset: true,
      replace: true,
    });
  };

  return (
    <div onClick={collapseFilters}>
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
            "collection-filters-background mobile-only",
            expandedMobileMenu ? "--is-visible" : ""
          )}
          onClick={closeMobileMenu}
        />

        <div
          className={clsx(
            "collection-filters semi-bold-20",
            expandedMobileMenu ? "--is-visible" : ""
          )}
        >
          <Filter
            items={styles}
            title="Styles"
            activeFilters={activeFilters}
            isExpanded={expandedFilter === "styles"}
            onClickHeading={(event) => toggleExpandFilter(event, "styles")}
            onClickFilter={({ event, id, slug }) =>
              toggleFilter({
                event,
                id,
                slug,
              })
            }
          />

          <Filter
            items={colours}
            title="Colours"
            activeFilters={activeFilters}
            isExpanded={expandedFilter === "colours"}
            onClickHeading={(event) => toggleExpandFilter(event, "colours")}
            onClickFilter={({ event, id, slug }) =>
              toggleFilter({
                event,
                id,
                slug,
              })
            }
          />

          <Filter title="Availability" />

          <button
            className="button--large semi-bold-20 mobile-only"
            onClick={closeMobileMenu}
          >
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
