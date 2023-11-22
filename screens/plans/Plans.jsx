import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import style from "./style.module.css";
import { useNavigation, Link } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { Toast } from "toastify-react-native";
import { subscripe, confirm } from "../../api/plans";
import { setUser } from "../../store/userSlice";

const Plan = ({ plan, setUrl, setShow, setState }) => {
  const currentPlan = useSelector((state) => state.plan.value);
  const [planState, setPlanState] = useState("");
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
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
  style.plan = {
    ...style.plan,
    ...shadow,
    borderColor: user?.planId == plan?.id ? "#0ab2d0" : "#000",
    borderWidth: user?.planId == plan?.id ? 5 : 1,
  };
  const subscription = async (id) => {
    if (user.id == "passed") return Toast.error("يجب انشاء حساب اولا");
    if (planState == "مشترك بالفعل") Toast.info("انت مشترك بالفعل");
    else if (plan.price * (100 - plan.discount) * 0.01 == 0) {
      Toast.error("لا يمكنك تجديد الخطة المجانية");
    } else {
      const {
        link: { href },
      } = await subscripe(id);
      setState(id);
      setUrl(href);
      setShow(true);
    }
  };
  useEffect(() => {
    if (plan.price * (100 - plan.discount) * 0.01 == 0 && (plan.price ?? false))
      setPlanState("مشترك بالفعل");
    else if (user?.planId == plan?.id) {
      new Date(Number(currentPlan.end)) > new Date()
        ? setPlanState("مشترك بالفعل")
        : setPlanState("تجديد الاشتراك");
    } else setPlanState("اشترك الان");
  }, [user, plan, currentPlan]);
  return (
    <View style={style.plan} key={plan.id}>
      <View style={style.title}>
        <Text style={style.name}>{plan.name}</Text>
        <Text style={style.description}>{plan.description}</Text>
      </View>
      <View style={style.price}>
        <Text style={style.prev}>{plan.price}</Text>
        <LinearGradient
          colors={["#037ca6", "#0ab2d0"]}
          start={{ x: 0, y: 0.5 }}
          locations={[0.2, 0.8]}
          style={style.discount}
        >
          <Text style={style.discount}>خصم {plan.discount}%</Text>
        </LinearGradient>
        <Text style={style.actual}>
          <Text style={style.actualNumber}>
            {plan.price - (plan.discount / 100) * plan.price}
          </Text>
          $ شهريا
        </Text>
      </View>
      <Pressable onPress={() => subscription(plan.id)}>
        <LinearGradient
          colors={["#6c0581", "#e6017d"]}
          start={{ x: 0, y: 0.5 }}
          locations={[0.2, 0.8]}
          style={style.button}
        >
          <Text style={style.button}>{planState}</Text>
        </LinearGradient>
      </Pressable>
      <View style={style.advantages}>
        {plan.advantages.map((advantage, index) => (
          <View key={index} style={style.feature}>
            <MaterialIcons name="done" size={35} color="green" />
            <Text style={style.advantageTitle}>{advantage}</Text>
          </View>
        ))}
        {plan.disadvantages.map((advantage, index) => (
          <View key={index} style={style.feature}>
            <Feather name="x" size={35} color="red" />
            <Text style={style.advantageTitle}>{advantage}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const Plans = () => {
  const plans = useSelector((state) => state.plan.plans);
  const [show, setShow] = useState(false);
  const [state, setState] = useState(0);
  const [url, setUrl] = useState(null);
  const sign = useSelector((state) => state.sign.value);
  const user = useSelector((state) => state.user.value);
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
  style.close = { ...style.close, ...shadow };
  useEffect(() => {
    if (sign?.length == 0 || sign == "verify") navigation.navigate("Welcome");
  }, [sign, navigation]);
  const onUrlChange = async (url) => {
    console.log({ urlPay: url });
    if (url?.includes("https://example.com/return")) {
      setUrl(null);
      setShow(false);
      const newUser = await confirm(user.id, state);
      dispatch(setUser(newUser));
    } else if (url?.includes("https://example.com/cancel")) {
      setUrl(null);
      setShow(false);
    }
  };
  return (
    <View style={style.screen}>
      <ScrollView contentContainerStyle={style.plans} horizontal>
        {plans.map((plan) => (
          <Plan
            plan={plan}
            key={plan.id}
            setShow={setShow}
            setUrl={setUrl}
            setState={setState}
          />
        ))}
      </ScrollView>
      <Link style={style.continue} to={{ screen: "App" }}>
        <AntDesign name="arrowleft" size={35} color="black" />
        &nbsp; استمرار
      </Link>
      <Modal visible={show} style={style.model}>
        <TouchableOpacity
          style={style.close}
          onPress={async () => {
            setUrl(null);
            setShow(false);
          }}
        >
          <LinearGradient
            colors={["#037ca6", "#0ab2d0"]}
            start={{ x: 0.2, y: 0.2 }}
            locations={[0.2, 0.8]}
            style={style.closeGradient}
          >
            <AntDesign name="close" size={35} color="white" />
          </LinearGradient>
        </TouchableOpacity>
        <View style={style.paypal}>
          <WebView
            source={{ uri: url }}
            onNavigationStateChange={({ url }) => onUrlChange(url)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Plans;
