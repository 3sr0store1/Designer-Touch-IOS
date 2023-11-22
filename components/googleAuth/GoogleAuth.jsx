import * as Google from "expo-auth-session/providers/google";
import { View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import style from "./style.module.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { google } from "../../store/signSlice";

const GoogleAuth = () => {
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
  style.button = { ...style.button, ...shadow };
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "708064864550-u4g6oq96n51hsh3miuf5am0gk320ii0r.apps.googleusercontent.com",
    iosClientId:
      "708064864550-okjloqienhlbseoj49m39et9pj1tjr0b.apps.googleusercontent.com",
  });
  const [auth, setAuth] = useState({});
  useEffect(() => {
    if (auth.accessToken) getUserData();
  }, [auth]);

  const getUserData = async () => {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      }
    );

    userInfoResponse
      .json()
      .then((data) => {
        const { email, id, name, picture } = data;
        dispatch(google({ email, password: id, name, picture }));
      })
      .catch(() => setAuth({}));
  };

  useEffect(() => {
    if (response?.type === "success") setAuth(response.authentication);
  }, [response]);

  return (
    <Pressable
      onPress={() => promptAsync({ useProxy: false, showInRecents: true })}
    >
      <LinearGradient
        colors={["#6c0581", "#e6017d"]}
        start={{ x: 0.1, y: 0.3 }}
        locations={[0, 1]}
        style={style.button}
      >
        <View>
          <AntDesign name="google" size={30} color="white" />
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default GoogleAuth;
