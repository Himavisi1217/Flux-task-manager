<<<<<<< HEAD
import { create } from 'zustand'
import type { Notification } from '@/types'

interface NotificationStore {
    notifications: Notification[]
    unreadCount: number
    setNotifications: (notifications: Notification[]) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    addNotification: (notification: Notification) => void
    clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    unreadCount: 0,
    setNotifications: (notifications) => set({
        notifications,
        unreadCount: notifications.filter(n => !n.read).length
    }),
    markAsRead: (id) => set((s) => {
        const notifications = s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        )
        return {
            notifications,
            unreadCount: notifications.filter(n => !n.read).length
        }
    }),
    markAllAsRead: () => set((s) => {
        const notifications = s.notifications.map((n) => ({ ...n, read: true }))
        return {
            notifications,
            unreadCount: 0
        }
    }),
    addNotification: (notification) => set((s) => ({
        notifications: [notification, ...s.notifications],
        unreadCount: s.unreadCount + (notification.read ? 0 : 1)
    })),
    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}))
=======
import { create } from 'zustand'
import type { Notification } from '../types'

interface NotificationStore {
    notifications: Notification[]
    unreadCount: number
    setNotifications: (notifications: Notification[]) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    addNotification: (notification: Notification) => void
    clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    unreadCount: 0,
    setNotifications: (notifications) => set({
        notifications,
        unreadCount: notifications.filter(n => !n.read).length
    }),
    markAsRead: (id) => set((s) => {
        const notifications = s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        )
        return {
            notifications,
            unreadCount: notifications.filter(n => !n.read).length
        }
    }),
    markAllAsRead: () => set((s) => {
        const notifications = s.notifications.map((n) => ({ ...n, read: true }))
        return {
            notifications,
            unreadCount: 0
        }
    }),
    addNotification: (notification) => set((s) => ({
        notifications: [notification, ...s.notifications],
        unreadCount: s.unreadCount + (notification.read ? 0 : 1)
    })),
    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}))
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb
