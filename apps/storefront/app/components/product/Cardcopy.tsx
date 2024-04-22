import clsx from "clsx";

import { Link } from "~/components/Link";
import SanityImage from "~/components/media/SanityImage";
import type { SanityProductPreview } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";

type Props = {
  children?: React.ReactNode;
  product: SanityProductPreview;
  style?: string;
};

export default function ProductCard({ children, product, style }: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  const backgroundColor =
    product.artwork?.palette.dominant.population > 2.7
      ? `${product.artwork?.palette.dominant.background}12`
      : `${product.artwork?.palette.lightMuted.background}12`;

  return (
    <div
      className={clsx(
        "product-card",
        product.status === "upcoming" ? "--is-upcoming" : "",
        product.status === "unavailable" ? "--is-sold-out" : ""
      )}
      style={{
        "--product-primary-color": backgroundColor,
      }}
    >
      <Link to={`${product.slug}`}>
        <div className="image-container">
          <SanityImage
            dataset={sanityDataset}
            layout="responsive"
            projectId={sanityProjectID}
            sizes={["50vw, 75vW"]}
            src={product.artwork?.asset?._ref}
          />
        </div>
        <div className="card-metadata">
          <p className="bold-24 mobile-only product-title">{product.title}</p>
          <p className="bold-42 desktop-only product-title">{product.title}</p>
          <p className="italic-20 artist-title">{product.artist}</p>
          {style === "collage" && (
            <p className="body-text-18 product-description">
              {product.description}
            </p>
          )}

          {children}
        </div>
      </Link>
    </div>
  );
}
