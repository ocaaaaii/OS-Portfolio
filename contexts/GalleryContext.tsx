'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface GalleryPhoto {
  id: string
  src: string          // public path or base64
  description?: string
  isStatic?: boolean   // pre-configured, not deletable
}

// ── Pre-configured public photos ─────────────────────────────────────────────
// Add your public/ photo filenames here, e.g. { src: '/photos/picnic.jpg', description: 'Afternoon picnic ☀️' }
export const STATIC_PHOTOS: GalleryPhoto[] = []

const STORAGE_KEY = 'ca-gallery-photos'

interface CtxValue {
  photos: GalleryPhoto[]
  addPhoto: (p: Omit<GalleryPhoto, 'id' | 'isStatic'>) => void
  removePhoto: (id: string) => void
}

const Ctx = createContext<CtxValue>({ photos: [], addPhoto: () => {}, removePhoto: () => {} })

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [dynamic, setDynamic] = useState<GalleryPhoto[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setDynamic(JSON.parse(saved))
    } catch {}
  }, [])

  function addPhoto(p: Omit<GalleryPhoto, 'id' | 'isStatic'>) {
    const id = `photo-${Date.now()}`
    setDynamic(prev => {
      const next = [{ ...p, id }, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function removePhoto(id: string) {
    setDynamic(prev => {
      const next = prev.filter(p => p.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const photos = [...dynamic, ...STATIC_PHOTOS]

  return (
    <Ctx.Provider value={{ photos, addPhoto, removePhoto }}>
      {children}
    </Ctx.Provider>
  )
}

export function useGallery() { return useContext(Ctx) }
