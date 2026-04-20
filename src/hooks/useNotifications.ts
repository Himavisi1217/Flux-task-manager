<<<<<<< HEAD
import { useEffect } from 'react'
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthContext } from '@/context/AuthContext'
import { useNotificationStore } from '@/store/notificationStore'
import type { Notification } from '@/types'

export function useNotifications() {
    const { fluxUser } = useAuthContext()
    const {
        notifications,
        unreadCount,
        setNotifications,
        markAsRead: markReadStore,
        markAllAsRead: markAllAsReadStore
    } = useNotificationStore()

    useEffect(() => {
        if (!fluxUser) return

        const q = query(
            collection(db, 'users', fluxUser.uid, 'notifications'),
            orderBy('createdAt', 'desc')
        )

        const unsub = onSnapshot(q, (snap) => {
            const all: Notification[] = snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as Notification))
            setNotifications(all)
        })

        return unsub
    }, [fluxUser])

    const markAsRead = async (notificationId: string) => {
        if (!fluxUser) return
        const ref = doc(db, 'users', fluxUser.uid, 'notifications', notificationId)
        await updateDoc(ref, { read: true })
        markReadStore(notificationId)
    }

    const markAllAsRead = async () => {
        if (!fluxUser) return
        const batch = writeBatch(db)
        notifications.filter(n => !n.read).forEach((n) => {
            const ref = doc(db, 'users', fluxUser.uid, 'notifications', n.id)
            batch.update(ref, { read: true })
        })
        await batch.commit()
        markAllAsReadStore()
    }

    const deleteNotification = async (notificationId: string) => {
        if (!fluxUser) return
        const ref = doc(db, 'users', fluxUser.uid, 'notifications', notificationId)
        await deleteDoc(ref)
    }

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification
    }
}
=======
import { useEffect } from 'react'
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuthContext } from '../context/AuthContext'
import { useNotificationStore } from '../store/notificationStore'
import type { Notification } from '../types'

export function useNotifications() {
    const { fluxUser } = useAuthContext()
    const {
        notifications,
        unreadCount,
        setNotifications,
        markAsRead: markReadStore,
        markAllAsRead: markAllAsReadStore
    } = useNotificationStore()

    useEffect(() => {
        if (!fluxUser) return

        const q = query(
            collection(db, 'users', fluxUser.uid, 'notifications'),
            orderBy('createdAt', 'desc')
        )

        const unsub = onSnapshot(q, (snap) => {
            const all: Notification[] = snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as Notification))
            setNotifications(all)
        })

        return unsub
    }, [fluxUser])

    const markAsRead = async (notificationId: string) => {
        if (!fluxUser) return
        const ref = doc(db, 'users', fluxUser.uid, 'notifications', notificationId)
        await updateDoc(ref, { read: true })
        markReadStore(notificationId)
    }

    const markAllAsRead = async () => {
        if (!fluxUser) return
        const batch = writeBatch(db)
        notifications.filter(n => !n.read).forEach((n) => {
            const ref = doc(db, 'users', fluxUser.uid, 'notifications', n.id)
            batch.update(ref, { read: true })
        })
        await batch.commit()
        markAllAsReadStore()
    }

    const deleteNotification = async (notificationId: string) => {
        if (!fluxUser) return
        const ref = doc(db, 'users', fluxUser.uid, 'notifications', notificationId)
        await deleteDoc(ref)
    }

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification
    }
}
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb
