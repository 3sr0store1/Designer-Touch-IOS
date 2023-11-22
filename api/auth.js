import axios from "./axios";

export const getUser = async ({ email, password }) => {
  return axios
    .post("/get", { email, password })
    .then((e) => e.data)
    .catch((e) => console.error("error =*> " + e));
};
export const createUser = async ({ email, password }) => {
  return axios
    .post("/create", { email, password })
    .then((e) => e.data)
    .catch((e) => console.error("error =+> " + e));
};
export const byGoogle = async ({ email, password, picture, name }) => {
  return axios
    .post("/google", { email, password, picture, name })
    .then((e) => e.data)
    .catch((e) => console.error("error =+> " + e));
};
export const verifyUser = async ({ email, verificationCode }) => {
  return axios
    .post("/verify", { email, verificationCode })
    .then((e) => e.data)
    .catch((e) => console.error("error =-> " + e));
};
