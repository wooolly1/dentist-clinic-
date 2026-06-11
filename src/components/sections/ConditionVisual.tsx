"use client";

import type { ProblemVisual } from "@/data/problems";

/**
 * Scroll-reactive 2D overlay that illustrates each condition on top of the 3D
 * tooth. `p` is the section's 0→1 progress; visuals animate as a function of
 * it so the storytelling is driven entirely by scrolling — decay spreading,
 * gums reddening, plaque accreting, a crack racing through enamel, infection
 * pulsing, and a missing tooth being replaced by an implant.
 */
export default function ConditionVisual({
  variant,
  p,
  color,
}: {
  variant: ProblemVisual;
  p: number;
  color: string;
}) {
  // Bell-shaped focus: strongest while the section sits mid-viewport.
  const focus = Math.sin(Math.min(1, Math.max(0, p)) * Math.PI);

  switch (variant) {
    case "cavity":
      return (
        <Overlay>
          {/* decay spreads outward */}
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: `${40 + focus * 180}px`,
              height: `${40 + focus * 180}px`,
              transform: "translate(-30%, -60%)",
              background:
                "radial-gradient(circle, rgba(43,26,15,0.92) 0%, rgba(90,52,28,0.5) 45%, transparent 72%)",
              filter: "blur(2px)",
            }}
          />
          <Ripple focus={focus} color="#2b1a0f" />
        </Overlay>
      );

    case "gum":
      return (
        <Overlay>
          {/* redness floods in */}
          <div
            className="absolute inset-0"
            style={{
              opacity: focus,
              background:
                "radial-gradient(ellipse at 50% 70%, rgba(214,72,95,0.55) 0%, transparent 60%)",
              mixBlendMode: "multiply",
            }}
          />
          <PulseRing focus={focus} color="#d6485f" />
        </Overlay>
      );

    case "plaque":
      // Before / after wipe revealing a clean tooth.
      return (
        <Overlay>
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 0 0 ${focus * 100}%)`,
              background:
                "repeating-radial-gradient(circle at 60% 40%, rgba(231,216,166,0.6) 0 6px, rgba(200,180,120,0.35) 6px 12px)",
              mixBlendMode: "multiply",
              transition: "clip-path 0.1s linear",
            }}
          />
          <div className="absolute bottom-6 left-6 flex gap-2 text-[10px] font-semibold uppercase tracking-widest">
            <span className="rounded-full bg-clinical-900/70 px-2 py-1 text-white/80">
              Before
            </span>
            <span className="rounded-full bg-emerald-500/80 px-2 py-1 text-white">
              After
            </span>
          </div>
        </Overlay>
      );

    case "fracture":
      // X-ray tint + a crack that draws itself.
      return (
        <Overlay>
          <div
            className="absolute inset-0"
            style={{
              opacity: focus * 0.85,
              background:
                "linear-gradient(180deg, rgba(10,30,60,0.7), rgba(20,50,90,0.4))",
              mixBlendMode: "screen",
            }}
          />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200">
            <path
              d="M100 30 L92 80 L112 110 L96 150 L108 185"
              fill="none"
              stroke="#bfe2ff"
              strokeWidth="2.2"
              strokeLinecap="round"
              style={{
                strokeDasharray: 260,
                strokeDashoffset: 260 - focus * 260,
                filter: "drop-shadow(0 0 4px rgba(120,200,255,0.9))",
              }}
            />
          </svg>
        </Overlay>
      );

    case "rootcanal":
      return (
        <Overlay>
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${80 + focus * 60}px`,
              height: `${120 + focus * 80}px`,
              background:
                "radial-gradient(circle, rgba(255,90,54,0.85) 0%, rgba(255,59,31,0.4) 50%, transparent 75%)",
              filter: "blur(4px)",
              opacity: 0.5 + focus * 0.5,
            }}
          />
          <PulseRing focus={focus} color="#ff5a36" />
        </Overlay>
      );

    case "missing":
      return (
        <Overlay>
          {/* implant guide ring descending */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full border-2 border-dashed border-emerald-400/70"
            style={{
              width: "120px",
              height: "120px",
              top: `${20 + (1 - focus) * 30}%`,
              opacity: focus,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: focus * 0.4,
              background:
                "radial-gradient(circle at 50% 40%, rgba(31,157,143,0.4) 0%, transparent 60%)",
            }}
          />
        </Overlay>
      );

    default:
      return null;
  }
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {children}
    </div>
  );
}

function Ripple({ focus, color }: { focus: number; color: string }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: `${focus * 240}px`,
        height: `${focus * 240}px`,
        border: `1px solid ${color}`,
        opacity: (1 - focus) * 0.6,
      }}
    />
  );
}

function PulseRing({ focus, color }: { focus: number; color: string }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulseGlow rounded-full"
      style={{
        width: `${100 + focus * 80}px`,
        height: `${100 + focus * 80}px`,
        boxShadow: `0 0 60px 10px ${color}`,
        opacity: focus * 0.6,
      }}
    />
  );
}
