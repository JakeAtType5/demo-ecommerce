import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Money, ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import type {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import { useEffect, useState } from "react";

import SanityImage from "~/components/media/SanityImage";
import {
  addWorkingDays,
  getIpData,
  getZone,
  shippingZones,
} from "~/lib/delivery-utils";
import type { SanityProductPage } from "~/lib/sanity";
import { formatDate } from "~/lib/utils";
import { useRootLoaderData } from "~/root";

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  storefrontVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
  anchorLinkID: string;
};

export default function ProductDetails({
  sanityProduct,
  storefrontProduct,
  storefrontVariants,
  selectedVariant,
  analytics,
  anchorLinkID,
}: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();
  const [deliveryData, setDeliveryData] = useState({
    city: "",
    date: "",
    price: 0,
  });

  const estimateDelivery = async () => {
    const locationData = await getIpData();
    const zone = getZone("GB");
    // extract static number to delivery helpers and config
    const daysToFulfil = 2 + zone.daysToShip;

    const deliveryDate = addWorkingDays(daysToFulfil);

    const formattedDeliveryDate = formatDate({
      value: deliveryDate,
      format: "w do m",
    });

    setDeliveryData({
      city: locationData.city,
      date: formattedDeliveryDate,
      price: zone.additionalFee,
    });
  };

  useEffect(() => {
    estimateDelivery();
  }, []);

  const availableForSale = selectedVariant?.availableForSale;

  if (!selectedVariant) {
    return null;
  }

  return (
    <div
      style={{
        "--product-primary-color": `${sanityProduct.printImage?.palette.vibrant.background}1c`,
        "--product-secondary-color": `${sanityProduct.printImage?.palette.vibrant.background}1f`,
      }}
    >
      <div className="background-effect" />
      <section className="product-hero" id={anchorLinkID}>
        <div className="product-preview">
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

          <button className="button--large semi-bold-16 desktop-only">
            Customise
          </button>

          {/* Messages */}
          <div className="semi-bold-16 product-messages">
            <div className="product-message">
              <FontAwesomeIcon icon={faCheck} />
              <p>Starting at just £60.00</p>
            </div>
            <div className="product-message">
              <FontAwesomeIcon icon={faCheck} />
              <p>1 of only {sanityProduct.maxUnits} editions printed</p>
            </div>
            <div className="product-message">
              {deliveryData.city ? (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <p>
                    {deliveryData.price == 0
                      ? "Free delivery "
                      : `£${deliveryData.price} delivery `}
                    to {deliveryData.city} by {deliveryData.date}
                  </p>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCircle} beat />
                  <p>Calculating delivery time...</p>
                </>
              )}
            </div>
            <div className="product-message">
              <FontAwesomeIcon icon={faCheck} />
              <p>14 days return.</p>
            </div>
          </div>
          <button className="button--large semi-bold-16 mobile-only">
            Customise
          </button>
        </div>
      </section>
    </div>
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

// //       {/* Prices */}
// //       <ProductPrices
// //         storefrontProduct={storefrontProduct}
// //         selectedVariant={selectedVariant}
// //       />
