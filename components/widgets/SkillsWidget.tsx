'use client'

const SKILL_GROUPS = [
  {
    label: 'Languages',
    color: 'var(--teal)',
    skills: ['Python', 'JavaScript', 'SQL', 'Java', 'HTML / CSS'],
  },
  {
    label: 'Data & AI',
    color: 'var(--accent-terra)',
    skills: ['PyTorch', 'LangChain', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'OpenCV'],
  },
  {
    label: 'Web',
    color: 'var(--teal-dark)',
    skills: ['React', 'Flask', 'Full-Stack Architecture'],
  },
  {
    label: 'Tools',
    color: 'var(--accent-rose)',
    skills: ['Git', 'Agile Development', 'Database Design', 'Vibe Coding'],
  },
]

export default function SkillsWidget() {
  return (
    <div className="glass rounded-2xl p-5 fade-up space-y-4" style={{ animationDelay: '60ms' }}>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
        Skills
      </h2>
      {SKILL_GROUPS.map(group => (
        <div key={group.label}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: group.color }}>
            {group.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.skills.map(s => (
              <span key={s}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: 'rgba(132,156,146,0.12)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
