import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDesigns } from "../api/designs";

const initialState = {
  value: { designs: [], categories: [{ name: "كل التصاميم", order: 0 }] },
};

export const set = createAsyncThunk("designs/set", async (_, thunk) => {
  const { fulfillWithValue, getState, dispatch } = thunk;
  const { designs: d } = getState().designs?.value;
  if (d.length == 0) {
    const { designs, categories } = await getDesigns();
    return fulfillWithValue({ designs, categories });
  }
  return fulfillWithValue(getState().designs?.value);
});

const designsSlice = createSlice({
  name: "designs",
  initialState,
  reducers: {
    love: (state, action) => {
      const id = action.payload;
      const index = state.value.designs?.findIndex((design) => design.id == id);
      state.value.designs[index].love += 1;
    },
    unlove: (state, action) => {
      const id = action.payload;
      const index = state.value.designs?.findIndex((design) => design.id == id);
      state.value.designs[index].love -= 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("designs/set/fulfilled", (state, action) => {
      state.value.designs = action.payload.designs;
      state.value.categories.push(...action.payload.categories);
      state.value.categories.sort((c1, c2) => c2.order - c1.order);

    });
  },
});

export const { love, unlove } = designsSlice.actions;
export default designsSlice.reducer;
