import { type IUserData } from "@/types/auth/IUserData";
import { type Nullable } from "@/types/default";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCurrentUserData, login, register } from "./actions";
import { isUserAsyncThunkError } from "@/utils/asyncThunkErrorChecking";

interface IUserState {
   user: Nullable<IUserData>;
   isLoading: boolean;
}

const initialState: IUserState = {
   user: null,
   isLoading: true,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser: (state, action: PayloadAction<Nullable<IUserData>>) => {
         state.user = action.payload;
      },
   },
   extraReducers(builder) {
      builder
         .addCase(login.fulfilled, (state, action) => {
            state.user = action.payload;
         })
         .addCase(register.fulfilled, (state, action) => {
            state.user = action.payload;
         })
         .addCase(getCurrentUserData.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getCurrentUserData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
         })
         .addMatcher(isUserAsyncThunkError, (state) => {
            state.isLoading = false;
         });
   },
});

const { actions, reducer: userReducer } = userSlice;
export { actions };
export default userReducer;
