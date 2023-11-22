import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Text, View, Image, Pressable, BackHandler } from "react-native";
import { Link } from "@react-navigation/native";
import style from "./style.module.css";
import image from "../../assets/splash.png";
import { LinearGradient } from "expo-linear-gradient";
import { setDefaultUser } from "../../store/userSlice";
import { passSign } from "../../store/signSlice";

const Welcome = () => {
  const user = useSelector((state) => state.user.value);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (user?.id) navigation.navigate("App");
  }, [user, navigation]);

  const pass = () => {
    dispatch(passSign());
    dispatch(setDefaultUser());
  };

  return (
    <View style={style.page}>
      <Image style={style.image} source={image} />
      <Text style={style.text}>اهلا بكم</Text>
      <View style={style.links}>
        <LinearGradient
          colors={["#6c0581", "#e6017d"]}
          start={{ x: 0.2, y: 0.2 }}
          locations={[0, 1]}
          style={style.button}
        >
          <Link style={style.logIn} to={{ screen: "SignUp" }}>
            انشاء حساب
          </Link>
        </LinearGradient>
        <LinearGradient
          colors={["#037ca6", "#0ab2d0"]}
          start={{ x: 0.2, y: 0.2 }}
          locations={[0, 1]}
          style={style.button}
        >
          <Link style={style.signUp} to={{ screen: "LogIn" }}>
            تسجيل الدخول
          </Link>
        </LinearGradient>
        <Pressable onPress={pass}>
          <LinearGradient
            colors={["#6c0581", "#0ab2d0"]}
            start={{ x: 0.2, y: 0.2 }}
            locations={[0, 1]}
            style={style.pbutton}
          >
            <Text style={style.pass}>استمر بدون حساب</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
};

export default Welcome;
