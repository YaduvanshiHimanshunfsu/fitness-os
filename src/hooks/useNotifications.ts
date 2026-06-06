import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface NotificationStore {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  unreadCount: () => number;
}

export const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [],
  addNotification: (notif) => set((state) => ({
    notifications: [{
      ...notif,
      id: Math.random().toString(36).substring(7),
      read: false,
      timestamp: new Date()
    }, ...state.notifications].slice(0, 50) // Keep last 50
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  unreadCount: () => get().notifications.filter(n => !n.read).length
}));
