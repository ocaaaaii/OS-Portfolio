'use client'
import { useWindowManager } from '@/contexts/WindowManagerContext'
import { ALL_APPS } from '@/data/appConfig'
import AppIcon from './AppIcon'

export default function Dock() {
  const { windows, restoreWindow } = useWindowManager()
  const minimized = windows.filter(w => w.isMinimized)

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="glass rounded-2xl px-5 py-3 flex items-end gap-4"
        style={{ boxShadow: '0 8px 32px rgba(42,62,62,0.18)' }}>
        {ALL_APPS.map(app => <AppIcon key={app.id} app={app} size="sm" />)}
        {minimized.length > 0 && (
          <div className="w-px h-10 rounded-full mx-1" style={{ background: 'var(--glass-border)' }} />
        )}
        {minimized.map(win => {
          const app = ALL_APPS.find(a => a.id === win.id)
          return (
            <button key={win.id} onClick={() => restoreWindow(win.id)}
              className="flex flex-col items-center gap-1 group" title={win.title}>
              <div className="w-12 h-12 squircle overflow-hidden flex items-center justify-center shadow-md
                transition-transform duration-150 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                style={{ backgroundColor: app?.bg ?? '#6A9896' }}>
                {app?.imgSrc ? (
                  <img src={app.imgSrc} alt={app.label} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono text-white text-xs font-bold">&gt;_</span>
                )}
              </div>
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--teal)' }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
