import { useModal } from "@/providers/ModalProvider";
import React, { type MouseEvent, type FC, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export const PortalModal: FC<PropsWithChildren> = ({ children }) => {
   const { close } = useModal();

   const backgroundClickHandler = (event: MouseEvent<HTMLDivElement>): void => {
      if (event.target !== event.currentTarget || !close) return;
      close();
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
