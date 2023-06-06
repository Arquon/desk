import { localStorageService } from "@/services/localStorage.service";
import { statusesService } from "@/services/statuses.service";
import { type ITaskStatusFormState, type ITaskStatus } from "@/types/ITaskStatuses";
import { getUserId } from "@/utils/functions";
import { tasksNetworkErrorsHandler } from "@/utils/networkErrorHandlers";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchTaskStatuses = createAsyncThunk<ITaskStatus[], string, { rejectValue: string }>(
   "statuses/fetchTaskStatuses",
   async function (projectId, { rejectWithValue }) {
      try {
         const { localId } = localStorageService.getCredentials();
         if (!localId) throw "Unauthorized";
         const data = await statusesService.fetchStatuses(localId, projectId);
         return data;
      } catch (error) {
         const errorString: string = tasksNetworkErrorsHandler(error);
         return rejectWithValue(errorString);
      }
   }
);

const createStatus = createAsyncThunk<ITaskStatus, { statusFormState: ITaskStatusFormState; projectId: string }, { rejectValue: string }>(
   "statuses/createStatus",
   async function ({ statusFormState, projectId }, { rejectWithValue }) {
      try {
         const userId = getUserId();
         const data = await statusesService.createStatus({ ...statusFormState, userId, projectId });
         return data;
      } catch (error) {
         const parsedError = tasksNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const updateStatus = createAsyncThunk<ITaskStatus, ITaskStatus, { rejectValue: string }>(
   "statuses/updateStatus",
   async function (status, { rejectWithValue }) {
      try {
         const data = await statusesService.updateStatus(status);
         return data;
      } catch (error) {
         const parsedError = tasksNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);
const deleteStatus = createAsyncThunk<string, string, { rejectValue: string }>(
   "statuses/deleteStatus",
   async function (statusId, { rejectWithValue }) {
      try {
         const userId = getUserId();
         await statusesService.deleteStatus(userId, statusId);
         return statusId;
      } catch (error) {
         const parsedError = tasksNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const statusesActions = {
   fetchTaskStatuses,
   createStatus,
   updateStatus,
   deleteStatus,
};

export { fetchTaskStatuses, createStatus, updateStatus, deleteStatus };
export default statusesActions;
