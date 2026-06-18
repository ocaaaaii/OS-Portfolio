'use client'
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext'
import { PROJECT_APPS, SYSTEM_APPS } from '@/data/appConfig'
import TopBar from './TopBar'
import Dock from './Dock'
import AppIcon from './AppIcon'
import WindowModal from './WindowModal'
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

function Desktop() {
  const { windows } = useWindowManager()

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
            <SectionLabel>Projects</SectionLabel>
            <div className="flex gap-6 sm:gap-8 flex-wrap">
              {PROJECT_APPS.map(app => (
                <AppIcon key={app.id} app={app} />
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

      {/* ── Window layer (fixed, above everything) ── */}
      {windows.map(win => (
        <WindowModal key={win.id} win={win} />
      ))}
    </div>
  )
}

export default function OSDesktop() {
  return (
    <WindowManagerProvider>
      <div className="w-screen h-screen overflow-hidden relative">
        <TopBar />
        <Desktop />
        <Dock />
      </div>
    </WindowManagerProvider>
  )
}
