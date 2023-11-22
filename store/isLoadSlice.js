import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: false};


const isLoadSlice = createSlice({
  name: "isLoad",
  initialState,
  reducers: {
    setIsLoad(state, action) {
      state.value = action.payload;
    },
  }
});

export const { setIsLoad } = isLoadSlice.actions;
export default isLoadSlice.reducer;
