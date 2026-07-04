'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

export interface GalleryPhoto {
  id: string
  src: string           // public URL (Supabase Storage) or /photos/... for static
  description?: string
  isStatic?: boolean    // pre-configured, not deletable
  storagePath?: string  // Supabase Storage path for deletion
}

const STORAGE_BUCKET = 'gallery'

interface CtxValue {
  photos: GalleryPhoto[]
  addPhoto: (src: string, description?: string) => Promise<void>
  removePhoto: (id: string) => void
}

const Ctx = createContext<CtxValue>({ photos: [], addPhoto: async () => {}, removePhoto: () => {} })

// Convert base64 dataURL → Blob
function dataURLtoBlob(dataURL: string): Blob {
  const [meta, data] = dataURL.split(',')
  const mime = meta.match(/:(.*?);/)![1]
  const binary = atob(data)
  const arr = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [dynamic, setDynamic] = useState<GalleryPhoto[]>([])
  const [staticPhotos, setStaticPhotos] = useState<GalleryPhoto[]>([])

  // Load user-uploaded photos from Supabase
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Gallery load failed:', error.message)
        return
      }
      setDynamic(
        (data ?? []).map(row => ({
          id:          row.id as string,
          src:         row.src as string,
          description: row.description as string | undefined,
          storagePath: row.storage_path as string | undefined,
        }))
      )
    }
    load()
  }, [])

  // Fetch numbered static photos from public/ via API route
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

  async function addPhoto(src: string, description?: string): Promise<void> {
    const id = `photo-${Date.now()}`
    const filename = `${id}.jpg`

    // Upload compressed image to Supabase Storage
    const blob = dataURLtoBlob(src)
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, blob, { contentType: 'image/jpeg', upsert: false })

    if (uploadError) {
      console.error('Upload failed:', uploadError.message)
      throw new Error(uploadError.message)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename)

    // Insert row in DB
    const { error: dbError } = await supabase.from('gallery_photos').insert({
      id,
      src:          publicUrl,
      storage_path: filename,
      description:  description ?? null,
      created_at:   Date.now(),
    })
    if (dbError) console.error('Gallery DB insert failed:', dbError.message)

    // Update state
    setDynamic(prev => [{ id, src: publicUrl, description, storagePath: filename }, ...prev])
  }

  function removePhoto(id: string) {
    const photo = dynamic.find(p => p.id === id)
    // Optimistic update
    setDynamic(prev => prev.filter(p => p.id !== id))
    // Delete from Storage (if has path) + DB
    if (photo?.storagePath) {
      supabase.storage.from(STORAGE_BUCKET).remove([photo.storagePath])
        .then(({ error }) => { if (error) console.error('Storage delete failed:', error.message) })
    }
    supabase.from('gallery_photos').delete().eq('id', id)
      .then(({ error }) => { if (error) console.error('Gallery DB delete failed:', error.message) })
  }

  const photos = [...dynamic, ...staticPhotos]

  return (
    <Ctx.Provider value={{ photos, addPhoto, removePhoto }}>
      {children}
    </Ctx.Provider>
  )
}

export function useGallery() { return useContext(Ctx) }
