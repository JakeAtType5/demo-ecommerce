import { Await, Link, useLoaderData } from "@remix-run/react";
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
import type { SanityDrop, SanityHeroHome, SanityHomePage } from "~/lib/sanity";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { DROPS_QUERY } from "~/queries/sanity/drop";
import { HOME_PAGE_QUERY } from "~/queries/sanity/home";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.page?.seo?.title || "Ready | Collectible, musueum-quality art",
  description:
    data?.page?.seo?.description ||
    "A custom storefront powered by Hydrogen and Sanity",
});

export const handle = {
  seo,
};

export async function loader({ context, params }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityHomePage>({
    query: HOME_PAGE_QUERY,
    params: {
      language,
    },
    cache,
  });

  if (!page) {
    throw notFound();
  }

  // Fetch drops from Sanity
  const drops = await context.sanity.query<SanityDrop>({
    query: DROPS_QUERY,
    cache,
  });

  console.log(page.faqs);

  // // Resolve any references to products on the Storefront API
  // const gids = fetchGids({ page, context });

  return defer({
    language,
    page,
    drops,
    // gids,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const { language, page, drops } =
    useLoaderData<SerializeFrom<typeof loader>>();

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    result.setHours(0);
    result.setMinutes(0);
    return result;
  };

  const now = new Date();
  const todayDay = now.getDay();

  const diffToThurs = todayDay > 4 ? 11 - todayDay : 4 - todayDay;

  const nextWeekDropDate = addDays(now, diffToThurs + 7);
  const thisWeekDropDate = addDays(now, diffToThurs);
  const lastWeekDropDate = addDays(now, diffToThurs - 7);

  const nextDrop = drops.find((x) => {
    const releaseDate = new Date(x.releaseDate);
    return releaseDate >= nextWeekDropDate;
  });

  const thisDrop = drops.find((x) => {
    const releaseDate = new Date(x.releaseDate);
    return releaseDate >= thisWeekDropDate && releaseDate < nextWeekDropDate;
  });

  const lastDrop = drops.find((x) => {
    const releaseDate = new Date(x.releaseDate);
    return releaseDate >= lastWeekDropDate && releaseDate < thisWeekDropDate;
  });

  return (
    <>
      <section className="homepage-hero">
        <h1 className="bold-56">{page.title}</h1>

        <div className="italic-56">
          {/* {nextDrop && (
            <Link to={nextDrop.slug}>Next week: {nextDrop.title}</Link>
          )}
          {thisDrop && (
            <Link to={thisDrop.slug}>This week: {thisDrop.title}</Link>
          )}
          {lastDrop && (
            <Link to={lastDrop.slug}>This week: {lastDrop.title}</Link>
          )} */}

          {/* for testing only */}
          <Link to={drops[0].slug}>This week: {drops[0].title}</Link>
          <Link to={drops[1].slug}>Last week: {drops[1].title}</Link>
        </div>
      </section>

      <section className="bento-grid product-quality-feature">
        <div className="full-width-feature"></div>
        <div className="half-width-feature"></div>
        <div className="half-width-feature"></div>
      </section>

      <section className="bento-grid artist-feature">
        <div className="full-width-feature"></div>
        <div className="half-width-feature"></div>
        <div className="half-width-feature"></div>
      </section>
      {/* 
      <section className="frequently-asked-questions">
      </section> */}
    </>

    // <SanityPreview data={page} query={HOME_PAGE_QUERY} params={{ language }}>
    //   {(page) => (
    //     <Suspense>
    //       <Await resolve={gids}>
    //         {/* Page hero */}
    //         {page?.hero && <HomeHero hero={page.hero as SanityHeroHome} />}

    //         {page?.modules && (
    //           <div className={clsx("mb-32 mt-24 px-4", "md:px-8")}>
    //             <ModuleGrid items={page.modules} />
    //           </div>
    //         )}
    //       </Await>
    //     </Suspense>
    //   )}
    // </SanityPreview>
  );
}
