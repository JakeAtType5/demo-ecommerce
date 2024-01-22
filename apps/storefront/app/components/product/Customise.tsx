import { Image, Money } from "@shopify/hydrogen";
import type {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { useState } from "react";

import SanityImage from "~/components/media/SanityImage";
import { useGid } from "~/lib/utils";
import {
  getMatchingOptionValues,
  makeSafeClass,
  prepareVariants,
} from "~/lib/variants";
import { useRootLoaderData } from "~/root";

import RadioInput from "../elements/RadioInput";
import RadioInputGroup from "../elements/RadioInputGroup";

type Props = {
  image: SanityImage;
  variants: ProductVariant[];
};

export default function CustomiseProduct({ image, variants }: Props) {
  const [options, setOptions] = useState({
    size: "A2",
    frame: "Jet Black",
    mount: "White",
  });

  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  // fill gaps in Shopify data as a result of merging bundles into a single product
  // this lets us overcome Shopify limits on # of options
  const processedVariants = prepareVariants(variants);
  const allOptions = processedVariants.map((x) => x.selectedOptions).flat();

  const sizes = getMatchingOptionValues(allOptions, "Size");
  const frames = getMatchingOptionValues(allOptions, "Frame").filter(
    (x) => x != "None"
  );
  const mounts = getMatchingOptionValues(allOptions, "Mount");

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

  const updateState = ({ optionType, value }) => {
    if (options[optionType] == value) {
      return true;
    }

    setOptions({
      ...options,
      [optionType]: value,
    });
  };

  const activeVariant = processedVariants.find((x) => {
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

  console.log(activeVariant);

  return (
    <div className="product-customisation">
      <div className="product-imagery">
        <div
          className={clsx("customisable-mount", [
            `--is-${makeSafeClass(options.mount)}`,
          ])}
        ></div>

        <div
          className={clsx("customisable-frame", [
            `--is-${makeSafeClass(options.frame)}`,
          ])}
        ></div>
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

      <div className="customisation-form">
        <div className="option-container">
          <div className="customisation-input">
            <RadioInputGroup
              options={sizes}
              type="size"
              value={options.size}
              onClick={updateState}
              title="select a size"
            />
          </div>

          <div className="customisation-input">
            <p className="semi-bold-20">
              would you like us to frame your print
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

          <div
            className={
              options.frame == "None"
                ? "collapsible-group"
                : "collapsible-group --is-expanded"
            }
          >
            <div className="customisation-input">
              <RadioInputGroup
                options={frames}
                type="frame"
                value={options.frame}
                onClick={updateState}
                title="select a frame finish"
              />
            </div>

            <div className="customisation-input">
              <RadioInputGroup
                options={mounts}
                type="mount"
                value={options.mount}
                onClick={updateState}
                title="select a mount"
              />
            </div>
          </div>
        </div>

        <div className="price-container">
          <div className="price-label">
            <p className="semi-bold-20">Total price</p>
            <p className="semi-bold-16">includes delivery to France</p>
          </div>

          <div className="money price semi-bold-20">
            {ProductPrices(activeVariant)}
          </div>
        </div>

        <button className="semi-bold-24 button--small button--large">
          Add to cart
        </button>
      </div>
    </div>
  );
}
