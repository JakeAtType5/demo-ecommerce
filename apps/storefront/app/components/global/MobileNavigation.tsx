import {
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";

import { CountrySelector } from "~/components/global/CountrySelector";
import Navigation from "~/components/global/Navigation";
import { Link } from "~/components/Link";
import type { SanityMenuLink } from "~/lib/sanity";

import CloseIcon from "../icons/Close";
import { CartStateContext } from "./CartStateWrapper";
import { Label } from "./Label";

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
        <div className="mobile-navigation">
          <header className="header">
            <button type="button" onClick={onClose}>
              <CloseIcon />
            </button>
          </header>

          <Navigation menuLinks={menuLinks} className="navigation-links" />

          <div className="social-links">
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faTiktok} />
            <FontAwesomeIcon icon={faYoutube} />
          </div>
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
