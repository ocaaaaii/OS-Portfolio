'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

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

const BG_POOL = ['#8AAEAB', '#C4845A', '#9B84C4', '#849C92', '#C7978E', '#6A8178', '#A8C49A']
export function getNextBg(index: number) { return BG_POOL[index % BG_POOL.length] }

// Map Supabase row (snake_case) → CustomProject (camelCase)
function rowToProject(row: Record<string, unknown>): CustomProject {
  return {
    id:           row.id            as string,
    label:        row.label         as string,
    description:  row.description   as string ?? '',
    logoDataUrl:  row.logo_data_url as string ?? '',
    iframeUrl:    row.iframe_url    as string,
    bg:           row.bg            as string,
  }
}

export function CustomProjectsProvider({ children }: { children: ReactNode }) {
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([])

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('custom_projects')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Projects load failed:', error.message)
        return
      }
      setCustomProjects((data ?? []).map(rowToProject))
    }
    load()
  }, [])

  function addProject(p: Omit<CustomProject, 'id'>) {
    const id = `custom-${Date.now()}`
    const project: CustomProject = { ...p, id }
    // Optimistic update
    setCustomProjects(prev => [...prev, project])
    // Persist to Supabase
    supabase.from('custom_projects').insert({
      id,
      label:        p.label,
      description:  p.description ?? '',
      logo_data_url: p.logoDataUrl ?? '',
      iframe_url:   p.iframeUrl,
      bg:           p.bg,
      created_at:   Date.now(),
    }).then(({ error }) => { if (error) console.error('addProject failed:', error.message) })
  }

  function removeProject(id: string) {
    // Optimistic update
    setCustomProjects(prev => prev.filter(p => p.id !== id))
    // Persist to Supabase
    supabase.from('custom_projects').delete().eq('id', id)
      .then(({ error }) => { if (error) console.error('removeProject failed:', error.message) })
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
