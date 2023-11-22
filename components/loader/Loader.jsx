import { View, Animated, Easing,Text } from "react-native";
import { useRef } from "react";
import style from "./style.module.css";
import { Image } from "expo-image";
import x from "../../assets/load.png";
import y from "../../assets/load2.png";
const Loader = ({text}) => {
  console.log({text})
  spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.bezier(.5,1.5,.5,-0.5),
      useNativeDriver: true,
    })
  ).start();
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["210deg", "-150deg"],
  });
  return (
    <View style={style.loader}>
      <Animated.Image
        contentFit="cover"
        transition={1000}
        style={{ ...style.image, transform: [{ rotate: spin }] }}
        source={x}
      />
      <Image
        source={y}
        style={style.image2}
        contentFit="cover"
        transition={1000}
      />
      <Text style={style.text} >{typeof(text)=="boolean"?"":text}</Text>
    </View>
  );
};

export default Loader;
