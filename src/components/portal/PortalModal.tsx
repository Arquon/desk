import React, { type FC, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

interface IPortalModalProps {
   onBackgroundClick: () => void;
}

export const PortalModal: FC<PropsWithChildren<IPortalModalProps>> = ({ children, onBackgroundClick }) => {
   const backgroundClickHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
      if (event.target !== event.currentTarget) return;
      onBackgroundClick();
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
