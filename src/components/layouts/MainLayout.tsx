import React, { type FC } from "react";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {}

export const MainLayout: FC<MainLayoutProps> = (props: MainLayoutProps) => {
   return (
      <div>
         <header>HEADER</header>
         <main>
            <Outlet />
         </main>
         <footer>FOOTER</footer>
      </div>
   );
};
