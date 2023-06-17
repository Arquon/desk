import React, { type FC } from "react";
import { ColumnTask } from "../tasks/TasksColumn";
import { useAppSelector } from "@/store/store";

interface HistoryTableProps {}

export const HistoryTable: FC<HistoryTableProps> = ({}) => {
   const { tasks } = useAppSelector((state) => state.tasks);

   const historyTasks = tasks.filter((task) => task.inHistory);

   return (
      <div className="project__wrap">
         <div className="project__table">
            <div className="project__heading">
               <p className="text-center">История</p>
            </div>
            <ColumnTask tasks={historyTasks} />
         </div>
      </div>
   );
};
