import { PortalModal } from "@/components/portal/PortalModal";
import React, { type FC, createContext, useContext, type PropsWithChildren } from "react";

interface ModalContextType {
   close?: () => void;
}

const initialContextData: ModalContextType = {};

const ModalContext = createContext<ModalContextType>(initialContextData);

interface ModalContextProviderProps extends PropsWithChildren {
   close?: () => void;
}

export const ModalProvider: FC<ModalContextProviderProps> = ({ children, close }) => {
   return (
      <ModalContext.Provider value={{ close }}>
         <PortalModal>{children}</PortalModal>
      </ModalContext.Provider>
   );
};

export function useModal(): ModalContextType {
   return useContext(ModalContext);
}
