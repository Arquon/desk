import { getModalRouteBackground } from "@/router/router";
import React, { type FC, createContext, useContext, type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

type LocationBackgroundContextType = string | undefined;

const LocationBackgroundContext = createContext<LocationBackgroundContextType>(undefined);

export const LocationBackgroundProvider: FC<PropsWithChildren> = ({ children }) => {
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

export function useLocationBackground(): LocationBackgroundContextType {
   return useContext(LocationBackgroundContext);
}
