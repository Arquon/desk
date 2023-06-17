import projectsActions from "@/store/projects/actions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { type IProject } from "@/types/IProject";
import statusesActions from "@/store/statuses/actions";
import tasksActions from "@/store/tasks/actions";
import { type ITask } from "@/types/ITask";
import { type ITaskStatus } from "@/types/ITaskStatus";
import { isOutDated, toastError } from "@/utils/functions";
import { useEffect, useState } from "react";

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

   async function fetchProjectInfo(id: string, force: boolean = false): Promise<void> {
      if (!id) return;
      let projectPromise: () => Promise<IProject | undefined>;
      let tasksPromise: () => Promise<ITask[] | undefined>;
      let statusesPromise: () => Promise<ITaskStatus[] | undefined>;

      if (force) {
         projectPromise = async () => unwrapResult(await dispatch(projectsActions.fetchSingleProject(id)));
         tasksPromise = async () => unwrapResult(await dispatch(tasksActions.fetchTasks(id)));
         statusesPromise = async () => unwrapResult(await dispatch(statusesActions.fetchTaskStatuses(id)));
      } else {
         projectPromise = async () => {
            if (isOutDated(lastFetchSingleProject)) {
               return unwrapResult(await dispatch(projectsActions.fetchSingleProject(id)));
            }
         };
         tasksPromise = async () => {
            if (isOutDated(lastFetchTasks)) {
               return unwrapResult(await dispatch(tasksActions.fetchTasks(id)));
            }
         };
         statusesPromise = async () => {
            if (isOutDated(lastFetchStatuses)) {
               return unwrapResult(await dispatch(statusesActions.fetchTaskStatuses(id)));
            }
         };
      }

      const promises = [projectPromise(), tasksPromise(), statusesPromise()];
      await Promise.all(promises);
   }

   const firstLoadProjectInfo = async (id: string): Promise<void> => {
      try {
         await fetchProjectInfo(id, id !== currentProject?.id);
         setFirstLoad(true);
      } catch (error) {
         toastError(error);
      }
   };

   const loadProjectInfo = async (projectId: string): Promise<void> => {
      try {
         await fetchProjectInfo(projectId, projectId !== currentProject?.id);
      } catch (error) {
         toastError(error);
      }
   };

   useEffect(() => {
      firstLoadProjectInfo(projectId);
   }, []);

   useEffect(() => {
      if (!firstLoad || lastFetchTasks !== null) return;
      loadProjectInfo(projectId);
   }, [lastFetchTasks]);

   useEffect(() => {
      if (!firstLoad || lastFetchSingleProject !== null) return;
      loadProjectInfo(projectId);
   }, [lastFetchSingleProject]);

   useEffect(() => {
      if (!firstLoad || lastFetchStatuses !== null) return;
      loadProjectInfo(projectId);
   }, [lastFetchStatuses]);

   return { deleteProject, updateProject };
}
