import clsx from "clsx";

type Props = {
  className?: string;
  onClick?: () => void;
  value: string;
};

export default function RadioInput({ className, onClick, value }: Props) {
  return (
    <div
      className={clsx(["radio-item semi-bold-16", className])}
      role="button"
      onClick={() => onClick()}
    >
      {value}
    </div>
  );
}
