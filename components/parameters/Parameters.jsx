import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Text, View, ScrollView, Pressable } from "react-native";
import style from "./style.module.css";
import { LinearGradient } from "expo-linear-gradient";
import TextInput from "./TextInput";
import ImgInput from "./ImgInput";
import VideoInput from "./VideoInput";
import AudioInput from "./AudioInput";
import { render } from "../../api/user";
import { Toast } from "toastify-react-native";

const translator = {
  text: "النصوص",
  image: "الصور",
  video: "الفيديوهات",
};

const Parameters = ({ id, parameters, duration, setVideo }) => {
  const token = useSelector((state) => state.sign.value);
  const plan = useSelector((state) => state.plan.value);
  const user = useSelector((state) => state.user.value);
  const [object, setObject] = useState({});
  const [files, setFiles] = useState([]);
  const [show, setShow] = useState({ value: "text", available: [] });

  useEffect(() => {
    const set = new Set([...parameters.map(({ type }) => type)]);
    set.delete("audio");
    setShow({ value: [...set][0], available: [...set] });
  }, [parameters]);

  const shadow = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  };
  style.gradientRender = { ...style.gradientRender, ...shadow };

  const createVideo = async () => {
    if (user.id == "passed") return Toast.error("يجب انشاء حساب اولا");
    if (plan.haveTime < duration)
      Toast.error("ليس لديك ما يكفى لانشاء فيديو من هذا التصميم");
    else if (Date.now() > Date(plan.end))
      Toast.error("لقد انتهت مدةالاشتراك الحالى");
    else {
      const { success, error, output } = await render({
        id,
        object,
        files,
        token,
      });
      console.log({ success, error, output } )
      if (error) Toast.error(error);
      else {
        Toast.success(success);
        setVideo({url:output,state:"render"});
      }
    }
  };

  return (
    <Fragment>
      {parameters
        .filter(({ type }) => type == "audio")
        .map(({ name, defaultValue }) => (
          <AudioInput
            defaultValue={defaultValue}
            name={name}
            key={name}
            setter={setFiles}
            designId={id}
          />
        ))}
      <View style={style.tab}>
        {show.available.map((name, index) => (
          <Pressable
            key={index}
            onPress={() =>
              setShow((show) => {
                return { ...show, value: name };
              })
            }
            style={name == show.value ? style.tabActive : style.tabNonActive}
          >
            <Text
              style={{
                ...style.tabText,
                color: name == show.value ? "#0ab2d0" : "#000",
              }}
            >
              {translator[name]}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView style={style.parameters} contentContainerStyle={style.scroll}>
        {parameters
          .filter(({ type }) => type == show.value)
          .map(({ name, defaultValue, type }) => {
            if (type == "text")
              return (
                <TextInput
                  defaultValue={defaultValue}
                  name={name}
                  setter={setObject}
                  key={name}
                />
              );
            else if (type == "image")
              return (
                <ImgInput
                  defaultValue={defaultValue}
                  name={name}
                  key={name}
                  setter={setFiles}
                />
              );
            else if (type == "video")
              return (
                <VideoInput
                  defaultValue={defaultValue}
                  name={name}
                  key={name}
                  setter={setFiles}
                />
              );
          })}
        <Pressable style={style.renderBox} onPress={() => createVideo()}>
          <LinearGradient
            colors={["#6c0581", "#0ab2d0"]}
            start={{ x: 0.1, y: 0.3 }}
            locations={[0, 1]}
            style={style.gradientRender}
          >
            <Text style={style.render}>انشاء الفيديو</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </Fragment>
  );
};

export default Parameters;
