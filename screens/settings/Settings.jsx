import { useSelector } from "react-redux";
import { Pressable, Text, View } from "react-native";
import style from "./style.module.css";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Logout from "../../components/logout/Logout";
import { FontAwesome5 } from '@expo/vector-icons';

const Settings = ({ navigation: { navigate } }) => {
  const user = useSelector((state) => state.user.value);
  const plan = useSelector((state) => state.plan.value);
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
  style.imageGradient = { ...style.imageGradient, ...shadow };
  return (
    <View style={style.screen}>
      <LinearGradient
        colors={["#6c0581", "#0ab2d0"]}
        start={{ x: 0.2, y: 0.2 }}
        locations={[0, 1]}
        style={style.imageGradient}
      >
        <Image
          style={style.image}
          source={user.picture}
          contentFit="contain"
          transition={1000}
        />
      </LinearGradient>
      <View style={style.meta}>
        <View style={style.data}>
          <Text style={style.key}>الاسم</Text>
          <Text style={style.value}>{user.name}</Text>
        </View>
        <View style={style.data}>
          <Text style={style.key}>البريد الالكترونى</Text>
          <Text style={style.value}>{user.email}</Text>
        </View>
        <View style={style.data}>
          <Text style={style.key}>الخطة الحالية</Text>
          <Text style={style.value}>{plan.name || "غير مشترك بعد"}</Text>
        </View>
        <View style={style.data}>
          <Text style={style.key}>المستهلك</Text>
          <Text style={style.value}>{user.consumed} ثانية</Text>
        </View>
        <View style={style.data}>
          <Text style={style.key}>المتبقى</Text>
          <Text style={style.value}>{plan.haveTime || 0} ثانية </Text>
        </View>
      </View>
      <View style={style.buttons}>
        <Pressable style={style.btn} onPress={() => navigate("Plans")}>
          <LinearGradient
          colors={["#037ca6", "#0ab2d0"]}
            start={{ x: 0.2, y: 0.2 }}
            locations={[0, 1]}
            style={style.planGradient}
          >
            <Text style={style.plan}>الاشتراكات</Text>
          </LinearGradient>
        </Pressable>
        <Logout/>
      </View>
    </View>
  );
};

export default Settings;
