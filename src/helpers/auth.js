import { axiosInstance } from "../lib/utils";

export const signIn = async (data) => {
  return axiosInstance({
    method: "POST",
    url: "/auth/sign-in",
    data,
  }).then((res) => res.data);
};
