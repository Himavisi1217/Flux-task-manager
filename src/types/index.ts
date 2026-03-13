import { Timestamp } from 'firebase/firestore'

export type UserRole = 'admin' | 'user'

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export type TaskStatus = 'todo' | 'started' | 'ongoing' | 'need-time' | 'completed'

export interface FluxUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt: Timestamp
  googleCalendarConnected: boolean
  googleAccessToken?: string
  googleRefreshToken?: string
}

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  assignedTo: string[]       // array of user UIDs
  assignedToNames?: string[] // denormalized names for display
  createdBy: string
  createdByName?: string
  dueDate: Timestamp
  addToCalendar: boolean
  googleEventId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  assignedTo: string[]
  dueDate: Date
  addToCalendar: boolean
}

export interface GoogleCalendarEvent {
  id: string
  title: string
  start: string | Date
  end: string | Date
  source: 'flux' | 'google'
  taskId?: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  extendedProps?: {
    source: 'flux' | 'google'
    taskId?: string
    priority?: TaskPriority
    status?: TaskStatus
  }
}

export interface StatsData {
  total: number
  completed: number
  inProgress: number
  critical: number
  todo: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Timestamp
  link?: string
}
