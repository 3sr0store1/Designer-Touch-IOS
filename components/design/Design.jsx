import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Text, View, Pressable, Dimensions, ScrollView } from "react-native";
import style from "./style.module.css";
import { LinearGradient } from "expo-linear-gradient";
import { Video, ResizeMode } from "expo-av";
import { Ionicons, Foundation } from "@expo/vector-icons";
import { love as loveAction } from "../../store/userSlice.js";
import {
  love as loveDesign,
  unlove as unloveDesign,
} from "../../store/designsSlice";
import Parameters from "../parameters/Parameters";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Toast } from "toastify-react-native";
import { setIsLoad } from "../../store/isLoadSlice";

const Design = ({ id }) => {
  const navigation = useNavigation();
  const { designs } = useSelector((state) => state.designs.value);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [design, setDesign] = useState(
    designs?.find((design) => design.id === id)
  );
  const [videoUrl, setVideo] = useState({ url: "", state: null });
  const [isLove, setIsLove] = useState(
    Boolean(user?.loveIDs?.find((id) => id == design.id))
  );
  const [love, setLove] = useState(design.love);
  const [isWork, setIsWork] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    setIsLove(Boolean(user?.loveIDs?.find((id) => id == design.id)));
  }, [user, design]);

  useEffect(() => {
    setLove(design.love);
    const directory = FileSystem.documentDirectory;
    FileSystem.readDirectoryAsync(directory).then((folders) => {
      if (folders?.includes(`${design.id}.mp4`))
        setVideo({ url: `${directory}${design.id}.mp4`, state: "file" });
      else setVideo({ url: design.files.video, state: "url" });
    });
  }, [design]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", async () => {
      await video.current.stopAsync();
    });
    return unsubscribe;
  }, [navigation]);

  const loveHandel = () => {
    if (user.id == "passed") return Toast.error("يجب انشاء حساب اولا");
    setIsLove((isLove) => {
      if (isLove) {
        dispatch(unloveDesign(design.id));
      } else {
        dispatch(loveDesign(design.id));
      }
      dispatch(
        loveAction({ love: !isLove, userId: user?.id, designId: design.id })
      );
      return !isLove;
    });
  };

  useEffect(() => {
    console.log(videoUrl);
    if (videoUrl.state != "url" && videoUrl.state != "render") return;
    const directory = FileSystem.documentDirectory;
    try {
      FileSystem.readDirectoryAsync(directory).then(async (folders) => {
        if (folders?.includes(`${design.id}.mp4`) && videoUrl.state == "url")
          setVideo({ url: `${directory}${design.id}.mp4`, state: "file" });
        else {
          try {
            const { uri } = await FileSystem.downloadAsync(
              videoUrl.url,
              `${directory}${design.id}_${
                videoUrl.state == "url" ? "" : `render${Date.now()}`
              }.mp4`
            );
            setVideo({ url: uri, state: "file" });
          } catch (e) {
            Toast.error(e.message);
            console.error({ e });
          }
        }
      });
    } catch (error) {
      Toast.error(error.message);
      console.error({ error });
    }
  }, [videoUrl]);

  const restart = async () => {
    setDesign(designs?.find((design) => design.id === id));
    setIsWork(false);
    await video.current.stopAsync();
  };

  useEffect(() => {
    restart();
  }, [id, designs]);

  saveFile = async (fileUri) => {
    if (videoUrl.state != "file")
      return Toast.error("انتظر حتى بداية عرض الفيديو");
    dispatch(setIsLoad("جارى حفظ الفيديو"));
    MediaLibrary.requestPermissionsAsync().then(async ({ status }) => {
      if (status == "granted") {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        asset.filename = design.name + ".mp4";
        const album = await MediaLibrary.getAlbumAsync("Album");
        if (album) await MediaLibrary.addAssetsToAlbumAsync(asset, album.id);
        else await MediaLibrary.createAlbumAsync("Album", asset);
        Toast.success("تم التحميل بنجاح فى مجلد Album");
      } else Toast.error("لكى تتمكن من تحميل هذا الفيديو يجب منح الصلاحيات");
      dispatch(setIsLoad(false));
    });
  };

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
  style.video = { ...style.video, ...shadow };
  style.gradient = { ...style.gradient, ...shadow };

  return (
    <Fragment>
      <View style={style.videoContainer}>
        <Pressable onPress={loveHandel} style={style.heart}>
          <Ionicons
            name="heart"
            size={Dimensions.get("window").width * 0.08}
            color={isLove ? "#e6017d" : "white"}
          />
          <Text
            style={{
              ...style.love,
              fontSize: Dimensions.get("window").width * 0.04,
            }}
          >
            {love}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => saveFile(videoUrl.url)}
          style={style.download}
        >
          <LinearGradient
            colors={["#037ca6", "#0ab2d0"]}
            start={{ x: 0.2, y: 0.2 }}
            locations={[0.2, 0.8]}
            style={style.downloadGradient}
          >
            <Foundation
              name="download"
              size={Dimensions.get("window").height * 0.04}
              color="white"
            />
          </LinearGradient>
        </Pressable>
        <Video
          ref={video}
          style={{
            ...style.video,
            height: Dimensions.get("window").width * 0.6,
          }}
          posterSource={{ uri: design.files.image }}
          source={{ uri: videoUrl.state == "file" ? videoUrl.url : "" }}
          posterStyle={{ resizeMode: ResizeMode.COVER }}
          resizeMode={ResizeMode.COVER}
          videoStyle={{ padding: 20 }}
          onError={(e) => console.error("Error => " + e)}
          onLoad={() => video.current.playAsync()}
          useNativeControls
          isLooping
          usePoster
        />
      </View>
      {isWork ? (
        <Parameters
          id={design.projectId}
          parameters={design.parameters}
          duration={design.duration}
          setVideo={setVideo}
        />
      ) : (
        <Fragment>
          <View style={style.info}>
            <View style={style.infoText}>
              <Text style={style.date}>{design.formateTime}</Text>
              <Text style={style.name}>{design.name}</Text>
            </View>
            <Pressable style={style.button} onPress={() => setIsWork(true)}>
              <LinearGradient
                colors={["#6c0581", "#e6017d"]}
                start={{ x: 0, y: 0.5 }}
                locations={[0, 1]}
                style={style.gradient}
              >
                <Text style={style.buttonText}>انشاء فيديو</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <ScrollView>
            <Text style={style.description}>{design.description}</Text>
          </ScrollView>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Design;
