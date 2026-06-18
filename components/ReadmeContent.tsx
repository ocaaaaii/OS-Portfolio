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
          About This Project
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          A browser-based <strong style={{ color: 'var(--text-primary)' }}>OS-style personal portfolio</strong> inspired by the desktop UI metaphor.
          Instead of a traditional scrolling page, everything lives inside an interactive desktop —
          widgets, draggable windows, a working terminal, and project showcases via iframe.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          About CA
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Hi! I&#39;m <strong style={{ color: 'var(--text-primary)' }}>Joanne Wu (吳蕎安)</strong> — a Software Engineer & Technical PM
          with an MS in Information Management (GPA 3.98) from NSYSU.
          I&#39;ve built full-stack platforms at <strong style={{ color: 'var(--text-primary)' }}>TSMC</strong>,
          conducted AI research at <strong style={{ color: 'var(--text-primary)' }}>ITRI</strong>,
          and ship side projects in my spare time.
          Currently seeking roles where I can bridge technology and people.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Tech Stack
        </h3>
        <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
          <li><strong style={{ color: 'var(--text-primary)' }}>Next.js 14</strong> — App Router, SPA architecture</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Tailwind CSS</strong> — utility-first styling</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>React Context</strong> — window manager (open / minimize / focus / drag)</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Lucide React</strong> — icons</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Vercel</strong> — deployment</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Features
        </h3>
        <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
          <li>&#128187;  Desktop widgets — Profile, Skills, Experience</li>
          <li>&#128450;&#65039;  readme.txt — this window you&#39;re reading right now</li>
          <li>&#62;&#95;  Terminal — type <code style={{ color: 'var(--accent-terra)' }}>help</code> to explore</li>
          <li>&#64;  Contact — email, phone, LinkedIn, GitHub</li>
          <li>&#128218;  Project apps — live iframes of deployed side projects</li>
          <li>&#10010;  Custom app creator — add your own apps via localStorage</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Design
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Morandi Sage &amp; Terracotta palette — soft cream tones, frosted glass (backdrop-blur) dock,
          squircle app icons, and smooth window animations. Built to feel premium without being loud.
        </p>
      </section>

      <p className="text-xs italic pt-2" style={{ color: 'var(--text-muted)' }}>
        — Designed &amp; built by Joanne Wu —
      </p>
    </div>
  )
}
