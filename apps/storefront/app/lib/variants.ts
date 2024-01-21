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
 * and rendered by product customisation form
 */
export const prepareVariants = (variants) => {
  if (!variants || !variants.length) {
    return [];
  }

  // we first fill in missing variant options from Shopify
  const processedVariants = variants
    .map((x) => x?.variants?.nodes) // unpack from Shopify api format into usable array
    .flat()
    .map((x) => {
      const hasSize = x.selectedOptions.some((x) => x.name === "Size");
      const hasFrame = x.selectedOptions.some((x) => x.name === "Frame");

      if (!hasFrame) {
        x.selectedOptions.push({
          name: "Frame",
          value: "None",
        });
        x.selectedOptions.push({
          name: "Mount",
          value: "None",
        });
      }

      if (hasSize == false) {
        x.selectedOptions.push({
          name: "Size",
          value: getSizeFromBundleHandle(x.product.title),
        });
      }
      return x;
    });

  // all possible options
  return processedVariants;
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
}