import { useLocationBackground } from "@/providers/LocationBackgroundProvider";
import React, { type PropsWithChildren, type FC } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

interface MainPortalProps {}

export const PortalPage: FC<PropsWithChildren<MainPortalProps>> = ({ children }) => {
   const navigate = useNavigate();
   const location = useLocation();
   const locationBackground = useLocationBackground();

   const backgroundClickHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
      if (event.target !== event.currentTarget) return;
      if (!locationBackground) {
         console.error("Default Location(Something went wrong)");
         navigate("/");
         return;
      }
      navigate(locationBackground, { state: { from: { location } } });
   };

   return (
      <>
         {createPortal(
            <div className="desk-modal" onClick={backgroundClickHandler}>
               {children}
            </div>,
            document.body
         )}
      </>
   );
};
