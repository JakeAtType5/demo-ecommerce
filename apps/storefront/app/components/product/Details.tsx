import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Money, ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import type {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";

import SanityImage from "~/components/media/SanityImage";
import type { SanityProductPage } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  storefrontVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
  anchorLinkID: string;
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

export default function ProductDetails({
  sanityProduct,
  storefrontProduct,
  storefrontVariants,
  selectedVariant,
  analytics,
  anchorLinkID,
}: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  const availableForSale = selectedVariant?.availableForSale;

  if (!selectedVariant) {
    return null;
  }

  return (
    <>
      <div
        className="background-effect"
        style={{
          "--product-primary-color": `${sanityProduct.printImage?.palette.vibrant.background}1f`,
        }}
      ></div>

      <div className="product-hero" id={anchorLinkID}>
        <div className="image-container">
          <SanityImage
            // crop={image?.crop}
            dataset={sanityDataset}
            layout="responsive"
            projectId={sanityProjectID}
            sizes={["30vw, 100vw"]}
            src={sanityProduct.printImage?.asset?._ref}
          />
        </div>

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
      </div>
    </>
  );
}

// import clsx from "clsx";
// import ProductForm from "~/components/product/Form";
// import { Label } from "../global/Label";

// export default function ProductWidget({
//   sanityProduct,
//   storefrontProduct,
//   storefrontVariants,
//   selectedVariant,
//   analytics,
// }: Props) {

//   return (
//   );
// }

// //   return (

// //       {/* Sold out */}
// //       {!availableForSale && (
// //         <div className="mb-3 text-xs font-bold uppercase text-darkGray">
// //           <Label _key="product.soldOut" />
// //         </div>
// //       )}

// //       {/* Sale */}
// //       {availableForSale && selectedVariant?.compareAtPrice && (
// //         <div className="mb-3 text-xs font-bold uppercase text-red">
// //           <Label _key="product.sale" />
// //         </div>
// //       )}

// //       {/* Prices */}
// //       <ProductPrices
// //         storefrontProduct={storefrontProduct}
// //         selectedVariant={selectedVariant}
// //       />

// //       {/* Divider */}
// //       <div className="my-4 w-full border-b border-gray" />

// //       {/* Product options */}
// //       <ProductForm
// //         product={storefrontProduct}
// //         variants={storefrontVariants}
// //         selectedVariant={selectedVariant}
// //         analytics={analytics}
// //         customProductOptions={sanityProduct.customProductOptions}
// //       />
// //   );
