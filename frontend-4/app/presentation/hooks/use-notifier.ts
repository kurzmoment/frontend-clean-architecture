import type { NotificationService } from "../../application/services/notification-service";
import { notificationService } from "../../infrastructure/services/notification-service-impl";

export function useNotifier(): NotificationService {
  return notificationService;
}
