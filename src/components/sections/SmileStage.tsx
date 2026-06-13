"use client";

import { useMemo, useState } from "react";
import type { ProblemVisual, ToothTarget } from "@/data/problems";

/**
 * A front-facing, fully interactive smile rendered as layered SVG.
 *
 * Every tooth in the upper arch is its own interactive element: hovering it
 * lifts the tooth and surfaces a tooltip naming the condition, and clicking it
 * fires `onSelect` so the parent can reveal the responsible specialist.
 *
 * The `variant` paints the matching dental condition onto the smile — decay,
 * inflamed gums, braces, plaque, a fracture, an infection, a missing tooth, or
 * a flawless healthy smile — all procedurally, with no image assets.
 */

const TOOTH_COUNT = 10;

interface ToothBox {
  cx: number;
  top: number;
  w: number;
  h: number;
}

/** Lay teeth out along a gentle smile arc (corners sit lower). */
function buildTeeth(): ToothBox[] {
  const startX = 72;
  const spanX = 336;
  return Array.from({ length: TOOTH_COUNT }, (_, i) => {
    const t = i / (TOOTH_COUNT - 1); // 0..1
    const k = (t - 0.5) * 2; // -1..1
    const arch = k * k; // 0 centre → 1 corners
    return {
      cx: startX + t * spanX,
      top: 122 + arch * 30,
      w: 32 - arch * 7,
      h: 76 - arch * 18,
    };
  });
}

export interface SmileStageProps {
  variant: ProblemVisual;
  accent: string;
  /** Tooltip shown when hovering an affected tooth. */
  tooltip: string;
  /** Which tooth / region the condition sits on. */
  target: ToothTarget;
  /** Fired when the visitor clicks a tooth to meet the specialist. */
  onSelect?: () => void;
}

