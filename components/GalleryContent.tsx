'use client'
import { useState, useRef } from 'react'
import { useGallery, GalleryPhoto } from '@/contexts/GalleryContext'

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeletePhotoConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const hash = await hashInput(pw)
    if (hash === (process.env.NEXT_PUBLIC_ADD_PROJECT_HASH ?? '')) {
      onConfirm()
    } else {
      setErr(true)
      setPw('')
    }
  }

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center"
      style={{ background: 'rgba(10,8,8,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="rounded-2xl w-72 overflow-hidden shadow-2xl"
        style={{ background: 'rgba(242,237,231,0.97)', border: '1px solid rgba(132,156,146,0.28)' }}>
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3"
          style={{ background: 'rgba(226,213,197,0.92)', borderBottom: '1px solid rgba(132,156,146,0.20)' }}>
          <div className="flex gap-1.5">
            <button onClick={onCancel} className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] opacity-40" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] opacity-40" />
          </div>
          <span className="flex-1 text-center text-xs font-semibold" style={{ color: '#5C4E4E' }}>
            Delete Photo
          </span>
          <div className="w-[52px]" />
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(200,80,60,0.10)', border: '1px solid rgba(132,156,146,0.28)' }}>🗑️</div>
              <p className="text-xs text-center" style={{ color: '#8A7A7A' }}>
                Enter password to delete this photo
              </p>
            </div>
            <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false) }}
              placeholder="Password" autoFocus
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(132,156,146,0.10)', border: `1px solid ${err ? '#C4845A' : 'rgba(132,156,146,0.28)'}`, color: '#3A3030' }} />
            {err && <p className="text-xs text-center" style={{ color: '#C4845A' }}>Incorrect password.</p>}
            <div className="flex gap-2">
              <button type="button" onClick={onCancel}
                className="flex-1 py-2 rounded-xl text-xs font-semibold hover:opacity-75 transition-opacity"
                style={{ background: 'rgba(132,156,146,0.15)', color: '#5C4E4E', border: '1px solid rgba(132,156,146,0.28)' }}>
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-2 rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity"
                style={{ background: 'rgba(200,80,60,0.75)', color: '#fff' }}>
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

async function hashInput(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ photos, index, onClose, onNav }: {
  photos: GalleryPhoto[]
  index: number
  onClose: () => void
  onNav: (i: number) => void
}) {
  const photo = photos[index]
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'rgba(10,8,8,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      {/* Prev */}
      {index > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); onNav(index - 1) }}>
          ‹
        </button>
      )}
      {/* Image */}
      <div className="flex flex-col items-center gap-3 max-w-[90vw] max-h-[90vh]"
        onClick={e => e.stopPropagation()}>
        <img
          src={photo.src}
          alt={photo.description ?? ''}
          className="rounded-2xl object-contain shadow-2xl"
          style={{ maxWidth: '80vw', maxHeight: '75vh' }}
        />
        {photo.description && (
          <p className="text-sm text-center px-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {photo.description}
          </p>
        )}
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {index + 1} / {photos.length}
        </p>
      </div>
      {/* Next */}
      {index < photos.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); onNav(index + 1) }}>
          ›
        </button>
      )}
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-sm"
        style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
        onClick={onClose}>
        ✕
      </button>
    </div>
  )
}

