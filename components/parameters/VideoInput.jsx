import { useState } from "react";
import { Pressable } from "react-native";
import style from "./style.module.css";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const ImgInput = ({ name, defaultValue }) => {
  const [video, setVideo] = useState(defaultValue);
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
  style.gradientImage = { ...style.gradientImage, ...shadow };
  style.upload2 = { ...style.upload2, ...shadow };

  const upload = async () => {
    let { assets, canceled } = await DocumentPicker.getDocumentAsync({
      type: "video/*",
    });
    if (!canceled) {
      setVideo(assets[0].uri);
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
      <Video
        style={{ ...style.image }}
        source={{ uri: video }}
        posterStyle={{ resizeMode: ResizeMode.COVER }}
        resizeMode={ResizeMode.COVER}
        videoStyle={{ padding: 20 }}
        useNativeControls
        isLooping
        usePoster
      />
      <LinearGradient
        colors={["#037ca6", "#0ab2d0"]}
        start={{ x: 0.2, y: 0.2 }}
        locations={[0.2, 0.8]}
        style={style.upload2}
      >
        <Pressable onPress={() => upload()}>
          <Ionicons name="cloud-upload" size={30} color="white" />
        </Pressable>
      </LinearGradient>
    </LinearGradient>
  );
};

export default ImgInput;
