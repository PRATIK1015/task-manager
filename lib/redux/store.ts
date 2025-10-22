import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slice/profileSlice";
import alertReducer from "./slice/alertSlice";
import projectReducer from  './slice/projectSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    alert: alertReducer,
    projectTasks:projectReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
