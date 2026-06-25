'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Note {
  id: string
  title: string
  content: string   // markdown
  color: string     // icon background color
  createdAt: number
}

export const NOTE_COLORS = [
  '#5A5272', // purple (default)
  '#7B6FA0', // lavender
  '#6A8178', // teal
  '#849C92', // sage
  '#B07A6E', // dusty rose
  '#C4845A', // terracotta
  '#9B84C4', // soft violet
  '#7A9CAA', // slate blue
  '#8A7060', // warm brown
  '#5E7A6A', // forest
]

const STORAGE_KEY = 'ca-notes'

const ML_NOTE_CONTENT = `評估模型好壞不能只靠「體感」，需要量化指標。常見的有 **Accuracy**、**Precision**、**Recall**、**F1-score**，以及用於曲線比較的 **ROC-AUC** 與 **PR-AUC**。

## 名詞定義

以**信用卡詐欺偵測**為例：

> 共 100 筆交易，70 筆正常、30 筆詐欺。偵測系統標記了 50 筆為詐欺，其中只有 16 筆是真詐欺，另 34 筆是被誤判的正常交易。

| | 標記為詐欺 | 標記為正常 |
| --- | --- | --- |
| **實際詐欺** | 16（TP） | 14（FN） |
| **實際正常** | 34（FP） | 36（TN） |

- **TP（True Positives）**：詐欺被正確偵測到。共 16 筆。
- **TN（True Negatives）**：正常交易正確放行。共 36 筆。
- **FP（False Positives）**：正常交易被誤報為詐欺（冤枉好人）。共 34 筆。
- **FN（False Negatives）**：詐欺交易漏網未被發現。共 14 筆。

## Accuracy（準確率）

模型預測正確數量佔整體的比例：

$$
Accuracy = (TP + TN) / (TP + TN + FP + FN) = 52 / 100 = 0.52
$$

> ⚠️ 資料不平衡時幾乎沒有參考價值。若詐欺率只有 1%，模型全猜「正常」也有 99% Accuracy，卻完全抓不到詐欺。

## Precision（精確率）

在「被預測為 Positive」中，真正是 Positive 的比例。在意 **誤報代價** 的場景：

$$
Precision = TP / (TP + FP) = 16 / 50 = 0.32
$$

**適用**：反垃圾郵件、誤殺代價高的情境（把正常交易擋掉 → 客戶體驗很差）。

## Recall（召回率）

在「實際為 Positive」中，成功找出的比例。在意 **漏掉代價** 的場景：

$$
Recall = TP / (TP + FN) = 16 / 30 = 0.53
$$

**適用**：詐欺偵測、疾病篩檢——寧可誤報也不能讓詐欺漏網。

## F1-score

Precision 與 Recall 通常不可兼得。F1 取兩者的調和平均數：

$$
F1 = 2PR / (P + R) = 2TP / (2TP + FP + FN) = 32 / 80 = 0.40
$$

一般化版本（β 控制 Recall 的權重）：

$$
F_β = (1 + β²) × PR / (β²×P + R)
$$

## ROC-AUC（Area Under ROC Curve）

ROC 空間：X 軸為 **FPR**，Y 軸為 **TPR**：

$$
FPR = FP / (FP + TN),  TPR = TP / (TP + FN)
$$

對同一模型用不同閾值畫出的曲線即 ROC 曲線，**越靠左上角越好**。AUC 為曲線下面積：

- **AUC = 1** → 完美分類器
- **0.5 < AUC < 1** → 有預測價值
- **AUC = 0.5** → 等同隨機猜測
- **AUC < 0.5** → 比隨機還差（反著預測反而更好）

> ROC-AUC 不受資料不平衡影響：FPR 和 TPR 分別只看各自的類別，互不干擾。

## PR-AUC（Area Under PR Curve）

X 軸為 Recall、Y 軸為 Precision 的曲線，**越靠右上角越好**。

在正例極少的情況下（如詐欺偵測），PR-AUC 比 ROC-AUC 更能反映模型真實能力，因為它直接反映你在少數正例上的表現。`

const INITIAL_NOTE: Note = {
  id: 'note-ml-metrics',
  title: 'ML 模型評估指標：Accuracy、Precision、Recall、F1 與 AUC',
  content: ML_NOTE_CONTENT,
  color: NOTE_COLORS[0],
  createdAt: Date.now(),
}

interface CtxValue {
  notes: Note[]
  addNote: (title: string, content: string, color?: string) => void
  removeNote: (id: string) => void
  updateNoteColor: (id: string, color: string) => void
  getNote: (id: string) => Note | undefined
}

const Ctx = createContext<CtxValue>({
  notes: [],
  addNote: () => {},
  removeNote: () => {},
  updateNoteColor: () => {},
  getNote: () => undefined,
})

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const parsed: Note[] = saved ? JSON.parse(saved) : []
      // Seed the initial ML note if it's not already present
      const hasInitial = parsed.some(n => n.id === INITIAL_NOTE.id)
      if (!hasInitial) {
        const seeded = [INITIAL_NOTE, ...parsed]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
        setNotes(seeded)
      } else {
        setNotes(parsed)
      }
    } catch {
      setNotes([INITIAL_NOTE])
    }
  }, [])

  function addNote(title: string, content: string, color = NOTE_COLORS[0]) {
    const note: Note = { id: `note-${Date.now()}`, title, content, color, createdAt: Date.now() }
    setNotes(prev => {
      const next = [note, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function removeNote(id: string) {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function updateNoteColor(id: string, color: string) {
    setNotes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, color } : n)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function getNote(id: string) {
    return notes.find(n => n.id === id)
  }

  return (
    <Ctx.Provider value={{ notes, addNote, removeNote, updateNoteColor, getNote }}>
      {children}
    </Ctx.Provider>
  )
}

export function useNotes() { return useContext(Ctx) }
