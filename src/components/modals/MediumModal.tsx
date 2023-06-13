import { useModal } from "@/providers/ModalProvider";
import React, { type PropsWithChildren, type FC, type MouseEvent } from "react";

interface MediumModalProps extends PropsWithChildren {
   hidden?: boolean;
}

export const MediumModal: FC<MediumModalProps> = ({ children, hidden = false }) => {
   const { close } = useModal();

   const closeHandler = (event: MouseEvent<HTMLDivElement>): void => {
      if ((event.currentTarget.contains(event.target as Node) && event.currentTarget !== event.target) || !close) return;
      close();
   };

   return (
      <div className="container-lg p-4" hidden={hidden} onClick={closeHandler}>
         <div className="bg-white rounded shadow p-4 col-md-8 offset-md-2">{children}</div>
      </div>
   );
};
