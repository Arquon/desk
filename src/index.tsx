import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/components/app/App";
import "@/assets/styles/main.scss";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
