export default function ReadmeContent() {
  return (
    <div className="p-7 overflow-y-auto h-full space-y-5" style={{ color: 'var(--text-primary)' }}>
      <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
          style={{ background: 'var(--accent-terra)', color: '#fff' }}>
          .txt
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-wide">readme.txt</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last modified: June 2026</p>
        </div>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          About Me
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Hi! I&#39;m <strong style={{ color: 'var(--text-primary)' }}>Joanne Wu (吳蕎安)</strong> — a High-achieving Information Management MS
          (GPA 3.98) with full-stack development experience at{' '}
          <strong style={{ color: 'var(--text-primary)' }}>TSMC</strong> and advanced AI training at{' '}
          <strong style={{ color: 'var(--text-primary)' }}>ITRI</strong>.
          Proven track record of bridging business-tech gaps and managing 200+ participant field experiments.
          Seeking a Software Engineer or Technical PM role to deliver scalable, user-centric enterprise solutions.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Thesis
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Research on the <em>Impact of Generative AI Conversational Systems on Elderly Well-being</em>.
          Orchestrated a 3-month field experiment partnering with 7 community centers and 200+ elderly participants
          for a 3-week technology trial — proving GenAI&#39;s significant positive impact on emotional well-being.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Fun Facts
        </h3>
        <ul className="text-sm space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
          <li>&#9749;&#65039;  Coffee and protein are non-negotiable — so are side-projects</li>
          <li>&#9992;&#65039;  3 months immersion study in San Francisco — TOEIC 800, CEFR B2+ / pre-advanced</li>
          <li>&#127925;  Music + dancing are my reset between coding sessions</li>
          <li>&#127758;  English (Fluent) &#183; Mandarin (Native) &#183; Japanese (Conversational)</li>
          <li>&#129302;  Currently deep in AI / ML / DL / Image Processing at ITRI</li>
        </ul>
      </section>

      <p className="text-xs italic pt-2" style={{ color: 'var(--text-muted)' }}>
        — Open to Software Engineer &amp; Technical PM roles —
      </p>
    </div>
  )
}
