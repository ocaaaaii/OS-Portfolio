'use client'

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

const LINKS = [
  { icon: '📧', label: 'Email',    value: 'joannewu0314@gmail.com',      href: 'mailto:joannewu0314@gmail.com',           iconBg: '#6A9896', svg: null },
  { icon: '📞', label: 'Phone',    value: '+886 988 984 614',             href: 'tel:+886988984614',                        iconBg: '#6A9896', svg: null },
  { icon: null,  label: 'LinkedIn', value: 'linkedin.com/in/joannewu-ca', href: 'https://www.linkedin.com/in/joannewu-ca/', iconBg: '#0A66C2', svg: 'linkedin' },
  { icon: null,  label: 'GitHub',   value: 'github.com/ocaaaaii',         href: 'https://github.com/ocaaaaii',              iconBg: '#2D2D2D', svg: 'github' },
  { icon: '📍', label: 'Location', value: 'Taiwan  ·  Open to remote',   href: null,                                        iconBg: '#C4845A', svg: null },
]

export default function ContactContent() {
  return (
    <div className="p-7 overflow-y-auto h-full space-y-5" style={{ color: 'var(--text-primary)' }}>
      <div className="text-center pb-1">
        <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 text-2xl font-bold shadow-sm"
          style={{ background: 'var(--teal)', color: '#fff' }}>
          @
        </div>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          Let&apos;s connect!
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          Open to Software Engineer and Technical PM opportunities
        </p>
      </div>

      <div className="space-y-2.5">
        {LINKS.map(l => (
          <div key={l.label} className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(242,237,231,0.60)', border: '1px solid var(--glass-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white"
              style={{ background: l.iconBg }}>
              {l.svg === 'linkedin' ? <LinkedInIcon /> :
               l.svg === 'github'   ? <GitHubIcon />   :
               <span className="text-base leading-none">{l.icon}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                style={{ color: 'var(--text-muted)' }}>{l.label}</p>
              {l.href ? (
                <a href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-xs font-medium truncate block hover:underline"
                  style={{ color: 'var(--teal)' }}>
                  {l.value}
                </a>
              ) : (
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{l.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        I typically reply within 24 hours ✨
      </p>
    </div>
  )
}
