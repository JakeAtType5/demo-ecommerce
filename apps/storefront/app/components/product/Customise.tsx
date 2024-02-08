import { DEFAULT_CURRENCY_CODE } from "@demo-ecommerce/sanity/src/constants";
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
import {
  getAllVariants,
  getMatchingOptionValues,
  makeSafeClass,
} from "~/lib/variants";
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
  const [isInCart, setIsInCart] = useState(false);

  const [options, setOptions] = useState({
    size: "A2",
    frame: "Jet Black",
    mount: "White",
  });

  // fill gaps in Shopify data as a result of merging bundles into a single product
  // this lets us overcome Shopify limits on # of options
  // todo: this can be simplified from May 2024 with higher Shopify variant limits.
  const allVariants = getAllVariants(variants);

  const allOptions = allVariants.map((x) => x.selectedOptions).flat();

  const sizes = getMatchingOptionValues(allOptions, "Size");
  const frames = getMatchingOptionValues(allOptions, "Frame").filter(
    (x) => x != "None"
  );

  const mounts = getMatchingOptionValues(allOptions, "Mount");

  // resets the frame options to default
  const setDefaultFrame = () => {
    if (options.frame !== "None") {
      return true;
    }
    setOptions({
      frame: "Jet Black",
      mount: "White",
      size: options.size,
    });
  };

  // sets the frame and mount options to none
  const setNoFrame = () => {
    if (options.frame == "None") {
      return true;
    }
    setOptions({
      frame: "None",
      mount: "None",
      size: options.size,
    });
  };

  // updates the selected options whenever a user presses an option
  const updateSelection = ({ optionType, value }) => {
    if (options[optionType] == value) {
      return true;
    }

    setOptions({
      ...options,
      [optionType]: value,
    });
  };

  // takes the selected options and finds the matching Shopify variant
  const selectedVariant = allVariants.find((x) => {
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

  const artworkIsInStock = allVariants.some(
    (variant) => variant.availableForSale == true
  );

  useEffect(() => {
    // checks if this product is already in the cart
    cart.then((cart) => {
      setIsInCart(isProductInCart(cart, selectedVariant?.product?.id));
      console.log(isInCart);
    });

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

  const hasErrorMessages =
    configurationIsSoldOut || cartIsOverMaxUnits || !artworkIsInStock;

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
            className={clsx("customisable-mount", [
              `--is-${makeSafeClass(options.mount)}`,
            ])}
          />

          <div
            className={clsx("customisable-frame", [
              `--is-${makeSafeClass(options.frame)}`,
            ])}
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

      {!artworkIsInStock && (
        <CartNotification
          title="Sold out"
          description="This design has sold out. <br/><br/> Our workshop only creates a very limited number of each artwork, as pre-agreed with the artist."
        />
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
          <div
            className={
              options.frame == "None"
                ? "option-container"
                : "option-container --is-expanded"
            }
          >
            <div className="customisation-input">
              <RadioInputGroup
                options={sizes}
                type="size"
                value={options.size}
                onClick={updateSelection}
                title="1. select a size."
              />
            </div>

            <div className="customisation-input">
              <p className="semi-bold-16">
                2. would you like us to frame your print?
              </p>
              <div className="radio-group">
                <RadioInput
                  value="Yes, please"
                  className={options.frame != "None" ? "--is-selected" : ""}
                  onClick={setDefaultFrame}
                />

                <RadioInput
                  value="No thanks, I have my own frame"
                  className={options.frame == "None" ? "--is-selected" : ""}
                  onClick={setNoFrame}
                />
              </div>
            </div>

            <div className="collapsible-group">
              <div className="customisation-input">
                <RadioInputGroup
                  options={frames}
                  type="frame"
                  value={options.frame}
                  onClick={updateSelection}
                  title="3. select a frame finish."
                />
              </div>

              <div className="customisation-input">
                <RadioInputGroup
                  options={mounts}
                  type="mount"
                  value={options.mount}
                  onClick={updateSelection}
                  title="4. select a mount."
                />
              </div>
            </div>
          </div>

          <div className="price-container">
            {selectedVariant.availableForSale ? (
              <>
                <div className="price-label">
                  <p className="semi-bold-20">Total price</p>
                  <p className="semi-bold-16">
                  {shipping.price == 0
                      ? "including delivery "
                      : `plus £${shipping.price} delivery `}
                    to {shipping.city}
                  </p>
                </div>
                <div className="money price semi-bold-20">
                  {ProductPrices(selectedVariant)}
                </div>
              </>
            ) : (
              <p className="semi-bold-16">
                Due to exceptional demand, we have sold out of one of the
                materials needed to build this order. Try another configuration
                or speak to one of our advisors to place a order.
              </p>
            )}
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
              Add to cart
            </AddToCartLink>
          )}
        </div>
      )}
    </div>
  );
}
