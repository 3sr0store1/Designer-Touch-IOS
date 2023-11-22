import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import Home from "../screens/home/Home";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Loves from "../screens/loves/Loves";
import Notifications from "../screens/notifications/Notifications";
import Design from "../screens/design/Design";
import { useSelector } from "react-redux";
import Settings from "../screens/settings/Settings";
import Header from "../components/header/Header";

const TabArr = [
  {
    route: "Add",
    label: "الاعدادت",
    icon: "settings",
    component: Settings,
    color: "#0ab2d0",
  },
  {
    route: "Notifications",
    label: "الاشعارات",
    icon: "notifications",
    component: Notifications,
    color: "#0ab2d0",
  },
  {
    route: "Loves",
    label: "اعجبنى",
    icon: "heart",
    component: Loves,
    color: "#0ab2d0",
  },
  {
    route: "Home",
    label: "الرئيسية",
    icon: "ios-home",
    component: Home,
    color: "#0ab2d0",
  },
];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);
  const iconRef = useRef(null);
  useEffect(() => {
    if (focused) {
      iconRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      viewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      textViewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
    } else {
      viewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
      textViewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, { flex: focused ? 1 : 0.65 }]}
    >
      <View>
        <Animatable.View
          ref={viewRef}
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "white", borderRadius: 20 },
          ]}
        />
        <View
          style={[styles.btn, { backgroundColor: focused ? null : "white" }]}
        >
          <Animatable.View ref={textViewRef}>
            {focused && (
              <Text
                style={{
                  color: focused ? item.color : "#555555",
                  paddingHorizontal: 0,
                  fontSize: 19,
                  fontWeight: 900,
                  marginHorizontal: 5,
                }}
              >
                {item.label}
              </Text>
            )}
          </Animatable.View>

          <Animatable.View ref={iconRef}>
            <Ionicons
              name={item.icon}
              size={30}
              color={focused ? item.color : "#555555"}
            />
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TabScreen({ navigation: { navigate } }) {
  const user = useSelector((state) => state.user.value);
  const sign = useSelector((state) => state.sign.value);
  const [keyboardShow, setKeyboardShow] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShow(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShow(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (sign?.length == 0 || sign == "verify") navigate("Welcome");
  });
  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: ({ navigation: { goBack, canGoBack }, route: { name } }) => {
          return <Header name={name} goBack={goBack} canGoBack={canGoBack} />;
        },
        headerShown: true,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          bottom: 10,
          right: 10,
          left: 10,
          borderRadius: 20,
          display: keyboardShow ? "none" : "flex",
          flexDirection: "column",
        },
        tabBarBackground: () => (
          <View style={{ flex: 1 }}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#037ca6", "#0ab2d0"]}
              style={{ height: 60, borderRadius: 16 }}
            />
          </View>
        ),
      }}
      initialRouteName="Home"
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
      <Tab.Screen
        name="Design"
        component={Design}
        options={{
          tabBarShowLabel: false,
          tabBarButton: (props) => null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin: 0,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
  },
});
