# Aurea Dental — Futuristic Interactive Clinic

An award-style, scroll-driven dental clinic website that blends an Apple-style
product page, a medical simulator and an interactive museum. The visitor starts
on a smiling patient, flies straight into a **fully interactive 3D jaw**, and
explores orthodontics, gum health, implants and cosmetic dentistry — all in a
premium white-and-gold key.

## ✨ Experience

| # | Section | What happens |
|---|---------|--------------|
| 1 | **Hero** | A photoreal smiling patient. A pinned GSAP timeline pushes the camera straight into the mouth, closing a vignette that hands off to the 3D scene. |
| 2 | **Teeth** | A real-time **React Three Fiber** jaw (32 procedural teeth on upper & lower arches). The camera flies out from inside the mouth, then orbit controls take over. Hover any tooth to highlight it; click it to open a floating panel with its **name, common problems, recommended treatments, related specialists and a booking CTA**. |
| 3 | **Orthodontics** | A scroll-controlled before/after: crowded, rotated teeth straighten into a perfect arch as braces appear and come off. |
| 4 | **Gum Diseases** | A realistic gum visualization you can drag from healthy to severely inflamed, with interactive hotspots explaining each clinical sign. |
| 5 | **Dental Implants** | An interactive implant anatomy — hover/tap the crown, abutment or titanium post to learn how each part rebuilds a missing tooth. |
| 6 | **Cosmetic Dentistry** | A draggable before/after smile-makeover slider plus a live whitening-shade selector. |

A **fixed vertical navigation** rail tracks the active section with a scroll-spy,
and the whole page rides on Lenis smooth scrolling synced to GSAP.

## 🧱 Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **React Three Fiber + Three.js + drei** — the interactive 3D jaw
- **GSAP + ScrollTrigger** — the pinned hero "fly into the mouth" timeline
- **Framer Motion** — scroll-driven section animations & micro-interactions
- **Tailwind CSS** — the white/gold luxury design system
- **Lenis** — buttery smooth scrolling

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## ▲ Deploy (Vercel)

This is a zero-config Next.js app — Vercel auto-detects everything.

1. Go to **vercel.com/new** and sign in (free Hobby plan is fine).
2. **Import** the `wooolly1/dentist-clinic-` repository.
3. Leave all defaults (Framework: **Next.js**, Build: `next build`, Output: auto)
   and click **Deploy**. The first build takes ~1–2 min.
4. Vercel gives you a live URL (e.g. `https://dentist-clinic.vercel.app`) and
   redeploys automatically on every push to `main`.

No environment variables are required.

## 🖼 The hero photo

The hero expects a realistic patient portrait at:

```
public/images/hero-patient.jpg
```

Drop a wide (≈16:9) front-facing smiling portrait there — the mouth should sit
around 62% down the frame so the zoom lands inside it. Until the file is added,
the hero falls back to an elegant gold gradient (no broken image). The zoom
target/origin is tuned in `src/components/sections/Hero.tsx`.

## 🗂 Architecture

```
src/
├── app/
│   ├── layout.tsx          # fonts, SEO metadata, JSON-LD
│   ├── page.tsx            # composes the six scenes
│   └── globals.css         # Tailwind layers, glass utilities, Lenis styles
├── components/
│   ├── three/
│   │   ├── Tooth.tsx       # one interactive procedural tooth (shape per type)
│   │   ├── Jaw.tsx         # 32 teeth on elliptical arches + gum ridges
│   │   └── JawScene.tsx    # canvas, lighting, scroll-driven camera + orbit
│   ├── sections/
│   │   ├── Hero.tsx        # patient + cinematic zoom into the mouth
│   │   ├── ExploreJaw.tsx  # pinned 3D jaw + selection state
│   │   ├── Orthodontics.tsx# scroll before/after alignment
│   │   ├── GumDisease.tsx  # inflammation visualization + hotspots
│   │   ├── Implants.tsx    # interactive implant anatomy
│   │   ├── Cosmetic.tsx    # before/after slider + whitening shades
│   │   └── ContactFooter.tsx
│   ├── ui/
│   │   ├── SideNav.tsx     # fixed vertical scroll-spy navigation
│   │   ├── Navbar.tsx, ToothPanel.tsx, LoadingScreen.tsx,
│   │   └── MouseLight.tsx, ToothIcon.tsx
│   └── providers/SmoothScrollProvider.tsx  # Lenis ↔ GSAP bridge
├── data/clinic.ts          # teeth, tooth archetypes, doctors, sections, clinic
└── lib/gsap.ts             # one-time plugin registration
```

### Design notes

- **Content-driven.** All 32 teeth, their clinical profiles and the section list
  derive from `src/data/clinic.ts`. Each tooth archetype carries its own
  problems, treatments and specialists.
- **Procedural 3D.** The jaw is generated entirely in code (rounded boxes, cusp
  spheres, tube-geometry gums) — no binary 3D assets to ship.
- **Accessibility & performance.** Respects `prefers-reduced-motion`, lazily
  loads the 3D canvas, and keeps the page interactive on mobile and tablet.
