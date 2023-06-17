import React, { type FC } from "react";
import { TasksTable } from "../components/tasks/TasksTable";
import { CustomButtonLink } from "../components/ui/CustomButtonLink";
import { Outlet } from "react-router-dom";
import { useProject } from "@/providers/ProjectProvider";
import { ETaskViewPages } from "./TaskViewPage";

interface TasksPageProps {}

export const TasksPage: FC<TasksPageProps> = ({}) => {
   const { isError, isLoading } = useProject();

   return (
      <>
         {!(isLoading || isError) && (
            <>
               <div className="mb-3">
                  <TasksTable />
               </div>
               <CustomButtonLink className="fs-5" to={`new`}>
                  Создать задачу
               </CustomButtonLink>
            </>
         )}
         <Outlet context={{ currentPage: ETaskViewPages.tasks }} />
      </>
   );
};
