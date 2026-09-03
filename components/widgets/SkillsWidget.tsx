'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useSiteData } from '@/contexts/SiteDataContext'

export default function SkillsWidget() {
  const { skillGroups, loading } = useSiteData()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading || skillGroups.length === 0 || !containerRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.skills-header',      { y: 6, duration: 0.4, ease: 'power2.out', delay: 0.15, clearProps: 'y' })
      gsap.from('.skill-group-label',  { x: -6, stagger: 0.07, duration: 0.35, ease: 'power2.out', delay: 0.3, clearProps: 'x' })
      gsap.from('.skill-tag', {
        y: 10, scale: 0.88, stagger: { amount: 0.55, from: 'start' },
        duration: 0.4, ease: 'back.out(1.4)', delay: 0.4, clearProps: 'y,scale',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [loading, skillGroups])

  if (loading && skillGroups.length === 0) {
    return <div className="glass rounded-2xl p-5 fade-up h-64 animate-pulse" style={{ animationDelay: '60ms' }} />
  }

  return (
    <div ref={containerRef} className="glass rounded-2xl p-5 fade-up space-y-4 h-full" style={{ animationDelay: '60ms' }}>
      <h2 className="skills-header text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
        Skills
      </h2>
      {skillGroups.map(group => (
        <div key={group.id}>
          <p className="skill-group-label text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: group.color }}>
            {group.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.skills.map(s => (
              <span key={s} className="skill-tag text-[10px] px-2 py-0.5 rounded-full font-medium transition-transform hover:scale-105"
                style={{
                  background: `${group.color}18`,
                  border: `1px solid ${group.color}40`,
                  color: group.color,
                }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
