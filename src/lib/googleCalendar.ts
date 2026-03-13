// Google Calendar API integration
// This module handles OAuth 2.0 flow and Calendar API calls via gapi

declare global {
  interface Window {
    gapi: any
    google: any
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/calendar'

let gapiInited = false
let gisInited = false
let tokenClient: any = null

export function loadGapiScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.gapi) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = async () => {
      await new Promise<void>((res) => window.gapi.load('client', res))
      await window.gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] })
      gapiInited = true
      resolve()
    }
    document.body.appendChild(script)
  })
}

export function loadGisScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.accounts) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      gisInited = true
      resolve()
    }
    document.body.appendChild(script)
  })
}

export function initGoogleCalendar(): Promise<void> {
  return Promise.all([loadGapiScript(), loadGisScript()]).then(() => {})
}

export function createTokenClient(callback: (token: string) => void): void {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: any) => {
      if (response.error) return
      callback(response.access_token)
    },
  })
}

export function requestGoogleCalendarAccess(): void {
  if (!tokenClient) throw new Error('Token client not initialized')
  tokenClient.requestAccessToken({ prompt: 'consent' })
}

export async function listGoogleCalendarEvents(
  accessToken: string,
  timeMin?: string,
  timeMax?: string
): Promise<any[]> {
  try {
    window.gapi.client.setToken({ access_token: accessToken })
    const response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax,
      showDeleted: false,
      singleEvents: true,
      maxResults: 100,
      orderBy: 'startTime',
    })
    return response.result.items || []
  } catch {
    return []
  }
}

export async function createGoogleCalendarEvent(
  accessToken: string,
  event: {
    title: string
    description?: string
    startDate: Date
    endDate?: Date
  }
): Promise<string | null> {
  try {
    window.gapi.client.setToken({ access_token: accessToken })
    const endDate = event.endDate || new Date(event.startDate.getTime() + 60 * 60 * 1000)
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: `[Flux] ${event.title}`,
        description: event.description || '',
        start: { dateTime: event.startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
      },
    })
    return response.result.id || null
  } catch {
    return null
  }
}

export async function deleteGoogleCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  try {
    window.gapi.client.setToken({ access_token: accessToken })
    await window.gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId,
    })
  } catch {
    // Event may already be deleted
  }
}

export async function updateGoogleCalendarEvent(
  accessToken: string,
  eventId: string,
  updates: { title?: string; startDate?: Date; endDate?: Date }
): Promise<void> {
  try {
    window.gapi.client.setToken({ access_token: accessToken })
    const patch: any = {}
    if (updates.title) patch.summary = `[Flux] ${updates.title}`
    if (updates.startDate) patch.start = { dateTime: updates.startDate.toISOString() }
    if (updates.endDate) patch.end = { dateTime: updates.endDate.toISOString() }
    await window.gapi.client.calendar.events.patch({
      calendarId: 'primary',
      eventId,
      resource: patch,
    })
  } catch {
    // Silent fail
  }
}
