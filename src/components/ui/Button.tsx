import React, { type ElementType, type ComponentProps } from "react";

interface ButtonOwnProps<E extends ElementType = ElementType> {
   as?: E;
}

type ButtonProps<E extends ElementType> = ButtonOwnProps<E> & Omit<ComponentProps<E>, keyof ButtonOwnProps>;
const defaultElement = "button";

export const Button = <E extends ElementType = typeof defaultElement>({ children, as, ...otherProps }: ButtonProps<E>): JSX.Element => {
   const TagName = as ?? defaultElement;

   return (
      <TagName className="btn w-100 mx-auto" {...otherProps}>
         {children}
      </TagName>
   );
};
