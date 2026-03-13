import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
  Bell,
} from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { useThemeContext } from '../../context/ThemeContext'
import { useNotifications } from '../../hooks/useNotifications'
import NotificationPopover from '../notifications/NotificationPopover'

const ThreeBackground = React.lazy(() => import('../three/ThreeBackground'))

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, fluxUser } = useAuthContext()
  const { theme, toggleTheme } = useThemeContext()
  const { unreadCount } = useNotifications()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifsOpen, setNotifsOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  if (fluxUser?.role === 'admin') {
    navItems.push({ label: 'Manage', path: '/manage', icon: Settings })
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex h-screen bg-flux-black-soft overflow-hidden transition-colors duration-300 relative">
      {/* Global 3D Background */}
      <React.Suspense fallback={null}>
        <ThreeBackground />
      </React.Suspense>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-flux-black-card border-r border-flux-black-border transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
            <div className="w-8 h-8 bg-flux-red rounded-lg flex items-center justify-center glow-red-subtle group-hover:scale-110 transition-transform">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-black text-flux-white tracking-tight">Flux</span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive(item.path)
                  ? 'bg-flux-red text-white shadow-lg glow-red-subtle translate-x-1'
                  : 'text-flux-gray hover:text-flux-white hover:bg-white/5'
                  }`}
              >
                <item.icon size={18} className={isActive(item.path) ? 'animate-pulse' : ''} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Profile/Logout */}
          <div className="mt-auto pt-6 border-t border-flux-black-border space-y-2">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-8 h-8 bg-flux-red/20 rounded-lg flex items-center justify-center border border-flux-red/30 flex-shrink-0 animate-float">
                <span className="text-xs font-bold text-flux-red">{fluxUser?.displayName?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-flux-white truncate">{fluxUser?.displayName}</p>
                <p className="text-[10px] text-flux-gray truncate capitalize">{fluxUser?.role}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 text-flux-gray hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="font-semibold text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 transition-all duration-500">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-flux-black-border bg-flux-black-card backdrop-blur-xl z-30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-flux-gray hover:text-flux-white lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs font-bold text-flux-text-dim uppercase tracking-widest animate-fade-in">
                {location.pathname === '/' ? 'Welcome' : location.pathname.substring(1)}
              </span>
            </div>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-6 h-6 bg-flux-red rounded-md flex items-center justify-center glow-red-subtle">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-black text-flux-white">Flux</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-flux-gray hover:text-flux-white rounded-xl hover:bg-white/5 transition-all border border-white/5 hover:border-white/10"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifsOpen(!notifsOpen)}
                className={`p-2.5 text-flux-gray hover:text-flux-white rounded-xl hover:bg-white/5 transition-all border border-white/5 hover:border-white/10 relative ${notifsOpen ? 'bg-white/5 border-white/10' : ''}`}
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-flux-red text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-flux-black-card animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifsOpen && (
                <NotificationPopover onClose={() => setNotifsOpen(false)} />
              )}
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
