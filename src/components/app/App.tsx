import React from "react";
import { useRoutes } from "react-router-dom";
import { defaultRoutes, modalRoutes } from "@/router/router";
import { useLocationBackground } from "@/providers/LocationBackgroundProvider";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/store";
import userActions from "@/store/user/actions";
import { useFetchAbortEffect } from "@/hooks/useFetchAbortEffect";

export const App: React.FC = () => {
   const locationBackground = useLocationBackground();
   const { isLoadingUser } = useAppSelector((state) => state.user);
   const dispatch = useAppDispatch();

   const fetchUserData = async (signal: AbortSignal): Promise<void> => {
      await dispatch(userActions.getCurrentUserData(signal));
   };

   useFetchAbortEffect((signal) => {
      fetchUserData(signal);
   }, []);

   const appRoutes = useRoutes(defaultRoutes, locationBackground);
   const appModalRoutes = useRoutes(modalRoutes);

   return (
      <div className="wrapper">
         {!isLoadingUser && (
            <>
               {appRoutes}
               {appModalRoutes}
            </>
         )}
         <ToastContainer />
      </div>
   );
};
