import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import {
  User,
  Shield,
  Mail,
  KeyRound,
  Pencil,
  CalendarDays,
  PlugZap,
  Plug,
  Users,
} from 'lucide-react'
<<<<<<< HEAD
import { db } from '@/lib/firebase'
import { useAuthContext } from '@/context/AuthContext'
import { useUsers } from '@/hooks/useUsers'
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { FluxUser } from '@/types'
=======
import { db } from '../lib/firebase'
import { useAuthContext } from '../context/AuthContext'
import { useUsers } from '../hooks/useUsers'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import type { FluxUser } from '../types'
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name is required'),
})

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ProfileValues = z.infer<typeof profileSchema>
type PasswordValues = z.infer<typeof passwordSchema>

function ProfileSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="flux-card p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-flux-black-border">
        <Icon size={18} className="text-flux-red" />
        <h2 className="text-flux-white font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function Profile() {
  const { fluxUser, currentUser, updateDisplayName, changePassword, refreshFluxUser } = useAuthContext()
  const users = useUsers()
  const { isConnected, connectGoogleCalendar, disconnectGoogleCalendar } = useGoogleCalendar()
  const [editingName, setEditingName] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editingUserData, setEditingUserData] = useState<FluxUser | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  const isAdmin = fluxUser?.role === 'admin'

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileLoading },
    setValue: setProfileValue,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: fluxUser?.displayName || '' },
  })

  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors, isSubmitting: passLoading },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) })

  useEffect(() => {
    gsap.fromTo(pageRef.current?.children ? Array.from(pageRef.current.children) : [], { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }, [])

  const onSaveName = async (data: ProfileValues) => {
    await updateDisplayName(data.displayName)
    setProfileMsg('Name updated successfully!')
    setEditingName(false)
    setTimeout(() => setProfileMsg(''), 3000)
  }

  const onChangePass = async (data: PasswordValues) => {
    await changePassword(data.newPassword)
    setPassMsg('Password changed successfully!')
    setChangingPassword(false)
    resetPass()
    setTimeout(() => setPassMsg(''), 3000)
  }

  // Admin: load user data for editing
  const loadUserForEdit = async (uid: string) => {
    setSelectedUserId(uid)
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) setEditingUserData(snap.data() as FluxUser)
  }

  const saveUserEdit = async () => {
    if (!editingUserData) return
    await updateDoc(doc(db, 'users', editingUserData.uid), {
      displayName: editingUserData.displayName,
      role: editingUserData.role,
    })
    setSelectedUserId(null)
    setEditingUserData(null)
  }

  return (
    <div ref={pageRef} className="page-enter max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <User size={20} className="text-flux-red" />
        <h1 className="text-2xl font-black text-flux-white">Profile</h1>
      </div>

      {/* Identity card */}
      <div className="flux-card p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-flux-red rounded-2xl flex items-center justify-center glow-red-subtle flex-shrink-0">
            <span className="text-2xl font-black text-white">
              {fluxUser?.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-flux-white text-xl font-bold">{fluxUser?.displayName}</h2>
            <p className="text-flux-gray text-sm">{fluxUser?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {isAdmin ? (
                <Shield size={13} className="text-flux-red" />
              ) : (
                <User size={13} className="text-flux-gray" />
              )}
              <span className="text-xs font-semibold capitalize text-flux-gray">{fluxUser?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Display Name */}
      <ProfileSection title="Display Name" icon={Pencil}>
        {!editingName ? (
          <div className="flex items-center justify-between">
            <p className="text-flux-white font-medium">{fluxUser?.displayName}</p>
            <Button variant="secondary" size="sm" onClick={() => {
              setEditingName(true)
              setProfileValue('displayName', fluxUser?.displayName || '')
            }}>
              Edit
            </Button>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit(onSaveName)} className="space-y-3">
            <Input error={profileErrors.displayName?.message} {...regProfile('displayName')} />
            {profileMsg && <p className="text-green-400 text-sm">{profileMsg}</p>}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setEditingName(false)}>Cancel</Button>
              <Button size="sm" type="submit" loading={profileLoading}>Save</Button>
            </div>
          </form>
        )}
        {profileMsg && !editingName && <p className="text-green-400 text-sm">{profileMsg}</p>}
      </ProfileSection>

      {/* Email (read-only for users) */}
      <ProfileSection title="Email Address" icon={Mail}>
        <div className="flex items-center justify-between">
          <p className="text-flux-white font-medium">{fluxUser?.email}</p>
          {!isAdmin && <span className="text-flux-gray text-xs">Email cannot be changed</span>}
        </div>
      </ProfileSection>

      {/* Password */}
      <ProfileSection title="Change Password" icon={KeyRound}>
        {!changingPassword ? (
          <div className="flex items-center justify-between">
            <p className="text-flux-gray text-sm">••••••••••</p>
            <Button variant="secondary" size="sm" onClick={() => setChangingPassword(true)}>Change</Button>
          </div>
        ) : (
          <form onSubmit={handlePassSubmit(onChangePass)} className="space-y-3">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              error={passErrors.newPassword?.message}
              {...regPass('newPassword')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat new password"
              error={passErrors.confirmPassword?.message}
              {...regPass('confirmPassword')}
            />
            {passMsg && <p className="text-green-400 text-sm">{passMsg}</p>}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setChangingPassword(false)}>Cancel</Button>
              <Button size="sm" type="submit" loading={passLoading}>Update Password</Button>
            </div>
          </form>
        )}
        {passMsg && !changingPassword && <p className="text-green-400 text-sm">{passMsg}</p>}
      </ProfileSection>

      {/* Google Calendar */}
      <ProfileSection title="Google Calendar" icon={CalendarDays}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-flux-white text-sm font-medium">
              {isConnected ? 'Connected' : 'Not connected'}
            </p>
            <p className="text-flux-gray text-xs mt-0.5">
              {isConnected
                ? 'Your tasks sync with Google Calendar'
                : 'Connect to sync tasks with Google Calendar'}
            </p>
          </div>
          {isConnected ? (
            <Button variant="secondary" size="sm" onClick={disconnectGoogleCalendar} className="flex items-center gap-1.5">
              <PlugZap size={14} className="text-blue-400" />
              <span className="text-blue-400">Disconnect</span>
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={connectGoogleCalendar} className="flex items-center gap-1.5">
              <Plug size={14} />
              Connect
            </Button>
          )}
        </div>
      </ProfileSection>

      {/* Admin: Manage Users */}
      {isAdmin && (
        <ProfileSection title="All Users" icon={Users}>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.uid} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-flux-black-soft border border-flux-black-border hover:border-white/10 transition-all gap-4">
                {selectedUserId === u.uid && editingUserData ? (
                  <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                    <input
                      className="flux-input !cursor-text sm:flex-1"
                      value={editingUserData.displayName}
                      onChange={(e) => setEditingUserData({ ...editingUserData, displayName: e.target.value })}
                    />
                    <select
                      className="flux-input sm:w-32"
                      value={editingUserData.role}
                      onChange={(e) => setEditingUserData({ ...editingUserData, role: e.target.value as any })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button size="sm" onClick={saveUserEdit} className="flex-1 sm:flex-none">Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => { setSelectedUserId(null); setEditingUserData(null) }} className="flex-1 sm:flex-none">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-flux-red/20 rounded-xl flex items-center justify-center border border-flux-red/30 shadow-[0_0_15px_rgba(230,57,70,0.1)]">
                        <span className="text-sm font-black text-flux-red">{u.displayName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-flux-white font-bold leading-none mb-1">{u.displayName}</p>
                        <p className="text-flux-text-dim text-xs">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-auto sm:ml-0">
                      <span className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg border ${u.role === 'admin'
                          ? 'bg-flux-red/10 text-flux-red border-flux-red/30 shadow-[0_0_10px_rgba(230,57,70,0.2)]'
                          : 'bg-white/5 text-flux-gray border-white/5'
                        }`}>
                        {u.role}
                      </span>
                      <button
                        onClick={() => loadUserForEdit(u.uid)}
                        className="p-2 text-flux-text-dim hover:text-flux-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5"
                        title="Edit User"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ProfileSection>
      )}
    </div>
  )
}
