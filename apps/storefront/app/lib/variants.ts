import { ProductVariant } from "@shopify/hydrogen/storefront-api-types";
import { createContext, useContext } from "react";

/**
 * Gets the size attribute from a Shopify bundle title
 */
export const getSizeFromBundleHandle = (productTitle: string) => {
  const title = productTitle.toLowerCase();

  if (title.includes("a3")) {
    return "A3";
  }

  if (title.includes("a2")) {
    return "A2";
  }

  if (title.includes("a1")) {
    return "A1";
  }
};

/**
 * Prepare a list of variants to be filtered
 * and rendered by the product customisation form
 */
export const getAllVariants = (variants) => {
  if (!variants || !variants.length) {
    return [];
  }

  // fill in missing variant options from Shopify
  // to overcome the limitations of native product bundles
  const allVariants = variants
    .map((resp) => resp?.variants?.nodes) // unpack from Shopify api format into usable array
    .flat()
    .map((variant) => {
      const hasSize = variant.selectedOptions.some(
        (option) => option.name === "Size"
      );
      const hasFrame = variant.selectedOptions.some(
        (option) => option.name === "Frame"
      );

      if (!hasFrame) {
        variant.selectedOptions.push({
          name: "Frame",
          value: "None",
        });
        variant.selectedOptions.push({
          name: "Mount",
          value: "None",
        });
      }

      if (hasSize == false) {
        variant.selectedOptions.push({
          name: "Size",
          value: getSizeFromBundleHandle(variant.product.title),
        });
      }
      return variant;
    });

  // an array of all possible options
  return allVariants;
};

/* Get all options matching a specific type */
export const getMatchingOptionValues = (options: [], optionType: string) => {
  const matchingOptions = options
    .filter((x) => x.name === optionType)
    .map((x) => x.value)
    .flat();

  // return without duplicates
  return [...new Set([...matchingOptions])];
};

export const makeSafeClass = (value: string) => {
  return value.replace(/\s+/g, "-").toLowerCase();
};
