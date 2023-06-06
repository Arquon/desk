import { createAsyncThunk } from "@reduxjs/toolkit";
import { type IProject, type TProjectWithoutId } from "@/types/IProject";
import { projectNetworkErrorsHandler } from "@/utils/networkErrorHandlers";
import { projectsService } from "@/services/project.service";
import { localStorageService } from "@/services/localStorage.service";
import { getUserId } from "@/utils/functions";

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

const fetchSingleProject = createAsyncThunk<IProject, string, { rejectValue: string }>(
   "projects/fetchSingleProject",
   async function (projectId, { rejectWithValue }) {
      try {
         const userId = getUserId();
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
         return data;
      } catch (error) {
         const parsedError = projectNetworkErrorsHandler(error);
         console.log({ parsedError });
         return rejectWithValue(parsedError);
      }
   }
);

const projectsActions = {
   fetchProjects,
   fetchSingleProject,
   createProject,
};

export { fetchProjects, fetchSingleProject, createProject };
export default projectsActions;