// ── Add Photo Modal ───────────────────────────────────────────────────────────
function AddPhotoModal({ onClose }: { onClose: () => void }) {
  const { addPhoto } = useGallery()
  const [step, setStep] = useState<'password' | 'form'>('password')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [src, setSrc] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePw(e: React.FormEvent) {
    e.preventDefault()
    const hash = await hashInput(pw)
    const expected = process.env.NEXT_PUBLIC_ADD_PROJECT_HASH ?? ''
    if (hash === expected) { setPwError(false); setStep('form') }
    else { setPwError(true); setPw('') }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setSrc(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!src) return
    addPhoto({ src, description: description.trim() || undefined })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center"
      style={{ background: 'rgba(20,15,15,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="glass rounded-2xl w-full max-w-xs mx-4 overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3"
          style={{ background: 'rgba(226,213,197,0.92)', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] opacity-40" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] opacity-40" />
          </div>
          <span className="flex-1 text-center text-xs font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            {step === 'password' ? 'Authentication' : 'Add Photo'}
          </span>
          <div className="w-[52px]" />
        </div>

        <div className="p-5" style={{ background: 'rgba(242,237,231,0.97)' }}>
          {step === 'password' ? (
            <form onSubmit={handlePw} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(176,122,110,0.15)', border: '1px solid var(--glass-border)' }}>🔐</div>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>Enter password to add a photo</p>
              </div>
              <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError(false) }}
                placeholder="Password" autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(132,156,146,0.10)', border: `1px solid ${pwError ? '#C4845A' : 'var(--glass-border)'}`, color: 'var(--text-primary)' }} />
              {pwError && <p className="text-xs text-center" style={{ color: '#C4845A' }}>Incorrect password.</p>}
              <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold hover:opacity-85 transition-opacity"
                style={{ background: '#B07A6E', color: '#fff' }}>Unlock</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo upload */}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full h-40 rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden transition-opacity hover:opacity-80"
                style={{ background: src ? 'transparent' : 'rgba(176,122,110,0.10)', border: `2px dashed ${src ? 'transparent' : 'var(--glass-border)'}` }}>
                {src
                  ? <img src={src} className="w-full h-full object-cover rounded-2xl" alt="preview" />
                  : <>
                      <span className="text-3xl opacity-40">🖼</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to upload photo</span>
                    </>
                }
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Description <span style={{ color: 'var(--glass-border)' }}>(optional)</span>
                </label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="A moment worth remembering..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(132,156,146,0.10)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-75 transition-opacity"
                  style={{ background: 'rgba(132,156,146,0.15)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={!src}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-85 transition-opacity disabled:opacity-40"
                  style={{ background: '#B07A6E', color: '#fff' }}>
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Gallery ──────────────────────────────────────────────────────────────
export default function GalleryContent() {
  const { photos, removePhoto } = useGallery()
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  return (
    <div className="h-full flex flex-col" style={{ background: '#16141A' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white">Gallery</h2>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-85"
          style={{ background: 'rgba(176,122,110,0.30)', color: '#E8C4BC', border: '1px solid rgba(176,122,110,0.40)' }}>
          + Add Photo
        </button>
      </div>

      {/* Photos grid */}
      {photos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3"
          style={{ color: 'rgba(255,255,255,0.25)' }}>
          <span className="text-5xl opacity-30">✦</span>
          <p className="text-sm">No photos yet</p>
          <p className="text-xs">Click &ldquo;+ Add Photo&rdquo; to start your gallery</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div style={{ columns: '3 120px', columnGap: '10px' }}>
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative mb-3 rounded-2xl overflow-hidden cursor-pointer"
                style={{ breakInside: 'avoid' }}
                onMouseEnter={() => setHoveredId(photo.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setLightboxIdx(idx)}
              >
                <img
                  src={photo.src}
                  alt={photo.description ?? ''}
                  className="w-full block transition-transform duration-300"
                  style={{ transform: hoveredId === photo.id ? 'scale(1.03)' : 'scale(1)' }}
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-200"
                  style={{
                    background: 'linear-gradient(to top, rgba(10,8,8,0.75) 0%, transparent 55%)',
                    opacity: hoveredId === photo.id ? 1 : 0,
                  }}>
                  {photo.description && (
                    <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.90)' }}>
                      {photo.description}
                    </p>
                  )}
                  {!photo.isStatic && (
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteTargetId(photo.id) }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-opacity hover:opacity-100 opacity-70"
                      style={{ background: 'rgba(200,80,60,0.75)', color: '#fff' }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNav={setLightboxIdx}
        />
      )}

      {/* Add Photo Modal */}
      {showAdd && <AddPhotoModal onClose={() => setShowAdd(false)} />}

      {/* Delete confirm */}
      {deleteTargetId && (
        <DeletePhotoConfirm
          onConfirm={() => { removePhoto(deleteTargetId); setDeleteTargetId(null) }}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  )
}
