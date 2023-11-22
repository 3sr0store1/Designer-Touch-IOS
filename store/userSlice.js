import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser, loveDesign } from "../api/user";
import { Toast } from "toastify-react-native";
const initialState = { value: {} };

export const get = createAsyncThunk("user/get", async (token, thunk) => {
  const { fulfillWithValue, rejectWithValue, dispatch } = thunk;
  const { error, user } = await getUser({ token });
  if (error) {
    Toast.error(error);
    return rejectWithValue(error);
  } else return fulfillWithValue(user);
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    love: (state, action) => {
      const { love, userId, designId } = action.payload;
      if (love) state.value.loveIDs?.push(designId);
      else
        state.value.loveIDs = state.value.loveIDs.filter(
          (id) => id != designId
        );
      state.value.loveIDs = [...new Set(state.value.loveIDs)];
      loveDesign({ love, userId, designId });
    },
    setUser: (state, action) => {
      state.value = action.payload;
    },
    setDefaultUser: (state) => {
      const defaultUser = {
        id: "passed",
        email: "xxxxxxx@xxx.xxx",
        name: "xxxxxxx",
        password: "xxxxxxx",
        picture: "https://www.stern.nyu.edu/sites/default/files/assets/images/no%20profile%20icon_0.png",
        created: Date.now(),
        loveIDs:[],
        pushToken:'xxxxxxx',
        consumed:0
      };
      state.value = defaultUser;
    },
    deleteUser: (state) => {
      state.value = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase("user/get/fulfilled", (state, action) => {
      state.value = action.payload;
    });
  },
});

export const { love, setUser, deleteUser, setDefaultUser } = userSlice.actions;
export default userSlice.reducer;
