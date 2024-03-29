import { type IProject } from "@/types/IProject";
import { createSlice } from "@reduxjs/toolkit";
import { createProject, deleteProject, fetchProjects, fetchSingleProject, updateProject } from "./actions";
import { type Nullable, type TimeStamp } from "@/types/default";
import { isProjectsAsyncThunkError } from "@/utils/asyncThunkErrorChecking";

interface IProjectsState {
   projects: IProject[];
   isLoadingProjects: boolean;
   isErrorProjects: boolean;
   lastFetchProjects: Nullable<TimeStamp>;
   currentProject: Nullable<IProject>;
   isLoadingSingleProject: boolean;
   isErrorSingleProject: boolean;
   lastFetchSingleProject: Nullable<TimeStamp>;
}

const initialState: IProjectsState = {
   projects: [],
   isLoadingProjects: true,
   isErrorProjects: false,
   lastFetchProjects: null,
   currentProject: null,
   isLoadingSingleProject: true,
   isErrorSingleProject: false,
   lastFetchSingleProject: null,
};

const projectSlice = createSlice({
   name: "projects",
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder
         // fetchProjects
         .addCase(fetchProjects.pending, (state) => {
            state.isLoadingProjects = true;
         })
         .addCase(fetchProjects.fulfilled, (state, action) => {
            state.projects = action.payload;
            state.lastFetchProjects = new Date().getTime();
            state.isLoadingProjects = false;
            state.isErrorProjects = false;
         })
         .addCase(fetchProjects.rejected, (state) => {
            state.isErrorProjects = true;
            state.isLoadingProjects = false;
         })
         // fetchSingleProject
         .addCase(fetchSingleProject.pending, (state) => {
            state.isLoadingSingleProject = true;
         })
         .addCase(fetchSingleProject.fulfilled, (state, action) => {
            state.currentProject = action.payload;
            state.lastFetchSingleProject = new Date().getTime();
            state.isLoadingSingleProject = false;
            state.isErrorSingleProject = false;
         })
         .addCase(fetchSingleProject.rejected, (state) => {
            state.isLoadingSingleProject = false;
            state.isErrorSingleProject = true;
         })
         // createProject
         .addCase(createProject.pending, (state) => {})
         .addCase(createProject.fulfilled, (state, action) => {
            state.projects.push(action.payload);
         })
         .addCase(createProject.rejected, (state) => {})
         // updateProject
         .addCase(updateProject.pending, (state) => {})
         .addCase(updateProject.fulfilled, (state, action) => {
            state.projects.map((project) => {
               if (project.id === action.payload.id) return action.payload;
               return project;
            });
            if (state.currentProject?.id === action.payload.id) state.currentProject = action.payload;
         })
         .addCase(updateProject.rejected, (state) => {})
         // deleteProject
         .addCase(deleteProject.pending, (state) => {})
         .addCase(deleteProject.fulfilled, (state, action) => {
            state.projects = state.projects.filter((project) => project.id !== action.payload);
         })
         .addCase(deleteProject.rejected, (state) => {})
         // matcher
         .addMatcher(isProjectsAsyncThunkError, (state) => {
            state.lastFetchSingleProject = null;
            state.lastFetchProjects = null;
         });
   },
});

const { actions, reducer: projectReducer } = projectSlice;

export { actions };
export default projectReducer;
