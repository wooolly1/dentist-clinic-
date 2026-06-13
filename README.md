# Lumière Dental — Cinematic Scroll Experience

A premium, award-style single-page dental clinic website built as an immersive,
**scroll-driven storytelling experience** — think Apple product launches meets
modern Awwwards sites. The visitor travels from a patient reclined in a luxury
dental chair, *into the mouth*, and through an interactive smile where every
tooth can be inspected. The face turns around condition by condition until a
flawless, healthy smile remains.

## ✨ Experience

| Scene | What happens |
| ----- | ------------ |
| **1 · Camera Zoom** | Pinned full-screen clinic scene. As you scroll, the "camera" dollies toward the patient's face, the jaw opens, and the teeth become the focus — driven by a GSAP ScrollTrigger timeline. |
| **2 · Enter the Mouth** | A dark, intimate interior with parallax tooth arches and drifting light particles for a sense of travelling inside the mouth. |
| **3 · The Interactive Smile** | A single pinned face holds a front-facing, fully interactive smile. **Hover any tooth** to surface a tooltip naming its condition; **click** to slide in the responsible specialist's card. As you keep scrolling, the **face turns all the way around** and reveals the next condition painted onto the smile — cavities, gum disease, crooked teeth & braces, plaque & tartar, a fracture, a root-canal infection, a missing tooth — ending on a **flawless, healthy smile** with nothing left to fix. |

## 🧱 Tech stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** — design system, glassmorphism, premium palette
- **GSAP + ScrollTrigger** — pinned cinematic hero timeline
- **Framer Motion** — scroll progress, the chapter flip, entrance & micro-interactions
- **Procedural SVG** — the patient, the chair and the interactive smile are all
  drawn in code (no image assets)
- **Lenis** — buttery smooth scrolling, synced to GSAP's ticker

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## 🗂 Architecture

```
src/
├── app/
│   ├── layout.tsx          # fonts, SEO metadata, JSON-LD schema
│   ├── page.tsx            # composes the full scroll journey
│   └── globals.css         # Tailwind layers, glass utilities, Lenis styles
├── components/
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx   # Lenis ↔ GSAP ScrollTrigger bridge
│   ├── ui/                 # LoadingScreen, Navbar, ScrollProgress,
│   │                       # MouseLight, DoctorCard, ToothIcon
│   └── sections/           # Hero, ClinicScene, MouthIntro,
│                           # SmileJourney, SmileStage, ContactFooter
├── data/
│   └── problems.ts         # single source of truth: chapters + doctors
└── lib/
    └── gsap.ts             # one-time plugin registration
```

- **`SmileStage.tsx`** draws the front-facing smile as layered SVG: every tooth
  is its own interactive element (hover → tooltip, click → `onSelect`), and the
  `variant` paints the matching condition (decay, inflamed gums, braces, plaque,
  fracture, infection, missing tooth, or a flawless healthy smile).
- **`SmileJourney.tsx`** pins the face, maps scroll progress to the active
  chapter, spins the face 360° on each hand-off, and reveals the specialist's
  `DoctorCard` (tagged with the condition name) when a tooth is clicked.

### Design notes

- **Zero binary assets.** Every visual — the patient, the chair, the smile, the
  condition effects — is generated from SVG and CSS, so the project is fully
  self-contained. Swap in real photography by editing `ClinicScene.tsx` /
  `SmileStage.tsx` and the doctor fields.
- **Content-driven.** Add or reorder chapters by editing `src/data/problems.ts`;
  the navigation, progress rail and smile journey all derive from it. Each
  chapter sets a `visual`, a `target` tooth/region and a `tooltip`.
- **Accessibility & performance.** Respects `prefers-reduced-motion`, ships SEO
  metadata + structured data, and uses semantic landmarks and ARIA labels.

## 🎨 Customisation

- **Palette** lives in `tailwind.config.ts` (`clinical`, `gold` scales).
- **Clinic details** (name, phone, address) live in `CLINIC` in
  `src/data/problems.ts`.
- **Doctors** are placeholder data — replace names, specialties and accents in
  the same file.

---

Built as a production-ready demonstration of cinematic, scroll-native web design
for premium healthcare branding.
