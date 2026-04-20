import { useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
<<<<<<< HEAD
import { db } from '@/lib/firebase'
import { useTaskStore } from '@/store/taskStore'
import type { FluxUser } from '@/types'
=======
import { db } from '../lib/firebase'
import { useTaskStore } from '../store/taskStore'
import type { FluxUser } from '../types'
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb

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