export default function SmileStage({
  variant,
  accent,
  tooltip,
  target,
  onSelect,
}: SmileStageProps) {
  const teeth = useMemo(buildTeeth, []);
  const [hover, setHover] = useState<number | null>(null);

  const healthy = variant === "healthy";
  const isAffected = (i: number) => {
    if (healthy) return false;
    if (target === "all" || target === "gumline") return true;
    return target === i;
  };

  const gumColor = variant === "gum" ? "#d6485f" : "#f3a3b4";

  return (
    <svg
      viewBox="0 0 480 320"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="An interactive smile — hover a tooth to see its condition"
    >
      <defs>
        <radialGradient id="cavityDecay" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1c1109" />
          <stop offset="60%" stopColor="#4a2c16" />
          <stop offset="100%" stopColor="#7a4a25" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="enamel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e4edf6" />
        </linearGradient>
        <linearGradient id="enamelBright" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef6ff" />
        </linearGradient>
        <linearGradient id="metalWire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9aa3ad" />
          <stop offset="50%" stopColor="#e8edf2" />
          <stop offset="100%" stopColor="#9aa3ad" />
        </linearGradient>
        <filter id="mouthBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Lips / mouth opening */}
      <path
        d="M30 150 Q240 40 450 150 Q240 230 30 150 Z"
        fill="#7a1d2b"
        opacity="0.9"
      />
      <path
        d="M44 150 Q240 58 436 150 Q240 214 44 150 Z"
        fill="#56121d"
        filter="url(#mouthBlur)"
      />

      {/* Gum arch */}
      <path
        d="M52 152 Q240 70 428 152 L428 116 Q240 44 52 116 Z"
        fill={gumColor}
        style={{ transition: "fill 0.5s ease" }}
      />
      {variant === "gum" && (
        <path
          d="M52 152 Q240 70 428 152 L428 116 Q240 44 52 116 Z"
          fill="#b3132c"
          opacity="0.6"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </path>
      )}

      {/* Lower teeth (faint, behind) */}
      <g opacity="0.5">
        {teeth.map((d, i) => (
          <rect
            key={`low-${i}`}
            x={d.cx - (d.w - 6) / 2}
            y={196}
            width={d.w - 6}
            height={26}
            rx={6}
            fill="#dbe6f1"
          />
        ))}
      </g>

      {/* Upper teeth — interactive */}
      {teeth.map((d, i) => {
        const missing = variant === "missing" && target === i;
        const affected = isAffected(i);
        const isHover = hover === i;
        const lift = isHover ? -8 : 0;

        if (missing) {
          // Empty socket where the tooth used to be.
          return (
            <g
              key={`tooth-${i}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              onClick={onSelect}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={d.cx - d.w / 2}
                y={d.top}
                width={d.w}
                height={d.h}
                rx={9}
                fill="#3a0d15"
              />
              <ellipse cx={d.cx} cy={d.top + 14} rx={d.w / 2 - 3} ry={8} fill="#26080e" />
            </g>
          );
        }

        return (
          <g
            key={`tooth-${i}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            onClick={onSelect}
            style={{
              cursor: "pointer",
              transform: `translateY(${lift}px)`,
              transition: "transform 0.25s ease",
            }}
          >
            {/* Enamel body */}
            <rect
              x={d.cx - d.w / 2}
              y={d.top}
              width={d.w}
              height={d.h}
              rx={9}
              fill={healthy ? "url(#enamelBright)" : "url(#enamel)"}
              stroke={isHover ? accent : "#cdddec"}
              strokeWidth={isHover ? 2 : 1}
              style={{ transition: "stroke 0.2s ease" }}
            />
            {/* Soft highlight */}
            <rect
              x={d.cx - d.w / 2 + 4}
              y={d.top + 5}
              width={4}
              height={d.h - 16}
              rx={2}
              fill="#ffffff"
              opacity="0.7"
            />

            {/* Condition overlays */}
            {variant === "cavity" && affected && (
              <circle cx={d.cx + 4} cy={d.top + d.h - 22} r={10} fill="url(#cavityDecay)" />
            )}

            {variant === "plaque" && (
              <rect
                x={d.cx - d.w / 2 + 1}
                y={d.top + 1}
                width={d.w - 2}
                height={14}
                rx={6}
                fill="#e7d39a"
                opacity="0.85"
              />
            )}

            {variant === "fracture" && affected && (
              <path
                d={`M${d.cx} ${d.top + 2} l-5 ${d.h * 0.4} l7 ${d.h * 0.25} l-4 ${
                  d.h * 0.3
                }`}
                fill="none"
                stroke="#2a3742"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            )}

            {variant === "rootcanal" && affected && (
              <ellipse cx={d.cx} cy={d.top + d.h / 2} rx={d.w / 3} ry={d.h / 3} fill="#ff4a2e">
                <animate
                  attributeName="opacity"
                  values="0.45;0.9;0.45"
                  dur="1.4s"
                  repeatCount="indefinite"
                />
              </ellipse>
            )}

            {variant === "braces" && (
              <>
                {/* Bracket */}
                <rect
                  x={d.cx - 6}
                  y={d.top + d.h / 2 - 6}
                  width={12}
                  height={12}
                  rx={2}
                  fill="#c9ced6"
                  stroke="#8a929c"
                  strokeWidth={0.8}
                />
                <circle cx={d.cx} cy={d.top + d.h / 2} r={2.6} fill="#eef1f5" />
              </>
            )}

            {/* Sparkles on a flawless smile */}
            {healthy && (isHover || i % 3 === 0) && (
              <g opacity={isHover ? 1 : 0.8}>
                <path
                  d={`M${d.cx + 6} ${d.top + 10} l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z`}
                  fill="#bfe6ff"
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur={`${2 + (i % 3) * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            )}

            {/* Attention ring on a localised problem tooth */}
            {affected &&
              (variant === "cavity" ||
                variant === "fracture" ||
                variant === "rootcanal") && (
                <circle
                  cx={d.cx}
                  cy={d.top + d.h / 2}
                  r={d.w / 2 + 6}
                  fill="none"
                  stroke={accent}
                  strokeWidth={1.5}
                  opacity={0.7}
                >
                  <animate
                    attributeName="r"
                    values={`${d.w / 2 + 4};${d.w / 2 + 12};${d.w / 2 + 4}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.7;0;0.7"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
          </g>
        );
      })}

      {/* Orthodontic archwire threaded across the brackets */}
      {variant === "braces" && (
        <path
          d={`M${teeth[0].cx} ${teeth[0].top + teeth[0].h / 2} ${teeth
            .map((d) => `L${d.cx} ${d.top + d.h / 2}`)
            .join(" ")}`}
          fill="none"
          stroke="url(#metalWire)"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      )}

      {/* Hover tooltip */}
      {hover !== null && (
        <Tooltip
          box={teeth[hover]}
          accent={accent}
          label={
            healthy
              ? "Perfect — no issues"
              : isAffected(hover)
              ? tooltip
              : "This one looks healthy"
          }
          showClickHint={!healthy && isAffected(hover)}
        />
      )}
    </svg>
  );
}

function Tooltip({
  box,
  label,
  accent,
  showClickHint,
}: {
  box: ToothBox;
  label: string;
  accent: string;
  showClickHint: boolean;
}) {
  const padX = 12;
  const w = Math.min(300, label.length * 6.6 + padX * 2);
  const h = showClickHint ? 44 : 30;
  const x = Math.max(8, Math.min(480 - w - 8, box.cx - w / 2));
  const y = Math.max(6, box.top - h - 14);

  return (
    <g pointerEvents="none" style={{ transition: "all 0.15s ease" }}>
      <rect x={x} y={y} width={w} height={h} rx={9} fill="#081d33" opacity="0.95" />
      <rect x={x} y={y} width={4} height={h} rx={2} fill={accent} />
      <text
        x={x + padX}
        y={y + 19}
        fill="#ffffff"
        fontSize="13"
        fontWeight={600}
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
      {showClickHint && (
        <text
          x={x + padX}
          y={y + 35}
          fill="#9cc6ec"
          fontSize="10"
          fontFamily="system-ui, sans-serif"
        >
          Click to meet the specialist →
        </text>
      )}
      {/* little pointer */}
      <path
        d={`M${box.cx - 6} ${y + h} L${box.cx + 6} ${y + h} L${box.cx} ${y + h + 7} Z`}
        fill="#081d33"
        opacity="0.95"
      />
    </g>
  );
}
