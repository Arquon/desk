import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasks/slice";
import logger from "redux-logger";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
   reducer: {
      tasks: tasksReducer,
   },
   devTools: process.env.NODE_ENV !== "production",
   middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware();
      if (process.env.NODE_ENV !== "production") middleware.concat(logger);
      return middleware;
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
