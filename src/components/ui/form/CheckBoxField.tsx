import { type ICommonInputProps } from "@/types/ICommonInputProps";
import React, { type FC, type ChangeEvent, type ComponentProps } from "react";

interface CheckBoxFieldOwnProps extends ICommonInputProps {
   value: boolean;
   onChange: (value: boolean) => void;
}

type CheckBoxFieldProps = CheckBoxFieldOwnProps & Omit<ComponentProps<"input">, keyof CheckBoxFieldOwnProps>;

export const CheckBoxField: FC<CheckBoxFieldProps> = ({ value, label, error, onChange, ...otherProps }) => {
   const onClickLabelHandler = (): void => {
      if (otherProps.readOnly) return;
      onChange(!value);
   };

   const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
      if (otherProps.readOnly) return;
      onChange(!value);
   };

   return (
      <div className="form-check form-switch fs-4 mb-3">
         <input className="form-check-input" type="checkbox" checked={value} onChange={onChangeHandler} {...otherProps} />
         <label className="form-check-label" onClick={onClickLabelHandler}>
            {label}
         </label>
      </div>
   );
};
