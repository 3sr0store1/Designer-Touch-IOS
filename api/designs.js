import axios from "./axios";

export const getDesigns = async () => {
  return axios
    .post("/designs")
    .then((e) => e.data)
    .catch((e) => console.error("error=>", e));
};
