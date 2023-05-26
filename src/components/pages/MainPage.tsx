import { useAppSelector } from "@/store/store";
import React, { type FC } from "react";

interface MainPageProps {}

export const MainPage: FC<MainPageProps> = ({}) => {
   const { tasks } = useAppSelector((state) => state.tasks);

   return (
      <div>
         {tasks.map((task) => (
            <p>{task}</p>
         ))}
      </div>
   );
};
