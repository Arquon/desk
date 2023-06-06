import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/components/app/App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/store";
import { LocationBackgroundContextProvider } from "./context/LocationBackgroundContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@/assets/styles/main.scss";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);
root.render(
   <BrowserRouter>
      <Provider store={store}>
         <LocationBackgroundContextProvider>
            <App />
         </LocationBackgroundContextProvider>
      </Provider>
   </BrowserRouter>
);
