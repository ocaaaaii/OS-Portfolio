'use client'
import { useRef, useCallback, ReactNode } from 'react'
import { WindowInstance } from '@/contexts/WindowManagerContext'
import { useWindowManager } from '@/contexts/WindowManagerContext'
import Terminal from './Terminal'
import ReadmeContent from './ReadmeContent'
import ContactContent from './ContactContent'

interface Props { win: WindowInstance }

export default function WindowModal({ win }: Props) {
  const { closeWindow, minimizeWindow, focusWindow, moveWindow } = useWindowManager()
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null)

  const onTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    focusWindow(win.id)
    dragOffset.current = { dx: e.clientX - win.position.x, dy: e.clientY - win.position.y }
    const onMove = (me: MouseEvent) => {
      if (!dragOffset.current) return
      moveWindow(win.id, { x: me.clientX - dragOffset.current.dx, y: me.clientY - dragOffset.current.dy })
    }
    const onUp = () => {
      dragOffset.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [win.id, win.position, focusWindow, moveWindow])

  let content: ReactNode
  if (win.type === 'terminal') {
    content = <Terminal />
  } else if (win.type === 'readme') {
    content = <ReadmeContent />
  } else if (win.type === 'contact') {
    content = <ContactContent />
  } else if (win.type === 'project' && win.iframeUrl) {
    content = (
      <div className="relative h-full w-full">
        <iframe src={win.iframeUrl} className="w-full h-full border-0" title={win.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" />
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[10px] pointer-events-none opacity-50"
          style={{ background: 'rgba(42,62,62,0.75)', color: '#F2EDE7' }}>
          {win.iframeUrl}
        </div>
      </div>
    )
  }

  if (win.isMinimized) return null

  return (
    <div
      className="fixed window-in select-none"
      style={{
        left: win.position.x, top: win.position.y,
        width: win.size.width, height: win.size.height,
        zIndex: win.zIndex,
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 100px)',
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div className="glass rounded-xl overflow-hidden flex flex-col h-full"
        style={{ boxShadow: '0 20px 48px rgba(42,62,62,0.22), 0 2px 8px rgba(42,62,62,0.10)' }}>
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-grab active:cursor-grabbing shrink-0"
          style={{ background: 'rgba(226,213,197,0.92)', borderBottom: '1px solid var(--glass-border)' }}
          onMouseDown={onTitleMouseDown}
        >
          <div className="flex gap-1.5">
            <button onClick={() => closeWindow(win.id)}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#e74c3c] transition-colors" />
            <button onClick={() => minimizeWindow(win.id)}
              className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#f39c12] transition-colors" />
            <button className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#27ae60] transition-colors" />
          </div>
          <span className="flex-1 text-center text-xs font-semibold tracking-wide truncate"
            style={{ color: 'var(--text-secondary)' }}>
            {win.title}
          </span>
          <div className="w-[52px]" />
        </div>
        <div className="flex-1 overflow-hidden" style={{ background: 'rgba(242,237,231,0.94)' }}>
          {content}
        </div>
      </div>
    </div>
  )
}
