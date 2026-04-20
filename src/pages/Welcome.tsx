import { useEffect, useRef, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRight, Zap } from 'lucide-react'
<<<<<<< HEAD
import LiveClock from '@/components/clock/LiveClock'

const ThreeBackground = lazy(() => import('@/components/three/ThreeBackground'))
=======
import LiveClock from '../components/clock/LiveClock'

const ThreeBackground = lazy(() => import('../components/three/ThreeBackground'))
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb

export default function Welcome() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.welcome-clock', { opacity: 0, y: -20, duration: 0.6 })
        .from('.welcome-logo', { opacity: 0, y: 60, duration: 0.9 }, '-=0.3')
        .from('.welcome-tagline', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
        .from('.welcome-feature', {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.12,
        }, '-=0.3')
        .fromTo('.welcome-btn', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.2')
        .from('.welcome-sub', { opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.welcome-footer', { opacity: 0, duration: 0.4 }, '-=0.2')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleBegin = () => {
    gsap.to('.welcome-content', {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => navigate('/auth'),
    })
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#181818] overflow-hidden flex flex-col">
      {/* Three.js background - behind everything */}
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>

      {/* Dark overlay so text is always readable over the 3D scene */}
      <div className="absolute inset-0 z-[1] bg-black/40" />

      {/* Clock - top right */}
      <div className="welcome-clock absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <LiveClock variant="welcome" />
      </div>

      {/* Main content */}
      <div className="welcome-content relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Logo icon */}
        <div className="welcome-logo">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-flux-red rounded-2xl flex items-center justify-center glow-red">
              <Zap size={32} style={{ color: '#ffffff' }} />
            </div>
          </div>

          {/* Title */}
          <h1 style={{ color: '#ffffff' }} className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-4 leading-none drop-shadow-lg">
            Flux
          </h1>

          {/* Red accent line */}
          <div className="w-24 h-1 bg-flux-red mx-auto mb-6 rounded-full glow-red" />
        </div>

        {/* Slogan */}
        <p style={{ color: 'rgba(255,255,255,0.8)' }} className="welcome-tagline text-xl md:text-2xl font-light tracking-wide mb-12 max-w-lg drop-shadow-md">
          always moving, always progressing
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {[
            'Task Management',
            'Team Collaboration',
            'Calendar Sync',
            'Real-time Updates',
          ].map((f) => (
            <span
              key={f}
              style={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)' }}
              className="welcome-feature px-4 py-1.5 rounded-full border text-sm backdrop-blur-sm"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Begin button */}
        <button
          onClick={handleBegin}
          style={{ color: '#ffffff' }}
          className="welcome-btn group flex items-center gap-3 bg-flux-red hover:bg-flux-red-dark font-semibold text-lg px-10 py-4 rounded-2xl glow-red transition-all duration-300 hover:gap-5 hover:scale-105"
        >
          Begin
          <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <p style={{ color: 'rgba(255,255,255,0.5)' }} className="welcome-sub mt-5 text-sm">
          Sign in or create your account to get started
        </p>
      </div>

      {/* Bottom bar */}
      <div className="welcome-footer relative z-20 text-center pb-6">
        <p style={{ color: 'rgba(255,255,255,0.3)' }} className="text-xs tracking-widest uppercase">
          Flux &copy; {new Date().getFullYear()} &mdash; Task Management Platform
        </p>
      </div>
    </div>
  )
}
