'use client'
import { createContext, useContext, useReducer, ReactNode } from 'react'

export type WindowType = 'readme' | 'terminal' | 'project' | 'contact' | 'vibecoding'

export interface WindowInstance {
  id: string
  type: WindowType
  title: string
  isMinimized: boolean
  zIndex: number
  iframeUrl?: string
  previewImg?: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface WindowManagerState {
  windows: WindowInstance[]
  activeId: string | null
  zCounter: number
}

type Action =
  | { type: 'OPEN_WINDOW'; payload: Omit<WindowInstance, 'zIndex' | 'isMinimized' | 'position' | 'size'> }
  | { type: 'CLOSE_WINDOW'; payload: { id: string } }
  | { type: 'MINIMIZE_WINDOW'; payload: { id: string } }
  | { type: 'RESTORE_WINDOW'; payload: { id: string } }
  | { type: 'FOCUS_WINDOW'; payload: { id: string } }
  | { type: 'MOVE_WINDOW'; payload: { id: string; position: { x: number; y: number } } }

const DEFAULT_SIZES: Record<WindowType, { width: number; height: number }> = {
  readme:      { width: 560, height: 460 },
  vibecoding:  { width: 680, height: 580 },
  terminal: { width: 660, height: 420 },
  project:  { width: 920, height: 620 },
  contact:  { width: 500, height: 440 },
}

function getDefaultPosition(index: number) {
  return { x: 100 + index * 32, y: 80 + index * 32 }
}

function reducer(state: WindowManagerState, action: Action): WindowManagerState {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const existing = state.windows.find(w => w.id === action.payload.id)
      if (existing) {
        if (existing.isMinimized) {
          return reducer(state, { type: 'RESTORE_WINDOW', payload: { id: existing.id } })
        }
        return reducer(state, { type: 'FOCUS_WINDOW', payload: { id: existing.id } })
      }
      const newZ = state.zCounter + 1
      const newWin: WindowInstance = {
        ...action.payload,
        isMinimized: false,
        zIndex: newZ,
        position: getDefaultPosition(state.windows.length),
        size: DEFAULT_SIZES[action.payload.type],
      }
      return { windows: [...state.windows, newWin], activeId: newWin.id, zCounter: newZ }
    }
    case 'CLOSE_WINDOW': {
      const remaining = state.windows.filter(w => w.id !== action.payload.id)
      const newActive =
        state.activeId === action.payload.id
          ? (remaining.at(-1)?.id ?? null)
          : state.activeId
      return { ...state, windows: remaining, activeId: newActive }
    }
    case 'MINIMIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, isMinimized: true } : w
        ),
        activeId: state.activeId === action.payload.id ? null : state.activeId,
      }
    }
    case 'RESTORE_WINDOW': {
      const newZ = state.zCounter + 1
      return {
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, isMinimized: false, zIndex: newZ } : w
        ),
        activeId: action.payload.id,
        zCounter: newZ,
      }
    }
    case 'FOCUS_WINDOW': {
      const newZ = state.zCounter + 1
      return {
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, zIndex: newZ } : w
        ),
        activeId: action.payload.id,
        zCounter: newZ,
      }
    }
    case 'MOVE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, position: action.payload.position } : w
        ),
      }
    }
    default:
      return state
  }
}

interface WindowManagerContextValue {
  windows: WindowInstance[]
  activeId: string | null
  openWindow: (cfg: Omit<WindowInstance, 'zIndex' | 'isMinimized' | 'position' | 'size'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, pos: { x: number; y: number }) => void
}

const Ctx = createContext<WindowManagerContextValue | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], activeId: null, zCounter: 100 })
  return (
    <Ctx.Provider value={{
      windows: state.windows,
      activeId: state.activeId,
      openWindow:   (cfg) => dispatch({ type: 'OPEN_WINDOW',   payload: cfg }),
      closeWindow:  (id)  => dispatch({ type: 'CLOSE_WINDOW',  payload: { id } }),
      minimizeWindow:(id) => dispatch({ type: 'MINIMIZE_WINDOW',payload: { id } }),
      restoreWindow: (id) => dispatch({ type: 'RESTORE_WINDOW', payload: { id } }),
      focusWindow:  (id)  => dispatch({ type: 'FOCUS_WINDOW',  payload: { id } }),
      moveWindow: (id, pos) => dispatch({ type: 'MOVE_WINDOW', payload: { id, position: pos } }),
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useWindowManager() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWindowManager must be inside WindowManagerProvider')
  return ctx
}
