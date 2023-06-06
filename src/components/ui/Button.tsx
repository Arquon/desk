import React, { type ElementType, type ComponentProps } from "react";

interface ButtonOwnProps {
   as?: ElementType;
}

type ButtonProps<E extends ElementType> = ButtonOwnProps & Omit<ComponentProps<E>, keyof ButtonOwnProps>;

const defaultElement: ElementType = "button";

export const Button = <E extends ElementType = typeof defaultElement>({ children, as, ...otherProps }: ButtonProps<E>): JSX.Element => {
   const TagName = as ?? defaultElement;
   return (
      <TagName className="btn btn-primary w-100 mx-auto" type="submit" {...otherProps}>
         {children}
      </TagName>
   );
};
