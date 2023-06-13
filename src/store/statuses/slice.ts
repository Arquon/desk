import { type ITaskStatus } from "@/types/ITaskStatus";
import { isStatuesAsyncThunkError } from "@/utils/asyncThunkErrorChecking";
import { createSlice } from "@reduxjs/toolkit";
import { createStatus, deleteStatus, fetchTaskStatuses, updateStatus } from "./actions";
import { type Nullable, type TimeStamp } from "@/types/default";

interface IStatusesState {
   statuses: ITaskStatus[];
   isLoadingStatuses: boolean;
   isErrorStatuses: boolean;
   lastFetchStatuses: Nullable<TimeStamp>;
}

const initialState: IStatusesState = {
   statuses: [],
   isLoadingStatuses: true,
   isErrorStatuses: false,
   lastFetchStatuses: null,
};

const statusesSlice = createSlice({
   name: "statuses",
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder
         // fetchTaskStatuses
         .addCase(fetchTaskStatuses.pending, (state) => {
            state.isLoadingStatuses = true;
         })
         .addCase(fetchTaskStatuses.fulfilled, (state, action) => {
            state.isLoadingStatuses = false;
            state.isErrorStatuses = false;
            state.statuses = action.payload;
            state.lastFetchStatuses = new Date().getTime();
         })
         .addCase(fetchTaskStatuses.rejected, (state) => {
            state.isErrorStatuses = true;
         })
         // createStatus
         .addCase(createStatus.pending, (state) => {
            state.isLoadingStatuses = true;
         })
         .addCase(createStatus.fulfilled, (state, action) => {
            state.isLoadingStatuses = false;
            state.statuses.push(action.payload);
         })
         // updateStatus
         .addCase(updateStatus.pending, (state) => {
            state.isLoadingStatuses = true;
         })
         .addCase(updateStatus.fulfilled, (state, action) => {
            state.isLoadingStatuses = false;
            state.statuses = state.statuses.map((status) => {
               if (action.payload.id === status.id) {
                  return action.payload;
               }
               return status;
            });
         })
         // deleteStatus
         .addCase(deleteStatus.pending, (state) => {
            state.isLoadingStatuses = true;
         })
         .addCase(deleteStatus.fulfilled, (state, action) => {
            state.isLoadingStatuses = false;
            state.statuses = state.statuses.filter((status) => status.id !== action.payload);
         })
         // matcher
         .addMatcher(isStatuesAsyncThunkError, (state) => {
            state.isLoadingStatuses = false;
            state.lastFetchStatuses = null;
         });
   },
});

const { actions, reducer: statusesReducer } = statusesSlice;

export { actions };
export default statusesReducer;
