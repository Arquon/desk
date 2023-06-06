import { createSlice } from "@reduxjs/toolkit";
import { type ITask } from "@/types/ITask";
import { createTask, deleteTask, fetchTasks, updateTask } from "./actions";
import { isTasksAsyncThunkError } from "@/utils/asyncThunkErrorChecking";
import { type Nullable, type TimeStamp } from "@/types/default";

interface TasksState {
   tasks: ITask[];
   isLoadingTasks: boolean;
   lastFetchTasks: Nullable<TimeStamp>;
}

const initialState: TasksState = {
   tasks: [],
   isLoadingTasks: true,
   lastFetchTasks: null,
};

const tasksSlice = createSlice({
   name: "tasks",
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder
         .addCase(fetchTasks.pending, (state) => {
            state.isLoadingTasks = true;
         })
         .addCase(fetchTasks.fulfilled, (state, action) => {
            state.isLoadingTasks = false;
            state.tasks = action.payload;
            state.lastFetchTasks = new Date().getTime();
         })
         .addCase(createTask.pending, (state) => {
            state.isLoadingTasks = true;
         })
         .addCase(createTask.fulfilled, (state, action) => {
            state.isLoadingTasks = false;
            state.tasks.push(action.payload);
         })
         .addCase(updateTask.pending, (state) => {
            state.isLoadingTasks = true;
         })
         .addCase(updateTask.fulfilled, (state, action) => {
            state.isLoadingTasks = false;
            state.tasks = state.tasks.map((task) => {
               if (action.payload.id === task.id) {
                  return action.payload;
               }
               return task;
            });
         })
         .addCase(deleteTask.pending, (state) => {
            state.isLoadingTasks = true;
         })
         .addCase(deleteTask.fulfilled, (state, action) => {
            state.isLoadingTasks = false;
            state.tasks.filter((task) => task.id !== action.payload);
         })

         .addMatcher(isTasksAsyncThunkError, (state) => {
            state.isLoadingTasks = false;
         });
   },
});

const { actions, reducer: tasksReducer } = tasksSlice;

export { actions };
export default tasksReducer;
