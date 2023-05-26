import { MainPage } from "@/components/pages/MainPage";
import { type FC } from "react";

interface IRoute {
   path: string;
   name: string;
   Element: FC;
   index?: true;
}

const routes: IRoute[] = [
   {
      name: "main",
      Element: MainPage,
      path: "/",
      index: true,
   },
];

export default routes;
