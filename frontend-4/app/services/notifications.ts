// Simple notification service
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

class NotificationService {
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private notifications: Notification[] = [];

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  // Add notification
  private add(notification: Notification) {
    this.notifications.push(notification);
    this.notify();

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration || 5000);
    }
  }

  // Remove notification
  remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  // Clear all notifications
  clear() {
    this.notifications = [];
    this.notify();
  }

  // Get current notifications
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Success notification
  success(message: string, duration?: number) {
    this.add({
      id: this.generateId(),
      type: "success",
      message,
      duration,
    });
  }

  // Error notification
  error(message: string, duration?: number) {
    this.add({
      id: this.generateId(),
      type: "error",
      message,
      duration,
    });
  }

  // Warning notification
  warning(message: string, duration?: number) {
    this.add({
      id: this.generateId(),
      type: "warning",
      message,
      duration,
    });
  }

  // Info notification
  info(message: string, duration?: number) {
    this.add({
      id: this.generateId(),
      type: "info",
      message,
      duration,
    });
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export const notificationService = new NotificationService();
