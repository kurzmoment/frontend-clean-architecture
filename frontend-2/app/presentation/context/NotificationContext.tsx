import React, { createContext, useContext, useState, useCallback } from "react";
import type { NotificationType } from "../../shared-kernel";
import NotificationToast from "../components/NotificationToast";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (type: NotificationType, message: string, duration = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, notification]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, removeNotification }}
    >
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
}
