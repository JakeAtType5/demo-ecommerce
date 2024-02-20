import clsx from "clsx";

import type { SanityProductPreview } from "~/lib/sanity";

import ProductCard from "./Cardcopy";

type Props = {
  products: SanityProductPreview[];
  style?: "collage" | "grid" | "row";
  idsToHide?: [];
  filter?: "upcoming available unavailable" | "upcoming" | "available";
  sortBy?: "releaseDate";
};

export function sortProducts({ products, filter, sortBy }: Props) {
  // temp: remove products without release dates for testing
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

  if (filter == "available") {
    return availableProducts;
  }

  if (filter == "upcoming") {
    return upcomingProducts;
  }

  if (filter == "unavailable") {
    return unavailableProducts;
  }

  if (filter == "upcoming available unavailable") {
    return new Set([
      ...upcomingProducts,
      ...availableProducts,
      ...unavailableProducts,
    ]);
  }
}

export default function ProductCollection({
  products,
  style,
  idsToHide,
}: Props) {
  // remove IDs that we've explicitly asked to take out
  const filteredProducts = idsToHide
    ? products.filter((product) => !idsToHide.includes(product._id))
    : products;

  // now lets sort the products
  const sortedProducts = sortProducts({
    products: filteredProducts,
    filter: "upcoming available unavailable",
  });
  // finally convert to an array so we can actually use it in JSX
  const productArray = Array.from(sortedProducts);

  return (
    <div className={clsx("product-collection", `--${style}-collection`)}>
      {productArray.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
