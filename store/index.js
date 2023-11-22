import { configureStore } from "@reduxjs/toolkit";

import signReducer from "./signSlice";
import userReducer from "./userSlice";
import designsReducer from "./designsSlice";
import notificationsReducer from "./notificationsSlice";
import isLoadReducer from "./isLoadSlice";
import planReducer from "./planSlice";

const reducer = {
  sign: signReducer,
  user: userReducer,
  designs: designsReducer,
  notifications: notificationsReducer,
  isLoad: isLoadReducer,
  plan: planReducer,
};
const store = configureStore({ reducer });
export default store;
