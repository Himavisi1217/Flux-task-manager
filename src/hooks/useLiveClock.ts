import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export function useLiveClock() {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    return {
        time: format(now, 'HH:mm:ss'),
        date: format(now, 'MMMM do, yyyy'),
        dayOfWeek: format(now, 'EEEE'),
        raw: now,
    }
}
