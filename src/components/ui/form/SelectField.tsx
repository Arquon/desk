import { type ICommonInputProps } from "@/types/ICommonInputProps";
import React, { type ChangeEvent } from "react";

interface SelectCollection<T extends string | number> {
   name: string;
   value: T;
}

interface SelectFieldProps<T extends string | number> extends ICommonInputProps {
   value: T;
   onChange: (value: string) => void;
   collection: Array<SelectCollection<T>>;
}

export const SelectField = <T extends string | number>({ value, onChange, collection, label, error }: SelectFieldProps<T>): JSX.Element => {
   const onChangeHandler = (event: ChangeEvent<HTMLSelectElement>): void => {
      onChange(event.target.value);
   };

   return (
      <div className="mb-3">
         <label className="form-label">{label}</label>
         <select className="form-select" value={value} onChange={onChangeHandler}>
            {collection.map((item) => (
               <option value={item.value} key={item.value}>
                  {item.name}
               </option>
            ))}
         </select>
      </div>
   );
};
