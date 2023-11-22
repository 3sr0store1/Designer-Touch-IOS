import { useEffect, useState } from "react";
import { Text, View, Dimensions } from "react-native";
import style from "./style.module.css";
import { useSelector } from "react-redux";
import Card from "../../components/card/Card";

const Loves = () => {
  const { designs } = useSelector((state) => state.designs?.value);
  const user = useSelector((state) => state.user.value);
  const [designsLove, setDesignsLove] = useState([]);
  useEffect(() => {
    const filterd = [...designs].filter((design) =>
      user?.loveIDs?.includes(design.id)
    );
    const sortd = [...filterd].sort((a, b) => (a.love > b.love ? -1 : 1));
    setDesignsLove(sortd);
  }, [designs, user]);
  return (
    <View style={style.page}>
      {designsLove.map((design) => (
        <Card design={design} key={design.id} />
      ))}
      {designsLove.length <= 0 && (
        <Text
          style={{
            ...style.emtpy,
            fontSize: Dimensions.get("window").width * 0.08,
          }}
        >
          لم تضيف اى تصميم الى قائمة اعجبنى حتى الان
        </Text>
      )}
    </View>
  );
};

export default Loves;
