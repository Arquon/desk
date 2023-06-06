import { TasksTable } from "@/components/tasks/TasksTable";
import { CustomButtonLink } from "@/components/ui/CustomButtonLink";
import { AuthRequire } from "@/hoc/AuthRequire";
import { useNetworkErrors } from "@/hooks/useNetworkErrors";
import { type IRouteParams } from "@/router/router";
import projectsActions from "@/store/projects/actions";
import statusesActions from "@/store/statuses/actions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type IProject } from "@/types/IProject";
import { type ITask } from "@/types/ITask";
import { type ITaskStatus } from "@/types/ITaskStatuses";
import { isOutDated } from "@/utils/functions";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { type FC, useEffect } from "react";
import { useParams } from "react-router-dom";

interface TasksPageProps {}

const TasksPageComponent: FC<TasksPageProps> = ({}) => {
   const { isLoadingTasks, lastFetchTasks } = useAppSelector((state) => state.tasks);
   const { isLoadingTaskStatuses, lastFetchStatuses } = useAppSelector((state) => state.statuses);
   const { isLoadingSingleProject, currentProject, lastFetchSingleProject } = useAppSelector((state) => state.projects);
   const { projectId } = useParams<IRouteParams["projectTasks"]>();
   const dispatch = useAppDispatch();
   const { networkErrorHandler } = useNetworkErrors();

   const fetchProjectTasksAndStatuses = async (): Promise<void> => {
      try {
         if (!projectId) return;
         let projectPromise: () => Promise<IProject | undefined>;
         let tasksPromise: () => Promise<ITask[] | undefined>;
         let statusesPromise: () => Promise<ITaskStatus[] | undefined>;

         if (projectId !== currentProject?.id) {
            projectPromise = async () => unwrapResult(await dispatch(projectsActions.fetchSingleProject(projectId)));
            tasksPromise = async () => unwrapResult(await dispatch(tasksActions.fetchTasks(projectId)));
            statusesPromise = async () => unwrapResult(await dispatch(statusesActions.fetchTaskStatuses(projectId)));
         } else {
            projectPromise = async () => {
               if (isOutDated(lastFetchSingleProject)) {
                  return unwrapResult(await dispatch(projectsActions.fetchSingleProject(projectId)));
               }
            };
            tasksPromise = async () => {
               if (isOutDated(lastFetchTasks)) {
                  return unwrapResult(await dispatch(tasksActions.fetchTasks(projectId)));
               }
            };
            statusesPromise = async () => {
               if (isOutDated(lastFetchStatuses)) {
                  return unwrapResult(await dispatch(statusesActions.fetchTaskStatuses(projectId)));
               }
            };
         }

         const promises = [projectPromise(), tasksPromise(), statusesPromise()];
         await Promise.all(promises);
      } catch (error) {
         networkErrorHandler(error);
      }
   };

   useEffect(() => {
      fetchProjectTasksAndStatuses();
   }, []);

   const isLoading = isLoadingSingleProject || isLoadingTasks || isLoadingTaskStatuses;

   return (
      <section className="tasks">
         <div className="container">
            {isLoading || !currentProject ? (
               <h2>Loading...</h2>
            ) : (
               <>
                  <h2>{currentProject.name}</h2>
                  <TasksTable />
                  <CustomButtonLink to={`/${currentProject.id}/task/new`}>Создать задачу</CustomButtonLink>
               </>
            )}
         </div>
      </section>
   );
};

export const TasksPage: FC<TasksPageProps> = (props) => {
   return (
      <AuthRequire>
         <TasksPageComponent {...props} />
      </AuthRequire>
   );
};
