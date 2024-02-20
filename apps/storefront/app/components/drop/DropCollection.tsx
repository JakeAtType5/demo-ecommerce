import clsx from "clsx";

import DropCard from "~/components/drop/Card";
import type { SanityDrop, SanityProductPreview } from "~/lib/sanity";

type Props = {
  drops: SanityDrop[];
  style?: "grid" | "row";
  idsToHide?: [];
  filter?:
    | "upcoming available unavailable"
    | "available unavailable"
    | "upcoming"
    | "available"
    | "unavailable";
  sortBy?: "releaseDate";
};

export function sortDrops({ drops, filter, sortBy }: Props) {
  // todo: THIS MUST FEED THROUGH TO THE QUERY, OR WE WILL HAVE BIG ISSUES WITH PAGINATION IN FUTURE!!

  // temp: remove products without release dates for testing
  const validDrops = drops.filter((x) => x.releaseDate);

  const sortedDrops = sortBy
    ? validDrops.sort((a, b) => {
        return a[sortBy] - b[sortBy];
      })
    : validDrops;

  const upcomingDrops = new Set();
  const availableDrops = new Set();
  const unavailableDrops = new Set();

  const now = new Date();

  // calculates the status of each drop, and adds it to the relevant array
  sortedDrops.forEach((drop) => {
    const releaseDate = drop.releaseDate && new Date(drop.releaseDate);
    const isUpcoming = releaseDate && releaseDate > now;

    const isAvailable = true;
    // todo: query isAvailable
    //   product.inventory && product.inventory.availableForSale == true;

    if (isUpcoming) {
      drop.status = "upcoming";
      upcomingDrops.add(drop);
      return;
    }

    if (isAvailable) {
      drop.status = "available";
      availableDrops.add(drop);
      return;
    }

    drop.status = "unavailable";
    unavailableDrops.add(drop);
  });

  // returns drops that match the specified status filter
  if (filter == "available") {
    return availableDrops;
  }

  if (filter == "upcoming") {
    return upcomingDrops;
  }

  if (filter == "unavailable") {
    return unavailableDrops;
  }

  if (filter == "upcoming available unavailable") {
    return new Set([...upcomingDrops, ...availableDrops, ...unavailableDrops]);
  }

  if (filter == "available unavailable") {
    return new Set([...availableDrops, ...unavailableDrops]);
  }
}

export default function ProductCollection({
  drops,
  style,
  idsToHide,
  filter,
}: Props) {
  // remove IDs that we've explicitly asked to take out
  const filteredDrops = idsToHide
    ? drops.filter((product) => !idsToHide.includes(drop._id))
    : drops;

  // now lets sort the products
  const sortedDrops = sortDrops({
    drops: filteredDrops,
    filter: filter || "upcoming available unavailable",
  });

  // finally convert to an array so we can actually use it in JSX
  const dropArray = Array.from(sortedDrops);

  return (
    <div className={clsx("drop-collection", `--${style}-collection`)}>
      {dropArray.map((drop) => (
        <DropCard key={drop._id} drop={drop} />
      ))}
    </div>
  );
}
