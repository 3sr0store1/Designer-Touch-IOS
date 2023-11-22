import axios from "./axios";

export const getPlans = async () => {
  return axios
    .post("/plans")
    .then((e) => e.data.plans)
    .catch((e) => console.error("error =*> " + e));
};
export const subscripe = async (planId) => {
  return axios
    .post("/subscription", { planId })
    .then((e) => e.data)
    .catch((e) => console.error("error =*> " + e));
};
export const confirm = async (userId, planId) => {
  return axios
    .post(`/confirm-subscription/${userId}/${planId}`)
    .then((e) => e.data.user)
    .catch((e) => console.error("error =*> " + e));
};
