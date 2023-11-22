import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsLoad } from "../../store/isLoadSlice.js";
import axios from "axios";
import { Toast } from "toastify-react-native";

const AxiosInterceptor = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const request = axios.interceptors.request.use(
      function (config) {
        if (config?.url?.includes("render")) dispatch(setIsLoad("جارى معالجة الفيديو\nقد يستغرق عدة دقائق"));
        else if (
          !config?.url?.includes("love") &&
          !config?.url?.includes("plan")
        )
          dispatch(setIsLoad(true));
        config.headers["Server-Access"] =
          "OUyvoTUCvotCirXItpYCP786di4SD4RcOP7V6c075se3TCvp789G7vYCV8760V6f606V06F7F66FTCPOLYHLVxr8civtbyviTRCi";
        return config;
      },
      function (error) {
        Toast.error(error.message);
        dispatch(setIsLoad(false));
        return { error };
      }
    );

    const response = axios.interceptors.response.use(
      function (response) {
        dispatch(setIsLoad(false));
        return response;
      },
      function (error) {
        Toast.error(error.message);
        dispatch(setIsLoad(false));
        return { error };
      }
    );
    return () => {
      axios.interceptors.request.eject(response);
      axios.interceptors.request.eject(request);
    };
  }, []);
  return <Fragment>{children}</Fragment>;
};

export default AxiosInterceptor;
