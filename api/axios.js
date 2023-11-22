const axios = require("axios").default;

axios.defaults.baseURL = "https://shark-app-92sk8.ondigitalocean.app/users/";
const ACCESS_API =
  "OUyvoTUCvotCirXItpYCP786di4SD4RcOP7V6c075se3TCvp789G7vYCV8760V6f606V06F7F66FTCPOLYHLVxr8civtbyviTRCi";
axios.defaults.headers["ACCESS_API"] = `Bearer ${ACCESS_API}`;

export default axios;
