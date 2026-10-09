import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/auth";

export const AuthWrapper = ({ children, role, status }) => {
  const user = useAuth();
  const navigate = useNavigate();

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (!user.data) {
    navigate("/SignIn");
    return null;
  }

  if (role && user.data.role !== role) {
    navigate("/NotAuthorized");
    return null;
  }

  if (status && user.data.status !== status) {
    navigate("/NotAuthorized");
    return null;
  }

  return <>{children}</>;
};
