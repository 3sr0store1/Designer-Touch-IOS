import { useDispatch, useSelector } from "react-redux";
import { Text, Pressable } from "react-native";
import style from "./style.module.css";
import { LinearGradient } from "expo-linear-gradient";
import { logOut } from "../../store/signSlice";
import { useNavigation } from "@react-navigation/native";

const Logout = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const user = useSelector((state) => state.user.value);
  return (
    <Pressable style={style.logout} onPress={() => dispatch(logOut())}>
      <LinearGradient
        colors={["#6c0581", "#e6017d"]}
        start={{ x: 0, y: 0.5 }}
        locations={[0.2, 0.8]}
        style={style.gradient}
      >
        <Text style={style.text}>
          {user.id == "passed" ? "تسجيل الدخول" : "تسجيل الخروج"}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

export default Logout;
