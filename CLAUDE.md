# CLAUDE.md - OS-Style Portfolio Hub (Advanced Edition)

## 🎯 Project Overview
An interactive, mobile/desktop OS-style personal portfolio landing page inspired by "DevOS". 
It features a premium Morandi & Cream aesthetic, customized information widgets, system apps (readme, terminal), and project apps that open in-built window modals (via Iframes) to deliver an immersive browser-based OS experience.

## 🛠️ Tech Stack & Constraints
- Framework: Next.js 14+ (App Router, SPA interactive architecture)
- Styling: Tailwind CSS
- Icons: Lucide React
- State Management: React Context for Window Manager (active window, z-index, open/minimize states) and LocalStorage for the dynamic "+" app feature.

## 🎨 UI & Aesthetics (Inspired by Sample)
- Vibe: Premium Morandi & Cream tones (Soft, clean, iOS-like minimalism).
- Dock Bar: A beautiful frosted glass (backdrop-blur) dock at the bottom holding high-frequency apps.
- App Icons: Squircle shape, soft-shadowed, consistent icon-to-label text spacing.

## 🗂️ Core Features & Window Behaviors
1. Top Section / Desktop Widgets: Smart stack widgets showcasing Profile, Photo, Skills, and Experience.
2. System Apps (In-OS Modal): 
   - `readme.txt`: Opens an elegant typography modal showing your bio.
   - `Terminal`: A functional mock terminal responding to `help`, `clear`, `skills`, `projects`.
3. Project Apps (Iframe Modal): Clickable icons that open a window containing an <iframe> pointing to your live deployed side projects.
4. Custom App Creator: A Floating "+" action button to add user-defined apps saved to LocalStorage.

## 🚫 Strict Restrictions (Anti-Patterns)
- DO NOT use unstyled default scrollbars; use Tailwind thin/hidden scrollbar classes.
- NEVER break the OS illusion—external links (GitHub, LinkedIn) can open in new tabs, but project showcase MUST use the internal Iframe Window Modal.
- Keep components modular: `OSDesktop`, `Dock`, `AppIcon`, `WindowModal`, `Terminal`.