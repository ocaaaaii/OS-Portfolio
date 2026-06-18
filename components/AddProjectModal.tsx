'use client'
import { useState, useRef } from 'react'
import { useCustomProjects, getNextBg } from '@/contexts/CustomProjectsContext'

interface Props {
  onClose: () => void
  existingCount: number
}

// Password is verified via SHA-256 hash only — plaintext never stored in source
async function hashInput(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function AddProjectModal({ onClose, existingCount }: Props) {
  const { addProject } = useCustomProjects()
  const [step, setStep] = useState<'password' | 'form'>('password')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [iframeUrl, setIframeUrl] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    const hash = await hashInput(pw)
    const expected = process.env.NEXT_PUBLIC_ADD_PROJECT_HASH ?? ''
    if (hash === expected) {
      setPwError(false)
      setStep('form')
    } else {
      setPwError(true)
      setPw('')
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setLogoDataUrl(result)
      setLogoPreview(result)
    }
    reader.readAsDataURL(file)
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim() || !iframeUrl.trim()) return
    setSubmitting(true)
    addProject({
      label: label.trim(),
      description: description.trim(),
      logoDataUrl: logoDataUrl ?? '',
      iframeUrl: iframeUrl.trim(),
      bg: getNextBg(existingCount),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(42,30,30,0.40)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="glass rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">

        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3"
          style={{ background: 'rgba(226,213,197,0.92)', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#e74c3c] transition-colors" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] opacity-40" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] opacity-40" />
          </div>
          <span className="flex-1 text-center text-xs font-semibold tracking-wide"
            style={{ color: 'var(--text-secondary)' }}>
            {step === 'password' ? 'Authentication Required' : 'New Project'}
          </span>
          <div className="w-[52px]" />
        </div>

        <div className="p-6" style={{ background: 'rgba(242,237,231,0.97)' }}>

          {/* ── Step 1: Password ── */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2 pb-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(132,156,146,0.15)', border: '1px solid var(--glass-border)' }}>
                  🔐
                </div>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Enter your password to add a project
                </p>
              </div>

              <input
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setPwError(false) }}
                placeholder="Password"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(132,156,146,0.10)',
                  border: `1px solid ${pwError ? '#C4845A' : 'var(--glass-border)'}`,
                  color: 'var(--text-primary)',
                }}
              />
              {pwError && (
                <p className="text-xs text-center" style={{ color: '#C4845A' }}>
                  Incorrect password. Try again.
                </p>
              )}
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
                style={{ background: 'var(--teal)', color: '#fff' }}>
                Unlock
              </button>
            </form>
          )}

          {/* ── Step 2: Form ── */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Logo upload */}
              <div className="flex flex-col items-center gap-2">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-16 h-16 rounded-[22%] flex items-center justify-center overflow-hidden transition-opacity hover:opacity-80"
                  style={{
                    background: logoPreview ? 'transparent' : 'rgba(132,156,146,0.15)',
                    border: `2px dashed ${logoPreview ? 'transparent' : 'var(--glass-border)'}`,
                  }}>
                  {logoPreview
                    ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                    : <span className="text-2xl">+</span>
                  }
                </button>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {logoPreview ? 'Click to change logo' : 'Upload app logo'}
                </p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>

              {/* Project name */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>Project Name</label>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="My Awesome App"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(132,156,146,0.10)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="A short description of this project..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: 'rgba(132,156,146,0.10)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Project URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>Project URL</label>
                <input
                  type="url"
                  value={iframeUrl}
                  onChange={e => setIframeUrl(e.target.value)}
                  placeholder="https://your-project.vercel.app"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(132,156,146,0.10)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-75"
                  style={{ background: 'rgba(132,156,146,0.15)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ background: 'var(--teal)', color: '#fff' }}>
                  Add Project
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
