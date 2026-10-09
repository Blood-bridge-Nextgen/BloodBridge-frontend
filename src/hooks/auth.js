import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getUser } from "../helpers/auth";

export function useAuth() {
  const token = Cookies.get("authToken");

  return useQuery({
    queryFn: getUser,
    queryKey: ["auth-user"],
    enabled: !!token,
  });
}
