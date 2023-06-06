import {
   type IValidationMethods,
   type RequiredMethod,
   type LatinaAndNumericMethod,
   type MinLengthMethod,
   type MaxLengthMethod,
   type IsCapitalSymbolMethod,
   type IsDigitSymbolMethod,
   type EmailMethod,
   type SameAsMethod,
} from "@/types/validator/methodTypes";

export function isRequiredMethod<T>(method: Partial<IValidationMethods<T>>): method is RequiredMethod {
   return "isRequired" in method;
}
export function isLatinaAndNumericMethod<T>(method: Partial<IValidationMethods<T>>): method is LatinaAndNumericMethod {
   return "latinaAndNumeric" in method;
}
export function isMinLengthMethod<T>(method: Partial<IValidationMethods<T>>): method is MinLengthMethod {
   return "minLength" in method;
}

export function isMaxLengthMethod<T>(method: Partial<IValidationMethods<T>>): method is MaxLengthMethod {
   return "maxLength" in method;
}
export function isCapitalSymbolMethod<T>(method: Partial<IValidationMethods<T>>): method is IsCapitalSymbolMethod {
   return "isCapitalSymbol" in method;
}
export function isDigitSymbolMethod<T>(method: Partial<IValidationMethods<T>>): method is IsDigitSymbolMethod {
   return "isDigitSymbol" in method;
}
export function isEmailMethod<T>(method: Partial<IValidationMethods<T>>): method is EmailMethod {
   return "email" in method;
}
export function isSameAsMethod<T>(method: Partial<IValidationMethods<T>>): method is SameAsMethod<T> {
   return "sameAs" in method;
}
