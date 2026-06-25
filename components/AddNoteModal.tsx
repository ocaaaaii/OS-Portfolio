'use client'
import { useState } from 'react'
import { useNotes, NOTE_COLORS } from '@/contexts/NotesContext'

async function hashInput(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

interface Props { onClose: () => void }

export default function AddNoteModal({ onClose }: Props) {
  const { addNote } = useNotes()
  const [step, setStep] = useState<'password' | 'form'>('password')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState(NOTE_COLORS[0])

  async function handlePw(e: React.FormEvent) {
    e.preventDefault()
    const hash = await hashInput(pw)
    const expected = process.env.NEXT_PUBLIC_ADD_PROJECT_HASH ?? ''
    if (hash === expected) { setPwError(false); setStep('form') }
    else { setPwError(true); setPw('') }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    addNote(title.trim(), content.trim(), color)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center"
      style={{ background: 'rgba(20,15,15,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div className="glass rounded-2xl w-full mx-4 overflow-hidden shadow-2xl"
        style={{ maxWidth: step === 'form' ? '600px' : '320px' }}>

        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3"
          style={{ background: 'rgba(226,213,197,0.92)', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] opacity-40" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] opacity-40" />
          </div>
          <span className="flex-1 text-center text-xs font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            {step === 'password' ? 'Authentication' : 'New Note'}
          </span>
          <div className="w-[52px]" />
        </div>

        <div className="p-5" style={{ background: 'rgba(242,237,231,0.97)' }}>
          {step === 'password' ? (
            <form onSubmit={handlePw} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(123,111,160,0.15)', border: '1px solid var(--glass-border)' }}>🔐</div>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>Enter password to add a note</p>
              </div>
              <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError(false) }}
                placeholder="Password" autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(132,156,146,0.10)', border: `1px solid ${pwError ? '#C4845A' : 'var(--glass-border)'}`, color: 'var(--text-primary)' }} />
              {pwError && <p className="text-xs text-center" style={{ color: '#C4845A' }}>Incorrect password.</p>}
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-semibold hover:opacity-85 transition-opacity"
                style={{ background: '#7B6FA0', color: '#fff' }}>Unlock</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Color picker */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Icon Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        outline: color === c ? `2px solid ${c}` : 'none',
                        outlineOffset: '2px',
                        boxShadow: color === c ? `0 0 0 1px white, 0 0 0 3px ${c}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Note Title
                </label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. React Hooks 學習筆記"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(132,156,146,0.10)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
              </div>

              {/* Markdown content */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Content <span style={{ color: 'var(--glass-border)', textTransform: 'none' }}>(Markdown supported)</span>
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={`## 主題\n\n記錄你的學習心得...\n\n- 重點一\n- 重點二\n\n> 重要備注`}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono resize-none leading-relaxed"
                  style={{
                    background: 'rgba(20,18,28,0.92)',
                    border: '1px solid var(--glass-border)',
                    color: '#E8DDD0',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(132,156,146,0.3) transparent',
                  }} />
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  支援：**粗體** *斜體* `code` ==highlight== &gt; 引用 | 表格 | - 列表 | ## 標題
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-75 transition-opacity"
                  style={{ background: 'rgba(132,156,146,0.15)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={!title.trim() || !content.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-85 transition-opacity disabled:opacity-40"
                  style={{ background: '#7B6FA0', color: '#fff' }}>
                  Save Note
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
