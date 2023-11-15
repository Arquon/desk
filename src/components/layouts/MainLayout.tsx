import React, { type FC } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./app/Header";
import { Footer } from "./app/Footer";

interface MainLayoutProps {}

export const MainLayout: FC<MainLayoutProps> = ({}) => {
   return (
      <>
         <Header />
         <main>
            <Outlet />
         </main>
         <Footer />
      </>
   );
};
