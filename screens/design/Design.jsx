import { View } from "react-native";
import Design from "../../components/design/Design";
import style from "./style.module.css";

const DesignScreen = ({ route }) => {
  const { id } = route.params;
  return (
    <View style={style.screen}>
      <Design id={id} />
    </View>
  );
};

export default DesignScreen;
