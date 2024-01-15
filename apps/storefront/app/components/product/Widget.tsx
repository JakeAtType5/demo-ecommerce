import { Money, ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";

import ProductForm from "~/components/product/Form";
import type { SanityProductPage } from "~/lib/sanity";

import { Label } from "../global/Label";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  storefrontVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
};

function ProductPrices({
  storefrontProduct,
  selectedVariant,
}: {
  storefrontProduct: Product;
  selectedVariant: ProductVariant;
}) {
  if (!storefrontProduct || !selectedVariant) {
    return null;
  }

  return (
    <div className="mt-2 flex text-md font-bold">
      {selectedVariant.compareAtPrice && (
        <span className="mr-3 text-darkGray line-through decoration-red">
          <Money data={selectedVariant.compareAtPrice} />
        </span>
      )}
      {selectedVariant.price && <Money data={selectedVariant.price} />}
    </div>
  );
}

export default function ProductWidget({
  sanityProduct,
  storefrontProduct,
  storefrontVariants,
  selectedVariant,
  analytics,
}: Props) {
  const availableForSale = selectedVariant?.availableForSale;

  if (!selectedVariant) {
    return null;
  }

  return (
    <div className="product-details">
      {/* Title */}
      {storefrontProduct?.title && (
        <h1 className="bold-56 product-title">{storefrontProduct.title}</h1>
      )}

      {/* Artist */}
      {storefrontProduct?.vendor && (
        <p className="semi-bold-24 product-artist">
          by {storefrontProduct.vendor}
        </p>
      )}

      {/* Description */}
      {sanityProduct?.description && (
        <p className="semi-bold-16 product-description">
          {sanityProduct.description}
        </p>
      )}

      {/* Messages */}
      <div className="semi-bold-16 product-messages">
        <div className="product-message">
          <FontAwesomeIcon icon={faCheck} />
          <p>1 of just {sanityProduct.maxUnits}</p>
        </div>
        <div className="product-message">
          <FontAwesomeIcon icon={faCheck} />
          <p>Delivered to ?? by ??</p>
        </div>
        <div className="product-message">
          <FontAwesomeIcon icon={faCheck} />
          <p>14 days return.</p>
        </div>
      </div>
    </div>
  );
}

// const neededInFuture = () => {
//   return (

//       {/* Sold out */}
//       {!availableForSale && (
//         <div className="mb-3 text-xs font-bold uppercase text-darkGray">
//           <Label _key="product.soldOut" />
//         </div>
//       )}

//       {/* Sale */}
//       {availableForSale && selectedVariant?.compareAtPrice && (
//         <div className="mb-3 text-xs font-bold uppercase text-red">
//           <Label _key="product.sale" />
//         </div>
//       )}

//       {/* Prices */}
//       <ProductPrices
//         storefrontProduct={storefrontProduct}
//         selectedVariant={selectedVariant}
//       />

//       {/* Divider */}
//       <div className="my-4 w-full border-b border-gray" />

//       {/* Product options */}
//       <ProductForm
//         product={storefrontProduct}
//         variants={storefrontVariants}
//         selectedVariant={selectedVariant}
//         analytics={analytics}
//         customProductOptions={sanityProduct.customProductOptions}
//       />
//   );
// }