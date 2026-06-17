"use client";

import { useRef, useState } from "react";

/**
 * SECTION — Cosmetic Dentistry.
 * A draggable before/after reveal of a smile makeover plus a live whitening
 * shade selector, showing the artistry side of the clinic.
 */

const SHADES = [
  { id: "a3", label: "A3", color: "#e9dcb8" },
  { id: "a2", label: "A2", color: "#efe6cf" },
  { id: "a1", label: "A1", color: "#f6efe0" },
  { id: "bl2", label: "BL2", color: "#fbf7ee" },
  { id: "bl1", label: "BL1", color: "#ffffff" },
];

function Smile({ teeth, gum = "#e6798b" }: { teeth: string; gum?: string }) {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#1a0a0d" />
      <path d="M40 120 Q200 30 360 120 Q200 210 40 120 Z" fill="#5a121d" />
      <path d="M60 118 Q200 56 340 118 L340 92 Q200 44 60 92 Z" fill={gum} />
      {Array.from({ length: 10 }).map((_, i) => {
        const x = 66 + i * 28;
        const mid = Math.abs(i - 4.5);
        return (
          <rect
            key={i}
            x={x}
            y={104 + mid * 2}
            width={22}
            height={58 - mid * 3}
            rx={7}
            fill={teeth}
          />
        );
      })}
    </svg>
  );
}

export default function Cosmetic() {
  const [pos, setPos] = useState(50);
  const [shade, setShade] = useState("bl2");
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const v = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, v)));
  };

  const shadeColor = SHADES.find((s) => s.id === shade)?.color ?? "#ffffff";

  return (
    <section id="cosmetic" className="relative bg-porcelain py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(201,151,46,0.12),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-600">
            05 — Cosmetic Dentistry
          </span>
          <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
            The art of the perfect smile
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500">
            Veneers, bonding and whitening, designed pixel by pixel. Drag the
            handle to reveal a makeover, then preview your target whitening
            shade.
          </p>

          <div className="mt-8">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
              Whitening shade
            </div>
            <div className="flex gap-2">
              {SHADES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShade(s.id)}
                  className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl border-2 text-[10px] font-semibold transition-all ${
                    shade === s.id
                      ? "border-gold-500 scale-105 text-ink-800"
                      : "border-ink-100 text-ink-400"
                  }`}
                  style={{ background: s.color }}
                  aria-label={`Shade ${s.label}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Before / after slider */}
        <div>
          <div
            ref={wrap}
            className="relative aspect-[5/3] w-full cursor-ew-resize select-none overflow-hidden rounded-[32px] border border-gold-200/60 shadow-glass-lg"
            onMouseDown={(e) => {
              dragging.current = true;
              move(e.clientX);
            }}
            onMouseMove={(e) => dragging.current && move(e.clientX)}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchStart={(e) => move(e.touches[0].clientX)}
            onTouchMove={(e) => move(e.touches[0].clientX)}
          >
            {/* AFTER (full, uses selected shade) */}
            <div className="absolute inset-0">
              <Smile teeth={shadeColor} />
            </div>
            {/* BEFORE (clipped on the left) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Smile teeth="#cdbb8e" gum="#c76b7d" />
            </div>

            {/* divider */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white"
              style={{ left: `${pos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-300 bg-white text-gold-600 shadow">
                ⇆
              </div>
            </div>

            <span className="absolute left-4 top-4 rounded-full bg-ink-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Before
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              After
            </span>
          </div>
          <p className="mt-3 text-center text-xs text-ink-400">
            Drag to compare · selected shade {SHADES.find((s) => s.id === shade)?.label}
          </p>
        </div>
      </div>
    </section>
  );
}
