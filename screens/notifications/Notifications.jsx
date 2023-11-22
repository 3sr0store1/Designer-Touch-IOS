import { Text, View, ScrollView, Pressable, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import style from "./style.module.css";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { see, deleteNotify } from "../../store/notificationsSlice";

export default function NotificationsScreen({ navigation: { navigate } }) {
  let notifications = useSelector((state) => state.notifications.value);
  const dispatch = useDispatch();
  const handelPress = async ({ screen, options }, index) => {
    navigate(screen, options);
    dispatch(see(index));
  };
  return (
    <View style={style.screen}>
      <ScrollView contentContainerStyle={style.scroll}>
        {notifications.map((notification, index) => (
          <Pressable
            style={style.notification}
            key={index}
            onPress={() => handelPress(notification.data, index)}
          >
            <View style={style.icon}>
              <LinearGradient
                colors={["#037ca6", "#0ab2d0"]}
                start={{ x: 0.2, y: 0.2 }}
                locations={[0.2, 0.8]}
                style={{ ...style.dot, opacity: notification.isSee ? 0 : 1 }}
              ></LinearGradient>
              <Ionicons
                name="notifications"
                size={24}
                color="black"
                style={style.notifyIcon}
              ></Ionicons>
            </View>
            <View style={style.info}>
              <Text style={style.title}>{notification.title}</Text>
              <Text style={style.body}>{notification.body}</Text>
              <Text style={style.date}>{notification.date}</Text>
            </View>
            <Pressable
              style={{ ...style.icon, right: 0, left: undefined }}
              onPress={() => dispatch(deleteNotify({ index, notifications }))}
            >
              <FontAwesome5
                name="trash"
                size={24}
                color="black"
                style={style.trashIcon}
              />
            </Pressable>
          </Pressable>
        ))}
        {notifications.length === 0 && (
          <Text
            style={{
              ...style.emtpy,
              fontSize: Dimensions.get("window").width * 0.08,
            }}
          >
            ليس لديك اى اشعارات الان
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
