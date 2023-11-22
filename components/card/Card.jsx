import { useState, useEffect } from "react";
import { Text, ImageBackground, Pressable, Dimensions } from "react-native";
import style from "./style.module.css";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { love as loveAction } from "../../store/userSlice.js";
import { useNavigation } from "@react-navigation/native";
import {
  love as loveDesign,
  unlove as unloveDesign,
} from "../../store/designsSlice";
import { Toast } from "toastify-react-native";

const Card = ({ design }) => {
  const { navigate } = useNavigation();
  const user = useSelector((state) => state.user.value);
  const despatch = useDispatch();
  const [isLove, setIsLove] = useState(
    Boolean(user?.loveIDs?.find((id) => id == design.id))
  );
  useEffect(() => {
    setIsLove(Boolean(user?.loveIDs?.find((id) => id == design.id)));
  }, [user, design]);
  const [love, setLove] = useState(design.love);
  useEffect(() => {
    setLove(design.love);
  }, [design]);
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
  style.card = { ...style.card, ...shadow };
  style.image = { ...style.image, resizeMode: "cover" };
  const loveHandel = () => {
    if (user.id == "passed") return Toast.error("يجب انشاء حساب اولا");
    setIsLove((isLove) => {
      if (isLove) {
        despatch(unloveDesign(design.id));
      } else {
        despatch(loveDesign(design.id));
      }
      despatch(
        loveAction({ love: !isLove, userId: user?.id, designId: design.id })
      );
      return !isLove;
    });
  };
  return (
    <Pressable
      style={{ ...style.card, height: Dimensions.get("screen").width * 0.47 }}
      onPress={() => navigate("Design", { id: design.id })}
    >
      <ImageBackground
        source={{ uri: design.files.image }}
        imageStyle={style.imageItself}
        style={style.image}
      >
        <Text style={style.time}>{design.formateTime}</Text>
        <Text style={style.name}>{design.name}</Text>
      </ImageBackground>
      <Pressable onPress={loveHandel} style={style.heart}>
        <Ionicons name="heart" size={30} color={isLove ? "#e6017d" : "white"} />
        <Text style={style.love}>{love}</Text>
      </Pressable>
    </Pressable>
  );
};

export default Card;
