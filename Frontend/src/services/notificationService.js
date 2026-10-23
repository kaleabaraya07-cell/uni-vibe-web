import { mockNotifications } from "../data/mockNotifications";

/**
 * Notifications Service
 */
export const notificationService = {
  async getNotifications() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...mockNotifications];
  },

  async markAllAsRead() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    mockNotifications.forEach((n) => {
      n.read = true;
    });
    return { success: true };
  },

  async markAsRead(id) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return { success: true };
  },
};

export default notificationService;
