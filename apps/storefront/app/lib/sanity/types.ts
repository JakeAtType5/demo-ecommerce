import type { PortableTextBlock } from "@portabletext/types";
import type { Image, Reference } from "@sanity/types";

import type { SanityColorTheme } from "~/lib/theme";
import type { ProductInventory, ProductWithNodes } from "~/types/shopify";

export interface SanityAssetImage extends Image {
  _type: "image";
  altText?: string;
  blurDataURL: string;
  height: number;
  palette: object;
  url: string;
  width: number;
}

export type SanityLabel = {
  key: string;
  text: string;
};

export type SanityLayout = {
  seo: SanitySeo;
  menuLinks?: SanityMenuLink[];
  companyLinks?: SanityMenuLink[];
  supportLinks?: SanityMenuLink[];
  footer?: {
    text?: PortableTextBlock[];
  };
  notFoundPage?: SanityNotFoundPage;
  labels?: SanityLabel[];
};

export type SanityCollection = {
  _id: string;
  colorTheme: SanityColorTheme;
  gid: string;
  hero?: SanityHeroPage;
  slug?: string;
  title: string;
  vector?: string;
};

export type SanityCollectionPage = {
  _id: string;
  colorTheme: SanityColorTheme;
  hero?: SanityHeroCollection;
  modules: (SanityModuleImage | SanityModuleInstagram)[];
  seo: SanitySeo;
  slug?: string;
  sortOrder: string;
  title: string;
};

export type SanityCollectionGroup = {
  _key: string;
  _type: "collectionGroup";
  collectionLinks?: SanityCollection[];
  collectionProducts?: SanityCollection;
  title: string;
};

export type SanityCustomProductOption =
  | SanityCustomProductOptionColor
  | SanityCustomProductOptionSize;

interface SanityCustomProductOptionBase {
  _key: string;
  title: string;
}
export interface SanityCustomProductOptionColor
  extends SanityCustomProductOptionBase {
  _type: "customProductOption.color";
  colors: {
    hex: string;
    title: string;
  }[];
}

export interface SanityCustomProductOptionSize
  extends SanityCustomProductOptionBase {
  _type: "customProductOption.size";
  sizes: {
    height: number;
    title: string;
    width: number;
  }[];
}

export type SanityHero = SanityHeroCollection | SanityHeroHome | SanityHeroPage;

export type SanityHeroCollection = {
  content?: SanityImageWithProductHotspots | SanityProductWithVariant;
  description?: string;
  title?: string;
  data?: ProductWithNodes[] | ProductWithNodes;
};

export type SanityHeroHome = {
  content?: SanityImageWithProductHotspots | SanityProductWithVariant;
  link?: SanityLink;
  title?: string;
  data?: ProductWithNodes[] | ProductWithNodes;
};

export type SanityHeroPage = {
  content?: SanityImageWithProductHotspots | SanityProductWithVariant;
  title?: string;
  data?: ProductWithNodes[] | ProductWithNodes;
};

export type SanityHomePage = {
  hero?: SanityHeroHome;
  modules: (SanityModuleImage | SanityModuleInstagram)[];
  seo: SanitySeo;
};

export type SanityImageWithProductHotspots = {
  _key?: string;
  _type: "imageWithProductHotspots";
  image: SanityAssetImage;
  productHotspots: SanityProductHotspot[];
};

export type SanityLink = SanityLinkExternal | SanityLinkInternal;

export type SanityLinkExternal = {
  _key: string;
  _type: "linkExternal";
  newWindow?: boolean;
  url: string;
  title: string;
};

export type SanityLinkInternal = {
  _key: string;
  _type: "linkInternal";
  documentType: string;
  slug?: string;
  title: string;
};

export type SanityMenuLink =
  | SanityCollectionGroup
  | SanityLinkExternal
  | SanityLinkInternal;

export type SanityModule =
  | SanityModuleAccordion
  | SanityModuleCallout
  | SanityModuleCallToAction
  | SanityModuleCollection
  | SanityModuleGrid
  | SanityModuleImage
  | SanityModuleInstagram
  | SanityModuleProduct;

export type SanityModuleAccordion = {
  _key?: string;
  _type: "module.accordion";
  groups: {
    _key: string;
    _type: "group";
    body: PortableTextBlock[];
    title: string;
  }[];
};

export type SanityModuleCallout = {
  _key?: string;
  _type: "module.callout";
  link: SanityLink;
  text: string;
};

export type SanityModuleCallToAction = {
  _key?: string;
  _type: "module.callToAction";
  body?: string;
  content?: SanityAssetImage | SanityProductWithVariant;
  layout: "left" | "right";
  link: SanityLink;
  title: string;
};

export type SanityModuleCollection = {
  _key?: string;
  _type: "module.collection";
  collection: SanityCollection;
  showBackground?: boolean;
};

// IMAGES
export type SanityModuleImage =
  | SanityModuleImageCallToAction
  | SanityModuleImageCaption
  | SanityModuleImageProductHotspots
  | SanityModuleImageProductTags
  | SanityModuleImageTextContent;

