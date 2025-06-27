import { useNavigate } from "react-router";
import { apiClient } from "../../infrastructure/api/client";

export function useAuth() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  };

  return { logout };
}
