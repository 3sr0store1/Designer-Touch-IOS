import { Text, View, Pressable, Platform } from "react-native";
import style from "./style.module.css";
import { Feather } from "@expo/vector-icons";
import { Fragment } from "react";

const Header = ({ name, goBack, canGoBack }) => {
  const tanslate = {
    Home: "الرئيسية",
    Add: "الاعدادت",
    Notifications: "الاشعارات",
    Loves: "اعجبنى",
    Design: "التصميم",
    LogIn: "تسجيل الدخول",
    SignUp: "انشاء حساب",
    Verify: "كود التحقق",
  };
  return (
    <Fragment>
      {name != "Home" &&
        name != "App" &&
        name != "Welcome" &&
        name != "Plans" && (
          <View
            style={{ ...style.header, marginTop: Platform.OS == "ios" ? 35 : 20 }}
          >
            <Text style={style.name}>{tanslate[name]}</Text>
            <Pressable
              style={style.back}
              onPress={() => (canGoBack() ? goBack() : null)}
            >
              <Text style={style.backText}>رجوع</Text>
              <Feather
                style={style.icon}
                name="chevron-right"
                size={40}
                color="#037ca6"
              />
            </Pressable>
          </View>
        )}
    </Fragment>
  );
};

export default Header;
