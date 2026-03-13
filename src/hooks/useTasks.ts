import { useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useTaskStore } from '@/store/taskStore'
import { useAuthContext } from '@/context/AuthContext'
import type { Task, TaskFormData, TaskStatus } from '@/types'
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from '@/lib/googleCalendar'

export function useTasks() {
  const { fluxUser } = useAuthContext()
  const { tasks, users, setTasks, addTask, updateTask, removeTask } = useTaskStore()

  useEffect(() => {
    if (!fluxUser) return
    // Admin sees all tasks; regular users only see tasks assigned to them
    const q = fluxUser.role === 'admin'
      ? query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'tasks'), where('assignedTo', 'array-contains', fluxUser.uid), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const all: Task[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task))
      setTasks(all)
    })
    return unsub
  }, [fluxUser])

  async function sendNotifications(uids: string[], notification: any) {
    const chunks = []
    for (let i = 0; i < uids.length; i += 500) {
      chunks.push(uids.slice(i, i + 500))
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db)
      chunk.forEach(uid => {
        const notifRef = doc(collection(db, 'users', uid, 'notifications'))
        batch.set(notifRef, {
          ...notification,
          createdAt: serverTimestamp()
        })
      })
      await batch.commit()
    }
  }

  async function createTask(data: TaskFormData, assignedToNames: string[]) {
    const taskData = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'todo' as TaskStatus,
      assignedTo: data.assignedTo,
      assignedToNames,
      createdBy: fluxUser!.uid,
      createdByName: fluxUser!.displayName,
      dueDate: Timestamp.fromDate(data.dueDate),
      addToCalendar: data.addToCalendar,
      googleEventId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const ref = await addDoc(collection(db, 'tasks'), taskData)

    // Push to Google Calendar if requested
    if (data.addToCalendar && fluxUser?.googleAccessToken) {
      const googleEventId = await createGoogleCalendarEvent(fluxUser.googleAccessToken, {
        title: data.title,
        description: data.description,
        startDate: data.dueDate,
      })
      if (googleEventId) {
        await updateDoc(ref, { googleEventId })
      }
    }

    // Notifications: If admin creates a task, notify everyone
    if (fluxUser?.role === 'admin') {
      const otherUserUids = users
        .map(u => u.uid)
        .filter(uid => uid !== fluxUser.uid)

      if (otherUserUids.length > 0) {
        await sendNotifications(otherUserUids, {
          title: 'New Task Assigned',
          message: `Admin ${fluxUser.displayName} created a new task: ${data.title}`,
          type: 'info',
          read: false,
          link: '/tasks'
        })
      }
    }
  }

  async function editTask(id: string, data: Partial<TaskFormData>, assignedToNames?: string[]) {
    const updates: any = { updatedAt: serverTimestamp() }
    if (data.title !== undefined) updates.title = data.title
    if (data.description !== undefined) updates.description = data.description
    if (data.priority !== undefined) updates.priority = data.priority
    if (data.assignedTo !== undefined) updates.assignedTo = data.assignedTo
    if (assignedToNames !== undefined) updates.assignedToNames = assignedToNames
    if (data.dueDate !== undefined) updates.dueDate = Timestamp.fromDate(data.dueDate)
    if (data.addToCalendar !== undefined) updates.addToCalendar = data.addToCalendar
    await updateDoc(doc(db, 'tasks', id), updates)
  }

  async function deleteTask(task: Task) {
    // Remove from Google Calendar if synced
    if (task.googleEventId && fluxUser?.googleAccessToken) {
      await deleteGoogleCalendarEvent(fluxUser.googleAccessToken, task.googleEventId)
    }
    await deleteDoc(doc(db, 'tasks', task.id))
  }

  async function updateTaskStatus(id: string, status: TaskStatus) {
    const task = tasks.find(t => t.id === id)
    await updateDoc(doc(db, 'tasks', id), { status, updatedAt: serverTimestamp() })

    // Notifications: If user completes a task, notify admins
    if (status === 'completed' && task) {
      const admins = users.filter(u => u.role === 'admin' && u.uid !== fluxUser?.uid)
      const adminUids = admins.map(u => u.uid)

      if (adminUids.length > 0) {
        await sendNotifications(adminUids, {
          title: 'Task Completed',
          message: `${fluxUser?.displayName} completed the task: ${task.title}`,
          type: 'success',
          read: false,
          link: '/manage'
        })
      }
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => ['started', 'ongoing'].includes(t.status)).length,
    critical: tasks.filter((t) => t.priority === 'critical' && t.status !== 'completed').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
  }

  return { tasks, stats, createTask, editTask, deleteTask, updateTaskStatus }
}
