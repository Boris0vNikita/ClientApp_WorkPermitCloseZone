import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IWorkPermit, IWorkPermitAll } from "../../types/types";

// Define a type for the slice state
interface WorkPermitState {
    workPermit: IWorkPermitAll | null;
}

// Define the initial state using that type
const initialState: WorkPermitState = {
    workPermit: null,
};

export const workPermitSlice = createSlice({
    name: "permit",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setWorkPermit: (state, action: PayloadAction<IWorkPermitAll>) => {
            state.workPermit = action.payload;
        },
    },
});

export const { setWorkPermit } = workPermitSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.workPermit;

export default workPermitSlice.reducer;
