import clsx from "clsx";

import { Link } from "~/components/Link";
import SanityImage from "~/components/media/SanityImage";
import type { SanityProductPreview } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";

type Props = {
  product: SanityProductPreview;
  style: string;
};

export default function ProductCard({ product, style }: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  return (
    <div
      className={clsx(
        "product-card",
        product.status === "upcoming" ? "--is-upcoming" : "",
        product.status === "unavailable" ? "--is-sold-out" : ""
      )}
      style={{
        "--product-primary-color": `${product.printImage?.palette.vibrant.background}1f`,
      }}
    >
      <Link to={`/products/${product.slug}`}>
        <div className="image-container">
          <SanityImage
            dataset={sanityDataset}
            layout="responsive"
            projectId={sanityProjectID}
            sizes={["30vw, 50vw"]}
            src={product.printImage?.asset?._ref}
          />
        </div>

        <p className="bold-24 product-title">{product.title}</p>
        <p className="semi-bold-16 artist-title">by {product.vendor}</p>
      </Link>
    </div>
  );
}
