import {
  faCircle,
  faTrash,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartForm } from "@shopify/hydrogen";
import type {
  Cart,
  CartCost,
  CartLine,
  CartLineUpdateInput,
  ComponentizableCartLine,
} from "@shopify/hydrogen/storefront-api-types";
import {
  flattenConnection,
  Image,
  Money,
  ShopPayButton,
} from "@shopify/hydrogen-react";
import clsx from "clsx";
import { useEffect, useState } from "react";

import MinusCircleIcon from "~/components/icons/MinusCircle";
import PlusCircleIcon from "~/components/icons/PlusCircle";
import RemoveIcon from "~/components/icons/Remove";
import SpinnerIcon from "~/components/icons/Spinner";
import { Link } from "~/components/Link";
import { useCartFetchers } from "~/hooks/useCartFetchers";
import { SanityProductPreview } from "~/lib/sanity/types";
import {
  addWorkingDays,
  getIpData,
  getZone,
  shippingZones,
} from "~/lib/shipping";
import { formatDate } from "~/lib/utils";
import { useRootLoaderData } from "~/root";

import CartProductPreview from "../cart/CartProductPreview";
import { Label } from "../global/Label";

export function CartLineItems({
  linesObj,
  sanityCartResults,
}: {
  linesObj: Cart["lines"] | undefined;
  sanityCartResults?: SanityProductPreview[];
}) {
  const [shipping, setShipping] = useState({
    city: "",
    date: "",
    price: 0,
  });

  const fetchShippingData = async () => {
    const locationData = await getIpData();
    const zone = getZone(locationData.country);
    const daysToFulfil = 2 + zone.daysToShip;

    const deliveryDate = addWorkingDays(daysToFulfil);

    const formattedDeliveryDate = formatDate({
      value: deliveryDate,
      format: "w do m",
    });

    setShipping({
      city: locationData.city,
      date: formattedDeliveryDate,
      price: zone.additionalFee,
    });
  };

  useEffect(() => {
    if (!shipping?.city) {
      fetchShippingData();
    }
  }, [shipping]);

  const lines = flattenConnection(linesObj);

  return (
    <div className="cart-product-list" role="table" aria-label="Shopping cart">
      {lines.map((line) => {
        const sanityProduct = sanityCartResults.find(
          (sanityProduct) => (sanityProduct.gid = line.merchandise.product.id)
        );
        return (
          <LineItem
            key={line.id}
            lineItem={line}
            sanityProduct={sanityProduct}
          />
        );
      })}

      <div className="product-card cart-product-preview shipping-product-preview">
        <div className="card-metadata">
          {shipping?.city ? (
            <>
              <p className="semi-bold-14 product-title">
                Delivery to {shipping.city}
              </p>
              <p className="semi-bold-14 artist-title">
                Before {shipping.date}
              </p>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCircle} beat />
              <p>Calculating delivery time...</p>
            </>
          )}
        </div>
        <p className="semi-bold-14 product-price">
          {shipping.price ? `£${shipping.price}` : "Free"}
        </p>
      </div>
    </div>
  );
}

function LineItem({
  lineItem,
  sanityProduct,
}: {
  lineItem: CartLine | ComponentizableCartLine;
  sanityProduct: SanityProductPreview;
}) {
  const { merchandise } = lineItem;

  const updatingItems = useCartFetchers(CartForm.ACTIONS.LinesUpdate);
  const removingItems = useCartFetchers(CartForm.ACTIONS.LinesRemove);

  // Check if the line item is being updated, as we want to show the new quantity as optimistic UI
  let updatingQty;
  const updating =
    updatingItems?.find((fetcher) => {
      const formData = fetcher?.formData;

      if (formData) {
        const formInputs = CartForm.getFormInput(formData);
        return (
          Array.isArray(formInputs?.inputs?.lines) &&
          formInputs?.inputs?.lines?.find((line: CartLineUpdateInput) => {
            updatingQty = line.quantity;
            return line.id === lineItem.id;
          })
        );
      }
    }) && updatingQty;

  // Check if the line item is being removed, as we want to show the line item as being deleted
  const deleting = removingItems.find((fetcher) => {
    const formData = fetcher?.formData;
    if (formData) {
      const formInputs = CartForm.getFormInput(formData);
      return (
        Array.isArray(formInputs?.inputs?.lineIds) &&
        formInputs?.inputs?.lineIds?.find(
          (lineId: CartLineUpdateInput["id"]) => lineId === lineItem.id
        )
      );
    }
  });

  const firstVariant = merchandise.selectedOptions[0];
  const hasDefaultVariantOnly =
    firstVariant.name === "Title" && firstVariant.value === "Default Title";

  return (
    <div className={clsx("cart-row", deleting && "--is-deleted")}>
      <CartProductPreview
        product={sanityProduct}
        key={lineItem.id}
        selectedOptions={merchandise.selectedOptions}
      >
        <div className="cart-row-column">
          <div className="semi-bold-14 product-price">
            {updating ? (
              <SpinnerIcon width={24} height={24} />
            ) : (
              <Money data={lineItem.cost.totalAmount} />
            )}
          </div>
        </div>
      </CartProductPreview>

      <div className="product-actions">
        <a className="body-text-12">Customise</a>
        {deleting ? (
          <SpinnerIcon width={24} height={24} />
        ) : (
          <ItemRemoveButton lineIds={[lineItem.id]} />
        )}
      </div>
    </div>
  );
}

