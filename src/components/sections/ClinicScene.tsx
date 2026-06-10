"use client";

import { forwardRef } from "react";

/**
 * Stylised, fully-vector clinic scene: a reclined patient in a luxury dental
 * chair, rendered as layered SVG so it scales crisply during the cinematic
 * zoom and lets us animate the mouth opening without any photographic asset.
 *
 * Refs are forwarded to the elements the Hero timeline animates:
 *  - `faceRef`    : the head group the camera pushes toward
 *  - `mouthRef`   : the lower-jaw group that rotates open
 *  - `teethRef`   : the teeth row that brightens / scales as focus lands
 */
export interface ClinicSceneHandles {
  face: SVGGElement | null;
  mouth: SVGGElement | null;
  teeth: SVGGElement | null;
}

const ClinicScene = forwardRef<ClinicSceneHandles, { className?: string }>(
  function ClinicScene({ className = "" }, ref) {
    const assign = (key: keyof ClinicSceneHandles) => (el: SVGGElement | null) => {
      if (typeof ref === "function") return;
      if (ref && ref.current) ref.current[key] = el;
    };

    return (
      <svg
        viewBox="0 0 1200 800"
        className={className}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A patient reclining in a modern luxury dental chair"
      >
        <defs>
          <linearGradient id="room" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eaf3fb" />
            <stop offset="55%" stopColor="#d7e8f7" />
            <stop offset="100%" stopColor="#bcd6ee" />
          </linearGradient>
          <radialGradient id="lamp" cx="50%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="chair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a86ce" />
            <stop offset="100%" stopColor="#175082" />
          </linearGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe2cf" />
            <stop offset="100%" stopColor="#f4c4a3" />
          </linearGradient>
          <linearGradient id="gum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f08aa0" />
            <stop offset="100%" stopColor="#d6485f" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Room */}
        <rect width="1200" height="800" fill="url(#room)" />
        {/* Overhead surgical lamp glow */}
        <ellipse cx="600" cy="120" rx="520" ry="320" fill="url(#lamp)" />
        <g opacity="0.5">
          <ellipse cx="600" cy="90" rx="150" ry="46" fill="#ffffff" />
          <ellipse cx="600" cy="90" rx="110" ry="30" fill="#eaf3fb" />
        </g>

        {/* Floor shadow */}
        <ellipse cx="600" cy="720" rx="430" ry="60" fill="#9bbcdc" opacity="0.5" filter="url(#soft)" />

        {/* Dental chair */}
        <g>
          <rect x="240" y="470" width="720" height="150" rx="60" fill="url(#chair)" />
          <rect x="250" y="430" width="430" height="120" rx="56" fill="url(#chair)" transform="rotate(-8 250 430)" />
          {/* headrest */}
          <rect x="690" y="360" width="190" height="110" rx="40" fill="#1f6ba8" />
          {/* chair stem + base */}
          <rect x="560" y="610" width="80" height="120" rx="18" fill="#0f365b" />
          <ellipse cx="600" cy="740" rx="170" ry="26" fill="#0f365b" />
        </g>

        {/* Patient (reclined, head to the right) */}
        <g>
          {/* torso under a clinic bib */}
          <path
            d="M250 470 Q470 410 690 440 L690 540 Q470 520 250 560 Z"
            fill="#f8fafc"
          />
          <path
            d="M250 470 Q470 410 690 440 L690 470 Q470 450 250 510 Z"
            fill="#dbeafe"
            opacity="0.7"
          />

          {/* Head group — camera target */}
          <g ref={assign("face")} style={{ transformOrigin: "780px 420px" }}>
            {/* neck */}
            <rect x="690" y="430" width="60" height="46" rx="20" fill="url(#skin)" />
            {/* head */}
            <ellipse cx="800" cy="415" rx="92" ry="80" fill="url(#skin)" />
            {/* hair */}
            <path
              d="M720 400 Q740 320 830 330 Q900 340 884 405 Q860 360 800 360 Q745 360 720 400Z"
              fill="#3b2b22"
            />
            {/* ear */}
            <ellipse cx="746" cy="420" rx="14" ry="20" fill="#f0b896" />
            {/* eye (closed, relaxed) */}
            <path d="M812 392 q16 -8 30 0" stroke="#6b4a36" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* brow */}
            <path d="M810 378 q16 -6 32 -1" stroke="#3b2b22" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* nose */}
            <path d="M866 410 q12 12 -2 22" stroke="#e0a583" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* MOUTH region (animated open) */}
            <g ref={assign("mouth")} style={{ transformOrigin: "846px 452px" }}>
              {/* oral cavity */}
              <path
                d="M820 446 Q852 440 878 452 Q872 484 846 490 Q826 486 820 446Z"
                fill="#7a1d2b"
              />
              {/* gums */}
              <path d="M824 450 Q850 444 874 453 L872 462 Q850 456 826 461Z" fill="url(#gum)" />
              <path d="M826 480 Q848 486 870 479 L868 472 Q848 478 828 472Z" fill="url(#gum)" />

              {/* TEETH */}
              <g ref={assign("teeth")} style={{ transformOrigin: "846px 462px" }}>
                {/* upper row */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect
                    key={`u${i}`}
                    x={828 + i * 9}
                    y={455}
                    width={7}
                    height={9}
                    rx={2}
                    fill="#ffffff"
                  />
                ))}
                {/* lower row */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect
                    key={`l${i}`}
                    x={829 + i * 9}
                    y={470}
                    width={6}
                    height={8}
                    rx={2}
                    fill="#f3f6fb"
                  />
                ))}
              </g>
            </g>
          </g>
        </g>

        {/* faint atmospheric particles */}
        <g fill="#ffffff" opacity="0.6">
          <circle cx="320" cy="220" r="3" />
          <circle cx="430" cy="300" r="2" />
          <circle cx="980" cy="250" r="3" />
          <circle cx="1050" cy="380" r="2" />
          <circle cx="540" cy="180" r="2" />
        </g>
      </svg>
    );
  }
);

export default ClinicScene;
