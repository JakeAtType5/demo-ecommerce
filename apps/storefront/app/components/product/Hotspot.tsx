import type { Product } from "@shopify/hydrogen/storefront-api-types";
import Tippy from "@tippyjs/react/headless";
import clsx from "clsx";

import { Link } from "~/components/Link";
import ProductTile from "~/components/product/Tile";
import { useGid } from "~/lib/utils";

type Props = {
  productGid: string;
  variantGid?: string;
  x: number;
  y: number;
};

export default function ProductHotspot({
  productGid,
  variantGid,
  x,
  y,
}: Props) {
  const storefrontProduct = useGid<Product>(productGid);

  return (
    <Tippy
      placement="top"
      render={() => {
        return (
          <ProductTile
            storefrontProduct={storefrontProduct}
            variantGid={variantGid}
          />
        );
      }}
    >
      <Link
        className="hotspot"
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
        to={`/product/${storefrontProduct.handle}`}
      >
        <div className="circle" />
      </Link>
    </Tippy>
  );
}
