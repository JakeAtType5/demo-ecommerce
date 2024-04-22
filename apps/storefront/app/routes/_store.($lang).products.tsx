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
import { getSanityIDsFromSlugs } from "~/lib/filters";
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
  // const cursor = searchParams.get("cursor");
  // const count = searchParams.get("count");
  const urlFilters = searchParams.get("filters")?.split(",");
  const urlAvailabilityFilters = searchParams.get("availability")?.split(",");

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  // fetch all possible styles
  const stylesPlaceholder = await context.sanity.query<SanityFilter>({
    query: STYLES_FOR_PRODUCT_QUERY,
    params: {
      colours: [],
    },
    cache,
  });

  // convert slugs from URL query into usable IDs
  const styleIDsInSearchQuery = getSanityIDsFromSlugs(
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
    getSanityIDsFromSlugs(urlFilters, colours) || [];

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
        ids: sanityProducts?.map((product: { gid: any }) => product.gid),
      },
    }
  );

  // merges shopify and sanity data into a single object
  const products = sanityProducts.map((product: { gid: any }) => {
    const inventoryForId = shopifyInventories.products.filter(
      (inventory: { id: any }) => inventory && inventory.id == product.gid
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
    urlAvailabilityFilters,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const { products, styles, colours, urlFilters, urlAvailabilityFilters } =
    useLoaderData<SerializeFrom<typeof loader>>();

  const availabilities = [
    {
      title: "Upcoming Release",
      slug: "upcomimg",
    },
    {
      title: "Available",
      slug: "available",
    },
    {
      title: "Sold Out",
      slug: "unavailable",
    },
  ];

  const availabilityFilter =
    urlAvailabilityFilters && urlAvailabilityFilters.length
      ? urlAvailabilityFilters
      : ["upcoming", "available", "unavailable"];

  // expanses or collapses a filter set
  const [expandedFilter, setExpandedFilter] = useState();

  const toggleExpandFilter = (event, filter) => {
    event.stopPropagation();
    if (expandedFilter === filter) {
      // collapse current filter
      collapseFilters();
    } else {
      // expand
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

  const addFilter = (slug: string, source: string[]) => {
    if (source && source.length && source.includes(slug)) {
      return source;
    }

    if (source) {
      return [...source, slug];
    } else {
      return [slug];
    }
  };

  const removeFilter = (slug: string, source: string[]) => {
    if (source && !source.includes(slug)) {
      return source;
    }
    return source.filter((x) => x !== slug);
  };

  const toggleFilter = ({ event, slug, source, type }) => {
    event.stopPropagation();

    const toggledFilters =
      source && source.length && source.includes(slug)
        ? removeFilter(slug, source)
        : addFilter(slug, source);

    if (type === "filters") {
      // use new filters and existing availability filters
      updateURLSearchParams(toggledFilters, urlAvailabilityFilters);
    } else {
      // use existing filters and new availability filters
      updateURLSearchParams(urlFilters, toggledFilters);
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const updateURLSearchParams = (
    filters: string[],
    availabilities: string[]
  ) => {
    const params = new URLSearchParams();
    if (filters && filters.length) {
      params.set("filters", filters.join(","));
    } else {
      params.delete("filters");
    }

    if (availabilities && availabilities.length) {
      params.set("availability", availabilities.join(","));
    } else {
      params.delete("availabilities");
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
        <p className="italic-24">explore our full catalogue of artworks.</p>

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
            activeItems={urlFilters}
            isExpanded={expandedFilter === "styles"}
            onClickHeading={(e) => toggleExpandFilter(e, "styles")}
            onClickFilter={({ event, slug }) =>
              toggleFilter({
                event,
                slug,
                source: urlFilters,
                type: "filters",
              })
            }
          />

          <Filter
            items={colours}
            title="Colours"
            activeItems={urlFilters}
            isExpanded={expandedFilter === "colours"}
            onClickHeading={(e) => toggleExpandFilter(e, "colours")}
            onClickFilter={({ event, slug }) =>
              toggleFilter({
                event,
                slug,
                source: urlFilters,
                type: "filters",
              })
            }
          />

          <Filter
            title="Availability"
            className="--is-right-aligned"
            items={availabilities}
            isExpanded={expandedFilter === "availability"}
            onClickHeading={(e) => toggleExpandFilter(e, "availability")}
            activeItems={urlAvailabilityFilters}
            onClickFilter={({ event, slug }) =>
              toggleFilter({
                event,
                slug,
                source: urlAvailabilityFilters,
                type: "availability",
              })
            }
          />

          <button
            className="button--large semi-bold-20 mobile-only"
            onClick={closeMobileMenu}
          >
            Apply
          </button>
        </div>

        <ProductCollection
          availabilities={availabilityFilter}
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
