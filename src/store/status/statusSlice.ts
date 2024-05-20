import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IStatusView } from "../../types/types";

// Define a type for the slice state
interface StatusView {
    statusView: IStatusView;
}

// Define the initial state using that type
const initialState: StatusView = {
    statusView: { statusView: false },
};

export const statusViewSlice = createSlice({
    name: "status",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setStatusView: (state, action: PayloadAction<IStatusView>) => {
            state.statusView = action.payload;
        },
    },
});

export const { setStatusView } = statusViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.statusView;

export default statusViewSlice.reducer;
