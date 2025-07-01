import type { NotificationType } from "../../shared-kernel";

export interface NotificationService {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
  show(type: NotificationType, message: string): void;
}
