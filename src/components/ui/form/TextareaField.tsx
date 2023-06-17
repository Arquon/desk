import { type ICommonTextInputProps } from "@/types/ICommonInputProps";
import { getClassNameFromArray } from "@/utils/functions";
import React, { useRef, type FC, type ChangeEvent, type ComponentProps } from "react";

interface TextAreaFieldOwnProps extends ICommonTextInputProps {}

type TextAreaFieldProps = TextAreaFieldOwnProps & Omit<ComponentProps<"textarea">, keyof TextAreaFieldOwnProps>;

export const TextareaField: FC<TextAreaFieldProps> = ({ value, label, error, onChange, ...otherProps }) => {
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const onClickLabelHandler = (): void => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
   };

   const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>): void => {
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
            <textarea
               className={getClassNameFromArray(inputClassName)}
               rows={3}
               onChange={onChangeHandler}
               value={value}
               ref={textareaRef}
               {...otherProps}
            ></textarea>
            {error && <div className="invalid-feedback">{error}</div>}
         </div>
      </div>
   );
};
