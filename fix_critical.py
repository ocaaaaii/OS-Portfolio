import os

BASE = r'C:\Users\ACER\Documents\Claude\Projects\OS-Style-Portfolio'

def write(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print(f'  wrote: {rel}')

# ── appConfig.ts ──────────────────────────────────────────────────────────────
write('data/appConfig.ts', """\
import { WindowType } from '@/contexts/WindowManagerContext'

export interface AppConfig {
  id: string
  type: WindowType
  label: string
  emoji: string
  bg: string
  imgSrc?: string
  iconScale?: number
  iframeUrl?: string
}

export const PROJECT_APPS: AppConfig[] = [
  {
    id: 'project-mochi',
    type: 'project',
    label: 'Mochi Habit',
    emoji: 'M',
    bg: '#8AAEAB',
    imgSrc: '/Mochi.png',
    iconScale: 1.8,
    iframeUrl: 'https://mochiselfgrowingapp.vercel.app/home',
  },
  {
    id: 'project-stock',
    type: 'project',
    label: 'StockPlatform',
    emoji: 'S',
    bg: '#6A9896',
    imgSrc: '/Stock.png',
    iconScale: 2.5,
    iframeUrl: 'https://stockplatform-rp6tf42ln2k8qfcztevgvy.streamlit.app/',
  },
  {
    id: 'project-tip',
    type: 'project',
    label: 'Tip Split',
    emoji: 'T',
    bg: '#4A7070',
    imgSrc: '/Tipsplit.png',
    iconScale: 1.45,
    iframeUrl: 'https://tip-split-usa.vercel.app/',
  },
]

export const SYSTEM_APPS: AppConfig[] = [
  {
    id: 'terminal',
    type: 'terminal',
    label: 'Terminal',
    emoji: '>_',
    bg: '#2D2D2D',
  },
  {
    id: 'readme',
    type: 'readme',
    label: 'readme.txt',
    emoji: '.txt',
    bg: '#C4845A',
  },
  {
    id: 'contact',
    type: 'contact',
    label: 'Contact Me',
    emoji: '@',
    bg: '#9B84C4',
  },
]

export const ALL_APPS = [...PROJECT_APPS, ...SYSTEM_APPS]
""")

# ── AppIcon.tsx ───────────────────────────────────────────────────────────────
write('components/AppIcon.tsx', """\
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
""")

# ── ProfileWidget.tsx ─────────────────────────────────────────────────────────
write('components/widgets/ProfileWidget.tsx', """\
'use client'
import Image from 'next/image'

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

export default function ProfileWidget() {
  return (
    <div className="glass rounded-2xl p-5 fade-up flex flex-col gap-4" style={{ animationDelay: '0ms' }}>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0">
          <Image src="/my_pic.jpg" alt="Joanne Wu" fill
            className="object-cover rounded-full shadow-md"
            style={{ border: '2px solid var(--teal-light)' }} />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
            Joanne Wu&nbsp;<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(&#21556;&#30889;&#23433;)</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Software Engineer · Technical PM</p>
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        MS InfoMgmt GPA 3.98 · Full-stack dev at TSMC · AI research at ITRI
      </p>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">&#128231;</span>
          <a href="mailto:joannewu0314@gmail.com" className="text-xs hover:underline" style={{ color: 'var(--teal)' }}>
            joannewu0314@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">&#128222;</span>
          <a href="tel:+886988984614" className="text-xs hover:underline" style={{ color: 'var(--teal)' }}>
            +886 988 984 614
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Open to opportunities</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <a href="https://www.linkedin.com/in/joannewu-ca/" target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity"
          style={{ background: 'var(--teal)', color: '#fff' }}>
          <LinkedInIcon />
          LinkedIn
        </a>
        <a href="https://github.com/ocaaaaii" target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity"
          style={{ background: 'var(--teal-dark)', color: '#fff' }}>
          <GitHubIcon />
          GitHub
        </a>
      </div>
    </div>
  )
}
""")

print('\nAll done! Restart npm run dev.')
