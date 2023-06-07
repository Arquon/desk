import { useAppSelector } from "@/store/store";
import React, { type FC } from "react";
import { useParams } from "react-router-dom";

type Params = Record<"id", string>;

interface SingleTaskPageProps {}

export const SingleTaskPage: FC<SingleTaskPageProps> = ({}) => {
   const { tasks, isLoadingTasks } = useAppSelector((state) => state.tasks);
   const { id } = useParams<Params>();

   const currentTask = tasks.find((task) => task.id === id);

   if (!currentTask || isLoadingTasks) {
      return <h2>Loading...</h2>;
   }

   return <div>SingleTaskPage {currentTask.title}</div>;
};
