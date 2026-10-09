import { axiosInstance } from "../lib/utils";

export const signInUser = async (data) => {
  return axiosInstance({
    method: "POST",
    url: "/auth/sign-in",
    data,
  }).then((res) => res.data);
};

export const getUser = async () => {
  return axiosInstance({
    url: "/auth/user",
  }).then((res) => res.data.data);
};
