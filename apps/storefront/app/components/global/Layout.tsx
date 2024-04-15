import { usePreviewContext } from "hydrogen-sanity";

import CartStateWrapper from "~/components/global/CartStateWrapper";
import Footer from "~/components/global/Footer";
import Header from "~/components/global/Header";
import Main from "~/components/global/Main";
import NavigationStateWrapper from "~/components/global/NavigationStateWrapper";
import { PreviewBanner } from "~/components/preview/PreviewBanner";

type LayoutProps = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export function Layout({ backgroundColor, children }: LayoutProps) {
  const isPreview = Boolean(usePreviewContext());
  //     {isPreview ? <PreviewBanner /> : <></>}

  return (
    <NavigationStateWrapper>
      <CartStateWrapper>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </CartStateWrapper>
    </NavigationStateWrapper>
  );
}
