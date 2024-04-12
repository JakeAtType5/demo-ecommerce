import { usePreviewContext } from "hydrogen-sanity";
import { useContext, useEffect } from "react";

import CartStateWrapper from "~/components/global/CartStateWrapper";
import Footer from "~/components/global/Footer";
import Header from "~/components/global/Header";
import Main from "~/components/global/Main";
import ThemeStateWrapper from "~/components/global/ThemeStateWrapper";
import { ThemeStateContext } from "~/components/global/ThemeStateWrapper";
import { PreviewBanner } from "~/components/preview/PreviewBanner";

type LayoutProps = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export function Layout({ backgroundColor, children }: LayoutProps) {
  const isPreview = Boolean(usePreviewContext());
  //     {isPreview ? <PreviewBanner /> : <></>}

  return (
    <ThemeStateWrapper>
      <CartStateWrapper>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </CartStateWrapper>
    </ThemeStateWrapper>
  );
}
