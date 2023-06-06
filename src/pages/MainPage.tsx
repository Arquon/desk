// import { useAppSelector } from "@/store/store";
import React, { type FC } from "react";

interface MainPageProps {}

export const MainPage: FC<MainPageProps> = ({}) => {
   // const { tasks } = useAppSelector((state) => state.tasks);

   return (
      <section className="tasks">
         <div className="container">MainPage</div>
      </section>
   );
};
