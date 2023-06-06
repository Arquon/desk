import React, { type PropsWithChildren, type FC } from "react";
import { Link } from "react-router-dom";

interface CustomLinkProps {
   to: string;
}

export const CustomLink: FC<PropsWithChildren<CustomLinkProps>> = ({ to, children }) => {
   return (
      <Link className="" to={to}>
         {children}
      </Link>
   );
};
