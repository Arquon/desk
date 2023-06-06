import { useAppSelector } from "@/store/store";
import React, { type PropsWithChildren, type FC } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthRequireProps {
   to?: string | Location;
}

export const AuthRequire: FC<PropsWithChildren<AuthRequireProps>> = ({ children, to = "/login" }) => {
   const { user } = useAppSelector((state) => state.user);
   const location = useLocation();
   if (!user) return <Navigate to={to} state={{ from: location }} />;
   return <>{children}</>;
};
