import { createAsyncThunk } from "@reduxjs/toolkit";
import { type ITaskFormState, type ITask } from "@/types/ITask";
import { tasksNetworkErrorsHandler } from "@/utils/networkErrorHandlers";
import { tasksService } from "@/services/task.service";
import { getUserId } from "@/utils/functions";

const fetchTasks = createAsyncThunk<ITask[], string, { rejectValue: string }>("tasks/fetchTasks", async function (projectId, { rejectWithValue }) {
   try {
      const userId = getUserId();
      const data = await tasksService.fetchTasks(userId, projectId);
      return data;
   } catch (error) {
      const errorString: string = tasksNetworkErrorsHandler(error);
      return rejectWithValue(errorString);
   }
});

const createTask = createAsyncThunk<ITask, { taskFormState: ITaskFormState; projectId: string }, { rejectValue: string }>(
   "tasks/createTask",
   async function ({ taskFormState, projectId }, { rejectWithValue }) {
      try {
         const userId = getUserId();
         const now = new Date().getTime();
         const data = await tasksService.createTask({ ...taskFormState, userId, projectId, createdAt: now, updatedAt: now });
         return data;
      } catch (error) {
         const parsedError = tasksNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const updateTask = createAsyncThunk<ITask, ITask, { rejectValue: string }>("tasks/updateTask", async function (task, { rejectWithValue }) {
   try {
      const data = await tasksService.updateTask(task);
      return data;
   } catch (error: unknown) {
      const errorString: string = tasksNetworkErrorsHandler(error);
      return rejectWithValue(errorString);
   }
});

const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>("tasks/deleteTask", async (taskId, { rejectWithValue }) => {
   try {
      const userId = getUserId();
      await tasksService.deleteTask(userId, taskId);
      return taskId;
   } catch (error) {
      const parsedError = tasksNetworkErrorsHandler(error);
      return rejectWithValue(parsedError);
   }
});

const tasksActions = {
   fetchTasks,
   createTask,
   updateTask,
   deleteTask,
};

export { fetchTasks, createTask, updateTask, deleteTask };

export default tasksActions;