// function CartItemQuantity({
//   line,
//   submissionQuantity,
// }: {
//   line: CartLine | ComponentizableCartLine;
//   submissionQuantity: number | undefined;
// }) {
//   if (!line || typeof line?.quantity === "undefined") return null;
//   const { id: lineId, quantity } = line;

//   // // The below handles optimistic updates for the quantity
//   const lineQuantity = submissionQuantity ? submissionQuantity : quantity;

//   const prevQuantity = Number(Math.max(0, lineQuantity - 1).toFixed(0));
//   const nextQuantity = Number((lineQuantity + 1).toFixed(0));

//   return (
//     <div className="flex items-center gap-2">
//       <UpdateCartButton lines={[{ id: lineId, quantity: prevQuantity }]}>
//         <button
//           aria-label="Decrease quantity"
//           value={prevQuantity}
//           disabled={quantity <= 1}
//         >
//           <MinusCircleIcon />
//         </button>
//       </UpdateCartButton>

//       <div className="min-w-[1rem] text-center text-sm font-bold leading-none text-black">
//         {lineQuantity}
//       </div>

//       <UpdateCartButton lines={[{ id: lineId, quantity: nextQuantity }]}>
//         <button aria-label="Increase quantity" value={prevQuantity}>
//           <PlusCircleIcon />
//         </button>
//       </UpdateCartButton>
//     </div>
//   );
// }

// function UpdateCartButton({
//   children,
//   lines,
// }: {
//   children: React.ReactNode;
//   lines: CartLineUpdateInput[];
// }) {
//   return (
//     <CartForm
//       route="/cart"
//       action={CartForm.ACTIONS.LinesUpdate}
//       inputs={{ lines }}
//     >
//       {children}
//     </CartForm>
//   );
// }

function ItemRemoveButton({ lineIds }: { lineIds: CartLine["id"][] }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button type="submit">
        <a className="body-text-12">Remove from order</a>
      </button>
    </CartForm>
  );
}

export function CartSummary({ cost }: { cost: CartCost }) {
  return (
    <>
      <div className="cart-totals">
        <p className="semi-bold-16">Total</p>
        <p className="semi-bold-16">
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            "-"
          )}
        </p>
      </div>
    </>
  );
}

export function CartActions({ cart }: { cart: Cart }) {
  const { storeDomain } = useRootLoaderData();

  if (!cart || !cart.checkoutUrl) return null;

  const shopPayLineItems = flattenConnection(cart.lines).map((line) => ({
    id: line.merchandise.id,
    quantity: line.quantity,
  }));

  return (
    <div className="cart-actions">
      <a href={cart.checkoutUrl}>
        <button className="button--large semi-bold-16">
          Proceed to Checkout
        </button>
      </a>
    </div>
  );
}

/* <ShopPayButton
        className={clsx([defaultButtonStyles({ tone: "shopPay" }), "w-1/2"])}
        variantIdsAndQuantities={shopPayLineItems}
        storeDomain={storeDomain}
      /> */
/* <Label _key="cart.checkout" /> */

/* <p className="semi-bold-16">Subtotal</p>
        <p className="semi-bold-16">
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            "-"
          )}
        </p>
        <p className="semi-bold-16">Tax</p>
        <p className="semi-bold-16">
          {cost?.totalTaxAmount?.amount ? (
            <Money data={cost?.totalTaxAmount} />
          ) : (
            "-"
          )}
        </p>
        <p className="semi-bold-16">Duty & delivery</p>
        <p className="semi-bold-16">
          {cost?.totalDutyAmount?.amount ? (
            <Money data={cost?.totalDutyAmount} />
          ) : (
            "-"
          )}
        </p> */

/* <div
          className="flex justify-between border-t border-gray p-4"
          role="row"
        >
          <span className="text-darkGray" role="rowheader">
            <Label _key="cart.subtotal" />
          </span>
          <span role="cell" className="text-right font-bold">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              "-"
            )}
          </span>
        </div> */

//   {/* Quantity */}
//   <CartItemQuantity line={lineItem} submissionQuantity={updating} />
// </div>
