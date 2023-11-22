import React from "react";
import Index from "./Index";
import { Provider } from "react-redux";
import store from "./store";
import AxiosInterceptor from "./components/axiosInterceptor/AxiosInterceptor";
const App = () => {
  return (
    <Provider store={store}>
      <AxiosInterceptor>
        <Index />
      </AxiosInterceptor>
    </Provider>
  );
};

export default App;
