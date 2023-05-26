import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import routes from "@/router/router";

interface Props {}

export const App: React.FC<Props> = () => {
   return (
      <>
         <Routes>
            <Route path="/" element={<MainLayout />}>
               {routes.map(({ name, path, Element, index }) => (
                  <Route key={name} path={path} element={<Element />} index={index} />
               ))}
            </Route>
         </Routes>
      </>
   );
};
