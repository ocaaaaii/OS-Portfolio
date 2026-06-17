import os

BASE = r'C:\Users\ACER\Documents\Claude\Projects\OS-Style-Portfolio'

def write(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print(f'  wrote: {rel}')

# ── SkillsWidget.tsx ──────────────────────────────────────────────────────────
write('components/widgets/SkillsWidget.tsx', """\
'use client'

const SKILL_GROUPS = [
  {
    label: 'Languages',
    color: 'var(--teal)',
    skills: ['Python', 'JavaScript', 'SQL', 'Java', 'HTML / CSS'],
  },
  {
    label: 'Data & AI',
    color: 'var(--accent-terra)',
    skills: ['PyTorch', 'LangChain', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'OpenCV'],
  },
  {
    label: 'Web',
    color: 'var(--teal-dark)',
    skills: ['React', 'Flask', 'Full-Stack Architecture'],
  },
  {
    label: 'Tools',
    color: 'var(--accent-rose)',
    skills: ['Git', 'Agile Development', 'Database Design', 'Vibe Coding'],
  },
]

export default function SkillsWidget() {
  return (
    <div className="glass rounded-2xl p-5 fade-up space-y-4" style={{ animationDelay: '60ms' }}>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
        Skills
      </h2>
      {SKILL_GROUPS.map(group => (
        <div key={group.label}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: group.color }}>
            {group.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.skills.map(s => (
              <span key={s}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
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
""")

# ── ExperienceWidget.tsx ──────────────────────────────────────────────────────
write('components/widgets/ExperienceWidget.tsx', """\
'use client'
import Image from 'next/image'

const WORK = [
  {
    logo: '/itri.png',
    company: 'ITRI',
    role: 'Advanced SW Program',
    period: '2026.04 – Present',
    desc: 'ML / DL / Image Processing / Vibe Coding',
  },
  {
    logo: '/tsmc.png',
    company: 'TSMC',
    role: 'Summer Intern',
    period: '2024.07 – 2024.09',
    desc: 'Full-stack Daily-Change Platform (Python + React); reduced RCA triage time',
  },
  {
    logo: '/Winbond.png',
    company: 'WINBOND',
    role: 'Summer Intern',
    period: '2023.07 – 2023.09',
    desc: 'Enterprise Data Dictionary UI — 3rd Place at symposium',
  },
]

const EDU = [
  {
    logo: '/NSYSU.png',
    school: 'NSYSU',
    degree: 'MS Information Management',
    period: '2023.09 – 2025.12',
    gpa: 'GPA 3.98',
  },
  {
    logo: '/NSYSU.png',
    school: 'NSYSU',
    degree: 'BS Information Management',
    period: '2019.09 – 2023.06',
    gpa: 'GPA 3.82',
  },
]

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
                <Image src={w.logo} alt={w.company} width={28} height={28}
                  className="object-contain rounded" />
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
                <Image src={e.logo} alt={e.school} width={22} height={22}
                  className="object-contain rounded" />
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
""")

# ── ReadmeContent.tsx ─────────────────────────────────────────────────────────
write('components/ReadmeContent.tsx', """\
export default function ReadmeContent() {
  return (
    <div className="p-7 overflow-y-auto h-full space-y-5" style={{ color: 'var(--text-primary)' }}>
      <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
          style={{ background: 'var(--accent-terra)', color: '#fff' }}>
          .txt
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-wide">readme.txt</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last modified: June 2026</p>
        </div>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          About Me
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Hi! I&#39;m <strong style={{ color: 'var(--text-primary)' }}>Joanne Wu (吴矬An)</strong> — a High-achieving Information Management MS
          (GPA 3.98) with full-stack development experience at{' '}
          <strong style={{ color: 'var(--text-primary)' }}>TSMC</strong> and advanced AI training at{' '}
          <strong style={{ color: 'var(--text-primary)' }}>ITRI</strong>.
          Proven track record of bridging business-tech gaps and managing 200+ participant field experiments.
          Seeking a Software Engineer or Technical PM role to deliver scalable, user-centric enterprise solutions.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Thesis
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Research on the <em>Impact of Generative AI Conversational Systems on Elderly Well-being</em>.
          Orchestrated a 3-month field experiment partnering with 7 community centers and 200+ elderly participants
          for a 3-week technology trial — proving GenAI&#39;s significant positive impact on emotional well-being.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Fun Facts
        </h3>
        <ul className="text-sm space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
          <li>&#9749;&#65039;  Coffee is non-negotiable — so are side-projects</li>
          <li>&#9992;&#65039;  3 months immersion study in San Francisco — TOEIC 800, CEFR B2+</li>
          <li>&#127925;  Music + dancing are my reset between coding sessions</li>
          <li>&#127758;  English (Fluent) &#183; Mandarin (Native) &#183; Japanese (Conversational)</li>
          <li>&#129302;  Currently deep in ML / DL / Image Processing at ITRI</li>
        </ul>
      </section>

      <p className="text-xs italic pt-2" style={{ color: 'var(--text-muted)' }}>
        — Open to Software Engineer &amp; Technical PM roles —
      </p>
    </div>
  )
}
""")

# ── Terminal.tsx ──────────────────────────────────────────────────────────────
write('components/Terminal.tsx', """\
'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'

const HELP_TEXT = `Available commands:
  help        show this list
  whoami      about Joanne
  skills      tech stack
  projects    side projects
  experience  work history
  contact     get in touch
  clear       clear terminal`

const SKILLS_TEXT = `Languages    : Python  JavaScript  SQL  Java  HTML/CSS
Data & AI    : PyTorch  LangChain  Scikit-learn  Pandas  NumPy  Matplotlib  OpenCV
Web          : React  Flask  Full-Stack Architecture
Tools        : Git  Agile  Database Design  Vibe Coding
Competencies : Data Ingestion  Rapid Prototyping  Timeline Mgmt  Cross-functional Comms`

const PROJECTS_TEXT = `[1] Mochi Habit    — habit tracking & self-growth app
         https://mochiselfgrowingapp.vercel.app
[2] StockPlatform  — AI-powered stock analysis dashboard
         https://stockplatform-rp6tf42ln2k8qfcztevgvy.streamlit.app
[3] Tip Split USA  — US tip calculator & bill splitter
         https://tip-split-usa.vercel.app`

const EXPERIENCE_TEXT = `ITRI Advanced Software Program  2026.04 – present  |  Taipei
  ML / DL / Image Processing / Data Analytics / Vibe Coding

TSMC  Summer Intern  2024.07 – 2024.09  |  Tainan
  Full-stack Daily-Change Platform (Python + React)
  Reduced RCA triage time; promoted AI rollback roadmap

WINBOND ELECTRONICS  Summer Intern  2023.07 – 2023.09  |  Kaohsiung
  Enterprise Data Dictionary UI
  Awarded 3rd Place at internship symposium`

const WHOAMI_TEXT = `Joanne Wu
MS Information Management, NSYSU  |  GPA 3.98
Thesis: GenAI Conversational Systems & Elderly Well-being
Languages: English (TOEIC 800, CEFR B2+) · Mandarin (Native) · Japanese (Conversational)
Interests: side-projects · GenAI · coffee · travel · music · dancing`

const CONTACT_TEXT = `\U0001F4E7  joannewu0314@gmail.com
\U0001F4DE  +886 988 984 614
\U0001F4BC  linkedin.com/in/joannewu-ca
\U0001F419  github.com/ocaaaaii
\U0001F4CD  Taiwan (open to remote / relocation)`

type Line = { text: string; isCmd?: boolean }

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { text: 'Joanne OS Terminal v1.0.0' },
    { text: 'Type "help" to see available commands.' },
    { text: '' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function run(cmd: string) {
    const c = cmd.trim().toLowerCase()
    const push = (text: string) =>
      setLines(prev => [...prev, { text }])

    setLines(prev => [...prev, { text: `joanne@os ~ % ${cmd}`, isCmd: true }])

    switch (c) {
      case 'help':       push(HELP_TEXT); break
      case 'whoami':     push(WHOAMI_TEXT); break
      case 'skills':     push(SKILLS_TEXT); break
      case 'projects':   push(PROJECTS_TEXT); break
      case 'experience': push(EXPERIENCE_TEXT); break
      case 'contact':    push(CONTACT_TEXT); break
      case 'clear':
        setLines([{ text: '' }])
        return
      case '':           break
      default:
        push(`command not found: ${cmd}`)
        push('Type "help" for available commands.')
    }
    push('')
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const cmd = input
      setHistory(h => [cmd, ...h])
      setHistIdx(-1)
      setInput('')
      run(cmd)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  return (
    <div
      className="h-full flex flex-col font-mono text-sm overflow-hidden cursor-text"
      style={{ backgroundColor: '#1A1A1A', color: '#E8DDD0' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {lines.map((ln, i) => (
          <div
            key={i}
            className={\`whitespace-pre-wrap leading-relaxed \${
              ln.isCmd ? 'text-[#C4A07A] font-semibold' : 'text-[#D4C8BC]'
            }\`}
          >
            {ln.text || ' '}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center px-4 pb-4 gap-2">
        <span className="text-[#C4A07A] font-semibold shrink-0">joanne@os ~ %</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          className="flex-1 bg-transparent outline-none caret-[#C4A07A] text-[#E8DDD0]"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
""")

print('All done! Restart npm run dev.')
