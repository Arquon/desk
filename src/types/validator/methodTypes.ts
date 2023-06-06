interface SampleConfig {
   message: string;
}

interface RequiredConfig extends SampleConfig {}
export interface RequiredMethod {
   isRequired: RequiredConfig;
}

interface LatinaAndNumericConfig extends SampleConfig {}
export interface LatinaAndNumericMethod {
   latinaAndNumeric: LatinaAndNumericConfig;
}

interface MinLengthConfig extends SampleConfig {
   min: number;
}
export interface MinLengthMethod {
   minLength: MinLengthConfig;
}

interface MaxLengthConfig extends SampleConfig {
   max: number;
}
export interface MaxLengthMethod {
   maxLength: MaxLengthConfig;
}

interface IsCapitalSymbolConfig extends SampleConfig {}
export interface IsCapitalSymbolMethod {
   isCapitalSymbol: IsCapitalSymbolConfig;
}

interface IsDigitSymbolConfig extends SampleConfig {}
export interface IsDigitSymbolMethod {
   isDigitSymbol: IsDigitSymbolConfig;
}

interface EmailConfig extends SampleConfig {}
export interface EmailMethod {
   email: EmailConfig;
}

interface SameAsConfig<T> extends SampleConfig {
   key: keyof T;
}
export interface SameAsMethod<T> {
   sameAs: SameAsConfig<T>;
}

export interface IValidationMethods<T>
   extends RequiredMethod,
      LatinaAndNumericMethod,
      MinLengthMethod,
      MaxLengthMethod,
      IsCapitalSymbolMethod,
      IsDigitSymbolMethod,
      EmailMethod,
      SameAsMethod<T> {}
