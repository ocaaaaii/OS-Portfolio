'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

const WORK = [
  {
    logo: '/Heph.png',
    company: 'Heph.AI',
    role: 'AI Engineer',
    period: '2026.08 – Present',
    desc: 'Building LLM & Agentic platforms; RAG pipelines, GenAI product development',
    fallbackBg: '#4F46E5',
    isCurrent: true,
  },
  {
    logo: '/itri.png',
    company: 'ITRI',
    role: 'Full-Stack Dev & Lead UI/UX',
    period: '2026.04 – 2026.07',
    desc: 'AI Parenting Navigator Platform — Led full-stack development & end-to-end UI/UX design',
    fallbackBg: '#3A7CA5',
  },
  {
    logo: '/tsmc.png',
    company: 'TSMC',
    role: 'Summer Intern',
    period: '2024.07 – 2024.08',
    desc: 'Full-stack Daily-Change Platform (Python + React); reduced RCA triage time',
    fallbackBg: '#C4845A',
  },
  {
    logo: '/Winbond.png',
    company: 'WINBOND',
    role: 'Summer Intern',
    period: '2023.07 – 2023.08',
    desc: 'Enterprise Data Dictionary UI — 3rd Place at symposium',
    fallbackBg: '#849C92',
  },
]

const EDU = [
  {
    logo: '/NSYSU.png',
    school: 'NSYSU',
    degree: 'MS Information Management',
    period: '2023.09 – 2025.12',
    gpa: 'GPA 3.98',
    fallbackBg: '#9B84C4',
  },
  {
    logo: '/NSYSU.png',
    school: 'NSYSU',
    degree: 'BS Information Management',
    period: '2019.09 – 2023.06',
    gpa: 'GPA 3.82',
    fallbackBg: '#9B84C4',
  },
]

function LogoBadge({ src, alt, size, fallbackBg }: { src: string; alt: string; size: number; fallbackBg: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div
        className="rounded flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size, background: fallbackBg, fontSize: size * 0.42, flexShrink: 0 }}
      >
        {alt[0]}
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain rounded"
      onError={() => setFailed(true)}
    />
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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Section labels
      gsap.from('.exp-section-label', {
        opacity: 0,
        y: 5,
        stagger: 0.12,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.2,
      })
      // Work entries slide in from left with stagger — timeline reveal
      gsap.from('.work-entry', {
        opacity: 0,
        x: -12,
        stagger: 0.1,
        duration: 0.45,
        ease: 'power3.out',
        delay: 0.35,
      })
      // Edu entries after work
      gsap.from('.edu-entry', {
        opacity: 0,
        x: -12,
        stagger: 0.09,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.85,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="glass rounded-2xl p-5 fade-up space-y-4 overflow-y-auto" style={{ animationDelay: '120ms' }}>
      <div>
        <SectionLabel><span className="exp-section-label">Experience</span></SectionLabel>
        <div className="space-y-3">
          {WORK.map(w => (
            <div key={w.company + w.period} className="work-entry flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">
                <LogoBadge src={w.logo} alt={w.company} size={28} fallbackBg={w.fallbackBg} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {w.company}
                    <span className="font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{w.role}</span>
                  </p>
                  {w.isCurrent && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8' }}
                    >
                      ● NOW
                    </span>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: 'var(--teal)' }}>{w.period}</p>
                <p className="text-[10px] leading-snug mt-0.5" style={{ color: 'var(--text-secondary)' }}>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel><span className="exp-section-label">Education</span></SectionLabel>
        <div className="space-y-2.5">
          {EDU.map((e, i) => (
            <div key={i} className="edu-entry flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">
                <LogoBadge src={e.logo} alt={e.school} size={22} fallbackBg={e.fallbackBg} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {e.degree}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--teal)' }}>{e.period} · {e.gpa}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
