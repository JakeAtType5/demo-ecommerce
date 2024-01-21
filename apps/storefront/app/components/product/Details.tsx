import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Money, ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import type {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import { useEffect, useState } from "react";

import SanityImage from "~/components/media/SanityImage";
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

const zones = {
  1: {
    additionalPrice: 0,
    markets: ["GB"],
    daysToShip: 2,
  },
  2: {
    additionalPrice: 10,
    markets: ["IR"],
    daysToShip: 3,
  },
  3: {
    additionalPrice: 10,
    markets: ["FR", "DE"],
    daysToShip: 3,
  },
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
    const zone = getZone("FR");
    // extract static number to delivery helpers and config
    const daysToFulfil = 3 + zone.daysToShip;

    const deliveryDate = addWorkingDays(daysToFulfil);

    setDeliveryData({
      city: locationData.city,
      date: deliveryDate,
      price: zone.additionalPrice,
    });
  };

  // extract to delivery helpers
  const getIpData = async () => {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data;
  };

  // extract to delivery helpers
  const getZone = (countryCode) => {
    const activeZoneIndex = Object.keys(zones).filter((i) => {
      return zones[i].markets.includes(countryCode);
    });

    return activeZoneIndex ? zones[activeZoneIndex] : {};
  };

  // extract to delivery helpers
  const addWorkingDays = (daysToAdd) => {
    const date = new Date();

    for (let i = 0; i < daysToAdd; i++) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();

      if (dayOfWeek == 0) {
        // sunday, add another day to Monday
        date.setDate(date.getDate() + 1);
      }

      if (dayOfWeek == 6) {
        // saturday, add another two days to get to Monday
        date.setDate(date.getDate() + 2);
      }
    }

    return formatDate({
      value: date,
      format: "w d m",
    });
  };

  useEffect(() => {
    estimateDelivery();
  }, []);

  // 1. get delivery pricings from shopify
  // 5. estimate timing
  // -> get stock count for frames in relevant location
  // -> time without frames
  // // -> 2 working days to manufacture
  // // -> 2 days for delivery in UK
  // // -> 5 days delivery?

  // 4. show non UK message?
  // -> + 3 days to send to EU = 8 working days

  // UK: 48 hr
  // EU: 5 day, 3 day.
  // Global: 5 day = £60?. Special consignment, sign up to register interest for coming to US

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

      <section className="product-hero" id={anchorLinkID}>
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
              {deliveryData.city ? (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <p>
                    {deliveryData.price == 0
                      ? "Free delivery "
                      : `£${deliveryData.price} delivery `
                    }
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
        </div>
      </section>
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
