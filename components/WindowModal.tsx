'use client'
import { useRef, useCallback, useEffect, ReactNode } from 'react'
import { WindowInstance } from '@/contexts/WindowManagerContext'
import { useWindowManager } from '@/contexts/WindowManagerContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import Terminal from './Terminal'
import ReadmeContent from './ReadmeContent'
import ContactContent from './ContactContent'
import VibeCodingContent from './VibeCodingContent'
import GalleryContent from './GalleryContent'
import NoteContent from './NoteContent'

interface Props { win: WindowInstance }

export default function WindowModal({ win }: Props) {
  const { closeWindow, minimizeWindow, focusWindow, moveWindow } = useWindowManager()
  const isMobile = useIsMobile(1024)
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null)

  // Lock body scroll on mobile when modal is open
  useEffect(() => {
    if (!isMobile || win.isMinimized) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isMobile, win.isMinimized])

  const onTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return
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
  }, [win.id, win.position, focusWindow, moveWindow, isMobile])

  let content: ReactNode
  if (win.type === 'terminal') {
    content = <Terminal />
  } else if (win.type === 'readme') {
    content = <ReadmeContent />
  } else if (win.type === 'contact') {
    content = <ContactContent />
  } else if (win.type === 'vibecoding') {
    content = <VibeCodingContent />
  } else if (win.type === 'gallery') {
    content = <GalleryContent />
  } else if (win.type === 'note') {
    content = <NoteContent noteId={win.id} />
  } else if (win.type === 'project' && win.iframeUrl) {
    if (win.previewImg) {
      content = (
        <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#1A1A1A' }}>
          {/* screenshot */}
          <img
            src={win.previewImg}
            alt={`${win.title} preview`}
            className="w-full h-full object-contain"
          />
          {/* overlay gradient + button */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8"
            style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.85) 0%, transparent 50%)' }}>
            <p className="text-xs mb-3 opacity-60" style={{ color: '#E8DDD0' }}>
              Preview — live embed not available
            </p>
            <a
              href={win.iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ background: 'var(--teal)', color: '#fff' }}
            >
              Open {win.title}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      )
    } else {
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
  }

  if (win.isMinimized) return null

  /* ── Title bar (shared) ── */
  const titleBar = (
    <div
      className={`flex items-center gap-3 px-4 py-3 shrink-0 ${isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
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
  )

  /* ── Mobile / Tablet: full-screen bottom sheet ── */
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 slide-up flex flex-col"
        style={{ zIndex: win.zIndex + 50 }}
        onClick={() => focusWindow(win.id)}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(42,30,30,0.35)', backdropFilter: 'blur(4px)' }}
          onClick={() => closeWindow(win.id)}
        />
        {/* sheet — takes up most of the screen, sits at bottom */}
        <div
          className="relative mt-auto rounded-t-2xl overflow-hidden flex flex-col"
          style={{
            height: '93dvh',
            background: 'rgba(242,237,231,0.97)',
            boxShadow: '0 -8px 40px rgba(42,62,62,0.22)',
          }}
        >
          {/* drag handle */}
          <div className="flex justify-center pt-2 pb-0 shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(132,156,146,0.35)' }} />
          </div>
          {titleBar}
          <div className="flex-1 overflow-hidden">
            {content}
          </div>
        </div>
      </div>
    )
  }

  /* ── Desktop: draggable window ── */
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
        {titleBar}
        <div className="flex-1 overflow-hidden" style={{ background: 'rgba(242,237,231,0.94)' }}>
          {content}
        </div>
      </div>
    </div>
  )
}
