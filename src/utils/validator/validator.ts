import { isObjectWithLength, isString } from "@/utils/typeChecking";
import { emailRegex, isCapitalSymbolRegex, isDigitSymbolRegex, latinaAndNumericRegex } from "@/utils/regex";
import { type PartialRecord } from "@/types/default";
import {
   isRequiredMethod,
   isLatinaAndNumericMethod,
   isMinLengthMethod,
   isMaxLengthMethod,
   isCapitalSymbolMethod,
   isDigitSymbolMethod,
   isEmailMethod,
   isSameAsMethod,
} from "./methodChecking";
import { type IValidationMethods } from "@/types/validator/methodTypes";
import { type ValidationErrors } from "@/types/validator/errorTypes";

export type TValidator<T> = PartialRecord<keyof T, Partial<IValidationMethods<T>>>;

function validator<T>(data: T, validatorConfig: TValidator<T>): ValidationErrors<T> {
   const errors: ValidationErrors<T> = {};

   for (const key of Object.keys(validatorConfig) as Array<keyof T>) {
      const validationMethods = validatorConfig[key];
      if (validationMethods === undefined) continue;
      const error = validate(data[key], validationMethods, data);
      if (error !== null) {
         errors[key] = error;
      }
   }

   return errors;
}

function validate<T>(value: unknown, method: Partial<IValidationMethods<T>>, data: T): string | null {
   if (isRequiredMethod(method)) {
      const { isRequired } = method;
      if (value === "" || value === null || value === undefined) {
         return isRequired.message;
      }
   }
   if (isLatinaAndNumericMethod(method)) {
      const { latinaAndNumeric } = method;
      if (!isString(value)) {
         throw new Error("Ошибка типа");
      }
      if (!latinaAndNumericRegex.test(value)) {
         return latinaAndNumeric.message;
      }
   }
   if (isMinLengthMethod(method)) {
      const { minLength } = method;
      if (!isString(value) && !isObjectWithLength(value)) {
         throw new Error("Ошибка типа");
      }
      if (value.length < minLength.min) {
         return minLength.message;
      }
   }
   if (isMaxLengthMethod(method)) {
      const { maxLength } = method;
      if (!isString(value) && !isObjectWithLength(value)) {
         throw new Error("Ошибка типа");
      }
      if (value.length > maxLength.max) {
         return maxLength.message;
      }
   }
   if (isCapitalSymbolMethod(method)) {
      const { isCapitalSymbol } = method;
      if (!isString(value)) {
         throw new Error("Ошибка типа");
      }
      if (!isCapitalSymbolRegex.test(value)) {
         return isCapitalSymbol.message;
      }
   }
   if (isDigitSymbolMethod(method)) {
      const { isDigitSymbol } = method;
      if (!isString(value)) {
         throw new Error("Ошибка типа");
      }
      if (!isDigitSymbolRegex.test(value)) {
         return isDigitSymbol.message;
      }
   }
   if (isEmailMethod(method)) {
      const { email } = method;
      if (!isString(value)) {
         throw new Error("Ошибка типа");
      }
      if (!emailRegex.test(value)) {
         return email.message;
      }
   }
   if (isSameAsMethod(method)) {
      const { sameAs } = method;
      if (!isString(value)) {
         throw new Error("Ошибка типа");
      }
      if (data[sameAs.key] !== value) {
         return sameAs.message;
      }
   }

   return null;
}

export default validator;
