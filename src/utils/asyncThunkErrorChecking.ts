import { type AnyAction } from "@reduxjs/toolkit";

function isAsyncThunkError(sliceName: string, action: AnyAction): boolean {
   return action.type.startsWith(sliceName) && action.type.endsWith("rejected");
}

function isAsyncThunkErrorGenerator(sliceName: string) {
   return function (action: AnyAction): boolean {
      return isAsyncThunkError(sliceName, action);
   };
}

export const isUserAsyncThunkError = isAsyncThunkErrorGenerator("user");
export const isProjectsAsyncThunkError = isAsyncThunkErrorGenerator("projects");
export const isStatuesAsyncThunkError = isAsyncThunkErrorGenerator("statuses");
export const isTasksAsyncThunkError = isAsyncThunkErrorGenerator("tasks");