export type SanityModuleImageBase = {
  _key?: string;
  _type: "module.image";
  image: SanityAssetImage;
  size?: "fullWidth" | "halfWidth";
  position?: "right" | "center" | "left";
  contentPosition?: "left-of-image" | "centered" | "right-of-image";
};

export interface SanityModuleImageTextContent extends SanityModuleImageBase {
  _key?: string;
  text?: string;
  quote?: string;
  variant: "quoteAndText" | "text" | "quote";
}

export interface SanityModuleImageCallToAction extends SanityModuleImageBase {
  _key?: string;
  callToAction?: {
    link: SanityLink;
    title?: string;
  };
  variant: "callToAction";
}

export interface SanityModuleImageCaption extends SanityModuleImageBase {
  _key?: string;
  caption?: string;
  variant: "caption";
}
export interface SanityModuleImageProductHotspots
  extends SanityModuleImageBase {
  _key?: string;
  productHotspots?: SanityProductHotspot[];
  variant: "productHotspots";
}

export interface SanityModuleImageProductTags extends SanityModuleImageBase {
  _key?: string;
  productTags?: SanityProductWithVariant[];
  variant: "productTags";
}

export type SanityModuleImages = {
  _key?: string;
  _type: "module.images";
  fullWidth?: boolean;
  modules: SanityModuleImage[];
  verticalAlign?: "bottom" | "center" | "top";
};

export type SanityModuleInstagram = {
  _key?: string;
  _type: "module.instagram";
  url: string;
};

export type SanityModuleGrid = {
  _key?: string;
  _type: "module.grid";
  items: {
    _key: string;
    _type: "items";
    body: PortableTextBlock[];
    image: SanityAssetImage;
    title: string;
  }[];
};

export type SanityModuleProduct = {
  _key?: string;
  _type: "module.product";
  productWithVariant: SanityProductWithVariant;
};

export type SanityModuleProducts = {
  _key?: string;
  _type: "module.products";
  layout?: "card" | "pill";
  modules: SanityModuleProduct[];
};

export type SanityModuleTaggedProducts = {
  _key?: string;
  _type: "module.taggedProducts";
  tag: string;
  number: number;
  layout?: "card" | "pill";
  products: SanityModuleProduct[];
};

export type SanityNotFoundPage = {
  body?: string;
  collectionGid?: string;
  colorTheme?: SanityColorTheme;
  title: string;
};

export type SanityPage = {
  body: PortableTextBlock[];
  colorTheme?: SanityColorTheme;
  hero?: SanityHeroPage;
  seo: SanitySeo;
  title: string;
};

export type SanityProductHotspot = {
  _key?: string;
  product: SanityProductWithVariant;
  x: number;
  y: number;
};

export type SanityProductWithVariant = {
  _id: string;
  _key?: string;
  _type: "productWithVariant";
  available: boolean;
  gid: string;
  slug?: string;
  variantGid: string;
};

export type SanityProductPage = {
  _id: string;
  bundles: [];
  customProductOptions?: SanityCustomProductOption[];
  description: string;
  drop?: SanityDrop;
  gid: string;
  maxUnits: number;
  printImage: SanityAssetImage;
  slug: string;
  seo: SanitySeo;
  story: PortableTextBlock[];
  faqs: SanityFaqs;
  sharedText: {
    deliveryAndReturns: PortableTextBlock[];
    deliverySummary: string;
    environmentallyFriendly: string;
  };
};

export type SanityProductPreview = {
  _id: string;
  artist: string;
  description: string;
  gid: string;
  inventory: ProductInventory;
  priceRange: {
    maxVariantPrice: number;
    minVariantPrice: number;
  };
  printImage: SanityAssetImage;
  release_date?: Date;
  slug: string;
  status?: string;
  title: string;
};

export type SanitySeo = {
  description?: string;
  image?: SanityAssetImage;
  title: string;
};

// DROPS
export type SanityDrop = {
  _id: string;
  title: string;
  number?: number;
  description?: string;
  release_date?: Date;
  location?: string;
  seo: SanitySeo;
  slug: string;
  episode: any; //temp
  video: SanityVideo;
};

export type SanityVideo = {
  playbackId: string;
  assetId: string;
  title?: string;
  duration: number;
  startTime?: number;
  muted?: boolean;
  autoPlay?: "muted" | "any" | "none";
  theme?: "microvideo" | "classic";
  playerReference?: any;
};

export type SanityPerson = {
  name: string;
  slug: string;
  bio: PortableTextBlock[];
  image: SanityAssetImage;
  seo: SanitySeo;
};

export type SanityPersonPage = SanityPerson & {
  seo: SanitySeo;
  products: SanityModuleProduct[];
};

export type SanityFaq = {
  _key: string;
  _type: "group";
  title: string;
  body: PortableTextBlock[];
};

export type SanityFaqs = {
  groups: SanityFaq[];
  _type: "module.accordion";
};
