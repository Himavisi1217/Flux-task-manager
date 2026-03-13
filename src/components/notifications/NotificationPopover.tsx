import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { format } from 'date-fns'
import { Bell, Check, Trash2, X, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { Button } from '../ui/Button'

export default function NotificationPopover({ onClose }: { onClose: () => void }) {
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
    const popoverRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.fromTo(popoverRef.current,
            { opacity: 0, y: -10, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
        )

        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-400" size={16} />
            case 'warning': return <AlertTriangle className="text-yellow-400" size={16} />
            case 'error': return <AlertCircle className="text-red-400" size={16} />
            default: return <Info className="text-blue-400" size={16} />
        }
    }

    return (
        <div
            ref={popoverRef}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-flux-black-card border border-flux-black-border rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[500px]"
        >
            <div className="p-4 border-b border-flux-black-border flex items-center justify-between bg-flux-black-card/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-flux-red" />
                    <h3 className="text-flux-white font-bold">Notifications</h3>
                </div>
                <div className="flex items-center gap-2">
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={() => markAllAsRead()}
                            className="text-[10px] uppercase tracking-widest font-bold text-flux-red hover:text-flux-red-light transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                    <button onClick={onClose} className="p-1 text-flux-gray hover:text-flux-white rounded-lg hover:bg-white/5">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                        <Bell size={32} className="text-flux-black-border mx-auto mb-3" />
                        <p className="text-flux-gray text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-flux-black-border">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-4 hover:bg-white/[0.02] transition-colors group relative ${!n.read ? 'bg-flux-red/[0.02]' : ''}`}
                                onClick={() => !n.read && markAsRead(n.id)}
                            >
                                {!n.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-flux-red" />
                                )}
                                <div className="flex gap-3">
                                    <div className="mt-1">{getIcon(n.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className={`text-sm font-bold truncate ${!n.read ? 'text-flux-white' : 'text-flux-text-muted'}`}>
                                                {n.title}
                                            </h4>
                                            <span className="text-[10px] text-flux-text-dim flex-shrink-0 whitespace-nowrap">
                                                {n.createdAt?.toDate ? format(n.createdAt.toDate(), 'HH:mm') : 'Recently'}
                                            </span>
                                        </div>
                                        <p className={`text-xs mt-1 leading-relaxed ${!n.read ? 'text-flux-text-muted' : 'text-flux-text-dim'}`}>
                                            {n.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!n.read && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); markAsRead(n.id) }}
                                            className="p-1.5 text-flux-text-dim hover:text-green-400 rounded-lg hover:bg-white/5 transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id) }}
                                        className="p-1.5 text-flux-text-dim hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="p-3 bg-flux-black-card/80 border-t border-flux-black-border text-center">
                    <p className="text-[10px] text-flux-text-dim uppercase tracking-widest font-medium">
                        Showing last {notifications.length} notifications
                    </p>
                </div>
            )}
        </div>
    )
}
