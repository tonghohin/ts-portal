import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import adminReducer from "../features/adminSlice";
import userReducer from "../features/userSlice";
import userGymReducer from "../features/userGymSlice";
import gymReducer from "../features/gymSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    userGym: userGymReducer,
    gym: gymReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
