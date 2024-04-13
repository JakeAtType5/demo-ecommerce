import clsx from "clsx";

import RadioInput from "./RadioInput";
import { ReactNode } from "react";

type Props = {
  onClick: () => void;
  options: [];
  stage: number;
  type: string;
  title: string;
  value: string;
  children?: ReactNode;
};

export default function RadioInputGroup({
  children,
  onClick,
  options,
  stage,
  type,
  title,
  value,
}: Props) {
  return (
    <>
      <p className="semi-bold-14">{title}</p>
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
        {children}
      </div>
    </>
  );
}
