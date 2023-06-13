import React, { type FC } from "react";
import { TasksTable } from "../components/tasks/TasksTable";
import { CustomButtonLink } from "../components/ui/CustomButtonLink";
import { Outlet } from "react-router-dom";
import { useProject } from "@/providers/ProjectProvider";

interface TasksPageProps {}

export const TasksPage: FC<TasksPageProps> = ({}) => {
   const { isError, isLoading } = useProject();

   return (
      <>
         {!isLoading && !isError && (
            <>
               <TasksTable />
               <CustomButtonLink to={`new`}>Создать задачу</CustomButtonLink>
            </>
         )}
         <Outlet />
      </>
   );
};
