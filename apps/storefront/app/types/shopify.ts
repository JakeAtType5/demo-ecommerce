import type {
  CacheShort,
  Storefront as HydrogenStorefront,
} from "@shopify/hydrogen";
import type {
  Collection,
  CountryCode,
  CurrencyCode,
  Customer,
  LanguageCode,
  MailingAddress,
  MailingAddressConnection,
  MediaConnection,
  Order,
  OrderLineItemConnection,
  Product,
  ProductVariantConnection,
} from "@shopify/hydrogen/storefront-api-types";

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  currency: CurrencyCode;
};

export type Localizations = Record<string, Locale>;

export type I18nLocale = Locale & {
  pathPrefix: string;
};

export type Storefront = HydrogenStorefront<I18nLocale>;

export type CollectionWithNodes = Partial<Omit<Collection, "products">> & {
  products: {
    nodes: ProductWithNodes[];
  };
};

export type CustomerWithNodes = Omit<Customer, "addresses" | "orders"> & {
  addresses: {
    nodes: MailingAddressConnection["nodes"];
  };
  orders: {
    nodes: OrderWithNodes[];
  };
};

export type MailingAddressExtended = MailingAddress & {
  originalId: string;
};

export type OrderWithNodes = Omit<Order, "lineItems"> & {
  lineItems: {
    nodes: OrderLineItemConnection["nodes"];
  };
};

export type ProductWithNodes = Partial<Omit<Product, "media" | "variants">> & {
  media?: {
    nodes: MediaConnection["nodes"];
  };
  variants: {
    nodes: ProductVariantConnection["nodes"];
  };
};

export type ProductInventory = {
  availableForSale?: boolean;
  handle: string;
  id: string;
}

export type EnvironmentOptions = {
  /**
   * A Cache API instance.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
   */
  cache: Cache;
  /**
   * A runtime utility for serverless environments
   * @see https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#waituntil
   */
  waitUntil: ExecutionContext["waitUntil"];
};

/** @see https://shopify.dev/docs/custom-storefronts/hydrogen/data-fetching/cache#caching-strategies */
export type CachingStrategy = ReturnType<typeof CacheShort>;
