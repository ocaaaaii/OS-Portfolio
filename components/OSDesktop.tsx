'use client'
import { useState } from 'react'
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext'
import { CustomProjectsProvider, useCustomProjects, CustomProject } from '@/contexts/CustomProjectsContext'
import { GalleryProvider } from '@/contexts/GalleryContext'
import { NotesProvider, useNotes, Note } from '@/contexts/NotesContext'
import { PROJECT_APPS, SYSTEM_APPS, NOTE_SYSTEM_APPS } from '@/data/appConfig'
import TopBar from './TopBar'
import Dock from './Dock'
import AppIcon from './AppIcon'
import WindowModal from './WindowModal'
import AddProjectModal from './AddProjectModal'
import AddNoteModal from './AddNoteModal'
import ProfileWidget from './widgets/ProfileWidget'
import SkillsWidget from './widgets/SkillsWidget'
import ExperienceWidget from './widgets/ExperienceWidget'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3 px-1"
      style={{ color: 'var(--text-muted)' }}
    >
      {children}
    </p>
  )
}

function CustomAppIcon({ project }: { project: CustomProject }) {
  const { openWindow } = useWindowManager()
  const px = 64
  return (
    <button
      onClick={() => openWindow({ id: project.id, type: 'project', title: project.label, iframeUrl: project.iframeUrl })}
      className="flex flex-col items-center gap-1.5 group cursor-pointer select-none"
    >
      <div
        className="shadow-md transition-transform duration-150 group-hover:scale-110 group-active:scale-95"
        style={{ width: px, height: px, borderRadius: '22%', overflow: 'hidden', backgroundColor: project.bg, flexShrink: 0 }}
      >
        {project.logoDataUrl
          ? <img src={project.logoDataUrl} alt={project.label} className="w-full h-full object-cover" />
          : <span className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
              {project.label[0]}
            </span>
        }
      </div>
      <span className="text-xs font-medium text-center leading-tight max-w-[72px] truncate"
        style={{ color: 'var(--text-primary)' }}>
        {project.label}
      </span>
    </button>
  )
}

// Note icon component
function NoteIcon({ note }: { note: Note }) {
  const { openWindow } = useWindowManager()
  const { removeNote } = useNotes()
  const px = 64
  return (
    <div className="relative group">
      <button
        onClick={() => openWindow({ id: note.id, type: 'note', title: note.title })}
        className="flex flex-col items-center gap-1.5 cursor-pointer select-none"
      >
        <div
          className="flex items-center justify-center shadow-md transition-transform duration-150 group-hover:scale-110 group-active:scale-95"
          style={{ width: px, height: px, borderRadius: '22%', backgroundColor: '#5A5272', flexShrink: 0 }}
        >
          <span style={{ fontSize: '26px' }}>📝</span>
        </div>
        <span className="text-xs font-medium text-center leading-tight max-w-[72px] line-clamp-2"
          style={{ color: 'var(--text-primary)' }}>
          {note.title}
        </span>
      </button>
      {/* Delete button — only on hover, skip the seed note if you want */}
      <button
        onClick={() => removeNote(note.id)}
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex"
        style={{ background: 'rgba(200,80,60,0.85)', color: '#fff', zIndex: 10 }}
        title="Delete note"
      >✕</button>
    </div>
  )
}

function Desktop() {
  const { windows } = useWindowManager()
  const { customProjects } = useCustomProjects()
  const { notes } = useNotes()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)

  return (
    <div className="relative w-full h-full">
      {/* Scrollable desktop area */}
      <div
        id="desktop-scroll"
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ paddingTop: '44px', paddingBottom: '120px' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">

          {/* ── Top widgets row ── */}
          <div id="section-widgets" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ProfileWidget />
            <SkillsWidget />
            <ExperienceWidget />
          </div>

          {/* ── Projects section ── */}
          <div id="section-projects">
            <div className="flex items-center gap-3 mb-3 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'var(--text-muted)' }}>
                Projects
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110 active:scale-95"
                style={{ background: 'rgba(132,156,146,0.20)', color: 'var(--teal-dark)', border: '1px solid var(--glass-border)' }}
                title="Add project"
              >
                +
              </button>
            </div>
            <div className="flex gap-4 sm:gap-6 flex-wrap">
              {PROJECT_APPS.map(app => (
                <AppIcon key={app.id} app={app} />
              ))}
              {customProjects.map(p => (
                <CustomAppIcon key={p.id} project={p} />
              ))}
            </div>
          </div>

          {/* ── About Me section ── */}
          <div>
            <SectionLabel>About Me</SectionLabel>
            <div className="flex gap-4 sm:gap-6 flex-wrap">
              {SYSTEM_APPS.map(app => (
                <AppIcon key={app.id} app={app} />
              ))}
            </div>
          </div>

          {/* ── Note section ── */}
          <div>
            <div className="flex items-center gap-3 mb-3 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'var(--text-muted)' }}>
                Note
              </p>
              <button
                onClick={() => setShowAddNote(true)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110 active:scale-95"
                style={{ background: 'rgba(123,111,160,0.20)', color: '#7B6FA0', border: '1px solid var(--glass-border)' }}
                title="Add note"
              >
                +
              </button>
            </div>
            <div className="flex gap-4 sm:gap-6 flex-wrap">
              {/* Vibe Coding SOP moved here */}
              {NOTE_SYSTEM_APPS.map(app => (
                <AppIcon key={app.id} app={app} />
              ))}
              {/* User notes */}
              {notes.map(note => (
                <NoteIcon key={note.id} note={note} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Window layer ── */}
      {windows.map(win => (
        <WindowModal key={win.id} win={win} />
      ))}

      {/* ── Add Project Modal ── */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          existingCount={PROJECT_APPS.length + customProjects.length}
        />
      )}

      {/* ── Add Note Modal ── */}
      {showAddNote && (
        <AddNoteModal onClose={() => setShowAddNote(false)} />
      )}
    </div>
  )
}

export default function OSDesktop() {
  return (
    <GalleryProvider>
    <NotesProvider>
    <CustomProjectsProvider>
      <WindowManagerProvider>
        <div className="w-screen h-screen overflow-hidden relative">
          <TopBar />
          <Desktop />
          <Dock />
        </div>
      </WindowManagerProvider>
    </CustomProjectsProvider>
    </NotesProvider>
    </GalleryProvider>
  )
}
