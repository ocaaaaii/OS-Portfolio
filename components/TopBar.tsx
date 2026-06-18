'use client'
import { useState, useEffect } from 'react'
import { useWindowManager } from '@/contexts/WindowManagerContext'

function scrollToSection(sectionId: string) {
  const container = document.getElementById('desktop-scroll')
  const target = document.getElementById(sectionId)
  if (container && target) {
    container.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' })
  }
}

export default function TopBar() {
  const [time, setTime] = useState('')
  const { openWindow } = useWindowManager()

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const navItems: { label: string; action: () => void }[] = [
    { label: 'Projects',   action: () => scrollToSection('section-projects') },
    { label: 'Skills',     action: () => scrollToSection('section-widgets') },
    { label: 'Experience', action: () => scrollToSection('section-widgets') },
    { label: 'Contact',    action: () => openWindow({ id: 'contact', type: 'contact', title: 'Contact Me' }) },
  ]

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-2"
      style={{
        background: 'rgba(226,213,197,0.80)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(106,152,150,0.20)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--teal-dark)' }}>
          CA&apos;s OS
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(106,152,150,0.20)', color: 'var(--teal)' }}>
          v1.0.0
        </span>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {navItems.map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-lg transition-all hover:opacity-100 opacity-70"
            style={{
              color: 'var(--text-secondary)',
              background: 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(132,156,146,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {label}
          </button>
        ))}
      </div>

      <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--text-secondary)' }}>
        {time}
      </span>
    </div>
  )
}
