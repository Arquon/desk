// eslint-disable-next-line @typescript-eslint/no-unused-vars

import React, { type FC } from "react";
import { generatePath } from "react-router-dom";
import { ETasksBasicRoutePaths, EStatusesBasicRoutePaths, EHistoryBasicRoutePaths } from "@/router/router";
import { ProjectTabItem } from "./ProjectTabItem";

interface ProjectTabsProps {
   projectId: string;
}

export const ProjectTabs: FC<ProjectTabsProps> = ({ projectId }) => {
   // const notesPath = generatePath(EBasicNotesRoutePaths.projectNotes, {
   //    projectId: projectId ?? null,
   // });
   const tasksPath = generatePath(ETasksBasicRoutePaths.projectTasks, {
      projectId,
   });
   const statusesPath = generatePath(EStatusesBasicRoutePaths.projectStatuses, {
      projectId,
   });
   const historyPath = generatePath(EHistoryBasicRoutePaths.projectHistory, {
      projectId,
   });
   return (
      <div className="d-flex justify-content-center mb-5">
         {/* <ProjectTab to={notesPath}>Заметки</ProjectTab> */}
         <ProjectTabItem to={tasksPath}>Задачи</ProjectTabItem>
         <ProjectTabItem to={statusesPath}>Статусы</ProjectTabItem>
         <ProjectTabItem to={historyPath}>История</ProjectTabItem>
      </div>
   );
};
