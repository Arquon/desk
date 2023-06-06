import { type IProject } from "@/types/IProject";
import { createSlice } from "@reduxjs/toolkit";
import { createProject, fetchProjects, fetchSingleProject } from "./actions";
import { type Nullable, type TimeStamp } from "@/types/default";

interface IProjectsState {
   projects: IProject[];
   isLoadingProjects: boolean;
   lastFetchProjects: Nullable<TimeStamp>;
   currentProject: Nullable<IProject>;
   isLoadingSingleProject: boolean;
   lastFetchSingleProject: Nullable<TimeStamp>;
}

const initialState: IProjectsState = {
   projects: [],
   isLoadingProjects: true,
   lastFetchProjects: null,
   currentProject: null,
   isLoadingSingleProject: true,
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
         .addCase(fetchSingleProject.pending, (state, action) => {
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
            state.isLoadingProjects = true;
         })
         .addCase(createProject.fulfilled, (state, action) => {
            state.projects.push(action.payload);
            state.isLoadingProjects = false;
         });
   },
});

const { actions, reducer: projectReducer } = projectSlice;

export { actions };
export default projectReducer;
