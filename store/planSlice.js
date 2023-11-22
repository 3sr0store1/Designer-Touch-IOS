import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPlans } from "../api/plans";

const initialState = {
  value: {
    useId: "",
    planId: "",
    name: "",
    haveTime: 0,
    consumed: 0,
    end: `${new Date()}`,
    start: `${new Date()}`,
  },
  plans: [],
};
export const setPlan = createAsyncThunk("plan/setPlan", async (user, thunk) => {
  const { fulfillWithValue } = thunk;
  const plans = await getPlans();
  if (user.id == "passed") return fulfillWithValue({ plans, value: {} });

  const plan = plans.find((plan) => plan.id === user.planId);
  const state = { value: {}, plans: plans };

  state.value.useId = user.id;
  state.value.planId = user.planId;
  state.value.name = plan.name;
  state.value.haveTime = plan.time - user.consumed;
  state.value.consumed = user.consumed;
  const start = new Date(user.planStart);
  state.value.start = `${start}`;
  state.value.end = `${start.setMonth(start.getMonth() + 1)}`;
  return fulfillWithValue(state);
});
const planSlice = createSlice({
  name: "plan",
  initialState,
  extraReducers: (builder) => {
    builder.addCase("plan/setPlan/fulfilled", (state, action) => {
      state = action.payload;
      return state;
    });
  },
});
export default planSlice.reducer;
