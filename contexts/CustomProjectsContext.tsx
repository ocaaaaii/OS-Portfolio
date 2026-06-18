'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CustomProject {
  id: string
  label: string
  description: string
  logoDataUrl: string
  iframeUrl: string
  bg: string
}

interface CtxValue {
  customProjects: CustomProject[]
  addProject: (p: Omit<CustomProject, 'id'>) => void
  removeProject: (id: string) => void
}

const Ctx = createContext<CtxValue>({
  customProjects: [],
  addProject: () => {},
  removeProject: () => {},
})

const STORAGE_KEY = 'ca-custom-projects'
const BG_POOL = ['#8AAEAB', '#C4845A', '#9B84C4', '#849C92', '#C7978E', '#6A8178', '#A8C49A']
export function getNextBg(index: number) { return BG_POOL[index % BG_POOL.length] }

export function CustomProjectsProvider({ children }: { children: ReactNode }) {
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCustomProjects(JSON.parse(saved))
    } catch {}
  }, [])

  function addProject(p: Omit<CustomProject, 'id'>) {
    const id = `custom-${Date.now()}`
    setCustomProjects(prev => {
      const next = [...prev, { ...p, id }]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function removeProject(id: string) {
    setCustomProjects(prev => {
      const next = prev.filter(p => p.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <Ctx.Provider value={{ customProjects, addProject, removeProject }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCustomProjects() {
  return useContext(Ctx)
}
