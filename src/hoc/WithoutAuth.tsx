import { useAppSelector } from "@/store/store";
import React, { type PropsWithChildren, type FC } from "react";
import { Navigate } from "react-router-dom";

interface AuthRequireProps {
   to?: string | Location;
}

export const WithoutAuth: FC<PropsWithChildren<AuthRequireProps>> = ({ children, to = "/" }) => {
   const { user } = useAppSelector((state) => state.user);
   console.log({ user });
   if (user) return <Navigate to={to} replace />;
   console.log("render children");
   return <>{children}</>;
};
