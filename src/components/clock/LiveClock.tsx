import React from 'react'

interface LiveClockProps {
  variant?: 'welcome' | 'default'
}

export default function LiveClock({ variant = 'default' }: LiveClockProps) {
  return <span>00:00:00</span>
}
