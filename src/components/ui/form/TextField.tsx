import { type ICommonTextInputProps } from "@/types/ICommonInputProps";
import { getClassNameFromArray } from "@/utils/functions";
import React, { useRef, type FC, type ChangeEvent, type ComponentProps } from "react";

interface TextFieldOwnProps extends ICommonTextInputProps {
   type?: "text" | "password";
}

type TextFieldProps = TextFieldOwnProps & Omit<ComponentProps<"input">, keyof TextFieldOwnProps>;

export const TextField: FC<TextFieldProps> = ({ value, type = "text", label, error, onChange, ...otherProps }) => {
   const inputRef = useRef<HTMLInputElement>(null);

   const onClickLabelHandler = (): void => {
      if (!inputRef.current) return;
      inputRef.current.focus();
   };

   const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
      onChange(event.target.value);
   };

   const inputClassName = ["form-control"];

   if (error) {
      inputClassName.push("is-invalid");
   }

   return (
      <div className="mb-3">
         <label className="form-label" onClick={onClickLabelHandler}>
            {label}
         </label>

         <div className="input-group">
            <input
               type={type}
               className={getClassNameFromArray(inputClassName)}
               onChange={onChangeHandler}
               value={value}
               ref={inputRef}
               {...otherProps}
            />

            {error && <div className="invalid-feedback">{error}</div>}
         </div>
      </div>
   );
};
