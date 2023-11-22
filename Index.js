import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigation";
import ToastManager from "toastify-react-native";
import { Dimensions, I18nManager, Platform } from "react-native";
import { useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { getItemAsync } from "expo-secure-store";
import { pushToken } from "./api/user";
import { useSelector, useDispatch } from "react-redux";
import { init, add } from "./store/notificationsSlice";
import Loader from "./components/loader/Loader";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
export default function Index() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const isLoad = useSelector((state) => state.isLoad.value);

  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
  });

  useEffect(() => {
    dispatch(init());
    registerForPushNotificationsAsync().then(async ({ data }) => {
      const token = await getItemAsync("token");
      if (token && user?.pushToken != data && user?.id != "passed")
        await pushToken({ token, pushToken: data });
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        dispatch(add(notification));
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar />
      <ToastManager
        duration={5000}
        width={Dimensions.get("window").width - 40}
        hasBackdrop
        style={{zIndex:9999999}}
      />
      {isLoad && <Loader text={isLoad} />}
    </SafeAreaProvider>
  );
}
