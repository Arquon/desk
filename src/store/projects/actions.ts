import { createAsyncThunk } from "@reduxjs/toolkit";
import { type IProjectFormState, type IProject } from "@/types/IProject";
import { projectNetworkErrorsHandler } from "@/utils/networkErrorHandlers";
import { projectsService } from "@/services/projects.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { delay, getUserId } from "@/utils/functions";
import { statusesService } from "@/services/statuses.service";
import { tasksService } from "@/services/tasks.service";
import { type RootState } from "../store";

const fetchProjects = createAsyncThunk<IProject[], AbortSignal | undefined, { rejectValue: string; state: RootState }>(
   "projects/fetchProjects",
   async function (signal, { rejectWithValue, getState }) {
      try {
         const userId = getUserId(getState);
         const data = await projectsService.fetchProjects(userId, signal);
         return data;
      } catch (error) {
         const parsedError = projectNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const fetchSingleProject = createAsyncThunk<IProject, { projectId: string; signal?: AbortSignal }, { rejectValue: string; state: RootState }>(
   "projects/fetchSingleProject",
   async function ({ projectId, signal }, { rejectWithValue, getState }) {
      try {
         const userId = getUserId(getState);
         const data = await projectsService.fetchSingleProject(userId, projectId, signal);
         return data;
      } catch (error) {
         const parsedError = projectNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const createProject = createAsyncThunk<IProject, IProjectFormState, { rejectValue: string; state: RootState }>(
   "projects/createProject",
   async function (projectState, { rejectWithValue, getState }) {
      try {
         const userId = getUserId(getState);
         const data = await projectsService.createProject({ ...projectState, userId });
         await statusesService.createDefaultProjectStatuses(data.userId, data.id);
         return data;
      } catch (error) {
         const parsedError = projectNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const updateProject = createAsyncThunk<IProject, IProject, { rejectValue: string }>(
   "projects/updateProject",
   async function (project, { rejectWithValue }) {
      try {
         const data = await projectsService.updateProject(project);
         return data;
      } catch (error) {
         const parsedError = projectNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const deleteProject = createAsyncThunk<string, string, { rejectValue: string; state: RootState }>(
   "projects/deleteProject",
   async function (projectId, { rejectWithValue, getState }) {
      try {
         const userId = getUserId(getState);
         await projectsService.deleteProject(userId, projectId);
         await Promise.all([statusesService.deleteProjectStatuses(userId, projectId), tasksService.deleteProjectTasks(userId, projectId)]);
         return projectId;
      } catch (error) {
         const parsedError = projectNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const projectsActions = {
   fetchProjects,
   fetchSingleProject,
   createProject,
   updateProject,
   deleteProject,
};

export { fetchProjects, fetchSingleProject, createProject, updateProject, deleteProject };
export default projectsActions;
