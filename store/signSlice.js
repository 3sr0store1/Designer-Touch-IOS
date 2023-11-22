import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser, createUser, verifyUser, byGoogle } from "../api/auth";
import { Toast } from "toastify-react-native";
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { deleteUser } from "./userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = { value: "", email: "" };

export const initial = createAsyncThunk(
  "sign/initial",
  async (_, { fulfillWithValue, getState }) => {
    const token = await getItemAsync("token");
    if (token) {
      return fulfillWithValue(`${token}`);
    } else {
      return fulfillWithValue(getState.sign.value);
    }
  }
);
export const logIn = createAsyncThunk(
  "sign/logIn",
  async ({ email, password }, thunk) => {
    const { fulfillWithValue, rejectWithValue, dispatch } = thunk;
    const { success, error, token } = await getUser({ email, password });
    if (success) {
      Toast.success(success);
      await setItemAsync("token", token);
      return fulfillWithValue(token);
    }
    if (error) {
      Toast.error(error);
      return rejectWithValue(error);
    }
  }
);
export const logOut = createAsyncThunk("sign/logOut", async (_, thunk) => {
  const { fulfillWithValue, dispatch } = thunk;
  await deleteItemAsync("token");
  await AsyncStorage.clear();
  dispatch(deleteUser());
  return fulfillWithValue({ value: "", email: "" });
});
export const signUp = createAsyncThunk(
  "sign/signUp",
  async ({ email, password }, thunk) => {
    const { fulfillWithValue, rejectWithValue } = thunk;
    const { success, error } = await createUser({ email, password });
    if (success) {
      Toast.success(success);
      return fulfillWithValue({ value: "verify", email });
    }
    if (error) {
      Toast.error(error);
      return rejectWithValue(error);
    }
  }
);
export const verify = createAsyncThunk("sign/verify", async (code, thunk) => {
  const { fulfillWithValue, rejectWithValue, getState } = thunk;
  const { email } = getState().sign;
  const { success, error, token } = await verifyUser({
    email,
    verificationCode: code,
  });
  if (success) {
    Toast.success(success);
    await setItemAsync("token", token);
    return fulfillWithValue(token);
  }
  if (error) {
    Toast.error(error);
    return rejectWithValue(error);
  }
});
export const passSign = createAsyncThunk("sign/passSign", async (_,{fulfillWithValue}) => {
  await setItemAsync("token", "passed");
  return fulfillWithValue("passed");
});
export const google = createAsyncThunk(
  "sign/google",
  async ({ email, password, name, picture }, thunk) => {
    const { fulfillWithValue, rejectWithValue, dispatch } = thunk;
    const { success, error, token } = await byGoogle({
      email,
      password,
      name,
      picture,
    });
    if (success) {
      Toast.success(success);
      await setItemAsync("token", token);
      return fulfillWithValue(token);
    }
    if (error) {
      Toast.error(error);
      return rejectWithValue(error);
    }
  }
);
const signSlice = createSlice({
  name: "sign",
  initialState,
  reducers: {
    setSign(state, action) {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("sign/initial/fulfilled", (state, action) => {
        state.value = action.payload;
      })
      .addCase("sign/logIn/fulfilled", (state, action) => {
        state.value = action.payload;
      })
      .addCase("sign/logOut/fulfilled", (state, action) => {
        state.value = action.payload.value;
        state.email = action.payload.email;
      })
      .addCase("sign/signUp/fulfilled", (state, action) => {
        state.value = action.payload.value;
        state.email = action.payload.email;
      })
      .addCase("sign/verify/fulfilled", (state, action) => {
        state.value = action.payload;
      })
      .addCase("sign/google/fulfilled", (state, action) => {
        state.value = action.payload;
      })
      .addCase("sign/passSign/fulfilled", (state, action) => {
        state.value = action.payload;
      });
  },
});

export const { setSign } = signSlice.actions;
export default signSlice.reducer;
