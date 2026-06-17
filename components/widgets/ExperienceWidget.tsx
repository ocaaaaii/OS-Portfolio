'use client'
import Image from 'next/image'
import { useState } from 'react'

const WORK = [
  {
    logo: '/itri.png',
    company: 'ITRI',
    role: 'Advanced SW Program',
    period: '2026.04 – Present',
    desc: 'AI / ML / DL / Image Processing / Vibe Coding',
    fallbackBg: '#3A7CA5',
  },
  {
    logo: '/tsmc.png',
    company: 'TSMC',
    role: 'Summer Intern',
    period: '2024.07 – 2024.09',
    desc: 'Full-stack Daily-Change Platform (Python + React); reduced RCA triage time',
    fallbackBg: '#C4845A',
  },
  {
    logo: '/Winbond.png',
    company: 'WINBOND',
    role: 'Summer Intern',
    period: '2023.07 – 2023.09',
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
  return (
    <div className="glass rounded-2xl p-5 fade-up space-y-4 overflow-y-auto" style={{ animationDelay: '120ms' }}>
      <div>
        <SectionLabel>Experience</SectionLabel>
        <div className="space-y-3">
          {WORK.map(w => (
            <div key={w.company} className="flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">
                <LogoBadge src={w.logo} alt={w.company} size={28} fallbackBg={w.fallbackBg} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                  {w.company}
                  <span className="font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{w.role}</span>
                </p>
                <p className="text-[10px]" style={{ color: 'var(--teal)' }}>{w.period}</p>
                <p className="text-[10px] leading-snug mt-0.5" style={{ color: 'var(--text-secondary)' }}>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Education</SectionLabel>
        <div className="space-y-2.5">
          {EDU.map((e, i) => (
            <div key={i} className="flex items-start gap-2.5">
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
