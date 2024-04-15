import { Dialog, Transition } from "@headlessui/react";
import { Await } from "@remix-run/react";
import type { Cart } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { Fragment, Suspense, useState } from "react";

import {
  CartActions,
  CartLineItems,
  CartSummary,
} from "~/components/cart/Cart";
import Button from "~/components/elements/Button";
import CloseIcon from "~/components/icons/Close";
import { SanityProductPreview } from "~/lib/sanity/types";

import { Label } from "../global/Label";

/**
 * A Drawer component that opens on user click.
 * @param open - Boolean state. If `true`, then the drawer opens.
 * @param onClose - Function should set the open state.
 * @param children - React children node.
 */

function CartDrawer({
  open,
  onClose,
  cart,
  sanityCartResults,
}: {
  open: boolean;
  onClose: () => void;
  cart: Cart;
  sanityCartResults: SanityProductPreview[];
}) {
  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <div className={open ? "cart-drawer --is-open" : "cart-drawer"}>
            <CartHeader numLines={data?.totalQuantity} onClose={onClose} />
            {data?.totalQuantity > 0 ? (
              <>
                <CartLineItems
                  linesObj={data.lines}
                  sanityCartResults={sanityCartResults}
                />
                <CartFooter cart={data} />
              </>
            ) : (
              <CartEmpty onClose={onClose} />
            )}
          </div>
        )}
      </Await>
    </Suspense>
  );
}

/* Use for associating arialabelledby with the title*/
CartDrawer.Title = Dialog.Title;

export { CartDrawer };

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
    document.body.classList.add("--prevent-scrolling");
  }

  function closeDrawer() {
    setIsOpen(false);
    document.body.classList.remove("--prevent-scrolling");
  }

  return {
    cartIsOpen: isOpen,
    openDrawer,
    closeDrawer,
  };
}

function CartHeader({
  numLines,
  onClose,
}: {
  numLines: number;
  onClose: () => void;
}) {
  return (
    <header className="cart-header">
      <div className="semi-bold-20">
        {/* <Label _key="cart.title" /> {numLines > 0 && `(${numLines})`} */}
        Your order
      </div>
      <button type="button" onClick={onClose}>
        <CloseIcon />
      </button>
    </header>
  );
}

function CartFooter({ cart }: { cart: Cart }) {
  return (
    <div className="cart-footer">
      <CartSummary cost={cart.cost} />
      <CartActions cart={cart} />
    </div>
  );
}

function CartEmpty({ onClose }: { onClose: () => void }) {
  return (
    <div className="cart-empty-state">
      <p className="semi-bold-14">
        You have not added anything to your order yet.
      </p>

      <button className="button--large semi-bold-16" onClick={onClose}>
        Continue browsing
      </button>
    </div>
  );
}
/* <Label _key="cart.empty" /> */
