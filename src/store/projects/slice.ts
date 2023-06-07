import { type IProject } from "@/types/IProject";
import { createSlice } from "@reduxjs/toolkit";
import { createProject, deleteProject, fetchProjects, fetchSingleProject, updateProject } from "./actions";
import { type Nullable, type TimeStamp } from "@/types/default";
import { isProjectsAsyncThunkError } from "@/utils/asyncThunkErrorChecking";

interface IProjectsState {
   projects: IProject[];
   isLoadingProjects: boolean;
   lastFetchProjects: Nullable<TimeStamp>;
   currentProject: Nullable<IProject>;
   isLoadingSingleProject: boolean;
   isLoadingEditSingleProject: boolean;
   lastFetchSingleProject: Nullable<TimeStamp>;
}

const initialState: IProjectsState = {
   projects: [],
   isLoadingProjects: true,
   lastFetchProjects: null,
   currentProject: null,
   isLoadingSingleProject: true,
   isLoadingEditSingleProject: true,
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
         })
         .addCase(fetchProjects.rejected, (state) => {
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
         })
         .addCase(fetchSingleProject.rejected, (state) => {
            state.isLoadingProjects = false;
         })
         // createProject
         .addCase(createProject.pending, (state) => {
            state.isLoadingSingleProject = true;
         })
         .addCase(createProject.fulfilled, (state, action) => {
            state.projects.push(action.payload);
            state.isLoadingSingleProject = false;
         })
         .addCase(createProject.rejected, (state) => {
            state.isLoadingSingleProject = false;
         })
         // updateProject
         .addCase(updateProject.pending, (state) => {
            state.isLoadingSingleProject = true;
         })
         .addCase(updateProject.fulfilled, (state, action) => {
            state.projects.map((project) => {
               if (project.id === action.payload.id) return action.payload;
               return project;
            });
            state.isLoadingSingleProject = false;
         })
         .addCase(updateProject.rejected, (state) => {
            state.isLoadingSingleProject = false;
         })
         // deleteProject
         .addCase(deleteProject.pending, (state) => {
            state.isLoadingSingleProject = true;
         })
         .addCase(deleteProject.fulfilled, (state, action) => {
            state.projects = state.projects.filter((project) => project.id !== action.payload);
            state.isLoadingSingleProject = false;
         })
         .addCase(deleteProject.rejected, (state) => {
            state.isLoadingSingleProject = false;
         })
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
