import clsx from "clsx";

import DropMetadata from "~/components/drop/Metadata";
import { Link } from "~/components/Link";
import SanityImage from "~/components/media/SanityImage";
import type { SanityDrop } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";

type Props = {
  drop: SanityDrop;
  style: string;
};

export default function DropCard({ drop, style }: Props) {
  // const { sanityDataset, sanityProjectID } = useRootLoaderData();

  return (
    <div
      className={clsx(
        "drop-card",
        drop.status === "upcoming" ? "--is-upcoming" : "",
        drop.status === "unavailable" ? "--is-sold-out" : ""
      )}
      // style={{
      //   "--product-primary-color": `${product.printImage?.palette.vibrant.background}1f`,
      // }}
    >
      <Link to={drop.slug}>
        <div className="image-container">
          {/* <SanityImage
            dataset={sanityDataset}
            layout="responsive"
            projectId={sanityProjectID}
            sizes={["30vw, 50vw"]}
            src={drop.previewImage?.asset?._ref}
          /> */}
        </div>

        <p className="bold-24">{drop.title}</p>

        {drop.description && (
          <p className="semi-bold-16 drop-description">{drop.description}</p>
        )}

        <DropMetadata
          location={drop.location}
          number={drop.number}
          releaseDate={drop.release_date}
        />
      </Link>
    </div>
  );
}
