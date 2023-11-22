import { TextInput } from "react-native";
import style from "./style.module.css";
import { LinearGradient } from "expo-linear-gradient";

const Input = ({ name, defaultValue, setter }) => {
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
  style.gradient = { ...style.gradient, ...shadow };
  return (
    <LinearGradient
      colors={["#6c0581", "#0ab2d0"]}
      start={{ x: 0.1, y: 0.3 }}
      locations={[0, 1]}
      style={style.gradient}
    >
      <TextInput
        style={style.inputText}
        onChangeText={(text) =>
          setter((object) => {
            object[name] = text;
            return object;
          })
        }
        defaultValue={defaultValue}
      />
    </LinearGradient>
  );
};

export default Input;
