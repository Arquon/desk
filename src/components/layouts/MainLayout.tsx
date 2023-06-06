import React, { type FC } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./app/Header";
import { PortalPage } from "../portal/PortalPage";
import { Footer } from "./app/Footer";

interface MainLayoutProps {
   isModal?: boolean;
}

export const MainLayout: FC<MainLayoutProps> = ({ isModal = false }) => {
   return (
      <>
         <Header />
         <main>
            {isModal ? (
               <PortalPage>
                  <Outlet />
               </PortalPage>
            ) : (
               <Outlet />
            )}
         </main>
         <Footer />
      </>
   );
};
