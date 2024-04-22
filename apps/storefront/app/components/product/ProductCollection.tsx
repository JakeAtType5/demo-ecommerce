import product from "@demo-ecommerce/sanity/src/schema/annotations/product";
import clsx from "clsx";

import type { SanityProductPreview } from "~/lib/sanity";

import ProductCard from "./Cardcopy";

type Props = {
  availabilities?: string[];
  products: SanityProductPreview[];
  style?: "collage" | "grid" | "row";
  idsToHide?: [];
  sortBy?: "releaseDate";
};

export function sortProducts({ products, availabilities, sortBy }: Props) {
  const validProducts = products.filter((x) => x.releaseDate);

  const sortedProducts = sortBy
    ? validProducts.sort((a, b) => {
        return a[sortBy] - b[sortBy];
      })
    : validProducts;

  const upcomingProducts = new Set();
  const availableProducts = new Set();
  const unavailableProducts = new Set();

  const now = new Date();

  sortedProducts.forEach((product) => {
    const releaseDate = product.releaseDate && new Date(product.releaseDate);
    const isUpcoming = releaseDate && releaseDate > now;

    const isAvailable =
      product.inventory && product.inventory.availableForSale == true;

    if (isUpcoming) {
      product.status = "upcoming";
      upcomingProducts.add(product);
      return;
    }

    if (isAvailable) {
      product.status = "available";
      availableProducts.add(product);
      return;
    }

    product.status = "unavailable";
    unavailableProducts.add(product);
  });

  if (!availabilities) {
    return [];
  }

  let mergedSet = new Set();

  availabilities.forEach((availability) => {
    if (availability == "available") {
      mergedSet = new Set([...mergedSet, ...availableProducts]);
    }

    if (availability == "upcoming") {
      mergedSet = new Set([...mergedSet, ...upcomingProducts]);
    }

    if (availability == "unavailable") {
      mergedSet = new Set([...mergedSet, ...unavailableProducts]);
    }
  });

  return mergedSet;
}

export default function ProductCollection({
  products,
  style,
  idsToHide,
  availabilities
}: Props) {
  // remove IDs that we've explicitly asked to take out
  const filteredProducts = idsToHide
    ? products.filter((product) => !idsToHide.includes(product._id))
    : products;

  // now lets sort the products
  const sortedProducts = sortProducts({
    products: filteredProducts,
    availabilities,
  });

  // convert the set to an array so we can actually use it in JSX
  const productArray = Array.from(sortedProducts);
  
  const emptyStateMessage = "Refine or reset your search";
  return (
    <div className={clsx("products-collection", `--is-${style}`)}>
      {productArray.length > 0 ? (
        productArray.map((product) => (
          <ProductCard key={product._id} product={product} style={style} />
        ))
      ) : (
        <div className="collection-empty-state">
          <p className="semi-bold-24">No artworks found</p>
          <p className="semi-bold-18">{emptyStateMessage}</p>
        </div>
      )}
    </div>
  );
}
