import { useState, useEffect } from "react";
import { Text, View, TextInput, Image, Pressable } from "react-native";
import style from "./style.module.css";
import { Link } from "@react-navigation/native";
import image from "../../assets/splash.png";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { signUp } from "../../store/signSlice";
import GoogleAuth from "../../components/googleAuth/GoogleAuth";
import { Toast } from "toastify-react-native";
import { useNavigation } from "@react-navigation/native";

export default function LogIn() {
  const user = useSelector((state) => state.user.value);
  const navigation = useNavigation();
  useEffect(() => {
    if (user?.id) navigation.navigate("Plans");
  }, [user, navigation]);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const shadow = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };
  style.input = { ...style.input, ...shadow };
  style.button = { ...style.button, ...shadow };
  style.icon = { ...style.icon, ...shadow };

  const handelSignUp = async (e) => {
    const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regExp.test(email)) return Toast.error("هذا البريد غير صالح");
    else if (password.length < 9)
      return Toast.error("كلمة السر يجب ان تكون اكبر من 8 احرف");
    else if (password != confirm)
      return Toast.error("كلمتى السر غير متطابقتين");
    else dispatch(signUp({ email, password }));
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
      <View style={style.inputBox}>
        <Text style={style.inputText}>اعادة كلمة السر</Text>
        <TextInput
          style={style.input}
          onChangeText={setConfirm}
          value={confirm}
          inputmode="password"
          placeholder="تاكيد كلمة السر"
          placeholderTextColor="#999999"
          textContentType="password"
          textAlign="right"
          secureTextEntry
        />
      </View>
      <LinearGradient
        colors={["#6c0581", "#e6017d"]}
        start={{ x: 0, y: 1 }}
        locations={[0.2, 0.8]}
        style={style.button}
      >
        <Pressable onPress={handelSignUp}>
          <Text style={style.logIn}>انشاء حساب</Text>
        </Pressable>
      </LinearGradient>
      <Text style={style.inputText}>التسجيل بواسطة</Text>
      <View style={style.icons}>
        <GoogleAuth />
      </View>
      <View style={style.signUpBox}>
        <Text style={style.Text}>تمتلك حساب! </Text>
        <Link style={style.signUp} to={{ screen: "LogIn" }}>
          تسجيل الدخول
        </Link>
      </View>
    </View>
  );
}
