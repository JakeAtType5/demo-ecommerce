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

import HomeHero from "~/components/heroes/Home";
import ModuleGrid from "~/components/modules/ModuleGrid";
import ProductCollection from "~/components/product/ProductCollection";
import type { SanityHeroHome, SanityHomePage } from "~/lib/sanity";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { ALL_PRODUCTS_QUERY } from "~/queries/sanity/product";
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

  return defer({
    language,
    products,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const { products } = useLoaderData<SerializeFrom<typeof loader>>();

  return (
    <section className="products-grid">
      <h1 className="bold-56">our prints.</h1>
      <ProductCollection
        filter="upcoming available unavailable"
        products={products}
        style="grid"
      />
    </section>
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
