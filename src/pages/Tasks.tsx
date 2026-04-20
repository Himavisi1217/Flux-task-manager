import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Plus, Filter, Search, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
<<<<<<< HEAD
import { useAuthContext } from '@/context/AuthContext'
import { useTasks } from '@/hooks/useTasks'
import { useUsers } from '@/hooks/useUsers'
import { Button } from '@/components/ui/Button'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import TaskForm from '@/components/tasks/TaskForm'
import type { Task, TaskStatus } from '@/types'
=======
import { useAuthContext } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { useUsers } from '../hooks/useUsers'
import { Button } from '../components/ui/Button'
import { PriorityBadge, StatusBadge } from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import TaskForm from '../components/tasks/TaskForm'
import type { Task, TaskStatus } from '../types'
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb

const STATUS_OPTIONS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'started', label: 'Started' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'need-time', label: 'Need Time' },
  { value: 'completed', label: 'Completed' },
]

const STATUS_ACTIONS: TaskStatus[] = ['todo', 'started', 'ongoing', 'need-time', 'completed']

export default function Tasks() {
  const { fluxUser } = useAuthContext()
  const { tasks, updateTaskStatus } = useTasks()
  useUsers()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [statusMenuTask, setStatusMenuTask] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(listRef.current?.children ? Array.from(listRef.current.children) : [], { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: 'power3.out',
    })
  }, [tasks.length])

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const handleStatusUpdate = async (taskId: string, status: TaskStatus) => {
    await updateTaskStatus(taskId, status)
    setStatusMenuTask(null)
  }

  const isAdmin = fluxUser?.role === 'admin'

  return (
    <div className="page-enter max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-flux-white">Tasks</h1>
          <p className="text-flux-gray text-sm mt-0.5">{filtered.length} tasks found</p>
        </div>
        {isAdmin && (
          <Button onClick={() => { setEditingTask(undefined); setModalOpen(true) }} className="flex items-center gap-2">
            <Plus size={16} /> New Task
          </Button>
        )}
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
            placeholder="Search for tasks, descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <select
            className="flux-input sm:w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
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
        </div>
      </div>

      {/* Task list */}
      <div ref={listRef} className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-24 flux-card relative overflow-hidden">
            <div className="absolute inset-0 bg-flux-red/5 animate-pulse" />
            <div className="relative z-10">
              <Filter size={48} className="text-flux-black-border mx-auto mb-4 opacity-50" />
              <h3 className="text-flux-white text-xl font-bold mb-2">No tasks found</h3>
              <p className="text-flux-text-dim max-w-xs mx-auto text-sm">We couldn't find any tasks matching your current filters. Try expanding your search!</p>
            </div>
          </div>
        ) : (
          filtered.map((task) => (
            <div
              key={task.id}
              className="flux-card group p-6 hover:shadow-[0_0_30px_rgba(230,57,70,0.1)] hover:border-flux-red/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    {task.priority === 'critical' && (
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-black text-flux-red bg-flux-red/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(230,57,70,0.2)]">
                        <AlertTriangle size={10} />
                        Immediate Action
                      </div>
                    )}
                  </div>

                  <h3 className={`text-lg sm:text-xl font-black text-flux-white mb-2 tracking-tight transition-all ${task.status === 'completed' ? 'line-through opacity-40' : 'group-hover:text-flux-red'}`}>
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-flux-text-muted text-sm leading-relaxed mb-4 line-clamp-2 italic opacity-80">
                      &ldquo;{task.description}&rdquo;
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 py-3 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-2 text-[11px] text-flux-text-dim uppercase tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-flux-red animate-pulse" />
                      Due: {format(task.dueDate.toDate(), 'MMM d, yyyy')} @ {format(task.dueDate.toDate(), 'HH:mm')}
                    </div>
                    {task.assignedToNames && task.assignedToNames.length > 0 && (
                      <div className="flex -space-x-2">
                        {task.assignedToNames.map((name, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-flux-red/20 border-2 border-flux-black-card flex items-center justify-center text-[10px] font-black text-flux-red shadow-lg transition-transform hover:scale-125 hover:z-10"
                            title={name}
                          >
                            {name.charAt(0)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 flex-shrink-0 sm:border-l sm:border-white/5 sm:pl-6 pt-2">
                  <div className="relative">
                    <button
                      onClick={() => setStatusMenuTask(statusMenuTask === task.id ? null : task.id)}
                      className={`text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-xl transition-all border ${statusMenuTask === task.id
                        ? 'bg-flux-red text-white border-flux-red shadow-lg'
                        : 'text-flux-text-dim hover:text-flux-white border-flux-black-border hover:border-flux-red'
                        }`}
                    >
                      Update Status
                    </button>
                    {statusMenuTask === task.id && (
                      <div className="absolute right-0 top-11 z-30 bg-flux-black-card/95 backdrop-blur-xl border border-flux-black-border rounded-2xl shadow-2xl overflow-hidden min-w-[160px] animate-fade-in">
                        {STATUS_ACTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusUpdate(task.id, s)}
                            className={`w-full text-left px-5 py-3 text-xs font-bold transition-all capitalize flex items-center justify-between group ${task.status === s
                              ? 'text-flux-red bg-flux-red/5'
                              : 'text-flux-text-dim hover:text-flux-white hover:bg-white/5'
                              }`}
                          >
                            {s.replace('-', ' ')}
                            {task.status === s && <div className="w-1 h-1 rounded-full bg-flux-red" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => { setEditingTask(task); setModalOpen(true) }}
                      className="text-[10px] uppercase tracking-widest font-black text-flux-text-dim hover:text-flux-white px-4 py-2 rounded-xl border border-flux-black-border hover:border-flux-white transition-all"
                    >
                      Edit Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Task Modal */}
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
    </div>
  )
}
