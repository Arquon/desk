import { authService } from "@/services/auth.service";
import { localStorageService } from "@/services/localStorage.service";
import { type IAuthData } from "@/types/auth/IAuthData";
import { type IUserData } from "@/types/auth/IUserData";
import { type Nullable } from "@/types/default";
import { type ValidationErrors } from "@/types/validator/errorTypes";
import { signInNetworkErrorsHandler, signUpNetworkErrorsHandler, userNetworkErrorsHandler } from "@/utils/networkErrorHandlers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type AppActionType } from "../store";
import { actions } from "./slice";

const login = createAsyncThunk<IUserData, IAuthData, { rejectValue: string | ValidationErrors<IAuthData> }>(
   "user/login",
   async function (authData, { rejectWithValue }) {
      try {
         const data = await authService.signIn(authData);
         localStorageService.setCredentials(data);
         try {
            const userData = await authService.getUserData(data.localId);
            return userData;
         } catch (error) {
            const parsedError = userNetworkErrorsHandler(error);
            return rejectWithValue(parsedError);
         }
      } catch (error) {
         const parsedError = signInNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const register = createAsyncThunk<IUserData, IAuthData, { rejectValue: string | ValidationErrors<IAuthData> }>(
   "user/register",
   async function (registrationData, { rejectWithValue }) {
      try {
         const data = await authService.signUp(registrationData);
         localStorageService.setCredentials(data);
         const userData = await authService.createUser({ email: registrationData.email, id: data.localId }, data.localId);
         return userData;
      } catch (error) {
         const parsedError = signUpNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const getCurrentUserData = createAsyncThunk<Nullable<IUserData>, undefined, { rejectValue: string }>(
   "user/getCurrentUserData",
   async function (_, { rejectWithValue }) {
      try {
         const { localId } = localStorageService.getCredentials();
         if (!localId) return null;
         const data = await authService.getUserData(localId);
         return data;
      } catch (error) {
         const parsedError = userNetworkErrorsHandler(error);
         return rejectWithValue(parsedError);
      }
   }
);

const signOut = (): AppActionType => (dispatch, getState) => {
   localStorageService.removeCredentials();
   dispatch(actions.setUser(null));
};

const userActions = {
   login,
   register,
   getCurrentUserData,
   signOut,
};

export { login, register, getCurrentUserData };
export default userActions;
