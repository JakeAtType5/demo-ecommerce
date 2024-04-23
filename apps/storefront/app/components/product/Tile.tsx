import { Money } from "@shopify/hydrogen";
import type { ProductVariant } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";

import { Link } from "~/components/Link";
import {
  getProductOptionString,
  hasMultipleProductOptions,
  useGid,
} from "~/lib/utils";
import { ProductWithNodes } from "~/types/shopify";

type Props = {
  storefrontProduct: ProductWithNodes;
  variantGid?: string;
};

export default function ProductTile({ storefrontProduct, variantGid }: Props) {
  return (
    <Link to={`/product/${storefrontProduct.handle}`} target="_blank">
      <div className="contextual-product-preview">
        <div className="card-metadata">
          <p className="bold-18 product-title">{storefrontProduct.title}</p>
          <p className="italic-16">{storefrontProduct.vendor}</p>
        </div>
      </div>
    </Link>
  );
}

//   {!availableForSale && (
//     <div className="mb-2 text-xs font-bold uppercase text-darkGray">
//       Sold out
//     </div>
//   )}
