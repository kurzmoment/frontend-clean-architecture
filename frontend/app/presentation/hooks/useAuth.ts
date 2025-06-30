import { useNavigate } from "react-router";
import { useAuthService } from "../../infrastructure/di/ServiceProvider";

export function useAuth() {
  const navigate = useNavigate();
  const authService = useAuthService();

  const logout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  };

  return { logout };
}
