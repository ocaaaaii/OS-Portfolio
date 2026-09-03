'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

export default function ProfileWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Avatar + header pops in first
      gsap.from('.profile-header', {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.1,
      })
      // Bio line
      gsap.from('.profile-bio', {
        opacity: 0,
        y: 6,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.35,
      })
      // Contact items stagger
      gsap.from('.contact-item', {
        opacity: 0,
        x: -8,
        stagger: 0.08,
        duration: 0.35,
        ease: 'power2.out',
        delay: 0.55,
      })
      // Buttons
      gsap.from('.profile-btn', {
        opacity: 0,
        y: 6,
        stagger: 0.07,
        duration: 0.35,
        ease: 'power2.out',
        delay: 0.85,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="glass rounded-2xl p-5 fade-up flex flex-col gap-4" style={{ animationDelay: '0ms' }}>
      <div className="profile-header flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0">
          <Image src="/my_pic.jpg" alt="Joanne Wu" fill
            className="object-cover rounded-full shadow-md"
            style={{ border: '2px solid var(--teal-light)' }} />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
            Joanne Wu&nbsp;<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(吳蕎安)</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>AI Engineer @ Heph.AI</p>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8', letterSpacing: '0.04em' }}
            >
              NOW
            </span>
          </div>
        </div>
      </div>

      <p className="profile-bio text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Building LLM &amp; Agent Platforms · MS InfoMgmt GPA 3.98 · Prev. TSMC · ITRI
      </p>

      <div className="space-y-1.5">
        <div className="contact-item flex items-center gap-2">
          <span className="text-sm">&#128231;</span>
          <a href="mailto:joannewu0314@gmail.com" className="text-xs hover:underline" style={{ color: 'var(--teal)' }}>
            joannewu0314@gmail.com
          </a>
        </div>
        <div className="contact-item flex items-center gap-2">
          <span className="text-sm">&#128222;</span>
          <a href="tel:+886988984614" className="text-xs hover:underline" style={{ color: 'var(--teal)' }}>
            +886 988 984 614
          </a>
        </div>
        <div className="contact-item flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#818CF8' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Engineer · Open to collaboration</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <a href="https://www.linkedin.com/in/joannewu-ca/" target="_blank" rel="noopener noreferrer"
          className="profile-btn flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity"
          style={{ background: 'var(--teal)', color: '#fff' }}>
          <LinkedInIcon />
          LinkedIn
        </a>
        <a href="https://github.com/ocaaaaii" target="_blank" rel="noopener noreferrer"
          className="profile-btn flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity"
          style={{ background: 'var(--teal-dark)', color: '#fff' }}>
          <GitHubIcon />
          GitHub
        </a>
      </div>
      <a href="/CA.CV.pdf" target="_blank" rel="noopener noreferrer"
        className="profile-btn flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity w-full"
        style={{ background: 'rgba(106,152,150,0.15)', color: 'var(--teal-dark)', border: '1px solid var(--glass-border)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download CV
      </a>
    </div>
  )
}
