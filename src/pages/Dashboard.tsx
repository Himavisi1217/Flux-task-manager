import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { useAuthContext } from '../context/AuthContext'
import { useLiveClock } from '../hooks/useLiveClock'
import { useTasks } from '../hooks/useTasks'
import { useUsers } from '../hooks/useUsers'
import { PriorityBadge, StatusBadge } from '../components/ui/Badge'
import type { Task } from '../types'

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  index,
}: {
  icon: any
  label: string
  value: number
  color: string
  index: number
}) {
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: 1.2,
      delay: index * 0.1,
      ease: 'power2.out',
      onUpdate() {
        if (numRef.current) numRef.current.textContent = Math.round(obj.val).toString()
      },
    })
  }, [value])

  return (
    <div className="flux-card p-5 hover:border-flux-red/30 transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <TrendingUp size={14} className="text-flux-gray" />
      </div>
      <span
        ref={numRef}
        className="text-4xl font-black text-flux-white tabular-nums"
      >
        0
      </span>
      <p className="text-flux-gray text-sm mt-1 font-medium">{label}</p>
    </div>
  )
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-flux-black-border hover:border-flux-red/30 bg-flux-black-card/50 transition-all duration-200 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'line-through text-flux-gray' : 'text-flux-white'}`}>
            {task.title}
          </p>
          {task.priority === 'critical' && (
            <AlertTriangle size={14} className="text-flux-red flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          <span className="text-flux-gray text-xs flex items-center gap-1">
            <Clock size={10} />
            {format(task.dueDate.toDate(), 'MMM d')}
          </span>
        </div>
      </div>
      {task.assignedToNames && task.assignedToNames.length > 0 && (
        <div className="flex -space-x-2">
          {task.assignedToNames.slice(0, 3).map((name, i) => (
            <div
              key={i}
              className="w-7 h-7 bg-flux-red/30 border-2 border-flux-black rounded-full flex items-center justify-center"
              title={name}
            >
              <span className="text-xs !text-[#ffffff] font-bold">{name.charAt(0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { fluxUser } = useAuthContext()
  const { time, date, dayOfWeek } = useLiveClock()
  const { tasks, stats } = useTasks()
  useUsers()
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    gsap.fromTo(statsRef.current?.children ? Array.from(statsRef.current.children) : [], { opacity: 0, y: 30 }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.2,
    })
    gsap.fromTo('.task-row', { opacity: 0, x: -20 }, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.5,
    })
  }, [])

  const criticalTasks = tasks.filter((t) => t.priority === 'critical' && t.status !== 'completed')
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 8)

  return (
    <div className="page-enter max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-flux-white mb-1">
            Hello, <span className="text-flux-red">{fluxUser?.displayName.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-flux-gray text-lg">What's on your agenda today?</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-flux-red text-3xl font-black tracking-widest">{time}</div>
          <p className="text-flux-gray text-sm mt-0.5">{dayOfWeek}, {date}</p>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ListTodo} label="Total Tasks" value={stats.total} color="bg-flux-red" index={0} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="bg-green-700" index={1} />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="bg-blue-700" index={2} />
        <StatCard icon={AlertTriangle} label="Critical" value={stats.critical} color="bg-orange-700" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical tasks */}
        {criticalTasks.length > 0 && (
          <div className="lg:col-span-1">
            <div className="flux-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-flux-red" />
                <h2 className="text-flux-white font-semibold text-sm">Critical Tasks</h2>
                <span className="ml-auto bg-flux-red/20 text-flux-red text-xs font-bold px-2 py-0.5 rounded-full border border-flux-red/30">
                  {criticalTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {criticalTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="task-row p-3 rounded-lg bg-flux-red/5 border border-flux-red/20 hover:border-flux-red/40 transition-colors"
                  >
                    <p className="text-flux-white text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={task.status} />
                      <span className="text-flux-gray text-xs">
                        Due {format(task.dueDate.toDate(), 'MMM d')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Task list */}
        <div className={criticalTasks.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="flux-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-flux-white font-semibold">
                {fluxUser?.role === 'admin' ? 'All Tasks' : 'My Tasks'}
              </h2>
              <span className="text-flux-gray text-sm">{pendingTasks.length} pending</span>
            </div>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
                <p className="text-flux-white font-semibold">All caught up!</p>
                <p className="text-flux-gray text-sm mt-1">No pending tasks right now.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="task-row">
                    <TaskRow task={task} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
