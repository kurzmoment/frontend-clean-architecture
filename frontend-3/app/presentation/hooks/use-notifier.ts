import { useCallback } from "react";
import { notificationService } from "../../infrastructure/services/notification-service-impl";

export const useNotifier = () => {
  const success = useCallback((message: string, title?: string) => {
    notificationService.success(title || "Success", message);
  }, []);

  const error = useCallback((message: string, title?: string) => {
    notificationService.error(title || "Error", message);
  }, []);

  const warning = useCallback((message: string, title?: string) => {
    notificationService.warning(title || "Warning", message);
  }, []);

  const info = useCallback((message: string, title?: string) => {
    notificationService.info(title || "Info", message);
  }, []);

  return {
    success,
    error,
    warning,
    info,
  };
};
