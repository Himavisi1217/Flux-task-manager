import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { useTasks } from '../../hooks/useTasks'
import { useUsers } from '../../hooks/useUsers'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { Task, TaskFormData } from '../../types'

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    assignedTo: z.array(z.string()).min(1, 'Assign at least one user'),
    dueDate: z.string().min(1, 'Due date is required'),
    dueTime: z.string().min(1, 'Time is required'),
    addToCalendar: z.boolean().default(false),
})

type FormData = z.infer<typeof taskSchema>

interface TaskFormProps {
    task?: Task
    onSuccess: () => void
    onCancel: () => void
}

export default function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
    const { createTask, editTask } = useTasks()
    const users = useUsers()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title || '',
            description: task?.description || '',
            priority: task?.priority || 'medium',
            assignedTo: task?.assignedTo || [],
            dueDate: task?.dueDate ? format(task.dueDate.toDate(), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            dueTime: task?.dueDate ? format(task.dueDate.toDate(), 'HH:mm') : '09:00',
            addToCalendar: task?.addToCalendar || false,
        },
    })

    const onSubmit = async (data: FormData) => {
        const assignedToNames = users
            .filter((u) => data.assignedTo.includes(u.uid))
            .map((u) => u.displayName)

        const dateStr = `${data.dueDate}T${data.dueTime}:00`
        const dueDate = new Date(dateStr)

        const formData: TaskFormData = {
            title: data.title,
            description: data.description || '',
            priority: data.priority,
            assignedTo: data.assignedTo,
            dueDate,
            addToCalendar: data.addToCalendar,
        }

        if (task) {
            await editTask(task.id, formData, assignedToNames)
        } else {
            await createTask(formData, assignedToNames)
        }
        onSuccess()
    }

    const selectedAssigned = watch('assignedTo')

    const toggleUser = (uid: string) => {
        const current = selectedAssigned
        if (current.includes(uid)) {
            setValue('assignedTo', current.filter((id) => id !== uid))
        } else {
            setValue('assignedTo', [...current, uid])
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Task Title"
                placeholder="Enter task title"
                error={errors.title?.message}
                {...register('title')}
            />

            <div>
                <label className="block text-xs font-semibold text-flux-gray uppercase tracking-wider mb-2">
                    Description
                </label>
                <textarea
                    className="w-full bg-flux-black-soft border border-flux-black-border rounded-xl px-4 py-2.5 text-flux-white text-sm focus:border-flux-red focus:ring-1 focus:ring-flux-red/20 outline-none transition-all placeholder:text-flux-text-dim min-h-[100px] resize-none"
                    placeholder="Enter task description"
                    {...register('description')}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-flux-gray uppercase tracking-wider mb-2">
                        Priority
                    </label>
                    <select
                        className="flux-input"
                        {...register('priority')}
                    >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-flux-gray uppercase tracking-wider">
                        Due Date & Time
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="flex-1 bg-flux-black-soft border border-flux-black-border rounded-xl px-3 py-2 text-flux-white text-sm outline-none focus:border-flux-red transition-all"
                            {...register('dueDate')}
                        />
                        <input
                            type="time"
                            className="w-24 bg-flux-black-soft border border-flux-black-border rounded-xl px-3 py-2 text-flux-white text-sm outline-none focus:border-flux-red transition-all"
                            {...register('dueTime')}
                        />
                    </div>
                    {(errors.dueDate || errors.dueTime) && (
                        <p className="text-xs text-red-400 mt-1">{errors.dueDate?.message || errors.dueTime?.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-flux-gray uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Assign To</span>
                    <span className="text-[10px] text-flux-text-dim normal-case italic font-normal">
                        {selectedAssigned.length} users selected
                    </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                    {users.map((u) => (
                        <button
                            key={u.uid}
                            type="button"
                            onClick={() => toggleUser(u.uid)}
                            className={`text-left p-3 rounded-xl text-xs truncate transition-all border ${selectedAssigned.includes(u.uid)
                                ? 'border-flux-red bg-flux-red/10 text-flux-white shadow-[0_0_10px_rgba(230,57,70,0.2)]'
                                : 'border-flux-black-border text-flux-gray hover:border-flux-gray bg-white/[0.02]'
                                }`}
                        >
                            <div className="font-bold">{u.displayName}</div>
                            <div className="text-[10px] opacity-60 truncate">{u.email}</div>
                        </button>
                    ))}
                </div>
                {errors.assignedTo && (
                    <p className="text-xs text-red-400 mt-1">{errors.assignedTo.message}</p>
                )}
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]">
                <input
                    id="calendarSync"
                    type="checkbox"
                    className="w-5 h-5 rounded-lg border-flux-black-border bg-flux-black-soft text-flux-red focus:ring-flux-red/20 transition-all cursor-pointer"
                    {...register('addToCalendar')}
                />
                <label htmlFor="calendarSync" className="flex-1 text-sm text-flux-white cursor-pointer select-none">
                    <div className="font-bold">Google Calendar Sync</div>
                    <div className="text-xs text-flux-gray">Add this task to your calendar automatically</div>
                </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={onCancel} className="px-6">
                    Cancel
                </Button>
                <Button type="submit" loading={isSubmitting} className="px-8 shadow-lg glow-red-subtle">
                    {task ? 'Update Task' : 'Create Task'}
                </Button>
            </div>
        </form>
    )
}
