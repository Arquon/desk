import React, { type PropsWithChildren, type FC } from "react";
import { Link } from "react-router-dom";

interface CustomButtonLinkProps {
   to: string;
}

export const CustomButtonLink: FC<PropsWithChildren<CustomButtonLinkProps>> = ({ to, children }) => {
   return (
      <Link className="" to={to}>
         {children}
      </Link>
   );
};
