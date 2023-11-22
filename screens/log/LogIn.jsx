import { useState, useEffect } from "react";
import { Text, View, TextInput, Image, Pressable } from "react-native";
import style from "./style.module.css";
import { Link } from "@react-navigation/native";
import image from "../../assets/splash.png";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../../store/signSlice";
import GoogleAuth from "../../components/googleAuth/GoogleAuth";
import { Toast } from "toastify-react-native";
import { useNavigation } from "@react-navigation/native";

export default function LogIn() {
  const user = useSelector((state) => state.user.value);
  const navigation = useNavigation();
  useEffect(() => {
    if (user?.id) navigation.navigate("Plans");
  }, [user, navigation]);

  const sign = useSelector((state) => state.sign.value);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const shadow = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  };
  style.input = { ...style.input, ...shadow };
  style.button = { ...style.button, ...shadow };
  style.icon = { ...style.icon, ...shadow };
  const handelLogIn = async (e) => {
    const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regExp.test(email)) return Toast.error("هذا البريد غير صالح");
    else if (password.length < 9)
      return Toast.error("كلمة السر يجب ان تكون اكبر من 8 احرف");
    else dispatch(logIn({ email, password }));
  };
  return (
    <View style={style.screen}>
      <Image style={style.image} source={image} />
      <View style={style.inputBox}>
        <Text style={style.inputText}>البريد الالكترونى</Text>
        <TextInput
          style={style.input}
          onChangeText={setEmail}
          value={email}
          inputmode="email"
          placeholder="البريد الالكترونى"
          placeholderTextColor="#999999"
          textContentType="username"
          textAlign="right"
        />
      </View>
      <View style={style.inputBox}>
        <Text style={style.inputText}>كلمة السر</Text>
        <TextInput
          style={style.input}
          onChangeText={setPassword}
          value={password}
          inputmode="password"
          placeholder="كلمة السر"
          placeholderTextColor="#999999"
          textContentType="password"
          textAlign="right"
          secureTextEntry
        />
      </View>
      <LinearGradient
        colors={["#037ca6", "#0ab2d0"]}
        start={{ x: 0, y: 1 }}
        locations={[0.2, 0.8]}
        style={style.button}
      >
        <Pressable onPress={handelLogIn}>
          <Text style={style.logIn}>تسجيل الدخول</Text>
        </Pressable>
      </LinearGradient>
      <Text style={style.inputText}>التسجيل بواسطة</Text>
      <View style={style.icons}>
        <GoogleAuth />
      </View>
      <View style={style.signUpBox} dir="rtl">
        <Text style={style.Text}>لا تمتلك حساب! </Text>
        <Link style={style.signUp} to={{ screen: "SignUp" }}>
          انشاء حساب
        </Link>
      </View>
    </View>
  );
}
