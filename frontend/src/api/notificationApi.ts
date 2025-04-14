
import api from './axiosConfig';

export interface Notification {
  id: string;
  recipientId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CreateNotificationData {
  userId: string;
  message: string;
}

export const notificationApi = {
  getUserNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/api/notifications');
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await api.put(`/api/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/api/notifications/read-all');
  },

  createNotification: async (data: CreateNotificationData): Promise<Notification> => {
    const response = await api.post(`/api/notifications/${data.userId}`, { message: data.message });
    return response.data;
  }
};
