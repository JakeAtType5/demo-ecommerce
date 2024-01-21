import { Image } from "@shopify/hydrogen";
import type {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";

import SanityImage from "~/components/media/SanityImage";
import ProductTile from "~/components/product/Tile";
import { useGid } from "~/lib/utils";
import { useRootLoaderData } from "~/root";

type Props = {
  image: SanityImage;
  variants: ProductVariant[];
  title: string;
  artist: string;
  options: [];
};

export default function CustomiseProduct({
  artist,
  image,
  title,
  variants,
  options,
}: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  console.log(options);
  return (
    <div className="product-customisation-container">
      <div className="product-imagery">
        <div className="blurred-print-background">
          <SanityImage
            // crop={image?.crop}
            dataset={sanityDataset}
            layout="responsive"
            projectId={sanityProjectID}
            sizes={["10vw"]}
            src={image?.asset?._ref}
          />
        </div>

        <div className="customisable-mount"></div>
        <div className="customisable-frame"></div>

        <div className="print-container">
          <SanityImage
            // crop={image?.crop}
            dataset={sanityDataset}
            layout="responsive"
            projectId={sanityProjectID}
            sizes={["30vw, 100vw"]}
            src={image?.asset?._ref}
          />
        </div>
      </div>

      <div className="customisation-form">
        <div className="customisation-input">
          <p className="semi-bold-20">select a print</p>
          <div className="radio-group">
            <div className="radio-item semi-bold-16">
              A1
            </div>
            <div className="radio-item semi-bold-16">
              A2
            </div>
            <div className="radio-item semi-bold-16">
              A3
            </div>
          </div>

        </div>


        <div className="customisation-input">
          <p className="semi-bold-20">would you like us to frame your print</p>
          <div className="radio-group">
            <div className="radio-item semi-bold-16">
              Yes, please
            </div>
            <div className="radio-item semi-bold-16">
              No thanks, I have my own frame
            </div>
          </div>

        </div>


        <div className="customisation-input">
          <p className="semi-bold-20">select a frame finish</p>
          <div className="radio-group">
            <div className="radio-item semi-bold-16">
              Jet Black
            </div>
            <div className="radio-item semi-bold-16">
              Brushed Silver
            </div>
            <div className="radio-item semi-bold-16">
              Oak
            </div>
          </div>

        </div>

        <div className="customisation-input">
          <p className="semi-bold-20">select a mount</p>
          <div className="radio-group">
            <div className="radio-item semi-bold-16">
              White
            </div>
            <div className="radio-item semi-bold-16">
              Black
            </div>
          </div>

        </div>

        <div className="product-price">
          <div className="price-label">
            <p className="semi-bold-20">Total price</p>
            <p className="semi-bold-16">includes delivery to France</p>
          </div>

          <p className="money price semi-bold-20">£260.00</p>
        </div>

        <button className=" semi-bold-24 button--small button--large">Add to cart</button>

      </div>
    </div>
  );
}
