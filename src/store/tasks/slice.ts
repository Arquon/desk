import { createSlice } from "@reduxjs/toolkit";
import { type ITask } from "@/types/ITask";
import { createTask, deleteTask, fetchTasks, updateTask } from "./actions";
import { type Nullable, type TimeStamp } from "@/types/default";
import { isTasksAsyncThunkError } from "@/utils/asyncThunkErrorChecking";

interface TasksState {
   tasks: ITask[];
   isLoadingTasks: boolean;
   lastFetchTasks: Nullable<TimeStamp>;
   isLoadingSingleTask: boolean;
}

const initialState: TasksState = {
   tasks: [],
   isLoadingTasks: true,
   lastFetchTasks: null,
   isLoadingSingleTask: false,
};

const tasksSlice = createSlice({
   name: "tasks",
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder
         // fetchTasks
         .addCase(fetchTasks.pending, (state) => {
            state.isLoadingTasks = true;
         })
         .addCase(fetchTasks.fulfilled, (state, action) => {
            state.isLoadingTasks = false;
            state.tasks = action.payload;
            state.lastFetchTasks = new Date().getTime();
         })
         .addCase(fetchTasks.rejected, (state) => {
            state.isLoadingTasks = false;
         })
         // createTask
         .addCase(createTask.pending, (state) => {
            state.isLoadingSingleTask = true;
         })
         .addCase(createTask.fulfilled, (state, action) => {
            state.isLoadingSingleTask = false;
            state.tasks.push(action.payload);
         })
         .addCase(createTask.rejected, (state) => {
            state.isLoadingSingleTask = false;
         })
         // updateTask
         .addCase(updateTask.pending, (state) => {
            state.isLoadingSingleTask = true;
         })
         .addCase(updateTask.fulfilled, (state, action) => {
            state.isLoadingSingleTask = false;
            state.tasks = state.tasks.map((task) => {
               if (action.payload.id === task.id) return action.payload;
               return task;
            });
         })
         .addCase(updateTask.rejected, (state) => {
            state.isLoadingSingleTask = false;
         })
         // deleteTask
         .addCase(deleteTask.pending, (state) => {
            state.isLoadingSingleTask = true;
         })
         .addCase(deleteTask.fulfilled, (state, action) => {
            state.isLoadingSingleTask = false;
            state.tasks.filter((task) => task.id !== action.payload);
         })
         .addCase(deleteTask.rejected, (state) => {
            state.isLoadingSingleTask = false;
         })
         // matcher
         .addMatcher(isTasksAsyncThunkError, (state) => {
            state.lastFetchTasks = null;
         });
   },
});

const { actions, reducer: tasksReducer } = tasksSlice;

export { actions };
export default tasksReducer;
