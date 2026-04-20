<<<<<<< HEAD
import React from 'react';

export default function LiveClock() {
  return <span>00:00:00</span>;
}
=======
import React from 'react'

interface LiveClockProps {
  variant?: 'welcome' | 'default'
}

export default function LiveClock({ variant = 'default' }: LiveClockProps) {
  return <span>00:00:00</span>
}
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb
