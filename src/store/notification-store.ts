// src/store/notification-store.ts - Global notifications
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { NotificationItem } from './interfaces';

interface NotificationState {
    notifications: NotificationItem[];
}

interface NotificationActions {
    addNotification: (notification: Omit<NotificationItem, 'id'>) => string;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    getUnreadCount: () => number;
}



export const useNotificationStore = create<NotificationStore>()(
    devtools(
        (set, get) => ({
            // State
            notifications: [],

            // Actions
            addNotification: (notification) => {
                const id = Math.random().toString(36).substring(2, 15);
                const newNotification: NotificationItem = {
                    ...notification,
                    id,
                    time: new Date().toISOString(),
                };

                set(state => ({
                    notifications: [newNotification, ...state.notifications],
                }));

                // Auto-remove after 5 seconds for non-important notifications
                if (notification.priority !== 'high') {
                    setTimeout(() => {
                        get().removeNotification(id);
                    }, 5000);
                }

                return id;
            },

            removeNotification: (id) => {
                set(state => ({
                    notifications: state.notifications.filter(n => n.id !== id),
                }));
            },

            markAsRead: (id) => {
                set(state => ({
                    notifications: state.notifications.map(n =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                }));
            },

            markAllAsRead: () => {
                set(state => ({
                    notifications: state.notifications.map(n => ({ ...n, read: true })),
                }));
            },

            clearAll: () => {
                set({ notifications: [] });
            },

            getUnreadCount: () => {
                return get().notifications.filter(n => !n.read).length;
            },
        }),
        {
            name: 'notification-store',
        }
    )
);

export type NotificationStore = NotificationState & NotificationActions;

// Convenient notification selector
export const useNotifications = () => useNotificationStore(state => ({
    notifications: state.notifications,
    unreadCount: state.getUnreadCount(),
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    markAsRead: state.markAsRead,
    markAllAsRead: state.markAllAsRead,
    clearAll: state.clearAll,
}));