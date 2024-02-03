import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  title: string;
  description: string;
  onClickBackButton?: () => void;
  onClickCheckoutButton?: () => void;
  ctaLabel?: string;
  backLabel?: string;
  secondaryCtaLabel?: string;
};

export default function CartNotification({
  ctaLabel,
  backLabel,
  secondaryCtaLabel,
  title,
  description,
  onClickBackButton,
  onClickCheckoutButton,
}: Props) {
  return (
    <div className="cart-notification">
      {backLabel && (
        <a
          className="semi-bold-16 back-button"
          onClick={() => onClickBackButton()}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
          {backLabel}
        </a>
      )}

      <p className="semi-bold-24">{title}</p>
      <p className="semi-bold-16">{description}</p>

      {ctaLabel && (
        <button className="semi-bold-20 button--small button--large button--checkout">
          {ctaLabel}
        </button>
      )}

      {secondaryCtaLabel && (
        <button className="semi-bold-16 button--large button--secondary">
          {secondaryCtaLabel}
        </button>
      )}
    </div>
  );
}
