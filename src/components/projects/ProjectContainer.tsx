import React, { type FC } from "react";
import { useAppSelector } from "@/store/store";
import { TasksTable } from "../tasks/TasksTable";
import { CustomButtonLink } from "../ui/CustomButtonLink";

interface TasksPageProps {}

export const TasksContent: FC<TasksPageProps> = ({}) => {
   const { currentProject } = useAppSelector((state) => state.projects);

   return (
      <>
         {currentProject && (
            <>
               <TasksTable />
               <CustomButtonLink to={`/${currentProject.id}/task/new`}>Создать задачу</CustomButtonLink>
            </>
         )}
      </>
   );
};
