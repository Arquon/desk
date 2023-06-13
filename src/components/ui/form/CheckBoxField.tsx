import { type ICommonInputProps } from "@/types/ICommonInputProps";
import React, { type FC, type ChangeEvent } from "react";

interface CheckBoxFieldProps extends ICommonInputProps {
   value: boolean;
   onChange: (value: boolean) => void;
}

export const CheckBoxField: FC<CheckBoxFieldProps> = ({ value, label, error, onChange }) => {
   const onClickLabelHandler = (): void => {
      onChange(!value);
   };

   const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
      onChange(!value);
   };

   return (
      <div className="form-check form-switch fs-4 mb-3">
         <input className="form-check-input" type="checkbox" checked={value} onChange={onChangeHandler} />
         <label className="form-check-label" onClick={onClickLabelHandler}>
            {label}
         </label>
      </div>
   );
};
