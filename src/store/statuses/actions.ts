import { localStorageService } from "@/services/localStorage.service";
import { statusesService } from "@/services/statuses.service";
import { type ITaskStatusFormState, type ITaskStatus } from "@/types/ITaskStatus";
import { getUserId } from "@/utils/functions";
import { tasksNetworkErrorsHandler } from "@/utils/networkErrorHandlers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type RootState } from "../store";

const fetchTaskStatuses = createAsyncThunk<ITaskStatus[], string, { rejectValue: string }>(
   "statuses/fetchTaskStatuses",
   async function (projectId, { rejectWithValue }) {
      try {
         const { localId } = localStorageService.getCredentials();
         if (!localId) throw "Unauthorized";
         const data = await statusesService.fetchProjectStatuses(localId, projectId);
         return data;
      } catch (error) {
         const errorString: string = tasksNetworkErrorsHandler(error);
         return rejectWithValue(errorString);
      }
   }
);

const createStatus = createAsyncThunk<
   ITaskStatus,
   { statusFormState: ITaskStatusFormState; projectId: string },
   { rejectValue: string; state: RootState }
>("statuses/createStatus", async function ({ statusFormState, projectId }, { rejectWithValue, getState }) {
   try {
      const userId = getUserId(getState);
      const data = await statusesService.createStatus(userId, { ...statusFormState, projectId });
      return data;
   } catch (error) {
      const parsedError = tasksNetworkErrorsHandler(error);
      return rejectWithValue(parsedError);
   }
});

const updateStatus = createAsyncThunk<ITaskStatus, ITaskStatus, { rejectValue: string; state: RootState }>(
   "statuses/updateStatus",
   async function (status, { rejectWithValue, getState }) {
      try {
         const userId = getUserId(getState);
         const data = await statusesService.updateStatus(userId, status);
         return data;
      } catch (error) {
         const parsedError = tasksNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);
const deleteStatus = createAsyncThunk<string, { statusId: string; projectId: string }, { rejectValue: string; state: RootState }>(
   "statuses/deleteStatus",
   async function ({ statusId, projectId }, { rejectWithValue, getState }) {
      try {
         const userId = getUserId(getState);
         await statusesService.deleteStatus(userId, projectId, statusId);
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
