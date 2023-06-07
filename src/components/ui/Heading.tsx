import { type PropsWithChildrenWithClassName } from "@/types/default";
import React, { type FC } from "react";

interface HeadingProps extends PropsWithChildrenWithClassName {}

export const Heading: FC<HeadingProps> = ({ children, className }) => {
   return <h3 className={className}>{children}</h3>;
};
