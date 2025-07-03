export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

export type NotificationHandler = (notification: Notification) => void;

let notificationHandler: NotificationHandler | null = null;

export const setNotificationHandler = (handler: NotificationHandler) => {
  notificationHandler = handler;
};

export const showNotification = (
  type: NotificationType,
  title: string,
  message: string,
  duration: number = 5000
) => {
  if (!notificationHandler) {
    console.warn("Notification handler not set");
    return;
  }

  const notification: Notification = {
    id: Date.now().toString(),
    type,
    title,
    message,
    duration,
  };

  notificationHandler(notification);
};

export const notificationService = {
  success: (title: string, message: string, duration?: number) =>
    showNotification("success", title, message, duration),
  error: (title: string, message: string, duration?: number) =>
    showNotification("error", title, message, duration),
  warning: (title: string, message: string, duration?: number) =>
    showNotification("warning", title, message, duration),
  info: (title: string, message: string, duration?: number) =>
    showNotification("info", title, message, duration),
};
