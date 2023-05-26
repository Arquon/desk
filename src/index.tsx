import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/components/app/App";
import "@/assets/styles/main.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/store";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);
root.render(
   <BrowserRouter>
      <Provider store={store}>
         <App />
      </Provider>
   </BrowserRouter>
);
