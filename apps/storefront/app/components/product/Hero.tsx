import {
  faAngleRight,
  faCheck,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetcher } from "@remix-run/react";
import { Money, ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import type {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { useEffect, useState } from "react";

import SanityImage from "~/components/media/SanityImage";
import type { SanityProductPage } from "~/lib/sanity";
import { formatDate, scrollToElement } from "~/lib/utils";
import { getMatchingOptionValues, makeSafeClass } from "~/lib/variants";
import { useRootLoaderData } from "~/root";

import RadioInput from "../elements/RadioInput";
import RadioInputGroup from "../elements/RadioInputGroup";
import { AddToCartLink } from "./buttons/AddToCartButton";
import ProductPrice from "./Price";

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  storefrontVariants: ProductVariant[];
  analytics: ShopifyAnalyticsPayload;
  anchorLinkID: string;
  isInStock: boolean;
  isFutureRelease: boolean;
  shipping?: {
    price?: number;
    city?: string;
    date?: string;
    /* todo: extract into ShippingObject for reuse*/
  };
};

export default function ProductHero({
  sanityProduct,
  storefrontProduct,
  storefrontVariants,
  // selectedVariant,
  analytics,
  anchorLinkID,
  isFutureRelease,
  isInStock,
  shipping,
}: Props) {
  const { sanityDataset, sanityProjectID, cart } = useRootLoaderData();
  const fetcher = useFetcher();

  const [stage, setStage] = useState(0);
  const [errors, setErrors] = useState([]);

  const [options, setOptions] = useState({
    size: null,
    frame: null,
    mount: null,
  });

  const formattedReleaseDate = formatDate({
    value: sanityProduct?.drop.releaseDate,
    format: "w do m @ h:00",
  });

  // fill gaps in Shopify data as a result of merging bundles into a single product
  // this lets us overcome Shopify limits on # of options
  // todo: this can be simplified from May 2024 with higher Shopify variant limits.
  const allOptions = storefrontVariants.map((x) => x.selectedOptions).flat();

  const sizes = getMatchingOptionValues(allOptions, "Size");
  const frames = getMatchingOptionValues(allOptions, "Frame").filter(
    (x) => x != "None"
  );

  const mounts = getMatchingOptionValues(allOptions, "Mount");

  // sets the frame and mount options to none
  const setNoFrame = () => {
    setOptions({
      frame: "None",
      mount: "None",
      size: options.size,
    });

    if (stage == 2) {
      setStage(stage + 1);
    }
  };

  // updates the selected options whenever a user presses an option
  const updateSelection = ({ optionType, selectedStage, value }) => {
    if (options[optionType] == value) {
      return true;
    }

    setOptions({
      ...options,
      [optionType]: value,
    });

    if (selectedStage == stage) {
      setStage(stage + 1);
    }
  };

  // takes the selected options and finds the matching Shopify variant
  const selectedVariant = storefrontVariants.find((x) => {
    const frameMatches = x.selectedOptions.some(
      (option) => option.name === "Frame" && option.value === options.frame
    );

    const mountMatches = x.selectedOptions.some(
      (option) => option.name === "Mount" && option.value === options.mount
    );
    const sizeMatches = x.selectedOptions.some(
      (option) => option.name === "Size" && option.value === options.size
    );

    if (frameMatches && mountMatches && sizeMatches) {
      return true;
    }
  });

  useEffect(() => {
    if (selectedVariant) {
      if (!fetcher.data) return;

      if (fetcher?.state === "loading") {
        setErrors(fetcher?.data?.errors);
      }

      //   cart.then((cart) => {
      //     const productIsInShopifyCart = isProductInCart(
      //       cart,
      //       selectedVariant?.product?.id
      //     );

      //     if (productIsInShopifyCart && !isInCart) {
      //       console.log("just added");
      //     }

      //     if (!productIsInShopifyCart && isInCart) {
      //       console.log("just deleted");
      //     }

      //     if (productIsInShopifyCart && isInCart) {
      //       console.log("already in cart");
      //     }

      //     setIsInCart(isProductInCart(cart, selectedVariant.product.id));
      //   });
      // }
    }
  }, [selectedVariant, fetcher.data, fetcher?.state]);

  console.log(storefrontProduct);

  const configurationIsSoldOut =
    errors &&
    errors.some((error) => error.message.includes("already sold out"));


  const cartIsOverMaxUnits =
    errors &&
    errors.some((error) => error.message.includes("You can only add"));

  return (
    <section className="product-hero" id={anchorLinkID}>
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

        {/* Badges & buttons */}
        {!isInStock && !isFutureRelease && (
          <span className="semi-bold-16 badge button--large badge--is-sold-out">
            Sold out
          </span>
        )}
        {isFutureRelease && (
          <span className="semi-bold-16 badge button--large badge--is-coming-soon">
            Dropping on {formattedReleaseDate}
          </span>
        )}

        {stage == 0 && isInStock && !isFutureRelease && (
          <button
            className="button--large semi-bold-16"
            onClick={(e) => setStage(1)}
          >
            Customise
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        )}

        {stage > 0 && (
          <div className="customisation-form">
            <div className="customisation-inputs">
              <div
                className={clsx(
                  stage >= 1 ? "--is-expanded" : "",
                  "customisation-input"
                )}
              >
                <RadioInputGroup
                  onClick={updateSelection}
                  options={sizes}
                  stage={1}
                  title="1. select a size."
                  type="size"
                  value={options.size}
                />
              </div>

              <div
                className={clsx(
                  stage >= 2 ? "--is-expanded" : "",
                  "customisation-input",
                  "customisation-input--is-frame-options"
                )}
              >
                <RadioInputGroup
                  onClick={updateSelection}
                  options={frames}
                  stage={2}
                  title="2. choose a frame."
                  value={options.frame}
                  type="frame"
                >
                  <RadioInput
                    value="None"
                    className={
                      options.frame && options.frame == "None"
                        ? "--is-selected"
                        : ""
                    }
                    onClick={setNoFrame}
                  />
                </RadioInputGroup>
              </div>

              <div
                className={clsx(
                  stage >= 3 && options.frame !== "None" ? "--is-expanded" : "",
                  "customisation-input"
                )}
              >
                <RadioInputGroup
                  onClick={updateSelection}
                  options={mounts}
                  stage={3}
                  title="3. choose a mount."
                  type="mount"
                  value={options.mount}
                />
              </div>
            </div>

            {selectedVariant && !cartIsOverMaxUnits && (
              <div className="price-container">
                {selectedVariant.availableForSale ? (
                  <>
                    {/* <div className="price-item">
                      <p className="semi-bold-14">Shipping to {shipping.city} </p>
                      <div className="money price semi-bold-14">
                        {shipping.price}
                      </div>
                    </div> */}

                    <div className="price-item">
                      <p className="semi-bold-14">Total</p>
                      <div className="money price semi-bold-14">
                        <ProductPrice variant={selectedVariant} />
                      </div>
                    </div>

                    {selectedVariant.availableForSale && (
                      <AddToCartLink
                        fetcher={fetcher}
                        lines={[
                          {
                            merchandiseId: selectedVariant.id,
                            quantity: 1,
                          },
                        ]}
                        disabled={configurationIsSoldOut}
                        // // analytics={{
                        // //   products: [productAnalytics],
                        // //   totalValue: parseFloat(productAnalytics.price),
                        // // }}
                        buttonClassName="semi-bold-20 button--large"
                      >
                        {fetcher?.state === "submitting"
                          ? "Adding to your order..."
                          : "Add to your order"}
                      </AddToCartLink>
                    )}
                  </>
                ) : (
                  <p className="semi-bold-14">
                    Due to exceptional demand, we have sold out of one of the
                    materials needed to build this order. Try another
                    configuration or speak to one of our advisors to place a
                    order.
                  </p>
                )}
              </div>
            )}

            {!cartIsOverMaxUnits && configurationIsSoldOut && (
              <p className="semi-bold-14">
                Sold Out <br />
                Our workshop does not currently have all of the materials in
                stock to build this custom order. <br />
                <br /> Please speak to one of our advisors, who may be able to
                offer further support.
              </p>
            )}

            {cartIsOverMaxUnits && (
              <p className="semi-bold-14">
                Over max units todo <br />
                Todo
              </p>
            )}
          </div>
        )}

        {/* Messages */}
        {isInStock && stage == 0 && (
          <div className="semi-bold-14 product-messages">
            <div className="product-message">
              <FontAwesomeIcon icon={faCheck} />
              <p>Starts from £160.00</p>
            </div>
            <div className="product-message">
              <FontAwesomeIcon icon={faCheck} />
              <p>1 of only {sanityProduct.maxUnits} editions printed</p>
            </div>
            <div className="product-message">
              {shipping?.city ? (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <p>
                    {shipping.price == 0
                      ? "Free delivery "
                      : `£${shipping.price} delivery `}
                    to {shipping.city} by {shipping.date}
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
              <p>14 days free return</p>
            </div>
          </div>
        )}
      </div>

      <div className="product-preview">
        <div className="image-container">
          <div
            className={clsx(
              options.mount != null && `--is-${makeSafeClass(options.mount)}`,
              "customisable-mount"
            )}
          />

          <div
            className={clsx(
              options.frame != null && `--is-${makeSafeClass(options.frame)}`,
              "customisable-frame"
            )}
          />

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
    </section>
  );
}

// //       {/* Sold out */}
// //       {!availableForSale && (
// //         <div className="mb-3 text-xs font-bold uppercase text-darkGray">
// //           <Label _key="product.soldOut" />
// //         </div>
// //       )}

// {isInCart && (
//   <CartNotification
//     title="Added to cart"
//     description={`Order now to receive your order by ${shipping.date}. \n \n Unfortunately we cannot reserve this item for you until you have checked out. `}
//     ctaLabel="Checkout"
//     secondaryCtaLabel="Edit customisation"
//   />
// )}
