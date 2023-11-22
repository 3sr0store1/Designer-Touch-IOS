import { useState } from "react";
import { Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import style from "./style.module.css";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

const ImgInput = ({ name, defaultValue, setter }) => {
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
  const [image, setImage] = useState(defaultValue);
  style.gradientImage = { ...style.gradientImage, ...shadow };
  style.upload2 = { ...style.upload2, ...shadow };
  const upload = async () => {
    let { assets, canceled } = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });
    if (!canceled) {
      setImage(assets[0].uri);
      setter((files) => {
        files.push({
          uri: assets[0].uri,
          type: assets[0].mimeType,
          name: name + "." + assets[0].uri.split(".").at(-1),
        });
        return files;
      });
    }
  };
  return (
    <LinearGradient
      colors={["#6c0581", "#0ab2d0"]}
      start={{ x: 0.1, y: 0.3 }}
      locations={[0, 1]}
      style={style.gradientImage}
    >
      <Image
        style={style.image}
        source={image}
        placeholder={"https://picsum.photos/seed/696/3000/2000"}
        contentFit="cover"
        transition={1000}
      />
      <LinearGradient
        colors={["#037ca6", "#0ab2d0"]}
        start={{ x: 0.2, y: 0.2 }}
        locations={[0.2, 0.8]}
        style={style.upload2}
      >
        <Pressable onPress={() => upload()}>
          <Ionicons
            name="cloud-upload"
            size={Dimensions.get("window").width > 400 ? 30 : 25}
            color="white"
          />
        </Pressable>
      </LinearGradient>
    </LinearGradient>
  );
};

export default ImgInput;
