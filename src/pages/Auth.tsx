import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gsap } from 'gsap'
import { Zap, User, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { UserRole } from '@/types'

const ThreeBackground = lazy(() => import('@/components/three/ThreeBackground'))

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  adminCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [role, setRole] = useState<UserRole>('user')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const { login, signup } = useAuthContext()
  const navigate = useNavigate()
  const formRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginLoading },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: signupLoading },
    watch,
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) })

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }
    )
  }, [])

  const switchMode = (newMode: 'login' | 'signup') => {
    gsap.to(formRef.current, {
      opacity: 0,
      x: newMode === 'signup' ? -30 : 30,
      duration: 0.2,
      onComplete: () => {
        setMode(newMode)
        setAuthError('')
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: newMode === 'signup' ? 30 : -30 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        )
      },
    })
  }

  const onLogin = async (data: LoginFormData) => {
    try {
      setAuthError('')
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please try again.')
    }
  }

  const onSignup = async (data: SignupFormData) => {
    try {
      setAuthError('')
      await signup(data.email, data.password, data.displayName, role, data.adminCode)
      navigate('/dashboard')
    } catch (err: any) {
      setAuthError(err.message || 'Signup failed. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#181818] flex items-center justify-center overflow-hidden p-4">
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div ref={cardRef} className="relative z-10 w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="flex items-center gap-2 text-flux-gray hover:text-flux-white text-sm mb-6 transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="flux-card p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-flux-red rounded-xl flex items-center justify-center glow-red-subtle">
              <Zap size={20} className="!text-[#ffffff]" />
            </div>
            <div>
              <h1 className="text-flux-white font-bold text-xl">Flux</h1>
              <p className="text-flux-gray text-xs">always moving, always progressing</p>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex bg-flux-black-soft rounded-xl p-1 mb-6 border border-flux-black-border">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${
                  mode === m
                    ? 'bg-flux-red text-white shadow-lg'
                    : 'text-flux-gray hover:text-flux-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Role selector (signup only) */}
          {mode === 'signup' && (
            <div className="flex gap-3 mb-6">
              {([
                { value: 'user' as UserRole, icon: User, label: 'Team Member' },
                { value: 'admin' as UserRole, icon: Shield, label: 'Admin' },
              ]).map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setRole(value)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                    role === value
                      ? 'border-flux-red bg-flux-red/10 text-flux-white'
                      : 'border-flux-black-border text-flux-gray hover:border-flux-gray'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <div ref={formRef}>
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={loginErrors.email?.message}
                  {...registerLogin('email')}
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    error={loginErrors.password?.message}
                    {...registerLogin('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-flux-gray hover:text-flux-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {authError && <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">{authError}</p>}
                <Button type="submit" className="w-full mt-2" size="lg" loading={loginLoading}>
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Your name"
                  error={signupErrors.displayName?.message}
                  {...registerSignup('displayName')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={signupErrors.email?.message}
                  {...registerSignup('email')}
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Choose a password"
                    error={signupErrors.password?.message}
                    {...registerSignup('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-flux-gray hover:text-flux-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat your password"
                  error={signupErrors.confirmPassword?.message}
                  {...registerSignup('confirmPassword')}
                />
                {role === 'admin' && (
                  <Input
                    label="Admin Secret Code"
                    type="password"
                    placeholder="Enter admin code"
                    error={signupErrors.adminCode?.message}
                    {...registerSignup('adminCode')}
                  />
                )}
                {authError && <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">{authError}</p>}
                <Button type="submit" className="w-full mt-2" size="lg" loading={signupLoading}>
                  Create Account
                </Button>
              </form>
            )}
          </div>

          <p className="text-center text-flux-gray text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-flux-red hover:text-flux-red-light font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
