import { type ValidationErrors } from "@/types/validator/errorTypes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UseFormReturnType<T> {
   networkErrors: ValidationErrors<T>;
   networkErrorHandler: (error: unknown) => void;
}

export function useNetworkErrors<T>(data?: T): UseFormReturnType<T> {
   const [networkErrors, setNetworkErrors] = useState<ValidationErrors<T>>({});

   const networkErrorHandler = (error: unknown): void => {
      if (typeof error === "object" && error !== null) {
         const netWorkError: ValidationErrors<T> = error;
         setNetworkErrors((prevErrors) => ({
            ...prevErrors,
            ...netWorkError,
         }));
      } else if (typeof error === "string") {
         toast.error(error, { autoClose: 5000 });
      }
   };

   useEffect(() => {
      setNetworkErrors({});
   }, [data]);

   return { networkErrors, networkErrorHandler };
}
