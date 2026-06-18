'use client'
import { useWindowManager } from '@/contexts/WindowManagerContext'
import { useCustomProjects } from '@/contexts/CustomProjectsContext'
import { ALL_APPS } from '@/data/appConfig'
import AppIcon from './AppIcon'

export default function Dock() {
  const { windows, restoreWindow, openWindow } = useWindowManager()
  const { customProjects } = useCustomProjects()
  const minimized = windows.filter(w => w.isMinimized)

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50"
      style={{ maxWidth: 'calc(100vw - 24px)' }}>
      <div
        className="glass rounded-2xl px-3 sm:px-5 py-2 sm:py-3 flex items-end gap-2 sm:gap-4 overflow-x-auto"
        style={{ boxShadow: '0 8px 32px rgba(42,62,62,0.18)', scrollbarWidth: 'none' }}
      >
        {ALL_APPS.map(app => <AppIcon key={app.id} app={app} size="sm" />)}

        {/* Custom project icons in dock */}
        {customProjects.map(p => (
          <button key={p.id}
            onClick={() => openWindow({ id: p.id, type: 'project', title: p.label, iframeUrl: p.iframeUrl })}
            className="flex flex-col items-center gap-1 group shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[22%] overflow-hidden shadow-md
              transition-transform duration-150 group-hover:scale-110 group-active:scale-95"
              style={{ backgroundColor: p.bg }}>
              {p.logoDataUrl
                ? <img src={p.logoDataUrl} alt={p.label} className="w-full h-full object-cover" />
                : <span className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                    {p.label[0]}
                  </span>
              }
            </div>
            <span className="text-[9px] font-medium truncate max-w-[48px] text-center"
              style={{ color: 'var(--text-muted)' }}>{p.label}</span>
          </button>
        ))}

        {minimized.length > 0 && (
          <div className="w-px h-10 rounded-full mx-1 shrink-0" style={{ background: 'var(--glass-border)' }} />
        )}
        {minimized.map(win => {
          const app = ALL_APPS.find(a => a.id === win.id)
          const custom = customProjects.find(p => p.id === win.id)
          const bg = app?.bg ?? custom?.bg ?? '#6A9896'
          const imgSrc = app?.imgSrc ?? custom?.logoDataUrl
          return (
            <button key={win.id} onClick={() => restoreWindow(win.id)}
              className="flex flex-col items-center gap-1 group shrink-0" title={win.title}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 squircle overflow-hidden flex items-center justify-center shadow-md
                transition-transform duration-150 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                style={{ backgroundColor: bg }}>
                {imgSrc
                  ? <img src={imgSrc} alt={win.title} className="w-full h-full object-cover" />
                  : <span className="font-mono text-white text-xs font-bold">{win.title[0]}</span>
                }
              </div>
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--teal)' }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
