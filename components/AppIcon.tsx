'use client'
import Image from 'next/image'
import { AppConfig } from '@/data/appConfig'
import { useWindowManager } from '@/contexts/WindowManagerContext'

interface Props {
  app: AppConfig
  size?: 'sm' | 'md'
}

export default function AppIcon({ app, size = 'md' }: Props) {
  const { openWindow } = useWindowManager()
  const px        = size === 'sm' ? 48 : 64
  const labelSize = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <button
      onClick={() =>
        openWindow({ id: app.id, type: app.type, title: app.label, iframeUrl: app.iframeUrl })
      }
      className="flex flex-col items-center gap-1.5 group cursor-pointer select-none"
    >
      {app.imgSrc ? (
        <div
          className="shadow-md transition-transform duration-150 group-hover:scale-110 group-active:scale-95"
          style={{
            width: px,
            height: px,
            borderRadius: '22%',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: app.bg,
          }}
        >
          <Image
            src={app.imgSrc}
            alt={app.label}
            width={px}
            height={px}
            className="w-full h-full object-cover block"
            style={{ transform: `scale(${app.iconScale ?? 1.8})`, transformOrigin: 'center' }}
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center shadow-md transition-transform duration-150 group-hover:scale-110 group-active:scale-95"
          style={{
            width: px,
            height: px,
            borderRadius: '22%',
            backgroundColor: app.bg,
            flexShrink: 0,
          }}
        >
          {app.emoji === '>_' ? (
            <span className="font-mono font-bold text-white leading-none"
              style={{ fontSize: size === 'sm' ? '11px' : '13px' }}>
              &gt;_
            </span>
          ) : app.emoji.length > 1 ? (
            <span className="font-mono font-bold text-white leading-none tracking-tight"
              style={{ fontSize: size === 'sm' ? '10px' : '12px' }}>
              {app.emoji}
            </span>
          ) : (
            <span className="text-white font-bold leading-none"
              style={{ fontSize: size === 'sm' ? '18px' : '24px' }}>
              {app.emoji}
            </span>
          )}
        </div>
      )}

      <span className={`${labelSize} font-medium text-center leading-tight max-w-[72px] truncate`}
        style={{ color: 'var(--text-primary)' }}>
        {app.label}
      </span>
    </button>
  )
}
