import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import type { PortableTextMarkComponentProps } from "@portabletext/react";
import clsx from "clsx";

type Props = PortableTextMarkComponentProps & {
  value?: PortableTextMarkComponentProps["value"] & {
    newWindow?: boolean;
    url: string;
  };
};

const LinkExternalAnnotation = ({ children, value }: Props) => {
  if (!value?.url) {
    return <>{children}</>;
  }

  return (
    <a
      href={value?.url}
      rel="noopener"
      target={value?.newWindow ? "_blank" : "_self"}
    >
      <>
      {children}
        <FontAwesomeIcon icon={faLink} />
      </>
    </a>
  );
};

export default LinkExternalAnnotation;
