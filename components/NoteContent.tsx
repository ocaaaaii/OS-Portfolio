'use client'
import { useNotes } from '@/contexts/NotesContext'
import { ReactNode, Fragment } from 'react'

// ── Inline formatter ─────────────────────────────────────────────────────────
function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = []
  // Patterns: **bold** | *italic* | `code` | ==highlight== | ~~strike~~
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|==(.+?)==|~~(.+?)~~/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>)
    if (m[1]) parts.push(<strong key={i++} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{m[1]}</strong>)
    else if (m[2]) parts.push(<em key={i++}>{m[2]}</em>)
    else if (m[3]) parts.push(<code key={i++} className="px-1.5 py-0.5 rounded text-[11px] font-mono"
      style={{ background: 'rgba(132,156,146,0.18)', color: 'var(--teal-dark)' }}>{m[3]}</code>)
    else if (m[4]) parts.push(<mark key={i++} style={{ background: 'rgba(196,132,90,0.22)', padding: '0 2px', borderRadius: 3, color: 'var(--text-primary)' }}>{m[4]}</mark>)
    else if (m[5]) parts.push(<s key={i++} style={{ opacity: 0.5 }}>{m[5]}</s>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>)
  return parts.length === 0 ? text : <>{parts}</>
}

// ── Block parser ──────────────────────────────────────────────────────────────
function parseMarkdown(md: string): ReactNode[] {
  const lines = md.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Empty line
    if (trimmed === '') { i++; continue }

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      blocks.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '16px 0' }} />)
      i++; continue
    }

    // Math block: $$...$$  (single-line OR multi-line)
    if (trimmed.startsWith('$$')) {
      let formula = ''
      if (trimmed.endsWith('$$') && trimmed.length > 4) {
        // Single-line: $$formula$$
        formula = trimmed.slice(2, -2).trim()
        i++
      } else {
        // Multi-line: opening $$ on its own line
        i++
        const fLines: string[] = []
        while (i < lines.length && lines[i].trim() !== '$$') {
          fLines.push(lines[i])
          i++
        }
        if (i < lines.length) i++ // skip closing $$
        formula = fLines.join('\n').trim()
      }
      blocks.push(
        <div key={key++} className="my-3 px-4 py-3 rounded-xl font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap"
          style={{ background: 'rgba(106,152,150,0.10)', border: '1px solid var(--glass-border)', color: 'var(--teal-dark)', fontSize: '12px' }}>
          {formula}
        </div>
      )
      continue
    }

    // Blockquote: > ...
    if (trimmed.startsWith('> ')) {
      const bqLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        bqLines.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push(
        <blockquote key={key++} className="my-3 px-4 py-2 rounded-r-lg text-sm"
          style={{ borderLeft: '3px solid var(--teal)', background: 'rgba(132,156,146,0.10)', color: 'var(--text-secondary)', margin: '12px 0' }}>
          {bqLines.map((l, j) => <p key={j} className="leading-relaxed">{renderInline(l)}</p>)}
        </blockquote>
      )
      continue
    }

    // Table: starts with |
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }
      // Filter out separator rows (| --- | --- |)
      const dataRows = tableLines.filter(l => !/^\|[\s\-|:]+\|$/.test(l))
      if (dataRows.length > 0) {
        const parseCells = (row: string) =>
          row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        const [header, ...body] = dataRows
        const headers = parseCells(header)
        blocks.push(
          <div key={key++} className="my-3 overflow-x-auto rounded-xl" style={{ border: '1px solid var(--glass-border)' }}>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ background: 'rgba(132,156,146,0.15)' }}>
                  {headers.map((h, j) => (
                    <th key={j} className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--teal-dark)', borderBottom: '1px solid var(--glass-border)' }}>
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    {parseCells(row).map((cell, ci) => (
                      <td key={ci} className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    }

    // Bullet list
    if (/^[-*+]\s/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s/, ''))
        i++
      }
      blocks.push(
        <ul key={key++} className="my-2 space-y-1" style={{ paddingLeft: '20px' }}>
          {items.map((item, j) => (
            <li key={j} className="text-sm leading-relaxed list-disc" style={{ color: 'var(--text-secondary)' }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''))
        i++
      }
      blocks.push(
        <ol key={key++} className="my-2 space-y-1" style={{ paddingLeft: '20px' }}>
          {items.map((item, j) => (
            <li key={j} className="text-sm leading-relaxed list-decimal" style={{ color: 'var(--text-secondary)' }}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Headers
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      blocks.push(<h1 key={key++} className="text-lg font-bold mt-2 mb-3 pb-2"
        style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)' }}>
        {renderInline(trimmed.slice(2))}
      </h1>)
      i++; continue
    }
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      blocks.push(<h2 key={key++} className="text-base font-bold mt-5 mb-2" style={{ color: 'var(--text-primary)' }}>
        {renderInline(trimmed.slice(3))}
      </h2>)
      i++; continue
    }
    if (trimmed.startsWith('### ')) {
      blocks.push(<h3 key={key++} className="text-sm font-bold mt-4 mb-1.5" style={{ color: 'var(--teal-dark)' }}>
        {renderInline(trimmed.slice(4))}
      </h3>)
      i++; continue
    }

    // Paragraph — collect until empty line or block marker
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^[-*+]\s|^\d+\.\s|^>|^\||^#{1,3}\s|^-{3,}$|\*{3,}$|^\$\$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim())
      i++
    }
    if (paraLines.length > 0) {
      blocks.push(
        <p key={key++} className="text-sm leading-relaxed my-2" style={{ color: 'var(--text-secondary)' }}>
          {renderInline(paraLines.join(' '))}
        </p>
      )
    } else {
      // Safety: if nothing matched and nothing consumed, skip the line to avoid infinite loop
      i++
    }
  }

  return blocks
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function NoteContent({ noteId }: { noteId: string }) {
  const { getNote } = useNotes()
  const note = getNote(noteId)

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
        <p className="text-sm">Note not found.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'rgba(250,247,243,0.98)' }}>
      {/* Note header */}
      <div className="px-6 pt-5 pb-3 shrink-0" style={{ borderBottom: '1px solid var(--glass-border)' }}>
        <h1 className="text-base font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{note.title}</h1>
        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          {new Date(note.createdAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Rendered markdown */}
      <div className="flex-1 overflow-y-auto px-6 py-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(132,156,146,0.3) transparent' }}>
        {parseMarkdown(note.content)}
        <div className="h-8" /> {/* bottom padding */}
      </div>
    </div>
  )
}
