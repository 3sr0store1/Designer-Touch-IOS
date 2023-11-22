import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = { value: [] };

export const init = createAsyncThunk("notifications/init", async (_, thunk) => {
  // await AsyncStorage.removeItem("notifications");
  const { fulfillWithValue } = thunk;
  const notificationsJSON = await AsyncStorage.getItem("notifications");
  if (notificationsJSON) {
    const { notifications } = JSON.parse(notificationsJSON);
    notifications.sort((a, b) => (a.time > b.time ? -1 : 1));
    return fulfillWithValue(notifications);
  } else {
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify({ notifications: [] })
    );
    return fulfillWithValue([]);
  }
});
export const add = createAsyncThunk("notifications/add", async (obj, thunk) => {
  const notification = {
    title: obj.request.content.title,
    body: obj.request.content.body,
    data: obj.request.content.data,
    isSee: false,
    time: new Date().toDateString(),
    date: new Intl.DateTimeFormat("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
      numberingSystem: "latn",
    }).format(new Date()),
  };
  const { fulfillWithValue } = thunk;
  const notificationsJSON = await AsyncStorage.getItem("notifications");
  if (notificationsJSON) {
    let { notifications } = JSON.parse(notificationsJSON);
    notifications?.push(notification);
    notifications.sort((a, b) => (a.time > b.time ? -1 : 1));
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify({ notifications })
    );
    return fulfillWithValue(notifications);
  } else {
    await setItem(
      "notifications",
      JSON.stringify({ notifications: [notification] })
    );
    return fulfillWithValue([notification]);
  }
});
export const see = createAsyncThunk(
  "notifications/see",
  async (index, thunk) => {
    const { fulfillWithValue } = thunk;
    const notificationsJSON = await AsyncStorage.getItem("notifications");
    const { notifications } = JSON.parse(notificationsJSON);
    notifications[index].isSee = true;
    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify({ notifications })
    );
    return fulfillWithValue(notifications);
  }
);
export const deleteNotify = createAsyncThunk(
  "notifications/deleteNotify",
  async ({ notifications, index }, thunk) => {
    const { fulfillWithValue } = thunk;
    notifications = [
      ...notifications.slice(0, index),
      ...notifications.slice(index + 1),
    ];
    AsyncStorage.setItem("notifications", JSON.stringify({ notifications }));
    return fulfillWithValue(notifications);
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase("notifications/add/fulfilled", (state, action) => {
        state.value = action.payload;
      })
      .addCase("notifications/init/fulfilled", (state, action) => {
        state.value = action.payload;
      })
      .addCase("notifications/see/fulfilled", (state, action) => {
        state.value = action.payload;
      })
      .addCase("notifications/deleteNotify/fulfilled", (state, action) => {
        state.value = action.payload;
      });
  },
});

export default notificationsSlice.reducer;
