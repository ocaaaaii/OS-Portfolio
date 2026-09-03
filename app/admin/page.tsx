'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteProfile, SkillGroup, WorkEntry, EduEntry, ProjectEntry } from '@/contexts/SiteDataContext'

// ── Auth ──────────────────────────────────────────────────────────
const HASH = process.env.NEXT_PUBLIC_ADD_PROJECT_HASH ?? ''
const SESSION_KEY = 'ca-admin-auth'

async function hashStr(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Shared UI helpers ─────────────────────────────────────────────
const inp = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white'
const btn = (variant: 'primary' | 'ghost' | 'danger' = 'primary') =>
  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 ' + {
    primary: 'bg-teal-700 text-white',
    ghost:   'bg-gray-100 text-gray-600 border border-gray-200',
    danger:  'bg-red-500 text-white',
  }[variant]

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-gray-500 mb-1">{children}</p>
}
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${className}`}>{children}</div>
}
function SaveMsg({ ok }: { ok: boolean | null }) {
  if (ok === null) return null
  return <span className={`text-xs font-medium ${ok ? 'text-teal-600' : 'text-red-500'}`}>
    {ok ? '✓ Saved' : '✗ Failed'}
  </span>
}

// ── Image Upload ──────────────────────────────────────────────────
const BUCKET = 'portfolio-images'

function FileUpload({ value, onChange, label = 'Image', accept = 'image/*', isPdf = false }: {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
  isPdf?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setErr('')
    const ext = file.name.split('.').pop() ?? 'bin'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(filename, file, { upsert: true })
    if (upErr) { setErr('Upload failed: ' + upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    onChange(data.publicUrl)
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 flex-wrap">
        {value && !isPdf && (
          <img src={value} alt="preview"
            className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0 bg-gray-50"
            onError={ev => { (ev.target as HTMLImageElement).style.display = 'none' }} />
        )}
        {value && isPdf && (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-teal-600 hover:underline shrink-0 px-2 py-1 rounded border border-gray-100 bg-gray-50">
            📄 View PDF
          </a>
        )}
        <label className={`${btn('ghost')} cursor-pointer flex items-center gap-1`}>
          {uploading ? '⏳ Uploading…' : `↑ Upload ${isPdf ? 'PDF' : 'Image'}`}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && !uploading && (
          <span className="text-[10px] text-gray-400 truncate max-w-[180px]" title={value}>
            {value.split('/').pop()}
          </span>
        )}
        {err && <span className="text-xs text-red-500">{err}</span>}
      </div>
    </div>
  )
}
// alias for image-only usage
const ImageUpload = (props: Omit<Parameters<typeof FileUpload>[0], 'accept' | 'isPdf'>) =>
  <FileUpload {...props} accept="image/*" />

// ── Login ─────────────────────────────────────────────────────────
function Login({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const h = await hashStr(pw)
    if (h === HASH) { sessionStorage.setItem(SESSION_KEY, '1'); onSuccess() }
    else { setErr(true); setPw('') }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-80">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔐</div>
          <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Portfolio CMS</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false) }}
            placeholder="Password" className={inp} autoFocus />
          {err && <p className="text-xs text-red-500">Incorrect password.</p>}
          <button type="submit" className={`${btn('primary')} w-full py-2`}>Sign in</button>
        </form>
      </div>
    </div>
  )
}

// ── Profile Tab ───────────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState<SiteProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.from('cms_profile').select('*').eq('id', 'main').single().then(({ data }) => {
      if (data) setForm({
        name: data.name, nameZh: data.name_zh, title: data.title, bio: data.bio,
        email: data.email, phone: data.phone, linkedinUrl: data.linkedin_url,
        githubUrl: data.github_url, cvPath: data.cv_path, statusText: data.status_text,
      })
    })
  }, [])

  async function save() {
    if (!form) return
    setSaving(true); setOk(null)
    const { error } = await supabase.from('cms_profile').upsert({
      id: 'main', name: form.name, name_zh: form.nameZh, title: form.title, bio: form.bio,
      email: form.email, phone: form.phone, linkedin_url: form.linkedinUrl,
      github_url: form.githubUrl, cv_path: form.cvPath, status_text: form.statusText,
      updated_at: Date.now(),
    })
    setSaving(false); setOk(!error)
    // clear site data cache so frontend re-fetches
    try { localStorage.removeItem('ca-site-data-v1') } catch {}
  }

  if (!form) return <p className="text-sm text-gray-400 p-4">Loading…</p>

  const f = (key: keyof SiteProfile) => (
    <div key={key}>
      <Label>{key}</Label>
      <input className={inp} value={form[key]} onChange={e => setForm(p => ({ ...p!, [key]: e.target.value }))} />
    </div>
  )

  return (
    <div className="space-y-4 max-w-lg">
      <Card className="space-y-3">
        {f('name')}{f('nameZh')}{f('title')}
        <div><Label>bio</Label>
          <textarea className={`${inp} h-20 resize-none`} value={form.bio}
            onChange={e => setForm(p => ({ ...p!, bio: e.target.value }))} />
        </div>
        {f('email')}{f('phone')}{f('linkedinUrl')}{f('githubUrl')}
        <FileUpload
          value={form.cvPath}
          onChange={url => setForm(p => ({ ...p!, cvPath: url }))}
          label="CV / Resume (PDF)"
          accept=".pdf,application/pdf"
          isPdf
        />
        {f('statusText')}
      </Card>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className={btn('primary')}>
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
        <SaveMsg ok={ok} />
      </div>
    </div>
  )
}

// ── Skills Tab ────────────────────────────────────────────────────
type SGForm = { label: string; color: string; skillsText: string }

function SkillsTab() {
  const [groups, setGroups] = useState<SkillGroup[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<SGForm>({ label: '', color: '#6A9896', skillsText: '' })
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState<SGForm>({ label: '', color: '#6A9896', skillsText: '' })
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const { data } = await supabase.from('cms_skill_groups').select('*').order('sort_order')
    setGroups((data ?? []).map(r => ({ id: r.id, label: r.label, color: r.color, skills: r.skills ?? [], sortOrder: r.sort_order })))
  }, [])
  useEffect(() => { load() }, [load])

  function startEdit(g: SkillGroup) {
    setEditId(g.id); setEditForm({ label: g.label, color: g.color, skillsText: g.skills.join(', ') })
  }

  async function saveEdit() {
    const skills = editForm.skillsText.split(',').map(s => s.trim()).filter(Boolean)
    const { error } = await supabase.from('cms_skill_groups').update({ label: editForm.label, color: editForm.color, skills }).eq('id', editId)
    if (!error) { setMsg('Saved'); setEditId(null); load(); try { localStorage.removeItem('ca-site-data-v1') } catch {} }
  }

  async function deleteGroup(id: string) {
    if (!confirm('Delete this skill group?')) return
    await supabase.from('cms_skill_groups').delete().eq('id', id)
    load(); try { localStorage.removeItem('ca-site-data-v1') } catch {}
  }

  async function addGroup() {
    const skills = newForm.skillsText.split(',').map(s => s.trim()).filter(Boolean)
    const { error } = await supabase.from('cms_skill_groups').insert({
      label: newForm.label, color: newForm.color, skills, sort_order: groups.length,
    })
    if (!error) { setAdding(false); setNewForm({ label: '', color: '#6A9896', skillsText: '' }); load(); try { localStorage.removeItem('ca-site-data-v1') } catch {} }
  }

  return (
    <div className="space-y-3 max-w-lg">
      {msg && <p className="text-xs text-teal-600">{msg}</p>}
      {groups.map(g => (
        <Card key={g.id}>
          {editId === g.id ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1"><Label>Label</Label><input className={inp} value={editForm.label} onChange={e => setEditForm(p => ({ ...p, label: e.target.value }))} /></div>
                <div><Label>Color</Label><input type="color" value={editForm.color.startsWith('#') ? editForm.color : '#6A9896'} onChange={e => setEditForm(p => ({ ...p, color: e.target.value }))} className="h-9 w-16 rounded border border-gray-200 cursor-pointer" /></div>
              </div>
              <div><Label>Skills (comma-separated)</Label><textarea className={`${inp} h-16 resize-none`} value={editForm.skillsText} onChange={e => setEditForm(p => ({ ...p, skillsText: e.target.value }))} /></div>
              <div className="flex gap-2">
                <button onClick={saveEdit} className={btn('primary')}>Save</button>
                <button onClick={() => setEditId(null)} className={btn('ghost')}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: g.color }} />
                  <span className="text-sm font-semibold text-gray-700">{g.label}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{g.skills.join(' · ')}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => startEdit(g)} className={btn('ghost')}>Edit</button>
                <button onClick={() => deleteGroup(g.id)} className={btn('danger')}>✕</button>
              </div>
            </div>
          )}
        </Card>
      ))}

      {adding ? (
        <Card className="space-y-2 border-teal-200">
          <p className="text-xs font-bold text-teal-700 mb-2">New Group</p>
          <div className="flex gap-2">
            <div className="flex-1"><Label>Label</Label><input className={inp} placeholder="e.g. Languages" value={newForm.label} onChange={e => setNewForm(p => ({ ...p, label: e.target.value }))} /></div>
            <div><Label>Color</Label><input type="color" value={newForm.color} onChange={e => setNewForm(p => ({ ...p, color: e.target.value }))} className="h-9 w-16 rounded border border-gray-200 cursor-pointer" /></div>
          </div>
          <div><Label>Skills (comma-separated)</Label><textarea className={`${inp} h-16 resize-none`} placeholder="Python, JavaScript, SQL" value={newForm.skillsText} onChange={e => setNewForm(p => ({ ...p, skillsText: e.target.value }))} /></div>
          <div className="flex gap-2">
            <button onClick={addGroup} className={btn('primary')}>Add</button>
            <button onClick={() => setAdding(false)} className={btn('ghost')}>Cancel</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setAdding(true)} className={`${btn('ghost')} w-full py-2`}>+ Add Skill Group</button>
      )}
    </div>
  )
}

// ── Experience Tab ────────────────────────────────────────────────
type WorkForm = Omit<WorkEntry, 'id' | 'sortOrder'>

function ExperienceTab() {
  const [work, setWork] = useState<WorkEntry[]>([])
  const [edu, setEdu] = useState<EduEntry[]>([])
  const [editWorkId, setEditWorkId] = useState<string | null>(null)
  const [editEduId, setEditEduId] = useState<string | null>(null)
  const [workForm, setWorkForm] = useState<WorkForm>({ company: '', role: '', period: '', description: '', logoPath: '', fallbackBg: '#849C92', isCurrent: false })
  const [eduForm, setEduForm] = useState<Omit<EduEntry, 'id' | 'sortOrder'>>({ school: '', degree: '', period: '', gpa: '', logoPath: '', fallbackBg: '#9B84C4' })
  const [addingWork, setAddingWork] = useState(false)
  const [addingEdu, setAddingEdu] = useState(false)

  const load = useCallback(async () => {
    const [w, e] = await Promise.all([
      supabase.from('cms_work').select('*').order('sort_order'),
      supabase.from('cms_education').select('*').order('sort_order'),
    ])
    setWork((w.data ?? []).map(r => ({ id: r.id, company: r.company, role: r.role, period: r.period, description: r.description ?? '', logoPath: r.logo_path ?? '', fallbackBg: r.fallback_bg ?? '#849C92', isCurrent: r.is_current ?? false, sortOrder: r.sort_order ?? 0 })))
    setEdu((e.data ?? []).map(r => ({ id: r.id, school: r.school, degree: r.degree, period: r.period, gpa: r.gpa ?? '', logoPath: r.logo_path ?? '', fallbackBg: r.fallback_bg ?? '#9B84C4', sortOrder: r.sort_order ?? 0 })))
  }, [])
  useEffect(() => { load() }, [load])

  const clearCache = () => { try { localStorage.removeItem('ca-site-data-v1') } catch {} }

  function startEditWork(w: WorkEntry) {
    setEditWorkId(w.id)
    setWorkForm({ company: w.company, role: w.role, period: w.period, description: w.description, logoPath: w.logoPath, fallbackBg: w.fallbackBg, isCurrent: w.isCurrent })
  }
  async function saveWork() {
    const { error } = await supabase.from('cms_work').update({ company: workForm.company, role: workForm.role, period: workForm.period, description: workForm.description, logo_path: workForm.logoPath, fallback_bg: workForm.fallbackBg, is_current: workForm.isCurrent }).eq('id', editWorkId)
    if (!error) { setEditWorkId(null); load(); clearCache() }
  }
  async function deleteWork(id: string) {
    if (!confirm('Delete this work entry?')) return
    await supabase.from('cms_work').delete().eq('id', id); load(); clearCache()
  }
  async function addWork() {
    const { error } = await supabase.from('cms_work').insert({ company: workForm.company, role: workForm.role, period: workForm.period, description: workForm.description, logo_path: workForm.logoPath, fallback_bg: workForm.fallbackBg, is_current: workForm.isCurrent, sort_order: work.length })
    if (!error) { setAddingWork(false); setWorkForm({ company: '', role: '', period: '', description: '', logoPath: '', fallbackBg: '#849C92', isCurrent: false }); load(); clearCache() }
  }

  function startEditEdu(e: EduEntry) {
    setEditEduId(e.id)
    setEduForm({ school: e.school, degree: e.degree, period: e.period, gpa: e.gpa, logoPath: e.logoPath, fallbackBg: e.fallbackBg })
  }
  async function saveEdu() {
    const { error } = await supabase.from('cms_education').update({ school: eduForm.school, degree: eduForm.degree, period: eduForm.period, gpa: eduForm.gpa, logo_path: eduForm.logoPath, fallback_bg: eduForm.fallbackBg }).eq('id', editEduId)
    if (!error) { setEditEduId(null); load(); clearCache() }
  }
  async function deleteEdu(id: string) {
    if (!confirm('Delete this education entry?')) return
    await supabase.from('cms_education').delete().eq('id', id); load(); clearCache()
  }
  async function addEdu() {
    const { error } = await supabase.from('cms_education').insert({ school: eduForm.school, degree: eduForm.degree, period: eduForm.period, gpa: eduForm.gpa, logo_path: eduForm.logoPath, fallback_bg: eduForm.fallbackBg, sort_order: edu.length })
    if (!error) { setAddingEdu(false); setEduForm({ school: '', degree: '', period: '', gpa: '', logoPath: '', fallbackBg: '#9B84C4' }); load(); clearCache() }
  }

  function WorkFormFields({ f, setF }: { f: WorkForm; setF: (fn: (p: WorkForm) => WorkForm) => void }) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Company</Label><input className={inp} value={f.company} onChange={e => setF(p => ({ ...p, company: e.target.value }))} /></div>
          <div><Label>Role</Label><input className={inp} value={f.role} onChange={e => setF(p => ({ ...p, role: e.target.value }))} /></div>
        </div>
        <div><Label>Period</Label><input className={inp} value={f.period} placeholder="2026.08 – Present" onChange={e => setF(p => ({ ...p, period: e.target.value }))} /></div>
        <ImageUpload value={f.logoPath} onChange={url => setF(p => ({ ...p, logoPath: url }))} label="Company Logo" />
        <div><Label>Description</Label><textarea className={`${inp} h-14 resize-none`} value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} /></div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isCurrent" checked={f.isCurrent} onChange={e => setF(p => ({ ...p, isCurrent: e.target.checked }))} />
            <label htmlFor="isCurrent" className="text-xs text-gray-600">Current role</label>
          </div>
          <div className="flex items-center gap-2">
            <Label>Fallback color</Label>
            <input type="color" value={f.fallbackBg} onChange={e => setF(p => ({ ...p, fallbackBg: e.target.value }))} className="h-7 w-10 rounded border border-gray-200 cursor-pointer" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Work */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Work Experience</h3>
        <div className="space-y-3">
          {work.map(w => (
            <Card key={w.id}>
              {editWorkId === w.id ? (
                <><WorkFormFields f={workForm} setF={setWorkForm} /><div className="flex gap-2 mt-3"><button onClick={saveWork} className={btn('primary')}>Save</button><button onClick={() => setEditWorkId(null)} className={btn('ghost')}>Cancel</button></div></>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{w.company} <span className="font-normal text-gray-400">{w.role}</span>{w.isCurrent && <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">NOW</span>}</p>
                    <p className="text-xs text-teal-600">{w.period}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{w.description}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0 ml-3"><button onClick={() => startEditWork(w)} className={btn('ghost')}>Edit</button><button onClick={() => deleteWork(w.id)} className={btn('danger')}>✕</button></div>
                </div>
              )}
            </Card>
          ))}
          {addingWork ? (
            <Card className="border-teal-200 space-y-3">
              <p className="text-xs font-bold text-teal-700">New Work Entry</p>
              <WorkFormFields f={workForm} setF={setWorkForm} />
              <div className="flex gap-2"><button onClick={addWork} className={btn('primary')}>Add</button><button onClick={() => setAddingWork(false)} className={btn('ghost')}>Cancel</button></div>
            </Card>
          ) : (
            <button onClick={() => { setAddingWork(true); setWorkForm({ company: '', role: '', period: '', description: '', logoPath: '', fallbackBg: '#849C92', isCurrent: false }) }} className={`${btn('ghost')} w-full py-2`}>+ Add Work Entry</button>
          )}
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Education</h3>
        <div className="space-y-3">
          {edu.map(e => (
            <Card key={e.id}>
              {editEduId === e.id ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>School</Label><input className={inp} value={eduForm.school} onChange={ev => setEduForm(p => ({ ...p, school: ev.target.value }))} /></div>
                    <div><Label>Degree</Label><input className={inp} value={eduForm.degree} onChange={ev => setEduForm(p => ({ ...p, degree: ev.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Period</Label><input className={inp} value={eduForm.period} onChange={ev => setEduForm(p => ({ ...p, period: ev.target.value }))} /></div>
                    <div><Label>GPA</Label><input className={inp} value={eduForm.gpa} onChange={ev => setEduForm(p => ({ ...p, gpa: ev.target.value }))} /></div>
                  </div>
                  <ImageUpload value={eduForm.logoPath} onChange={url => setEduForm(p => ({ ...p, logoPath: url }))} label="School Logo" />
                  <div className="flex gap-2 mt-2"><button onClick={saveEdu} className={btn('primary')}>Save</button><button onClick={() => setEditEduId(null)} className={btn('ghost')}>Cancel</button></div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{e.degree}</p>
                    <p className="text-xs text-teal-600">{e.period} · {e.gpa}</p>
                  </div>
                  <div className="flex gap-1.5 ml-3"><button onClick={() => startEditEdu(e)} className={btn('ghost')}>Edit</button><button onClick={() => deleteEdu(e.id)} className={btn('danger')}>✕</button></div>
                </div>
              )}
            </Card>
          ))}
          {addingEdu ? (
            <Card className="border-teal-200 space-y-2">
              <p className="text-xs font-bold text-teal-700">New Education Entry</p>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>School</Label><input className={inp} value={eduForm.school} onChange={e => setEduForm(p => ({ ...p, school: e.target.value }))} /></div>
                <div><Label>Degree</Label><input className={inp} value={eduForm.degree} onChange={e => setEduForm(p => ({ ...p, degree: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Period</Label><input className={inp} value={eduForm.period} onChange={e => setEduForm(p => ({ ...p, period: e.target.value }))} /></div>
                <div><Label>GPA</Label><input className={inp} value={eduForm.gpa} onChange={e => setEduForm(p => ({ ...p, gpa: e.target.value }))} /></div>
              </div>
              <ImageUpload value={eduForm.logoPath} onChange={url => setEduForm(p => ({ ...p, logoPath: url }))} label="School Logo" />
              <div className="flex gap-2"><button onClick={addEdu} className={btn('primary')}>Add</button><button onClick={() => setAddingEdu(false)} className={btn('ghost')}>Cancel</button></div>
            </Card>
          ) : (
            <button onClick={() => setAddingEdu(true)} className={`${btn('ghost')} w-full py-2`}>+ Add Education Entry</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Projects Tab ──────────────────────────────────────────────────
type ProjForm = Omit<ProjectEntry, 'id' | 'sortOrder'>

function ProjectsTab() {
  const [projects, setProjects] = useState<ProjectEntry[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<ProjForm>({ label: '', emoji: '✦', bg: '#8AAEAB', imgSrc: '', iframeUrl: '', iconScale: 1.0 })
  const [adding, setAdding] = useState(false)
  const [newId, setNewId] = useState('')

  const load = useCallback(async () => {
    const { data } = await supabase.from('cms_projects').select('*').order('sort_order')
    setProjects((data ?? []).map(r => ({ id: r.id, label: r.label, emoji: r.emoji, bg: r.bg, imgSrc: r.img_src ?? '', iframeUrl: r.iframe_url ?? '', iconScale: r.icon_scale ?? 1, sortOrder: r.sort_order ?? 0 })))
  }, [])
  useEffect(() => { load() }, [load])

  const clearCache = () => { try { localStorage.removeItem('ca-site-data-v1') } catch {} }

  function startEdit(p: ProjectEntry) {
    setEditId(p.id); setForm({ label: p.label, emoji: p.emoji, bg: p.bg, imgSrc: p.imgSrc, iframeUrl: p.iframeUrl, iconScale: p.iconScale })
  }
  async function saveEdit() {
    const { error } = await supabase.from('cms_projects').update({ label: form.label, emoji: form.emoji, bg: form.bg, img_src: form.imgSrc, iframe_url: form.iframeUrl, icon_scale: form.iconScale }).eq('id', editId)
    if (!error) { setEditId(null); load(); clearCache() }
  }
  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return
    await supabase.from('cms_projects').delete().eq('id', id); load(); clearCache()
  }
  async function addProject() {
    const id = newId.trim() || `project-${Date.now()}`
    const { error } = await supabase.from('cms_projects').insert({ id, label: form.label, emoji: form.emoji, bg: form.bg, img_src: form.imgSrc, iframe_url: form.iframeUrl, icon_scale: form.iconScale, sort_order: projects.length })
    if (!error) { setAdding(false); setForm({ label: '', emoji: '✦', bg: '#8AAEAB', imgSrc: '', iframeUrl: '', iconScale: 1 }); setNewId(''); load(); clearCache() }
  }

  function ProjFormFields({ f, setF }: { f: ProjForm; setF: (fn: (p: ProjForm) => ProjForm) => void }) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2"><Label>Label</Label><input className={inp} value={f.label} onChange={e => setF(p => ({ ...p, label: e.target.value }))} /></div>
          <div><Label>Emoji</Label><input className={inp} value={f.emoji} onChange={e => setF(p => ({ ...p, emoji: e.target.value }))} /></div>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1"><ImageUpload value={f.imgSrc} onChange={url => setF(p => ({ ...p, imgSrc: url }))} label="Project Image" /></div>
          <div className="shrink-0"><Label>BG color</Label><input type="color" value={f.bg} onChange={e => setF(p => ({ ...p, bg: e.target.value }))} className="h-9 w-12 rounded border border-gray-200 cursor-pointer" /></div>
        </div>
        <div><Label>iframe URL</Label><input className={inp} value={f.iframeUrl} placeholder="https://myapp.vercel.app/" onChange={e => setF(p => ({ ...p, iframeUrl: e.target.value }))} /></div>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-w-xl">
      {projects.map(p => (
        <Card key={p.id}>
          {editId === p.id ? (
            <><ProjFormFields f={form} setF={setForm} /><div className="flex gap-2 mt-3"><button onClick={saveEdit} className={btn('primary')}>Save</button><button onClick={() => setEditId(null)} className={btn('ghost')}>Cancel</button></div></>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: p.bg }}>
                  {p.imgSrc ? <img src={p.imgSrc} alt={p.label} className="w-full h-full object-cover rounded-xl" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} /> : p.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{p.label}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[260px]">{p.iframeUrl}</p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0"><button onClick={() => startEdit(p)} className={btn('ghost')}>Edit</button><button onClick={() => deleteProject(p.id)} className={btn('danger')}>✕</button></div>
            </div>
          )}
        </Card>
      ))}
      {adding ? (
        <Card className="border-teal-200 space-y-2">
          <p className="text-xs font-bold text-teal-700">New Project</p>
          <div><Label>ID (slug, optional)</Label><input className={inp} value={newId} placeholder="project-my-app" onChange={e => setNewId(e.target.value)} /></div>
          <ProjFormFields f={form} setF={setForm} />
          <div className="flex gap-2 mt-1"><button onClick={addProject} className={btn('primary')}>Add</button><button onClick={() => setAdding(false)} className={btn('ghost')}>Cancel</button></div>
        </Card>
      ) : (
        <button onClick={() => { setAdding(true); setForm({ label: '', emoji: '✦', bg: '#8AAEAB', imgSrc: '', iframeUrl: '', iconScale: 1 }) }} className={`${btn('ghost')} w-full py-2`}>+ Add Project</button>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────
const TABS = ['Profile', 'Skills', 'Experience', 'Projects'] as const
type Tab = typeof TABS[number]

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('Profile')

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true)
  }, [])

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">⚙️</span>
            <div>
              <p className="text-sm font-bold text-gray-800">Portfolio Admin</p>
              <p className="text-[10px] text-gray-400">Joanne Wu · CMS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-teal-600 hover:underline">← Back to Portfolio</a>
            <button onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false) }}
              className="text-xs text-gray-400 hover:text-gray-600">Sign out</button>
          </div>
        </div>
        {/* Tab bar */}
        <div className="max-w-3xl mx-auto px-6 flex gap-1 pb-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${tab === t ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-6">
        {tab === 'Profile'    && <ProfileTab />}
        {tab === 'Skills'     && <SkillsTab />}
        {tab === 'Experience' && <ExperienceTab />}
        {tab === 'Projects'   && <ProjectsTab />}
      </div>
    </div>
  )
}
