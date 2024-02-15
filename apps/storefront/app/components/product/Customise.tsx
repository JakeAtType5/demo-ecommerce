import {
  Await,
  type FetcherWithComponents,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { useRouteError } from "@remix-run/react";
import { Image, Money } from "@shopify/hydrogen";
import type {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { useEffect, useState } from "react";

import SanityImage from "~/components/media/SanityImage";
import { AddToCartLink } from "~/components/product/buttons/AddToCartButton";
import { getMatchingOptionValues, makeSafeClass } from "~/lib/variants";
import { useRootLoaderData } from "~/root";

import CartNotification from "../cart/CartNotification";
import RadioInput from "../elements/RadioInput";
import RadioInputGroup from "../elements/RadioInputGroup";

type Props = {
  image: SanityImage;
  shipping?: {
    price?: number;
    city?: string;
    date?: string;
  };
  variants: ProductVariant[];
};

export default function CustomiseProduct({ image, shipping, variants }: Props) {
  const { sanityDataset, sanityProjectID, cart } = useRootLoaderData();

  const fetcher = useFetcher();

  const [errors, setErrors] = useState([]);
  const [stage, setStage] = useState(1);

  const [isInCart, setIsInCart] = useState(false);

  const [options, setOptions] = useState({
    size: null,
    frame: null,
    mount: null,
  });

  // fill gaps in Shopify data as a result of merging bundles into a single product
  // this lets us overcome Shopify limits on # of options
  // todo: this can be simplified from May 2024 with higher Shopify variant limits.
  const allOptions = variants.map((x) => x.selectedOptions).flat();

  const sizes = getMatchingOptionValues(allOptions, "Size");
  const frames = getMatchingOptionValues(allOptions, "Frame").filter(
    (x) => x != "None"
  );

  const mounts = getMatchingOptionValues(allOptions, "Mount");

  // resets the frame options to default
  const setDefaultFrame = () => {
    if (options.frame == "None" || options.frame == null) {
      setOptions({
        frame: "selected",
        mount: null,
        size: options.size,
      });
    }

    if (stage == 2) {
      setStage(stage + 1);
    }
  };

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
  const selectedVariant = variants.find((x) => {
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
    // checks if this product is already in the cart
    if (selectedVariant) {
      cart.then((cart) => {
        setIsInCart(isProductInCart(cart, selectedVariant?.product?.id));
        console.log(isInCart);
      });
    }

    if (!fetcher.data) return;

    if (fetcher?.state === "loading") {
      setErrors(fetcher?.data?.errors);

      cart.then((cart) => {
        const productIsInCart = isProductInCart(
          cart,
          selectedVariant?.product?.id
        );

        if (productIsInCart && !isInCart) {
          // has just been added to cart
          console.log("just added");
          // we must render the added to cart ui
        }

        if (!productIsInCart && isInCart) {
          console.log("just deleted");
          // has just been deleted from cart
          // we must render the removed from cart ui
        }

        setIsInCart(isProductInCart(cart, selectedVariant.product.id));
      });
    }
  }, [fetcher.data, fetcher?.state]);

  // todo: extract into cart helper
  const isProductInCart = (cart, productId: string) => {
    if (!cart) {
      return false;
    }

    const validLineItems = cart?.lines?.edges.filter(
      (item) => item?.node?.quantity >= 1
    );

    if (!validLineItems || !validLineItems.length) {
      return false;
    }

    return validLineItems.some(
      (item) => item.node.merchandise.product.id == productId
    );
  };

  const configurationIsSoldOut =
    errors &&
    errors.some((error) => error.message.includes("already sold out"));

  const cartIsOverMaxUnits =
    errors &&
    errors.some((error) => error.message.includes("you can only add"));

  const hasErrorMessages = configurationIsSoldOut || cartIsOverMaxUnits;

  // todo: extract into own component
  const ProductPrices = (selectedVariant: ProductVariant) => {
    if (!selectedVariant) {
      return null;
    }

    return (
      <div className="product-price">
        {selectedVariant.compareAtPrice && (
          <span className="mr-3 text-darkGray line-through decoration-red">
            <Money data={selectedVariant.compareAtPrice} />
          </span>
        )}
        {selectedVariant.price && <Money data={selectedVariant.price} />}
      </div>
    );
  };

  return (
    <div className="product-customisation">
      <div className="product-imagery-container">
        <div className="product-imagery">
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

          <div className="print-container">
            <SanityImage
              dataset={sanityDataset}
              layout="responsive"
              projectId={sanityProjectID}
              sizes={["60vw, 100vw"]}
              src={image?.asset?._ref}
            />
          </div>
        </div>
      </div>

      {configurationIsSoldOut && (
        <CartNotification
          title="Not in stock"
          description={
            "Our workshop does not currently have all of the materials in stock to build this custom order. \n \n Please speak to one of our advisors, who may be able to offer further support."
          }
        />
      )}

      {cartIsOverMaxUnits && (
        <CartNotification title="Todo" description={"Todo"} />
      )}

      {/* {isInCart && (
        <CartNotification
          title="Added to cart"
          description={`Order now to receive your order by ${shipping.date}. \n \n Unfortunately we cannot reserve this order for you until you have checked out. `}
          ctaLabel="Checkout"
          secondaryCtaLabel="Edit customisation"
        />
      )} */}

      {!hasErrorMessages && (
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
                "customisation-input"
              )}
            >
              <p className="semi-bold-14">
                2. would you like us to frame your print?
              </p>
              <div className="radio-group">
                <RadioInput
                  value="Yes"
                  className={
                    options.frame && options.frame != "None"
                      ? "--is-selected"
                      : ""
                  }
                  onClick={setDefaultFrame}
                />

                <RadioInput
                  value="No"
                  className={
                    options.frame && options.frame == "None"
                      ? "--is-selected"
                      : ""
                  }
                  onClick={setNoFrame}
                />
              </div>
            </div>

            <div
              className={clsx(
                stage >= 3 && options.frame !== "None" ? "--is-expanded" : "",
                "customisation-input",
                "customisation-input--is-frame-options"
              )}
            >
              <RadioInputGroup
                onClick={updateSelection}
                options={frames}
                stage={3}
                title="3. select a frame finish."
                value={options.frame}
                type="frame"
              />
            </div>

            <div
              className={clsx(
                stage >= 4 && options.frame !== "None" ? "--is-expanded" : "",
                "customisation-input"
              )}
            >
              <RadioInputGroup
                onClick={updateSelection}
                options={mounts}
                stage={4}
                title="4. select a mount."
                type="mount"
                value={options.mount}
              />
            </div>
          </div>

          {selectedVariant && (
            <div className="price-container">
              {selectedVariant.availableForSale ? (
                <>
                  {/* <div className="price-item">
                    <p className="semi-bold-14">Subtotal</p>
                    <div className="money price semi-bold-14">
                      {ProductPrices(selectedVariant)}
                    </div>
                  </div> */}

                  {/* <div className="price-item">
                    <p className="semi-bold-14">Shipping to {shipping.city} </p>
                    <div className="money price semi-bold-14">
                      {shipping.price}
                    </div>
                  </div> */}

                  <div className="price-item">
                    <p className="semi-bold-14">Total</p>
                    <div className="money price semi-bold-14">
                      {ProductPrices(selectedVariant)}
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
                        ? "Adding to cart..."
                        : "Add to cart"}
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
        </div>
      )}
    </div>
  );
}
