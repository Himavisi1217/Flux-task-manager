import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentUser, fluxUser, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-flux-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-flux-red border-t-transparent rounded-full animate-spin" />
          <span className="text-flux-gray text-sm font-mono">Loading Flux...</span>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }

  if (requiredRole && fluxUser && fluxUser.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
