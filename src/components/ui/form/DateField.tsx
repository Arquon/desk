import { type Nullable, type TimeStamp } from "@/types/default";
import React, { type ChangeEvent, type FC } from "react";

interface DateFieldProps {
   value: Nullable<TimeStamp>;
   minDate?: TimeStamp;
   onChange: () => void;
}

export const DateField: FC<DateFieldProps> = ({ value, onChange }) => {
   const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
      console.log(event.target.value);
   };

   return <input type="date" value={value ?? undefined} onChange={onChangeHandler} />;
};
