'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────
export interface SiteProfile {
  name: string; nameZh: string; title: string; bio: string
  email: string; phone: string; linkedinUrl: string; githubUrl: string
  cvPath: string; statusText: string
}

export interface SkillGroup {
  id: string; label: string; color: string; skills: string[]; sortOrder: number
}

export interface WorkEntry {
  id: string; company: string; role: string; period: string
  description: string; logoPath: string; fallbackBg: string
  isCurrent: boolean; sortOrder: number
}

export interface EduEntry {
  id: string; school: string; degree: string; period: string
  gpa: string; logoPath: string; fallbackBg: string; sortOrder: number
}

export interface ProjectEntry {
  id: string; label: string; emoji: string; bg: string
  imgSrc: string; iframeUrl: string; iconScale: number; sortOrder: number
}

interface SiteDataCtx {
  profile:     SiteProfile | null
  skillGroups: SkillGroup[]
  workEntries: WorkEntry[]
  eduEntries:  EduEntry[]
  projects:    ProjectEntry[]
  loading:     boolean
}

// ── Row mappers ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

const toProfile = (r: Row): SiteProfile => ({
  name: r.name, nameZh: r.name_zh, title: r.title, bio: r.bio,
  email: r.email, phone: r.phone, linkedinUrl: r.linkedin_url,
  githubUrl: r.github_url, cvPath: r.cv_path, statusText: r.status_text,
})

const toSkillGroup = (r: Row): SkillGroup => ({
  id: r.id, label: r.label, color: r.color,
  skills: Array.isArray(r.skills) ? r.skills : [],
  sortOrder: r.sort_order ?? 0,
})

const toWork = (r: Row): WorkEntry => ({
  id: r.id, company: r.company, role: r.role, period: r.period,
  description: r.description ?? '', logoPath: r.logo_path ?? '',
  fallbackBg: r.fallback_bg ?? '#849C92', isCurrent: r.is_current ?? false,
  sortOrder: r.sort_order ?? 0,
})

const toEdu = (r: Row): EduEntry => ({
  id: r.id, school: r.school, degree: r.degree, period: r.period,
  gpa: r.gpa ?? '', logoPath: r.logo_path ?? '',
  fallbackBg: r.fallback_bg ?? '#9B84C4', sortOrder: r.sort_order ?? 0,
})

const toProject = (r: Row): ProjectEntry => ({
  id: r.id, label: r.label, emoji: r.emoji ?? '✦', bg: r.bg ?? '#8AAEAB',
  imgSrc: r.img_src ?? '', iframeUrl: r.iframe_url ?? '',
  iconScale: r.icon_scale ?? 1.0, sortOrder: r.sort_order ?? 0,
})

// ── Context ────────────────────────────────────────────────────────
const CACHE_KEY = 'ca-site-data-v1'

const DEFAULT: SiteDataCtx = {
  profile: null, skillGroups: [], workEntries: [], eduEntries: [], projects: [], loading: true,
}

const Ctx = createContext<SiteDataCtx>(DEFAULT)

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteDataCtx>(DEFAULT)

  useEffect(() => {
    // 1. Instant cache
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) setData({ ...JSON.parse(cached), loading: false })
    } catch {}

    // 2. Background Supabase sync
    async function sync() {
      const [pRes, sgRes, wRes, eRes, prRes] = await Promise.all([
        supabase.from('cms_profile').select('*').eq('id', 'main').single(),
        supabase.from('cms_skill_groups').select('*').order('sort_order'),
        supabase.from('cms_work').select('*').order('sort_order'),
        supabase.from('cms_education').select('*').order('sort_order'),
        supabase.from('cms_projects').select('*').order('sort_order'),
      ])

      const fresh: SiteDataCtx = {
        profile:     pRes.data  ? toProfile(pRes.data)                         : null,
        skillGroups: (sgRes.data ?? []).map(toSkillGroup),
        workEntries: (wRes.data  ?? []).map(toWork),
        eduEntries:  (eRes.data  ?? []).map(toEdu),
        projects:    (prRes.data ?? []).map(toProject),
        loading:     false,
      }

      setData(fresh)
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(fresh)) } catch {}
    }
    sync()
  }, [])

  return <Ctx.Provider value={data}>{children}</Ctx.Provider>
}

export function useSiteData() { return useContext(Ctx) }
