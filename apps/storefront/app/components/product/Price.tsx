import { Money } from "@shopify/hydrogen";
import type { ProductVariant } from "@shopify/hydrogen/storefront-api-types";

type Props = {
  variant: ProductVariant;
};

export default function ProductPrice({ variant }: Props) {
  if (!variant) {
    return null;
  }

  return (
    <div className="product-price">
      {variant.compareAtPrice && (
        <span className="line-through">
          <Money data={variant.compareAtPrice} />
        </span>
      )}
      {variant.price && <Money data={variant.price} />}
    </div>
  );
}
