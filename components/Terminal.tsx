'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useCustomProjects } from '@/contexts/CustomProjectsContext'
import { useNotes } from '@/contexts/NotesContext'

const HELP_TEXT = `Available commands:
  help        show this list
  whoami      about Joanne
  skills      tech stack
  projects    side projects
  notes       learning notes
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

const CONTACT_TEXT = `📧  joannewu0314@gmail.com
📞  +886 988 984 614
💼  linkedin.com/in/joannewu-ca
🐙  github.com/ocaaaaii
📍  Taiwan (open to remote / relocation)`

const PROJECT_APPS_COUNT = 3 // Mochi, Stock, TipSplit
type Line = { text: string; isCmd?: boolean }

export default function Terminal() {
  const { customProjects } = useCustomProjects()
  const { notes } = useNotes()
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
      case 'projects': {
        const extra = customProjects.length > 0
          ? '\n' + customProjects.map((p, i) =>
              `[${PROJECT_APPS_COUNT + i + 1}] ${p.label.padEnd(14)} — ${p.description || p.iframeUrl}`
            ).join('\n')
          : ''
        push(PROJECTS_TEXT + extra)
        break
      }
      case 'notes': {
        if (notes.length === 0) {
          push('No notes yet. Click "+" in the NOTE section to add one.')
        } else {
          const notesList = notes.map((n, i) =>
            `[${i + 1}] ${n.title}\n     ${new Date(n.createdAt).toLocaleDateString('zh-TW')}`
          ).join('\n')
          push(`Learning Notes (${notes.length}):\n${notesList}`)
        }
        break
      }
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
            className={`whitespace-pre-wrap leading-relaxed ${
              ln.isCmd ? 'text-[#C4A07A] font-semibold' : 'text-[#D4C8BC]'
            }`}
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
