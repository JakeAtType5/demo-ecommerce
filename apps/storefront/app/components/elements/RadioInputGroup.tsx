import clsx from "clsx";

import RadioInput from "./RadioInput";

type Props = {
  onClick: () => void;
  options: [];
  stage: number;
  type: string;
  title: string;
  value: string;
};

export default function RadioInputGroup({
  onClick,
  options,
  stage,
  type,
  title,
  value,
}: Props) {
  return (
    <>
      <p className="semi-bold-16">{title}</p>
      <div className="radio-group">
        {options.map((option: string) => {
          return (
            <RadioInput
              value={option}
              key={option}
              className={option === value ? "--is-selected" : ""}
              onClick={() =>
                onClick({
                  optionType: type,
                  value: option,
                  selectedStage: stage 
                })
              }
            />
          );
        })}
      </div>
    </>
  );
}
