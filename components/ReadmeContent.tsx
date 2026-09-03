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
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last modified: Sep 2026</p>
        </div>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          About CA
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Hi! I&#39;m <strong style={{ color: 'var(--text-primary)' }}>Joanne Wu (吳蕎安)</strong> — an AI Engineer at <strong style={{ color: 'var(--text-primary)' }}>Heph.AI</strong>,
          building LLM &amp; Agentic platforms from the ground up.
          MS in Information Management (GPA 3.98) from NSYSU.
          Previously full-stack dev at <strong style={{ color: 'var(--text-primary)' }}>TSMC</strong>,
          led UI/UX &amp; full-stack on the AI Parenting Navigator at <strong style={{ color: 'var(--text-primary)' }}>ITRI</strong>,
          and keep shipping side projects for fun.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Fun Facts
        </h3>
        <ul className="text-sm space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
          <li>&#9749;&#65039;  Coffee &amp; protein are non-negotiable — so are side-projects!</li>
          <li>&#9992;&#65039;  3 months immersion in San Francisco — English fluent CTFR B2+(pre-Advanced) TOEIC 800, conversational Japanese &amp; still learning</li>
          <li>&#127915;  Music &amp; dancing are my reset between coding sessions</li>
          <li>&#127828;  Obsessed with picnics — good food, good view, good vibes</li>
          <li>&#9992;&#65039;  Love traveling — always planning the next trip</li>
          <li>&#129302;  Currently building LLM &amp; Agent platforms at Heph.AI</li>
          <li>&#129504;  MBTI: INTJ-A</li>
        </ul>
      </section>

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
          Tech Stack
        </h3>
        <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
          <li><strong style={{ color: 'var(--text-primary)' }}>Next.js 14</strong> — App Router, SPA architecture</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Tailwind CSS</strong> — utility-first styling</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>GSAP</strong> — entrance &amp; micro-interaction animations</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> — notes, gallery &amp; custom projects (PostgreSQL + Storage)</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>React Context</strong> — window manager (open / minimize / focus / drag)</li>
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
          <li>&#10010;  Custom app creator — add your own apps (synced to Supabase)</li>
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
