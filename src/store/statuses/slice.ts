import { type ITaskStatus } from "@/types/ITaskStatuses";
import { isStatuesAsyncThunkError } from "@/utils/asyncThunkErrorChecking";
import { createSlice } from "@reduxjs/toolkit";
import { createStatus, deleteStatus, fetchTaskStatuses, updateStatus } from "./actions";
import { type Nullable, type TimeStamp } from "@/types/default";

interface IStatusesState {
   statuses: ITaskStatus[];
   isLoadingTaskStatuses: boolean;
   lastFetchStatuses: Nullable<TimeStamp>;
}

const initialState: IStatusesState = {
   statuses: [],
   isLoadingTaskStatuses: true,
   lastFetchStatuses: null,
};

const statusesSlice = createSlice({
   name: "statuses",
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder
         .addCase(fetchTaskStatuses.pending, (state) => {
            state.isLoadingTaskStatuses = true;
         })
         .addCase(fetchTaskStatuses.fulfilled, (state, action) => {
            state.isLoadingTaskStatuses = false;
            state.statuses = action.payload;
            state.lastFetchStatuses = new Date().getTime();
         })
         .addCase(createStatus.pending, (state) => {
            state.isLoadingTaskStatuses = true;
         })
         .addCase(createStatus.fulfilled, (state, action) => {
            state.isLoadingTaskStatuses = false;
            state.statuses.push(action.payload);
         })
         .addCase(updateStatus.pending, (state) => {
            state.isLoadingTaskStatuses = true;
         })
         .addCase(updateStatus.fulfilled, (state, action) => {
            state.isLoadingTaskStatuses = false;
            state.statuses = state.statuses.map((status) => {
               if (action.payload.id === status.id) {
                  return action.payload;
               }
               return status;
            });
         })
         .addCase(deleteStatus.pending, (state) => {
            state.isLoadingTaskStatuses = true;
         })
         .addCase(deleteStatus.fulfilled, (state, action) => {
            state.isLoadingTaskStatuses = false;
            state.statuses.filter((status) => status.id !== action.payload);
         })

         .addMatcher(isStatuesAsyncThunkError, (state) => {
            state.isLoadingTaskStatuses = false;
         });
   },
});

const { actions, reducer: statusesReducer } = statusesSlice;

export { actions };
export default statusesReducer;
