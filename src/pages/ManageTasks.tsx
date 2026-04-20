import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Plus, Trash2, Pencil, Search, AlertTriangle, Shield } from 'lucide-react'
import { format } from 'date-fns'
<<<<<<< HEAD
import { useTasks } from '@/hooks/useTasks'
import { useUsers } from '@/hooks/useUsers'
import { Button } from '@/components/ui/Button'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import TaskForm from '@/components/tasks/TaskForm'
import type { Task } from '@/types'
import { useAuthContext } from '@/context/AuthContext'
=======
import { useTasks } from '../hooks/useTasks'
import { useUsers } from '../hooks/useUsers'
import { Button } from '../components/ui/Button'
import { PriorityBadge, StatusBadge } from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import TaskForm from '../components/tasks/TaskForm'
import type { Task } from '../types'
import { useAuthContext } from '../context/AuthContext'
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb

export default function ManageTasks() {
  const { tasks, deleteTask } = useTasks()
  useUsers()
  const { fluxUser } = useAuthContext()
  const isAdmin = fluxUser?.role === 'admin'
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<Task | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(tableRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
  }, [])

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignedToNames || []).some((n) => n.toLowerCase().includes(search.toLowerCase()))
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchPriority && matchStatus
  })

  const handleDelete = async (task: Task) => {
    await deleteTask(task)
    setDeleteConfirm(null)
  }

  return (
    <div className="page-enter max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-flux-red" />
            <h1 className="text-2xl font-black text-flux-white">Manage Tasks</h1>
          </div>
          <p className="text-flux-gray text-sm">Admin panel — full task control</p>
        </div>
        <Button
          onClick={() => { setEditingTask(undefined); setModalOpen(true) }}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Search size={16} className="text-flux-text-dim group-focus-within:text-flux-red transition-all duration-300" />
          </div>
          <input
            type="text"
            className="flux-input pl-11 !cursor-text relative z-0 appearance-none"
            placeholder="Search by title, description or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <select
            className="flux-input sm:w-44"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            className="flux-input sm:w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="started">Started</option>
            <option value="ongoing">Ongoing</option>
            <option value="need-time">Need Time</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {[
          { label: 'Total', value: filtered.length, color: 'text-flux-white' },
          { label: 'Critical', value: filtered.filter((t) => t.priority === 'critical').length, color: 'text-flux-red' },
          { label: 'Pending', value: filtered.filter((t) => t.status !== 'completed').length, color: 'text-yellow-400' },
          { label: 'Done', value: filtered.filter((t) => t.status === 'completed').length, color: 'text-green-400' },
        ].map((s) => (
          <div key={s.label} className="flux-card p-3">
            <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            <p className="text-flux-gray text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div ref={tableRef} className="flux-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-flux-black-border">
                <th className="text-left text-flux-gray font-medium px-5 py-3">Task</th>
                <th className="text-left text-flux-gray font-medium px-4 py-3 hidden md:table-cell">Priority</th>
                <th className="text-left text-flux-gray font-medium px-4 py-3 hidden md:table-cell">Status</th>
                <th className="text-left text-flux-gray font-medium px-4 py-3 hidden lg:table-cell">Assigned To</th>
                <th className="text-left text-flux-gray font-medium px-4 py-3 hidden lg:table-cell">Due Date</th>
                <th className="text-right text-flux-gray font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-flux-gray py-16">
                    No tasks match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((task, i) => (
                  <tr
                    key={task.id}
                    className={`border-b border-flux-black-border/50 hover:bg-white/2 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {task.priority === 'critical' && <AlertTriangle size={13} className="text-flux-red flex-shrink-0" />}
                        <span className={`font-medium ${task.status === 'completed' ? 'line-through text-flux-gray' : 'text-flux-white'}`}>
                          {task.title}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-flux-gray text-xs mt-0.5 truncate max-w-xs">{task.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-flux-gray text-xs">
                        {task.assignedToNames?.join(', ') || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-flux-gray text-xs">
                        {format(task.dueDate.toDate(), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingTask(task); setModalOpen(true) }}
                          className="p-1.5 text-flux-gray hover:text-flux-white hover:bg-white/5 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteConfirm(task)}
                            className="p-1.5 text-flux-gray hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(undefined) }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        maxWidth="max-w-xl"
      >
        <TaskForm
          task={editingTask}
          onSuccess={() => { setModalOpen(false); setEditingTask(undefined) }}
          onCancel={() => { setModalOpen(false); setEditingTask(undefined) }}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Task"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-flux-gray text-sm">
            Are you sure you want to delete{' '}
            <span className="text-flux-white font-semibold">"{deleteConfirm?.title}"</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
