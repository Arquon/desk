import { type ICommonInputProps } from "@/types/ICommonInputProps";
import { type Nullable, type TimeStamp } from "@/types/default";
import React, { type SyntheticEvent, type FC, useRef } from "react";
import DatePicker, { type ReactDatePicker } from "react-datepicker";

interface DateFieldProps extends ICommonInputProps {
   value: Nullable<TimeStamp>;
   onChange: (value: Nullable<TimeStamp>) => void;
   maxDate?: Nullable<TimeStamp>;
   minDate?: Nullable<TimeStamp>;
}

export const DateField: FC<DateFieldProps> = ({ value, label, maxDate, minDate, onChange }) => {
   const dateRef = useRef<ReactDatePicker>(null);

   const onClickLabelHandler = (): void => {
      if (!dateRef.current) return;
      dateRef.current.setFocus();
   };

   const onChangeHandler = (date: Nullable<Date>, event: SyntheticEvent): void => {
      onChange(date ? date.getTime() : null);
   };

   const datePickerValue = value ? new Date(value) : null;
   const datePickerMaxDate = maxDate ? new Date(maxDate) : null;
   const datePickerMinDate = minDate ? new Date(minDate) : null;

   return (
      <div className="mb-3 me-3">
         <label className="form-label" onClick={onClickLabelHandler}>
            {label}
         </label>
         <DatePicker
            onChange={onChangeHandler}
            selected={datePickerValue}
            ref={dateRef}
            isClearable
            locale="ru"
            maxDate={datePickerMaxDate}
            minDate={datePickerMinDate}
            placeholderText="Выберите дату"
         />
      </div>
   );
};
