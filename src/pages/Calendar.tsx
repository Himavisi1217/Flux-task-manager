import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { RefreshCw, CalendarDays, Plug, PlugZap } from 'lucide-react'
import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
<<<<<<< HEAD
import { useTasks } from '@/hooks/useTasks'
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'
import { Button } from '@/components/ui/Button'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import type { CalendarEvent, Task } from '@/types'
=======
import { useTasks } from '../hooks/useTasks'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'
import { Button } from '../components/ui/Button'
import { PriorityBadge, StatusBadge } from '../components/ui/Badge'
import type { CalendarEvent, Task } from '../types'
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb

function taskToCalendarEvent(task: Task): CalendarEvent {
  const dueDate = task.dueDate instanceof Timestamp
    ? task.dueDate.toDate()
    : new Date(task.dueDate as any)

  return {
    id: `flux-${task.id}`,
    title: task.title,
    start: dueDate.toISOString(),
    end: dueDate.toISOString(),
    backgroundColor: task.priority === 'critical' ? '#E63946' : '#8B0000',
    borderColor: task.priority === 'critical' ? '#E63946' : '#8B0000',
    extendedProps: {
      source: 'flux',
      taskId: task.id,
      priority: task.priority,
      status: task.status,
    },
  }
}

export default function Calendar() {
  const { tasks } = useTasks()
  const {
    googleEvents,
    syncing,
    isConnected,
    connectGoogleCalendar,
    fetchGoogleEvents,
    disconnectGoogleCalendar,
  } = useGoogleCalendar()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const calRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
    gsap.fromTo(calRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' })
  }, [])

  // Auto-fetch Google events on load if connected
  useEffect(() => {
    if (isConnected) fetchGoogleEvents()
  }, [isConnected])

  const fluxEvents = tasks
    .filter((t) => t.addToCalendar)
    .map(taskToCalendarEvent)

  const allEvents = [...fluxEvents, ...googleEvents]

  const handleEventClick = (info: any) => {
    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      extendedProps: info.event.extendedProps,
    }
    setSelectedEvent(event)
    if (event.extendedProps?.taskId) {
      const task = tasks.find((t) => t.id === event.extendedProps?.taskId)
      setSelectedTask(task || null)
    } else {
      setSelectedTask(null)
    }
  }

  return (
    <div className="page-enter max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays size={20} className="text-flux-red" />
            <h1 className="text-2xl font-black text-flux-white">Calendar</h1>
          </div>
          <p className="text-flux-gray text-sm">Your tasks and events in one place</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync button */}
          {isConnected && (
            <button
              onClick={() => fetchGoogleEvents()}
              disabled={syncing}
              className="flex items-center gap-2 text-sm text-flux-gray hover:text-flux-white border border-flux-black-border hover:border-flux-gray px-3 py-2 rounded-lg transition-all"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              Sync
            </button>
          )}

          {/* Google Calendar connect/disconnect */}
          {isConnected ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={disconnectGoogleCalendar}
              className="flex items-center gap-2"
            >
              <PlugZap size={14} className="text-blue-400" />
              <span className="text-blue-400">Google Connected</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={connectGoogleCalendar}
              className="flex items-center gap-2"
            >
              <Plug size={14} />
              Connect Google Calendar
            </Button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-flux-gray">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-flux-red inline-block" /> Flux tasks
        </span>
        {isConnected && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> Google Calendar
          </span>
        )}
      </div>

      <div className="flex gap-6">
        {/* Calendar */}
        <div ref={calRef} className="flex-1 flux-card p-4 overflow-hidden min-w-0">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={allEvents}
            eventClick={handleEventClick}
            height="auto"
            eventClassNames={(arg) => {
              return arg.event.extendedProps?.source === 'google'
                ? ['fc-event-google']
                : ['fc-event-flux']
            }}
          />
        </div>

        {/* Event detail sidebar */}
        {selectedEvent && (
          <div className="w-72 flex-shrink-0">
            <div className="flux-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-flux-white font-semibold text-sm leading-snug flex-1">
                  {selectedEvent.title}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-flux-gray hover:text-flux-white ml-2"
                >
                  ✕
                </button>
              </div>

              {selectedEvent.extendedProps?.source === 'flux' && selectedTask && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <PriorityBadge priority={selectedTask.priority} />
                    <StatusBadge status={selectedTask.status} />
                  </div>
                  {selectedTask.description && (
                    <p className="text-flux-gray text-xs">{selectedTask.description}</p>
                  )}
                  <div className="text-xs text-flux-gray space-y-1">
                    <p>Due: {format(selectedTask.dueDate.toDate(), 'MMMM d, yyyy')}</p>
                    {selectedTask.assignedToNames && selectedTask.assignedToNames.length > 0 && (
                      <p>Assigned: {selectedTask.assignedToNames.join(', ')}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedEvent.extendedProps?.source === 'google' && (
                <div className="text-xs text-flux-gray">
                  <span className="inline-flex items-center gap-1 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    Google Calendar event
                  </span>
                  <p className="mt-2">{selectedEvent.start as string}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
