import { Await, useLoaderData } from "@remix-run/react";
import { defer, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import clsx from "clsx";
import { SanityPreview } from "hydrogen-sanity";

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

  // Fetch drops from Sanity
  const drops = await context.sanity.query<SanityDrop>({
    query: DROPS_QUERY,
    cache,
  });

  if (!drops) {
    throw notFound();
  }

  return defer({
    language,
    drops,
  });
}

export default function Index() {
  const { language, drops } = useLoaderData<typeof loader>();

  return (
    <SanityPreview
      data={drops}
      query={DROPS_QUERY}
      params={{ language, baseLanguage }}
    >
      <section className="page-hero drops-hero">
        <h1 className="bold-110">drops.</h1>
        <p className="italic-24">weekly releases from our favourite artists.</p>
      </section>

      <section className="drops-grid">
        <DropCollection drops={drops} style="grid" />
      </section>
    </SanityPreview>
  );
}
