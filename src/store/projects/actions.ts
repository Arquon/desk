import { createAsyncThunk } from "@reduxjs/toolkit";
import { type IProject, type TProjectWithoutId } from "@/types/IProject";
import { projectNetworkErrorsHandler } from "@/utils/networkErrorHandlers";
import { projectsService } from "@/services/projects.service";
import { localStorageService } from "@/services/localStorage.service";
import { getUserId } from "@/utils/functions";
import { statusesService } from "@/services/statuses.service";
import { tasksService } from "@/services/tasks.service";
import { type RootState } from "../store";

const fetchProjects = createAsyncThunk<IProject[], undefined, { rejectValue: string }>(
   "projects/fetchProjects",
   async function (_, { rejectWithValue }) {
      try {
         const { localId } = localStorageService.getCredentials();
         if (!localId) throw "Unauthorized";
         const data = await projectsService.fetchProjects(localId);
         return data;
      } catch (error) {
         const parsedError = projectNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const fetchSingleProject = createAsyncThunk<IProject, string, { rejectValue: string; state: RootState }>(
   "projects/fetchSingleProject",
   async function (projectId, { rejectWithValue, getState }) {
      try {
         const userId = getUserId(getState);
         const data = await projectsService.fetchSingleProject(userId, projectId);
         return data;
      } catch (error) {
         const parsedError = projectNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const createProject = createAsyncThunk<IProject, TProjectWithoutId, { rejectValue: string }>(
   "projects/createProject",
   async function (projectState, { rejectWithValue }) {
      try {
         const data = await projectsService.createProject({ ...projectState });
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
