import axios from "./axios";
import FormData from "form-data";

export const getUser = async ({ token }) => {
  return axios
    .post("/getInfo", { token })
    .then((e) => e.data)
    .catch((e) => console.error("error => " + e));
};
export const loveDesign = async ({ love, userId, designId }) => {
  return axios
    .post(`/${userId}/${love ? "love" : "unlove"}/${designId}`)
    .then((e) => e.data)
    .catch((e) => console.error("error => " + e));
};
export const pushToken = async ({ token, pushToken }) => {
  return axios
    .post(`/pushToken`, { token, pushToken })
    .then((e) => e.data)
    .catch((e) => console.error("error => " + e));
};
export const render = async ({ token, object, files, id }) => {
  const form = new FormData();
  form.append("token", token);
  for (let [key, value] of Object.entries(object)) form.append(key, value);
  for (let value of files) form.append("files", value);
  return axios({
    method: "post",
    url: `/render/${id}`,
    data: form,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((e) => e.data)
    .catch((e) => console.error("error => " + e));
};
