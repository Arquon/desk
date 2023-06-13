import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/components/app/App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/store";
import { LocationBackgroundProvider } from "./providers/LocationBackgroundProvider";
import ru from "date-fns/locale/ru";

import "bootstrap/dist/css/bootstrap.min.css";
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
