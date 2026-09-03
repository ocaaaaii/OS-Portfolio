'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useSiteData } from '@/contexts/SiteDataContext'

function LogoBadge({ src, alt, size, fallbackBg }: { src: string; alt: string; size: number; fallbackBg: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className="rounded flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size, background: fallbackBg, fontSize: size * 0.42, flexShrink: 0 }}>
        {alt[0]}
      </div>
    )
  }
  return (
    <Image src={src} alt={alt} width={size} height={size}
      className="object-contain rounded" onError={() => setFailed(true)} />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  )
}

export default function ExperienceWidget() {
  const { workEntries, eduEntries, loading } = useSiteData()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading || (workEntries.length === 0 && eduEntries.length === 0) || !containerRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.exp-section-label', { y: 5, stagger: 0.12, duration: 0.4, ease: 'power2.out', delay: 0.2, clearProps: 'y' })
      gsap.from('.work-entry', { x: -12, stagger: 0.1, duration: 0.45, ease: 'power3.out', delay: 0.35, clearProps: 'x' })
      gsap.from('.edu-entry',  { x: -12, stagger: 0.09, duration: 0.4,  ease: 'power2.out', delay: 0.85, clearProps: 'x' })
    }, containerRef)
    return () => ctx.revert()
  }, [loading, workEntries, eduEntries])

  if (loading && workEntries.length === 0) {
    return <div className="glass rounded-2xl p-5 fade-up h-64 animate-pulse" style={{ animationDelay: '120ms' }} />
  }

  return (
    <div ref={containerRef} className="glass rounded-2xl p-5 fade-up space-y-4 overflow-y-auto h-full" style={{ animationDelay: '120ms' }}>
      <div>
        <SectionLabel><span className="exp-section-label">Experience</span></SectionLabel>
        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[13px] top-5 bottom-3 w-px pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, var(--teal-light), var(--glass-border) 80%, transparent)' }} />
          <div className="space-y-3">
            {workEntries.map(w => (
              <div key={w.id} className="work-entry flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5 relative z-10">
                  <LogoBadge src={w.logoPath} alt={w.company} size={28} fallbackBg={w.fallbackBg} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {w.company}
                      <span className="font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{w.role}</span>
                    </p>
                    {w.isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: 'rgba(150,177,205,0.22)', color: '#6A92B5' }}>● NOW</span>
                    )}
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--teal)' }}>{w.period}</p>
                  <p className="text-[10px] leading-snug mt-0.5" style={{ color: 'var(--text-secondary)' }}>{w.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionLabel><span className="exp-section-label">Education</span></SectionLabel>
        <div className="space-y-2.5">
          {eduEntries.map(e => (
            <div key={e.id} className="edu-entry flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">
                <LogoBadge src={e.logoPath} alt={e.school} size={22} fallbackBg={e.fallbackBg} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{e.degree}</p>
                <p className="text-[10px]" style={{ color: 'var(--teal)' }}>{e.period} · {e.gpa}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
