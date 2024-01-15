import clsx from "clsx";

import Button from "~/components/elements/Button";
import Link from "~/components/elements/Link";
import SanityImage from "~/components/media/SanityImage";
import ProductHotspot from "~/components/product/Hotspot";
import ProductTag from "~/components/product/Tag";
import type { SanityModuleImage } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";

type Props = {
  value: SanityModuleImage;
};

export default function ImageModule({ value }: Props) {
  if (!value.image) {
    return null;
  }

  const hyphenatedVariant =
    value && value.variant
      ? value.variant
          .split(/(?=[A-Z])/)
          .join("-")
          .toLowerCase()
      : "";

  const hyphenatedContentPosition =
    value && value.contentPosition
      ? value.contentPosition
          .split(/(?=[A-Z])/)
          .join("-")
          .toLowerCase()
      : "";

  return (
    <div
      className={clsx(
        "story-image",
        value.size && value.size === "halfWidth"
          ? "--half-width"
          : "--full-width",
        value.position ? `--${value.position}-aligned` : "",
        value.variant ? `--${hyphenatedVariant}-variant` : "",
        value.contentPosition ? `--content-${hyphenatedContentPosition}` : ""
      )}
    >
      {value.variant === "callToAction" && value.callToAction?.link ? (
        <Link className="group" link={value.callToAction.link}>
          <ImageContent value={value} />
        </Link>
      ) : (
        <ImageContent value={value} />
      )}

      {/* Caption */}
      {value.variant === "caption" && value.caption && (
        <div className="mt-2 max-w-[35rem] text-sm leading-caption text-darkGray">
          {value.caption}
        </div>
      )}
      {/* Product hotspots */}
      {value.variant === "productHotspots" && (
        <>
          {value.productHotspots?.map((hotspot) => {
            if (!hotspot?.product?.gid) {
              return null;
            }

            return (
              <ProductHotspot
                key={hotspot._key}
                productGid={hotspot?.product?.gid}
                variantGid={hotspot?.product?.variantGid}
                x={hotspot.x}
                y={hotspot.y}
              />
            );
          })}
        </>
      )}
      {/* Product tags */}
      {value.variant === "productTags" && (
        <div className="mt-2 flex flex-wrap gap-x-1 gap-y-2">
          {value.productTags?.map((tag) => {
            if (!tag?.gid) {
              return null;
            }

            return (
              <ProductTag
                key={tag._key}
                productGid={tag?.gid}
                variantGid={tag?.variantGid}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

const ImageContent = ({ value }: Props) => {
  const image = value.image;
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  return (
    <>
      <div className="image-container">
        <SanityImage
          crop={image?.crop}
          dataset={sanityDataset}
          hotspot={image?.hotspot}
          layout="responsive"
          projectId={sanityProjectID}
          sizes={["50vw, 100vw"]}
          src={image?.asset?._ref}
        />
      </div>

      {/* JL to look at why some are called here, and some in the above function */}

      {/* Call to action */}
      {value.variant === "callToAction" && (
        <div
          className={clsx(
            "absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-20 duration-500 ease-out",
            "group-hover:bg-opacity-30"
          )}
        >
          <div className="mt-[1em] flex flex-col items-center gap-5">
            {/* Title */}
            <div
              className={clsx(
                "max-w-[30rem] text-xl text-white",
                "lg:text-2xl",
                "xl:text-3xl"
              )}
            >
              {value.callToAction?.title}
            </div>

            {/* Button */}
            {value.callToAction?.link && (
              <Button
                className={clsx("pointer-events-none bg-white text-offBlack")}
              >
                {value.callToAction.title}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Quote */}
      {(value.variant === "quote" || value.variant === "quoteAndText") &&
        value.quote && <p className="bold-56 quote">{value.quote}</p>}

      {/* Text */}
      {(value.variant === "text" || value.variant === "quoteAndText") &&
        value.text && <p className="semi-bold-16 text">{value.text}</p>}
    </>
  );
};
