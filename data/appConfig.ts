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
    id: 'vibecoding',
    type: 'vibecoding',
    label: 'Vibe Coding',
    emoji: 'SOP',
    bg: '#7B6FA0',
  },
  {
    id: 'gallery',
    type: 'gallery',
    label: 'Gallery',
    emoji: '✦',
    bg: '#B07A6E',
  },
]

export const ALL_APPS = [...PROJECT_APPS, ...SYSTEM_APPS]
