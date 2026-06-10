# Lumière Dental — Cinematic Scroll Experience

A premium, award-style single-page dental clinic website built as an immersive,
**scroll-driven storytelling experience** — think Apple product launches meets
modern Awwwards sites. The visitor travels from a patient reclined in a luxury
dental chair, *into the mouth*, and tooth-by-tooth through six common dental
conditions, meeting the specialist who treats each one.

## ✨ Experience

| Scene | What happens |
| ----- | ------------ |
| **1 · Camera Zoom** | Pinned full-screen clinic scene. As you scroll, the "camera" dollies toward the patient's face, the jaw opens, and the teeth become the focus — driven by a GSAP ScrollTrigger timeline. |
| **2 · Enter the Mouth** | A dark, intimate interior with parallax tooth arches and drifting light particles for a sense of travelling inside the mouth. |
| **3 · Problems Journey** | Six chapters — Cavities, Gum Disease, Plaque & Tartar, Tooth Fracture, Root Canal Infection, Missing Tooth — each with a live 3D tooth, a scroll-reactive condition animation, educational copy, and an interactive specialist card. |

## 🧱 Tech stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** — design system, glassmorphism, premium palette
- **GSAP + ScrollTrigger** — pinned cinematic timelines & section progress
- **Framer Motion** — entrance animations, parallax, micro-interactions
- **Three.js + React Three Fiber + drei** — procedural 3D teeth & implant
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
│   ├── three/              # ToothMesh (procedural), ToothCanvas
│   └── sections/           # Hero, ClinicScene, MouthIntro,
│                           # ProblemScene, ConditionVisual, ContactFooter
├── data/
│   └── problems.ts         # single source of truth: chapters + doctors
├── hooks/
│   └── useSectionProgress.ts          # per-section scroll progress (0→1)
└── lib/
    └── gsap.ts             # one-time plugin registration
```

### Design notes

- **Zero binary assets.** Every visual — the patient, the chair, the 3D teeth,
  the implant, the condition effects — is generated from SVG, CSS and WebGL
  primitives, so the project is fully self-contained. Swap in real photography
  by editing `ClinicScene.tsx` and the doctor fields.
- **Content-driven.** Add or reorder chapters by editing `src/data/problems.ts`;
  the navigation, progress rail and journey all derive from it.
- **Accessibility & performance.** Respects `prefers-reduced-motion`, lazy-loads
  the 3D canvases, ships SEO metadata + structured data, and uses semantic
  landmarks and ARIA labels throughout.

## 🎨 Customisation

- **Palette** lives in `tailwind.config.ts` (`clinical`, `gold` scales).
- **Clinic details** (name, phone, address) live in `CLINIC` in
  `src/data/problems.ts`.
- **Doctors** are placeholder data — replace names, specialties and accents in
  the same file.

---

Built as a production-ready demonstration of cinematic, scroll-native web design
for premium healthcare branding.
