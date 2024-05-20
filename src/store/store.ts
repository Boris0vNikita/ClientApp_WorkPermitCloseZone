import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import workPermitReducer from "./workPermit/workPermitSlice";
import statusReducer from "./status/statusSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        workPermit: workPermitReducer,
        statusView: statusReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
