import React from 'react'

interface BadgeProps {
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'red' | 'gray' | 'blue' | 'green' | 'yellow'
}

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
    const variants = {
        default: 'bg-white/5 text-flux-gray border-white/10',
        red: 'bg-flux-red/10 text-flux-red border-flux-red/20',
        gray: 'bg-white/10 text-flux-text-muted border-white/10',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        green: 'bg-green-500/10 text-green-400 border-green-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    }

    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}

export function PriorityBadge({ priority }: { priority: string }) {
    switch (priority) {
        case 'critical':
            return <Badge variant="red">Critical</Badge>
        case 'high':
            return <Badge variant="yellow">High</Badge>
        case 'medium':
            return <Badge variant="blue">Medium</Badge>
        case 'low':
            return <Badge variant="gray">Low</Badge>
        default:
            return <Badge>{priority}</Badge>
    }
}

export function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'completed':
            return <Badge variant="green">Completed</Badge>
        case 'in-progress':
            return <Badge variant="blue">In Progress</Badge>
        case 'todo':
            return <Badge variant="gray">To Do</Badge>
        default:
            return <Badge>{status}</Badge>
    }
}
