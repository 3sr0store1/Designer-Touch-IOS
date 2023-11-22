import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, Pressable, Dimensions } from "react-native";
import style from "./style.module.css";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import { Entypo, Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const AudioInput = ({ name, defaultValue, setter, designId }) => {
  const [isPlay, setIsPlay] = useState(false);
  const [isLoad, setIsLoad] = useState(true);
  const [sound, setSound] = useState();
  const [duration, setDuration] = useState(1);
  const [position, setPosition] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const [time, setTime] = useState(false);
  const [audio, setAudio] = useState({ url: "", done: false });

  useEffect(() => {
    const directory = FileSystem.documentDirectory;
    FileSystem.readDirectoryAsync(directory).then(async (files) => {
      if (!files?.includes(`${designId}_${name}.mp3`))
        await FileSystem.downloadAsync(
          defaultValue,
          `${directory}${designId}_${name}.mp3`
        );
      setAudio({ url: `${directory}${designId}_${name}.mp3`, done: true });
    });
  }, [name, designId, defaultValue]);

  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("state", async () => {
      setIsPlay(false);
      setPosition(0);
    });
    return unsubscribe;
  }, [navigation]);
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
  style.point = { ...style.point, ...shadow };
  style.upload = { ...style.upload, ...shadow };
  style.gradientAudio = { ...style.gradientAudio, ...shadow };
  const formateTime = (number) => {
    const minutes = `${Math.floor(Number(number / 60000))}`;
    number -= minutes * 60000;
    const seconds = `${Math.floor(Number(number / 1000).toFixed())}`;
    return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  };

  useEffect(() => {
    if (audio.done) {
      sound?.stopAsync();
      setIsPlay(false);
      setIsLoad(true);
      Audio.Sound.createAsync({ uri: audio }, {}, (status) => {
        if (status.isLoaded) {
          setIsLoad(false);
          setDuration(status.durationMillis);
          setTime(status.positionMillis);
        }
      }).then(({ sound }) => setSound(sound));
    }
  }, [audio]);

  useEffect(() => {
    if (isPlay) sound?.playAsync();
    else sound?.pauseAsync();
  }, [isPlay]);
  useEffect(() => {
    if (!isTouch) setPosition(time / duration);
  }, [time, duration]);
  const moveTouch = async (event) => {
    if (!isLoad) {
      setIsTouch(true);
      const width = Dimensions.get("window").width;
      let x = event.nativeEvent.pageX;
      const start = (width - (width - 20) * 0.7 * 0.9) / 2;
      const end = start + (width - 20) * 0.7 * 0.9;
      if (x < start) x = start;
      if (x > end) x = end;
      await sound.setPositionAsync(position * duration);
      setPosition((x - start) / ((width - 20) * 0.7 * 0.9));
      setTime(((x - start) / ((width - 20) * 0.7 * 0.9)) * duration);
      setTimeout(() => setIsTouch(false), 5000);
    }
  };
  const upload = async () => {
    let { assets, canceled } = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
    });
    if (!canceled) {
      setAudio(assets[0].uri);
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
    <View style={style.contAudio}>
      <LinearGradient
        colors={["#6c0581", "#e6017d"]}
        start={{ x: 0, y: 1 }}
        locations={[0, 1]}
        style={{
          ...style.gradientAudio,
          width: Dimensions.get("window").width - 85,
        }}
      >
        <Pressable
          onPress={() => (isLoad ? null : setIsPlay((isPlay) => !isPlay))}
        >
          <Entypo
            name={isPlay ? "sound" : "sound-mute"}
            size={30}
            color={isLoad ? "#aaa" : "white"}
          />
        </Pressable>
        {Dimensions.get("window").width > 400 && (
          <View style={style.duration}>
            <Text style={style.durationTime}>{formateTime(time)}</Text>
          </View>
        )}
        <View
          style={{
            ...style.lineCont,
            width:
              Dimensions.get("window").width > 500
                ? Dimensions.get("window").width * 0.6
                : Dimensions.get("window").width * 0.45,
          }}
        >
          <View style={style.line}></View>
          <View
            style={[
              { ...style.position, left: `${position * 100}%` },
              { transform: [{ translateY: -1 }] },
            ]}
            onStartShouldSetResponder={() => true}
            onResponderMove={(event) => moveTouch(event)}
          >
            <LinearGradient
              colors={["#037ca6", "#0ab2d0"]}
              start={{ x: 0.2, y: 0.2 }}
              locations={[0.2, 0.8]}
              style={style.point}
            ></LinearGradient>
          </View>
        </View>
        <View style={style.duration}>
          <Text style={style.durationTime}>{formateTime(duration)}</Text>
        </View>
      </LinearGradient>
      <LinearGradient
        colors={["#037ca6", "#0ab2d0"]}
        start={{ x: 0.2, y: 0.2 }}
        locations={[0.2, 0.8]}
        style={style.upload}
      >
        <Pressable onPress={() => upload()}>
          <Ionicons name="cloud-upload" size={30} color="white" />
        </Pressable>
      </LinearGradient>
    </View>
  );
};

export default AudioInput;
