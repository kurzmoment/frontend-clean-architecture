import type { NotificationService } from "../../application/services/notification-service";
import type { NotificationType } from "../../shared-kernel";

// This will be set by the notification provider
let showNotification:
  | ((type: NotificationType, message: string, duration?: number) => void)
  | null = null;

export const setNotificationHandler = (
  handler: (type: NotificationType, message: string, duration?: number) => void
) => {
  showNotification = handler;
};

const show = (
  type: NotificationType,
  message: string,
  duration = 5000
): void => {
  if (showNotification) {
    showNotification(type, message, duration);
  } else {
    // Fallback to console logging if context is not available
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
};

export const notificationService: NotificationService = {
  success(message: string): void {
    show("success", message);
  },

  error(message: string): void {
    show("error", message);
  },

  warning(message: string): void {
    show("warning", message);
  },

  info(message: string): void {
    show("info", message);
  },

  show(type: NotificationType, message: string): void {
    show(type, message);
  },
};
