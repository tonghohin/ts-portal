import { createSlice } from "@reduxjs/toolkit";

interface Timeslot {
  coor: { x: number; y: number };
  id: string;
  text: string;
}

const initialState: Timeslot = { coor: { x: 0, y: 0 }, id: "", text: "" };

const gymSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    rightClicked: (
      state,
      action: {
        payload: Timeslot;
        type: string;
      }
    ) => (state = action.payload)
  }
});

export const { rightClicked } = gymSlice.actions;
export default gymSlice.reducer;
