import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { FluxUser, UserRole } from '../types'

interface AuthContextType {
  currentUser: FirebaseUser | null
  fluxUser: FluxUser | null
  loading: boolean
  login: (email: string, pass: string) => Promise<void>
  signup: (email: string, pass: string, name: string, role: UserRole, adminCode?: string) => Promise<void>
  logout: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
  changePassword: (newPass: string) => Promise<void>
  refreshFluxUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [fluxUser, setFluxUser] = useState<FluxUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchFluxUser = async (uid: string) => {
    const docRef = doc(db, 'users', uid)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      setFluxUser({ uid, ...snap.data() } as FluxUser)
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchFluxUser(user.uid)
      } else {
        setFluxUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass)
  }

  const signup = async (email: string, pass: string, name: string, role: UserRole, adminCode?: string) => {
    if (role === 'admin') {
      const secret = import.meta.env.VITE_ADMIN_SECRET_CODE
      if (adminCode !== secret) {
        throw new Error('Invalid Admin Secret Code')
      }
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, pass)
    await updateProfile(user, { displayName: name })

    const newUser: any = {
      uid: user.uid,
      email,
      displayName: name,
      role,
      createdAt: serverTimestamp(),
      googleCalendarConnected: false,
    }

    await setDoc(doc(db, 'users', user.uid), newUser)
    setFluxUser({ ...newUser, uid: user.uid })
  }

  const logout = async () => {
    await signOut(auth)
  }

  const updateDisplayName = async (name: string) => {
    if (!currentUser) return
    await updateProfile(currentUser, { displayName: name })
    await updateDoc(doc(db, 'users', currentUser.uid), { displayName: name })
    setFluxUser(prev => prev ? { ...prev, displayName: name } : null)
  }

  const changePassword = async (newPass: string) => {
    if (!currentUser) return
    await updatePassword(currentUser, newPass)
  }

  const refreshFluxUser = async () => {
    if (currentUser) await fetchFluxUser(currentUser.uid)
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      fluxUser,
      loading,
      login,
      signup,
      logout,
      updateDisplayName,
      changePassword,
      refreshFluxUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be used within AuthProvider')
  return context
}
