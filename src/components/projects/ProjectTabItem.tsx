import React, { type FC, type PropsWithChildren } from "react";
import { useMatch, Link } from "react-router-dom";
import { getClassNameFromArray } from "@/utils/functions";

interface ProjectTabItemProps {
   to: string;
}

export const ProjectTabItem: FC<PropsWithChildren<ProjectTabItemProps>> = ({ children, to }) => {
   const match = useMatch({ path: to });

   const arrayClassName = ["d-inline-block px-2 fs-5 text-decoration-none"];
   if (match) {
      arrayClassName.push("text-success");
   }

   return (
      <Link className={getClassNameFromArray(arrayClassName)} to={to}>
         {children}
      </Link>
   );
};
