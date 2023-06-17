import React, { type FC, useRef, type ComponentProps, type ChangeEvent } from "react";

import { type ICommonTextInputProps } from "@/types/ICommonInputProps";
import { getClassNameFromArray } from "@/utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

interface StatusTextFieldOwnProps extends ICommonTextInputProps {
   showDeleteButton?: boolean;
   onDelete: () => void;
   onBlur: () => void;
}

type StatusTextFieldProps = StatusTextFieldOwnProps & Omit<ComponentProps<"input">, keyof StatusTextFieldOwnProps>;

export const StatusTextField: FC<StatusTextFieldProps> = ({
   value,
   type = "text",
   label,
   error,
   showDeleteButton,
   onChange,
   onDelete,
   onBlur,
   ...otherProps
}) => {
   const inputRef = useRef<HTMLInputElement>(null);

   const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
      onChange(event.target.value);
   };

   const inputClassName = ["form-control"];

   if (error) {
      inputClassName.push("is-invalid");
   }

   const onEditHandler = (): void => {
      if (!inputRef.current) return;
      inputRef.current.disabled = false;
      inputRef.current.focus();
   };

   const onBlurHandler = (): void => {
      if (!inputRef.current) return;
      inputRef.current.disabled = true;
      onBlur();
   };

   const onDeleteHandler = (): void => {
      onDelete();
   };

   return (
      <div className="input-group">
         <input
            type={type}
            className={getClassNameFromArray(inputClassName)}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={value}
            ref={inputRef}
            disabled={true}
            // style={{ cursor: "default" }}
            {...otherProps}
         />
         <span className="input-group-text" onClick={onEditHandler} style={{ cursor: "pointer" }}>
            <FontAwesomeIcon icon={faPencil} />
         </span>
         {showDeleteButton && (
            <span className="input-group-text" onClick={onDeleteHandler} style={{ cursor: "pointer" }}>
               <FontAwesomeIcon icon={faTrash} />
            </span>
         )}
         {error && <div className="invalid-feedback">{error}</div>}
      </div>
   );
};
