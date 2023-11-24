import { useEffect, useRef } from "react";
import { Text, View, Pressable, ScrollView, Platform } from "react-native";
import { useLinkTo, useRoute } from "@react-navigation/native";
import style from "./style.module.css";
import { useSelector, useDispatch } from "react-redux";
import { set } from "../../store/designsSlice";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Card from "../../components/card/Card";

const Category = ({ route }) => {
  let { designs, categories } = useSelector((state) => state.designs.value);
  const { name: category } = categories[Number(route?.name.slice(8))];
  let designsCategory = [];
  if (category == "كل التصاميم")
    designsCategory = [...designs].sort((a, b) => (a.time > b.time ? -1 : 1));
  else
    designsCategory = [...designs]
      .filter((design) => design.categoryName == category)
      .sort((a, b) => (a.time > b.time ? -1 : 1));
  return (
    <View style={{ ...style.page, marginTop: Platform.OS == "ios" ? 5 : 0 }}>
      <ScrollView contentContainerStyle={style.scroll} scrollEnabled>
        {designsCategory.map((design) => (
          <Card design={design} key={design.id} />
        ))}
      </ScrollView>
    </View>
  );
};
const TabButton = ({ category, to }) => {
  const { categories } = useSelector((state) => state.designs?.value);
  const route = useRoute();
  let active;
  if (route.params) active = route.params?.path == to;
  else active = category == categories.at(-1)?.name;
  const linkTo = useLinkTo();
  return (
    <View style={active ? style.activeTab : style.tab}>
      <Pressable onPress={() => linkTo(to)}>
        <Text style={active ? style.tabTextActive : style.tabText}>
          {category}
        </Text>
      </Pressable>
    </View>
  );
};
const TabBar = ({ categories }) => {
  const scrollViewRef = useRef();
  return (
    <ScrollView
      horizontal
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
      scrollEnabled
      contentContainerStyle={style.navigator}
      style={{...style.navigatorStyle, top: Platform.OS == "ios" ? 35 : 20  }}
    >
      {categories.map((category, index) => (
        <TabButton
          key={index}
          category={category.name}
          to={`/App/Home/Category${index}`}
        />
      ))}
    </ScrollView>
  );
};
const Home = () => {
  const dispatch = useDispatch();
  const { designs, categories } = useSelector((state) => state.designs?.value);
  useEffect(() => {
    dispatch(set());
  }, [dispatch]);

  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      tabBar={() => <TabBar categories={categories} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: style.navigator,
      }}
      initialRouteName={`Category${categories.length - 1}`}
    >
      {categories.map((category, index) => (
        <Tab.Screen
          key={index}
          name={`Category${index}`}
          component={Category}
          options={{
            tabBarShowLabel: false,
            tabBarButton: () => (
              <TabButton
                category={category.name}
                to={`/App/Home/Category${index}`}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default Home;
