import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ru from "date-fns/locale/ru";
import "@/sw/init";
import store from "@/store/store";
import { App } from "@/components/app/App";
import { LocationBackgroundProvider } from "./providers/LocationBackgroundProvider";

import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "@/assets/styles/main.scss";
import { registerLocale, setDefaultLocale } from "react-datepicker";

registerLocale("ru", ru);
setDefaultLocale("ru");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);
root.render(
   <BrowserRouter>
      <Provider store={store}>
         <LocationBackgroundProvider>
            <App />
         </LocationBackgroundProvider>
      </Provider>
   </BrowserRouter>
);
