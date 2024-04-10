import { SelectedOption } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";

import { Link } from "~/components/Link";
import SanityImage from "~/components/media/SanityImage";
import type { SanityProductPreview } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";

type Props = {
  children?: React.ReactNode;
  product: SanityProductPreview;
  style?: string;
  selectedOptions: SelectedOption[];
};

export default function CartProductPreview({
  children,
  product,
  style,
  selectedOptions,
}: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  const size = selectedOptions.find((x) => x.name === "Size")?.value;

  const frame = selectedOptions.find((x) => x.name === "Frame")?.value;

  const mount = selectedOptions.find((x) => x.name === "Mount")?.value;

  return (
    <div
      className={clsx(
        "product-card cart-product-preview",
        product.status === "upcoming" ? "--is-upcoming" : "",
        product.status === "unavailable" ? "--is-sold-out" : ""
      )}
      style={{
        "--product-primary-color": `${product.printImage?.palette.vibrant.background}1f`,
      }}
    >
      <Link to={`${product.slug}`}>
        <div className="image-container">
          <SanityImage
            dataset={sanityDataset}
            layout="responsive"
            projectId={sanityProjectID}
            sizes={["30vw, 50vw"]}
            src={product.printImage?.asset?._ref}
          />
        </div>
        <div className="card-metadata">
          <p className="bold-18 product-title">{product.title}</p>
          <p className="semi-bold-14 artist-title">
            {size && `Size: ${size}`}
            {frame && `Frame: ${frame}`}
        {/* {mount && mount != "None" && `/ ${mount}`} */}
          </p>
        </div>
        {children}
      </Link>
    </div>
  );
}
