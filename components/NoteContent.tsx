'use client'
import { useNotes } from '@/contexts/NotesContext'
import { ReactNode, Fragment } from 'react'
import katex from 'katex'

function renderMath(formula: string, display: boolean): ReactNode {
  try {
    const html = katex.renderToString(formula.trim(), {
      displayMode: display,
      throwOnError: false,
      output: 'html',
    })
    return (
      <span
        dangerouslySetInnerHTML={{ __html: html }}
        className={display ? 'block overflow-x-auto py-2' : 'inline'}
      />
    )
  } catch {
    return <code style={{ color: 'var(--teal-dark)' }}>{formula}</code>
  }
}

// ── Inline formatter ─────────────────────────────────────────────────────────
function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = []
  // Order matters: images before links; bold before italic
  const re = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|==(.+?)==|~~(.+?)~~|\$([^$\n]+?)\$/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>)

    if (m[1] !== undefined) {
      // Image inline: ![alt](url)
      // eslint-disable-next-line @next/next/no-img-element
      parts.push(<img key={i++} src={m[2]} alt={m[1]} className="inline max-h-24 rounded align-middle" />)
    } else if (m[3] !== undefined) {
      // Link: [text](url)
      parts.push(
        <a key={i++} href={m[4]} target="_blank" rel="noopener noreferrer"
          className="underline hover:opacity-75 transition-opacity"
          style={{ color: 'var(--teal)' }}>
          {m[3]}
        </a>
      )
    } else if (m[5]) {
      parts.push(<strong key={i++} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{m[5]}</strong>)
    } else if (m[6]) {
      parts.push(<em key={i++} style={{ fontStyle: 'italic' }}>{m[6]}</em>)
    } else if (m[7]) {
      parts.push(
        <code key={i++} className="px-1.5 py-0.5 rounded text-[11px] font-mono"
          style={{ background: 'rgba(132,156,146,0.18)', color: 'var(--teal-dark)' }}>
          {m[7]}
        </code>
      )
    } else if (m[8]) {
      parts.push(
        <mark key={i++} style={{ background: 'rgba(196,132,90,0.22)', padding: '0 2px', borderRadius: 3, color: 'var(--text-primary)' }}>
          {m[8]}
        </mark>
      )
    } else if (m[9]) {
      parts.push(<s key={i++} style={{ opacity: 0.5 }}>{m[9]}</s>)
    } else if (m[10]) {
      parts.push(<Fragment key={i++}>{renderMath(m[10], false)}</Fragment>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>)
  return parts.length === 0 ? text : <>{parts}</>
}

// ── List helpers ──────────────────────────────────────────────────────────────
interface RawItem {
  text: string
  indent: number
  checked: boolean | null
  ordered: boolean
}

function collectList(lines: string[], start: number): { items: RawItem[]; end: number } {
  const items: RawItem[] = []
  let i = start
  while (i < lines.length) {
    const line = lines[i]
    const indentLen = line.match(/^(\s*)/)?.[1].length ?? 0
    const trimmed = line.trim()
    const isUnordered = /^[-*+]\s/.test(trimmed)
    const isOrdered   = /^\d+\.\s/.test(trimmed)
    if (!isUnordered && !isOrdered) break

    let text = isUnordered
      ? trimmed.replace(/^[-*+]\s/, '')
      : trimmed.replace(/^\d+\.\s/, '')
    let checked: boolean | null = null
    if (/^\[ \]\s/.test(text))     { checked = false; text = text.slice(4) }
    else if (/^\[x\]\s/i.test(text)) { checked = true;  text = text.slice(4) }

    items.push({ text, indent: indentLen, checked, ordered: isOrdered })
    i++
  }
  return { items, end: i }
}

