'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SKILL_GROUPS = [
  {
    label: 'Languages',
    color: 'var(--teal)',
    skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML / CSS'],
  },
  {
    label: 'AI & LLM',
    color: '#818CF8',
    skills: ['LLM Architecture', 'RAG', 'LangChain', 'Agentic Workflows', 'OpenAI API', 'LLM Fine-tuning', 'PyTorch'],
  },
  {
    label: 'Full-Stack',
    color: 'var(--teal-dark)',
    skills: ['React', 'Next.js', 'Flask', 'Supabase', 'API Integration'],
  },
  {
    label: 'Methods & Tools',
    color: 'var(--accent-terra)',
    skills: ['Agile', 'Rapid Prototyping', 'Database Design', 'System Architecture', 'Vibe Coding'],
  },
]

export default function SkillsWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Section header
      gsap.from('.skills-header', {
        opacity: 0,
        y: 6,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.15,
      })
      // Group labels stagger
      gsap.from('.skill-group-label', {
        opacity: 0,
        x: -6,
        stagger: 0.07,
        duration: 0.35,
        ease: 'power2.out',
        delay: 0.3,
      })
      // All tags scatter in — the signature animation: cloud assembles from below
      gsap.from('.skill-tag', {
        opacity: 0,
        y: 10,
        scale: 0.88,
        stagger: { amount: 0.55, from: 'start' },
        duration: 0.4,
        ease: 'back.out(1.4)',
        delay: 0.4,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="glass rounded-2xl p-5 fade-up space-y-4" style={{ animationDelay: '60ms' }}>
      <h2 className="skills-header text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
        Skills
      </h2>
      {SKILL_GROUPS.map(group => (
        <div key={group.label}>
          <p className="skill-group-label text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: group.color }}>
            {group.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.skills.map(s => (
              <span key={s}
                className="skill-tag text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors hover:border-opacity-60"
                style={{
                  background: 'rgba(132,156,146,0.12)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
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
