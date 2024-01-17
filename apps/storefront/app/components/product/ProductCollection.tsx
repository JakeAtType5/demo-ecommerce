import clsx from "clsx";

import type { SanityProductPreview } from "~/lib/sanity";

import ProductCard from "./Cardcopy";

type Props = {
  products: SanityProductPreview[];
  style: "collage" | "grid" | "row";
  idsToHide: [];
};

export default function ProductCollection({
  products,
  style,
  idsToHide,
}: Props) {
  console.log(idsToHide);
  const filteredProducts = idsToHide
    ? products.filter((product) => !idsToHide.includes(product._id))
    : products;

  return (
    <div className={clsx("product-collection", `--${style}-collection`)}>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
