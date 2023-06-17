import { createAsyncThunk } from "@reduxjs/toolkit";
import { type ITaskFormState, type ITask } from "@/types/ITask";
import { tasksNetworkErrorsHandler } from "@/utils/networkErrorHandlers";
import { tasksService } from "@/services/tasks.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { delay, getUserId } from "@/utils/functions";
import { type RootState } from "../store";

const fetchTasks = createAsyncThunk<ITask[], string, { rejectValue: string; state: RootState }>(
   "tasks/fetchTasks",
   async function (projectId, { rejectWithValue, getState }) {
      try {
         // await delay(1000);
         // const testError = "fetch tasks test error";
         // if (typeof testError === "string") throw testError;
         const userId = getUserId(getState);
         const data = await tasksService.fetchTasks(userId, projectId);
         return data;
      } catch (error) {
         const errorString: string = tasksNetworkErrorsHandler(error);
         return rejectWithValue(errorString);
      }
   }
);

const createTask = createAsyncThunk<ITask, { taskFormState: ITaskFormState; projectId: string }, { rejectValue: string; state: RootState }>(
   "tasks/createTask",
   async function ({ taskFormState, projectId }, { rejectWithValue, getState }) {
      try {
         // await delay(1000);
         // const testError = "testError";
         // if (typeof testError === "string") throw testError;
         const userId = getUserId(getState);
         const now = new Date().getTime();
         const data = await tasksService.createTask(userId, { ...taskFormState, projectId, createdAt: now, updatedAt: now, statusUpdatedAt: now });
         return data;
      } catch (error) {
         const parsedError = tasksNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const updateTask = createAsyncThunk<
   ITask,
   { updatedTaskFields: Partial<ITaskFormState>; currentTask: ITask },
   { rejectValue: string; state: RootState }
>("tasks/updateTask", async function ({ updatedTaskFields, currentTask }, { rejectWithValue, getState }) {
   try {
      const userId = getUserId(getState);
      const now = new Date().getTime();
      const updatedTask: ITask = { ...currentTask, ...updatedTaskFields, updatedAt: now };
      if (currentTask.statusId !== updatedTaskFields.statusId) {
         updatedTask.statusUpdatedAt = now;
      }
      const data = await tasksService.updateTask(userId, updatedTask);
      return data;
   } catch (error: unknown) {
      const errorString: string = tasksNetworkErrorsHandler(error);
      return rejectWithValue(errorString);
   }
});

const deleteTask = createAsyncThunk<string, { taskId: string; projectId: string }, { rejectValue: string; state: RootState }>(
   "tasks/deleteTask",
   async ({ taskId, projectId }, { rejectWithValue, getState }) => {
      try {
         // await delay(1000);
         // const testError = "delete task test error";
         // if (typeof testError === "string") throw testError;
         const userId = getUserId(getState);
         await tasksService.deleteTask(userId, projectId, taskId);
         return taskId;
      } catch (error) {
         const parsedError = tasksNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const tasksActions = {
   fetchTasks,
   createTask,
   updateTask,
   deleteTask,
};

export { fetchTasks, createTask, updateTask, deleteTask };

export default tasksActions;
