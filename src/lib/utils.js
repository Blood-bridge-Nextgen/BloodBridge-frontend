import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("authToken");

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://bloodbridge-backend.pxxlspace.cv",
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export const errorParser = (error) => {
  const DEFAULT_ERROR = "An error occured";
  if (error instanceof AxiosError) {
    const errorData = error.response?.data;
    return "message" in errorData ? errorData.message : DEFAULT_ERROR;
  }
  if (error instanceof Error) {
    return error.message;
  }

  return DEFAULT_ERROR;
};
