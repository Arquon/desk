import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { defaultRoutes, modalRoutes } from "@/router/router";
import { PortalPage } from "../portal/PortalPage";
import { useLocationBackground } from "@/context/LocationBackgroundContext";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/store";
import userActions from "@/store/user/actions";

export const App: React.FC = () => {
   const locationBackground = useLocationBackground();
   const { isLoading: isLoadingUser } = useAppSelector((state) => state.user);
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
                     {defaultRoutes.map(({ name, Element, index, path }) => (
                        <Route key={name} path={path} element={<Element />} index={index} />
                     ))}
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
