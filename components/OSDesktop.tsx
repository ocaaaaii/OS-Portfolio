'use client'
import { useState } from 'react'
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext'
import { CustomProjectsProvider, useCustomProjects, CustomProject } from '@/contexts/CustomProjectsContext'
import { PROJECT_APPS, SYSTEM_APPS } from '@/data/appConfig'
import TopBar from './TopBar'
import Dock from './Dock'
import AppIcon from './AppIcon'
import WindowModal from './WindowModal'
import AddProjectModal from './AddProjectModal'
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

function Desktop() {
  const { windows } = useWindowManager()
  const { customProjects } = useCustomProjects()
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="relative w-full h-full">
      {/* Scrollable desktop area */}
      <div
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ paddingTop: '40px', paddingBottom: '140px' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">

          {/* ── Top widgets row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProfileWidget />
            <SkillsWidget />
            <ExperienceWidget />
          </div>

          {/* ── Projects section ── */}
          <div>
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
            <div className="flex gap-6 sm:gap-8 flex-wrap">
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
            <div className="flex gap-6 sm:gap-8 flex-wrap">
              {SYSTEM_APPS.map(app => (
                <AppIcon key={app.id} app={app} />
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
    </div>
  )
}

export default function OSDesktop() {
  return (
    <CustomProjectsProvider>
      <WindowManagerProvider>
        <div className="w-screen h-screen overflow-hidden relative">
          <TopBar />
          <Desktop />
          <Dock />
        </div>
      </WindowManagerProvider>
    </CustomProjectsProvider>
  )
}
