import { useState, useEffect, useRef } from 'react'
import {
    initGoogleCalendar,
    createTokenClient,
    requestGoogleCalendarAccess,
    listGoogleCalendarEvents,
    createGoogleCalendarEvent,
    deleteGoogleCalendarEvent,
    updateGoogleCalendarEvent
} from '../lib/googleCalendar'

export function useGoogleCalendar() {
    const [isConnected, setIsConnected] = useState(false)
    const [googleEvents, setGoogleEvents] = useState<any[]>([])
    const [syncing, setSyncing] = useState(false)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [initError, setInitError] = useState<string | null>(null)
    const initPromiseRef = useRef<Promise<void> | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('google_access_token')
        if (storedToken) {
            setAccessToken(storedToken)
            setIsConnected(true)
        }

        initPromiseRef.current = initGoogleCalendar()
            .then(() => {
                createTokenClient((token) => {
                    setAccessToken(token)
                    setIsConnected(true)
                    localStorage.setItem('google_access_token', token)
                })
            })
            .catch((err) => {
                setInitError(err?.message || 'Failed to load Google Calendar')
            })
    }, [])

    const connectGoogleCalendar = async () => {
        try {
            if (initPromiseRef.current) {
                await initPromiseRef.current
            }
            requestGoogleCalendarAccess()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to connect'
            console.error('Failed to connect to Google Calendar:', error)
            setInitError(message)
        }
    }

    const disconnectGoogleCalendar = () => {
        setIsConnected(false)
        setAccessToken(null)
        setGoogleEvents([])
        localStorage.removeItem('google_access_token')
    }

    const fetchGoogleEvents = async (timeMin?: string, timeMax?: string) => {
        if (!accessToken) return
        setSyncing(true)
        try {
            const events = await listGoogleCalendarEvents(accessToken, timeMin, timeMax)
            setGoogleEvents(events.map(event => ({
                id: event.id,
                title: event.summary,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                extendedProps: {
                    source: 'google'
                }
            })))
        } catch (error) {
            console.error('Error fetching Google events:', error)
        } finally {
            setSyncing(false)
        }
    }

    const addEvent = async (event: { title: string; description?: string; startDate: Date; endDate?: Date }) => {
        if (!accessToken) return null
        return await createGoogleCalendarEvent(accessToken, event)
    }

    const removeEvent = async (eventId: string) => {
        if (!accessToken) return
        await deleteGoogleCalendarEvent(accessToken, eventId)
    }

    const updateEvent = async (eventId: string, updates: { title?: string; startDate?: Date; endDate?: Date }) => {
        if (!accessToken) return
        await updateGoogleCalendarEvent(accessToken, eventId, updates)
    }

    return {
        isConnected,
        googleEvents,
        syncing,
        initError,
        connectGoogleCalendar,
        disconnectGoogleCalendar,
        fetchGoogleEvents,
        addEvent,
        removeEvent,
        updateEvent
    }
}
