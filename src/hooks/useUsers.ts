import { useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useTaskStore } from '../store/taskStore'
import type { FluxUser } from '../types'

export function useUsers() {
  const { users, setUsers } = useTaskStore()

  useEffect(() => {
    const q = query(collection(db, 'users'))
    const unsub = onSnapshot(q, (snap) => {
      const all: FluxUser[] = snap.docs.map((d) => d.data() as FluxUser)
      setUsers(all)
    })
    return unsub
  }, [])

  return users
}
