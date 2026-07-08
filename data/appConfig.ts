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
  previewImg?: string
}

export const PROJECT_APPS: AppConfig[] = [
  {
    id: 'project-moon-tarot',
    type: 'project',
    label: 'AI Moon Tarot',
    emoji: '🌙',
    bg: '#1A1330',
    imgSrc: '/AI-Moon-Tarot.png',
    iconScale: 1.0,
    iframeUrl: 'https://ai-moon-tarot.vercel.app/',
  },
  {
    id: 'project-parenting',
    type: 'project',
    label: 'AI Parenting Navigator',
    emoji: '🍼',
    bg: '#F0E8DC',
    imgSrc: '/AI-Parenting-Platform.png',
    iconScale: 1.0,
    iframeUrl: 'https://parent-navigator.vercel.app/',
  },
  {
    id: 'project-mochi',
    type: 'project',
    label: 'Mochi Habit',
    emoji: 'M',
    bg: '#8AAEAB',
    imgSrc: '/Mochi.png',
    iconScale: 1.0,
    iframeUrl: 'https://mochiselfgrowingapp.vercel.app/home',
  },
  {
    id: 'project-stock',
    type: 'project',
    label: 'StockPlatform',
    emoji: 'S',
    bg: '#A8C49A',
    imgSrc: '/Stock.png',
    iconScale: 1.0,
    iframeUrl: 'https://stockplatform-rp6tf42ln2k8qfcztevgvy.streamlit.app/',
    previewImg: '/stock-preview.png',
  },
  {
    id: 'project-tip',
    type: 'project',
    label: 'Tip Split',
    emoji: 'T',
    bg: '#4A7070',
    imgSrc: '/Tipsplit.png',
    iconScale: 1.0,
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
  {
    id: 'gallery',
    type: 'gallery',
    label: 'Gallery',
    emoji: '✦',
    bg: '#B07A6E',
  },
]

// NOTE section system apps
export const NOTE_SYSTEM_APPS: AppConfig[] = [
  {
    id: 'vibecoding',
    type: 'vibecoding',
    label: 'Vibe Coding',
    emoji: 'SOP',
    bg: '#7B6FA0',
  },
]

export const ALL_APPS = [...PROJECT_APPS, ...SYSTEM_APPS, ...NOTE_SYSTEM_APPS]
