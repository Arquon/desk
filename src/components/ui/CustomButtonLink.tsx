import { type PropsWithChildrenWithClassName } from "@/types/default";
import { getClassNameFromArray } from "@/utils/functions";
import React, { type FC } from "react";
import { Link } from "react-router-dom";

interface CustomButtonLinkProps {
   to: string;
}

export const CustomButtonLink: FC<PropsWithChildrenWithClassName<CustomButtonLinkProps>> = ({ to, children, className }) => {
   const initialClasses = [""];

   if (className) initialClasses.push(className);

   return (
      <Link to={to} className={getClassNameFromArray(initialClasses)}>
         {children}
      </Link>
   );
};
