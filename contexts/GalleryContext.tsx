'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface GalleryPhoto {
  id: string
  src: string          // public path or base64
  description?: string
  isStatic?: boolean   // pre-configured, not deletable
}

const STORAGE_KEY = 'ca-gallery-photos'

interface CtxValue {
  photos: GalleryPhoto[]
  addPhoto: (p: Omit<GalleryPhoto, 'id' | 'isStatic'>) => void
  removePhoto: (id: string) => void
}

const Ctx = createContext<CtxValue>({ photos: [], addPhoto: () => {}, removePhoto: () => {} })

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [dynamic, setDynamic] = useState<GalleryPhoto[]>([])
  const [staticPhotos, setStaticPhotos] = useState<GalleryPhoto[]>([])

  // Load user-uploaded photos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setDynamic(JSON.parse(saved))
    } catch {}
  }, [])

  // Fetch numbered photos from public/ via API
  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then((items: { src: string; description?: string }[]) => {
        setStaticPhotos(
          items.map((item, i) => ({
            id: `static-${i}-${item.src}`,
            src: item.src,
            description: item.description,
            isStatic: true,
          }))
        )
      })
      .catch(() => {})
  }, [])

  function addPhoto(p: Omit<GalleryPhoto, 'id' | 'isStatic'>) {
    const id = `photo-${Date.now()}`
    setDynamic(prev => {
      const next = [{ ...p, id }, ...prev]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Storage quota exceeded — still show in session, warn user
        console.warn('Gallery: localStorage quota exceeded. Photo visible this session only.')
        alert('儲存空間已滿，照片僅在本次使用中顯示。請考慮刪除部分已上傳的照片。')
      }
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

  const photos = [...dynamic, ...staticPhotos]

  return (
    <Ctx.Provider value={{ photos, addPhoto, removePhoto }}>
      {children}
    </Ctx.Provider>
  )
}

export function useGallery() { return useContext(Ctx) }
