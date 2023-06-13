import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { defaultRoutes, modalRoutes, type TBasicRoute } from "@/router/router";
import { PortalPage } from "../portal/PortalPage";
import { useLocationBackground } from "@/providers/LocationBackgroundProvider";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/store";
import userActions from "@/store/user/actions";

function RenderRoutes(children: TBasicRoute[]): JSX.Element[] {
   return children.map(({ name, Element, index, path, children: nestedChildren }) => {
      if (nestedChildren) {
         return (
            <Route key={name} path={path} element={<Element />}>
               {RenderRoutes(nestedChildren)}
            </Route>
         );
      }
      return <Route key={name} path={path} element={<Element />} index={index} />;
   });
}

export const App: React.FC = () => {
   const locationBackground = useLocationBackground();
   const { isLoadingUser } = useAppSelector((state) => state.user);
   const dispatch = useAppDispatch();

   const fetchUserData = async (): Promise<void> => {
      await dispatch(userActions.getCurrentUserData());
   };

   useEffect(() => {
      fetchUserData();
   }, []);

   return (
      <div className="wrapper">
         {!isLoadingUser && (
            <>
               <Routes location={locationBackground}>
                  <Route path="/" element={<MainLayout />}>
                     {RenderRoutes(defaultRoutes)}
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
               </Routes>
               <Routes>
                  {modalRoutes.map(({ name, Element, index, path }) => (
                     <Route
                        key={name}
                        path={path}
                        element={
                           <PortalPage>
                              <Element />
                           </PortalPage>
                        }
                        index={index}
                     />
                  ))}
               </Routes>
            </>
         )}
         <ToastContainer />
      </div>
   );
};
