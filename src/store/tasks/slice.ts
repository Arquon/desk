import { createSlice } from "@reduxjs/toolkit";

interface TasksState {
   tasks: number[];
}

const initialState: TasksState = {
   tasks: [1, 2, 3, 4, 5],
};

const tasksSlice = createSlice({
   name: "tasks",
   initialState,
   reducers: {},
});

const { actions, reducer: tasksReducer } = tasksSlice;

console.log({ actions }, process.env.NODE_ENV);

export default tasksReducer;
