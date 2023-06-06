import React, { type FC, type PropsWithChildren } from "react";

interface HeadingProps extends PropsWithChildren {}

export const Heading: FC<HeadingProps> = ({ children }) => {
   return <h3>{children}</h3>;
};
