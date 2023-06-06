import { useEffect, useState } from "react";
import validator, { type TValidator } from "@/utils/validator/validator";
import { type ValidationErrors } from "@/types/validator/errorTypes";

interface UseFormParams<T extends object> {
   initialData: T;
   validatorConfig: Partial<TValidator<T>>;
}

interface UseFormReturnType<T> {
   data: T;
   changeHandler: (partialData: Partial<T>) => void;
   errors: ValidationErrors<T>;
   validate: () => boolean;
}

export function useForm<T extends object>({ initialData, validatorConfig }: UseFormParams<T>): UseFormReturnType<T> {
   const [data, setData] = useState(initialData);
   const [errors, setErrors] = useState<ValidationErrors<T>>({});

   const changeHandler = (partialData: Partial<T>): void => {
      setData((prevData) => ({
         ...prevData,
         ...partialData,
      }));
   };

   const validate = (): boolean => {
      const errors = validator(data, validatorConfig);
      setErrors(errors);
      return Object.keys(errors).length !== 0;
   };

   useEffect(() => {
      validate();
   }, [data]);

   return { data, changeHandler, errors, validate };
}
