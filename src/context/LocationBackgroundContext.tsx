import { getModalRouteBackground } from "@/router/router";
import React, { type FC, createContext, useContext, type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

type TLocationBackgroundContext = string | undefined;

const LocationBackgroundContext = createContext<TLocationBackgroundContext>(undefined);

export const LocationBackgroundContextProvider: FC<PropsWithChildren> = ({ children }) => {
   const location = useLocation();

   let locationBackground: string | undefined = location.state?.background;

   if (location.state?.background) {
      locationBackground = location.state?.background;
      console.log("Location from state", locationBackground);
   } else {
      const modalRouteBackground = getModalRouteBackground(location.pathname);
      if (modalRouteBackground) {
         locationBackground = modalRouteBackground;
         console.log("Location from baseBackground", locationBackground);
      }
   }
   return <LocationBackgroundContext.Provider value={locationBackground}>{children}</LocationBackgroundContext.Provider>;
};

export function useLocationBackground(): TLocationBackgroundContext {
   return useContext(LocationBackgroundContext);
}
