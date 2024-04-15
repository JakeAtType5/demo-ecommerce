import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";

import { CountrySelector } from "~/components/global/CountrySelector";
import Navigation from "~/components/global/Navigation";
import { Link } from "~/components/Link";
import type { SanityMenuLink } from "~/lib/sanity";

import { Label } from "./Label";
import { CartStateContext } from "./CartStateWrapper";

type Props = {
  open: boolean;
  menuLinks: SanityMenuLink[];
  onClose: () => void;
  onOpen: () => void;
};

export default function MobileNavigation({
  onOpen,
  onClose,
  open,
  menuLinks,
}: Props) {
  const { cartIsOpen, closeDrawer } = useContext(CartStateContext);

  const toggleNavigation = () => {
    if (cartIsOpen) {
      // first close cart drawer
      closeDrawer();
      // then open navigation
      onOpen();
    } else {
      // no cart to consider, so we just toggle
      if (open) {
        onClose();
      } else {
        onOpen();
      }
    }
  };

  return (
    <>
      <button className="mobile-only burger-icon" onClick={toggleNavigation}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      <Transition show={open}>
        {/* <Dialog onClose={handleClose}> */}
        {/* Panel */}
        {/* <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in-out duration-500"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        > */}
        <div className="fullscreen-navigation">
          {/* Header */}
          <header className="header">
            <button type="button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </header>

          {/* Links */}
          <Navigation menuLinks={menuLinks} className="navigation-links" />
          {/* 
              <div className="space-y-1">
                <Link
                  className={clsx(
                    "-ml-2 inline-flex h-[2.4rem] items-center rounded-sm bg-darkGray bg-opacity-0 px-3 py-2 text-sm font-bold duration-150",
                    "hover:bg-opacity-10"
                  )}
                  onClick={handleClose}
                  to="/account"
                >
                  <span className="mr-2">
                    <Label _key="global.account" />
                  </span>
                </Link>
                <div className="-ml-2">
                  <CountrySelector align="left" />
                </div>
              </div> */}
        </div>
        {/* </Transition.Child> */}
        {/* </Dialog> */}
      </Transition>
    </>
  );
}

export function useNavigation(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openNav() {
    setIsOpen(true);
    document.body.classList.add("--prevent-scrolling");
  }

  function closeNav() {
    setIsOpen(false);
    document.body.classList.remove("--prevent-scrolling");
  }

  return {
    navIsOpen: isOpen,
    openNav,
    closeNav,
  };
}
