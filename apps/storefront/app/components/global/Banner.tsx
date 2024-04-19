type Props = {
  className: string;
  text: string;
};

/**
 * A banner component
 */
export default function Banner({ className, text }: Props) {
  return (
    <div className={`banner ${className}`}>
      <div className="content-wrapper semi-bold-14">{text}</div>
    </div>
  );
}