function renderNestedList(items: RawItem[], baseIndent: number, keyRef: { n: number }): ReactNode {
  const result: ReactNode[] = []
  let i = 0
  while (i < items.length) {
    const item = items[i]
    if (item.indent < baseIndent) break
    if (item.indent > baseIndent) { i++; continue }

    // Collect children (deeper indent)
    const children: RawItem[] = []
    let j = i + 1
    while (j < items.length && items[j].indent > baseIndent) {
      children.push(items[j])
      j++
    }

    const childNode = children.length > 0
      ? <ul className="mt-1 space-y-0.5" style={{ paddingLeft: '16px' }}>
          {renderNestedList(children, children[0].indent, keyRef)}
        </ul>
      : null

    const k = keyRef.n++

    if (item.checked !== null) {
      // Task list item
      result.push(
        <li key={k} style={{ listStyle: 'none' }} className="flex items-start gap-2 text-sm leading-relaxed">
          <span className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center"
            style={{
              borderColor: item.checked ? 'var(--teal)' : 'var(--glass-border)',
              background:  item.checked ? 'rgba(122,166,194,0.2)' : 'transparent',
            }}>
            {item.checked && (
              <svg width="9" height="9" viewBox="0 0 12 12">
                <polyline points="2,6 5,9 10,3" fill="none" stroke="var(--teal)"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
          <span style={{
            color: 'var(--text-secondary)',
            textDecoration: item.checked ? 'line-through' : 'none',
            opacity: item.checked ? 0.5 : 1,
          }}>
            {renderInline(item.text)}
          </span>
          {childNode}
        </li>
      )
    } else {
      result.push(
        <li key={k} className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)', display: 'list-item' }}>
          {renderInline(item.text)}
          {childNode}
        </li>
      )
    }
    i = j
  }
  return <>{result}</>
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

    // ── Empty line
    if (trimmed === '') { i++; continue }

    // ── Horizontal rule
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      blocks.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '16px 0' }} />)
      i++; continue
    }

    // ── Fenced code block: ```[lang]
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim()
      i++
      const codeLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length) i++ // skip closing ```
      blocks.push(
        <div key={key++} className="my-3 rounded-xl overflow-hidden"
          style={{ background: 'rgba(42,46,53,0.88)', border: '1px solid rgba(184,205,217,0.15)' }}>
          {lang && (
            <div className="px-4 pt-2.5 pb-1 text-[10px] font-mono tracking-widest uppercase"
              style={{ color: 'rgba(184,205,217,0.55)', borderBottom: '1px solid rgba(184,205,217,0.10)' }}>
              {lang}
            </div>
          )}
          <pre className="px-4 py-3 text-[12px] font-mono leading-relaxed overflow-x-auto whitespace-pre"
            style={{ color: '#FEFAE6', margin: 0 }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      )
      continue
    }

    // ── Math block: $$
    if (trimmed.startsWith('$$')) {
      let formula = ''
      if (trimmed.endsWith('$$') && trimmed.length > 4) {
        formula = trimmed.slice(2, -2).trim()
        i++
      } else {
        i++
        const fLines: string[] = []
        while (i < lines.length && lines[i].trim() !== '$$') { fLines.push(lines[i]); i++ }
        if (i < lines.length) i++
        formula = fLines.join('\n').trim()
      }
      blocks.push(
        <div key={key++} className="my-3 px-4 py-3 rounded-xl overflow-x-auto text-center"
          style={{ background: 'rgba(106,152,150,0.08)', border: '1px solid var(--glass-border)' }}>
          {renderMath(formula, true)}
        </div>
      )
      continue
    }

    // ── Standalone image: ![alt](url) on its own line
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      blocks.push(
        <div key={key++} className="my-3 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgMatch[2]} alt={imgMatch[1]}
            className="max-w-full rounded-xl shadow-md"
            style={{ maxHeight: '320px', objectFit: 'contain' }} />
        </div>
      )
      i++; continue
    }

    // ── Blockquote (supports >> nested)
    if (trimmed.startsWith('>')) {
      const bqLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        bqLines.push(lines[i].trim())
        i++
      }
      const innerLines = bqLines.map(l => l.replace(/^>\s?/, ''))
      const hasNested = innerLines.some(l => l.startsWith('>'))
      blocks.push(
        <blockquote key={key++} className="my-3 px-4 py-2 rounded-r-lg"
          style={{ borderLeft: '3px solid var(--teal)', background: 'rgba(132,156,146,0.10)', margin: '12px 0' }}>
          {hasNested
            ? parseMarkdown(innerLines.join('\n'))
            : innerLines.map((l, j) => (
                <p key={j} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {renderInline(l)}
                </p>
              ))}
        </blockquote>
      )
      continue
    }

    // ── Table
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }
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
                    <th key={j} className="px-3 py-2 text-left font-semibold"
                      style={{ color: 'var(--teal-dark)', borderBottom: '1px solid var(--glass-border)' }}>
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

    // ── Lists (bullet / ordered / task, with nesting)
    if (/^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const { items, end } = collectList(lines, i)
      i = end
      const hasTasks  = items.some(it => it.checked !== null)
      const isOrdered = (items[0]?.ordered ?? false) && !hasTasks
      const baseIndent = items[0]?.indent ?? 0
      const keyRef = { n: key }
      key += items.length * 3 + 5

      const ListTag = isOrdered ? 'ol' : 'ul'
      blocks.push(
        <ListTag key={keyRef.n} className="my-2 space-y-1"
          style={{ paddingLeft: hasTasks ? '0' : '20px', listStyleType: isOrdered ? 'decimal' : 'disc' }}>
          {renderNestedList(items, baseIndent, keyRef)}
        </ListTag>
      )
      continue
    }

    // ── Headings (h4 → h1, most-specific first)
    if (trimmed.startsWith('#### ')) {
      blocks.push(
        <h4 key={key++} className="text-xs font-bold mt-3 mb-1 uppercase tracking-wider"
          style={{ color: 'var(--teal)' }}>
          {renderInline(trimmed.slice(5))}
        </h4>
      )
      i++; continue
    }
    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h3 key={key++} className="text-sm font-bold mt-4 mb-1.5" style={{ color: 'var(--teal-dark)' }}>
          {renderInline(trimmed.slice(4))}
        </h3>
      )
      i++; continue
    }
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h2 key={key++} className="text-base font-bold mt-5 mb-2" style={{ color: 'var(--text-primary)' }}>
          {renderInline(trimmed.slice(3))}
        </h2>
      )
      i++; continue
    }
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h1 key={key++} className="text-lg font-bold mt-2 mb-3 pb-2"
          style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)' }}>
          {renderInline(trimmed.slice(2))}
        </h1>
      )
      i++; continue
    }

    // ── Paragraph (supports trailing double-space hard line break)
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^[-*+]\s|^\d+\.\s|^>|^\||^#{1,6}\s|^-{3,}$|\*{3,}$|^\$\$|^```|^!\[/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      const children: ReactNode[] = []
      paraLines.forEach((pl, pi) => {
        const hardBreak = pl.endsWith('  ')
        children.push(<Fragment key={pi}>{renderInline(pl.trimEnd())}</Fragment>)
        if (hardBreak && pi < paraLines.length - 1) children.push(<br key={`br-${pi}`} />)
        else if (pi < paraLines.length - 1) children.push(' ')
      })
      blocks.push(
        <p key={key++} className="text-sm leading-relaxed my-2" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </p>
      )
    } else {
      i++ // safety: skip unmatched line
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
        <div className="h-8" />
      </div>
    </div>
  )
}
