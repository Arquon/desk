import projectsActions from "@/store/projects/actions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { type IProject } from "@/types/IProject";
import statusesActions from "@/store/statuses/actions";
import tasksActions from "@/store/tasks/actions";
import { type ITask } from "@/types/ITask";
import { type ITaskStatus } from "@/types/ITaskStatus";
import { isOutDated, networkErrorHandlerToast } from "@/utils/functions";

interface UseProjectViewReturnType {
   fetchProjectInfo: (projectId: string, force?: boolean) => Promise<void>;
   deleteProject: (projectId: string) => Promise<void>;
   updateProject: (project: IProject) => Promise<void>;
}

export function useProjectView(): UseProjectViewReturnType {
   const { lastFetchSingleProject } = useAppSelector((state) => state.projects);
   const { lastFetchTasks } = useAppSelector((state) => state.tasks);
   const { lastFetchStatuses } = useAppSelector((state) => state.statuses);
   const dispatch = useAppDispatch();

   async function deleteProject(projectId: string): Promise<void> {
      unwrapResult(await dispatch(projectsActions.deleteProject(projectId)));
   }

   async function updateProject(project: IProject): Promise<void> {
      unwrapResult(await dispatch(projectsActions.updateProject(project)));
   }

   async function fetchProjectInfo(projectId: string, force: boolean = false): Promise<void> {
      try {
         if (!projectId) return;
         let projectPromise: () => Promise<IProject | undefined>;
         let tasksPromise: () => Promise<ITask[] | undefined>;
         let statusesPromise: () => Promise<ITaskStatus[] | undefined>;

         if (force) {
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
         networkErrorHandlerToast(error);
      }
   }

   return { deleteProject, updateProject, fetchProjectInfo };
}
