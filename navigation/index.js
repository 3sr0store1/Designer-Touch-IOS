import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import LogInScreen from "../screens/log/LogIn";
import SignUpScreen from "../screens/sign/SignUp";
import WelcomeScreen from "../screens/welcome/Welcome";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Verify from "../screens/verify/Verify";
import Plans from "../screens/plans/Plans";
import { get } from "../store/userSlice";
import Tab from "./Tab";
import { initial } from "../store/signSlice";
import { setPlan } from "../store/planSlice";
import { setDefaultUser } from "../store/userSlice";
import { Text } from "react-native";
import Header from "../components/header/Header";

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
const Stack = createNativeStackNavigator();

function RootNavigator() {
  const sign = useSelector((state) => state.sign.value);
  const user = useSelector((state) => state.user.value);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initial());
    if (sign?.length > 1) {
      if (sign == "verify") navigation.navigate("Verify");
      else if (sign != "passed") dispatch(get(sign));
      else {
        dispatch(setDefaultUser());
        navigation.navigate("App");
      }
    } else {
      navigation.navigate("Welcome");
    }
  }, [sign, navigation]);

  useEffect(() => {
    if (user?.id) {
      dispatch(setPlan(user));
    }
  }, [user]);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation: { goBack, canGoBack }, route: { name } }) => {
          return <Header name={name} goBack={goBack} canGoBack={canGoBack} />;
        },
      }}
      initialRouteName={"App"}
    >
      <Stack.Screen name="App" component={Tab} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="Plans" component={Plans} />
    </Stack.Navigator>
  );
}
