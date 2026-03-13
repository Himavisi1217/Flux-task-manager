import { create } from 'zustand'
import type { Task, FluxUser } from '@/types'

interface TaskStore {
  tasks: Task[]
  users: FluxUser[]
  setTasks: (tasks: Task[]) => void
  setUsers: (users: FluxUser[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  users: [],
  setTasks: (tasks) => set({ tasks }),
  setUsers: (users) => set({ users }),
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
}))
