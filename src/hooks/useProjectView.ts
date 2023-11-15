import projectsActions from "@/store/projects/actions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { type IProject } from "@/types/IProject";
import statusesActions from "@/store/statuses/actions";
import tasksActions from "@/store/tasks/actions";
import { type ITask } from "@/types/ITask";
import { type ITaskStatus } from "@/types/ITaskStatus";
import { isOutDated, toastError } from "@/utils/functions";
import { useState } from "react";
import { useFetchAbortEffect } from "./useFetchAbortEffect";

interface UseProjectViewReturnType {
   deleteProject: (projectId: string) => Promise<void>;
   updateProject: (project: IProject) => Promise<void>;
}

export function useProjectView(projectId: string): UseProjectViewReturnType {
   const { lastFetchSingleProject, currentProject } = useAppSelector((state) => state.projects);
   const { lastFetchTasks } = useAppSelector((state) => state.tasks);
   const { lastFetchStatuses } = useAppSelector((state) => state.statuses);
   const dispatch = useAppDispatch();

   const [firstLoad, setFirstLoad] = useState(false);

   async function deleteProject(id: string): Promise<void> {
      unwrapResult(await dispatch(projectsActions.deleteProject(id)));
   }

   async function updateProject(project: IProject): Promise<void> {
      unwrapResult(await dispatch(projectsActions.updateProject(project)));
   }

   async function fetchProjectInfo(projectId: string, force: boolean = false, signal?: AbortSignal): Promise<void> {
      if (!projectId) return;
      let projectPromise: () => Promise<IProject | undefined>;
      let tasksPromise: () => Promise<ITask[] | undefined>;
      let statusesPromise: () => Promise<ITaskStatus[] | undefined>;

      if (force) {
         projectPromise = async () => unwrapResult(await dispatch(projectsActions.fetchSingleProject({ projectId, signal })));
         tasksPromise = async () => unwrapResult(await dispatch(tasksActions.fetchTasks({ projectId, signal })));
         statusesPromise = async () => unwrapResult(await dispatch(statusesActions.fetchTaskStatuses({ projectId, signal })));
      } else {
         projectPromise = async () => {
            if (isOutDated(lastFetchSingleProject)) {
               return unwrapResult(await dispatch(projectsActions.fetchSingleProject({ projectId, signal })));
            }
         };
         tasksPromise = async () => {
            if (isOutDated(lastFetchTasks)) {
               return unwrapResult(await dispatch(tasksActions.fetchTasks({ projectId, signal })));
            }
         };
         statusesPromise = async () => {
            if (isOutDated(lastFetchStatuses)) {
               return unwrapResult(await dispatch(statusesActions.fetchTaskStatuses({ projectId, signal })));
            }
         };
      }

      const promises = [projectPromise(), tasksPromise(), statusesPromise()];
      await Promise.all(promises);
   }

   const loadProjectInfo = async (id: string, signal?: AbortSignal, isFirstLoad: boolean = false): Promise<void> => {
      try {
         await fetchProjectInfo(id, id !== currentProject?.id, signal);
         if (isFirstLoad) setFirstLoad(true);
      } catch (error) {
         toastError(error);
      }
   };

   useFetchAbortEffect((signal) => {
      loadProjectInfo(projectId, signal, true);
   }, []);

   useFetchAbortEffect(
      (signal) => {
         if (!firstLoad || lastFetchTasks !== null) return;
         loadProjectInfo(projectId, signal);
      },
      [lastFetchTasks]
   );

   useFetchAbortEffect(
      (signal) => {
         if (!firstLoad || lastFetchSingleProject !== null) return;
         loadProjectInfo(projectId, signal);
      },
      [lastFetchSingleProject]
   );

   useFetchAbortEffect(
      (signal) => {
         if (!firstLoad || lastFetchStatuses !== null) return;
         loadProjectInfo(projectId, signal);
      },
      [lastFetchStatuses]
   );

   return { deleteProject, updateProject };
}
