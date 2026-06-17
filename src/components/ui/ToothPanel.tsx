"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DOCTORS, type Tooth } from "@/data/clinic";

/**
 * Floating glass panel that surfaces a selected tooth's clinical profile:
 * its name, the problems it commonly faces, recommended treatments, the
 * specialists who handle it, and a booking call-to-action. Behaves as a side
 * panel on desktop and a bottom sheet on mobile.
 */
export default function ToothPanel({
  tooth,
  onClose,
}: {
  tooth: Tooth | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {tooth && (
        <motion.aside
          key={tooth.id}
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 40, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="pointer-events-auto fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-3xl border border-gold-200/70 bg-white/85 p-6 shadow-glass-lg backdrop-blur-2xl sm:inset-x-auto sm:right-8 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2"
        >
          {/* header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
                <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] text-gold-700">
                  {tooth.notation}
                </span>
                Tooth profile
              </div>
              <h3 className="mt-2 font-display text-2xl leading-tight text-ink-900">
                {tooth.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close panel"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white transition-transform hover:scale-110"
            >
              ✕
            </button>
          </div>

          {/* problems */}
          <Section title="Common problems">
            <ul className="space-y-1.5">
              {tooth.type.problems.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-ink-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  {p}
                </li>
              ))}
            </ul>
          </Section>

          {/* treatments */}
          <Section title="Recommended treatments">
            <div className="flex flex-wrap gap-2">
              {tooth.type.treatments.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </Section>

          {/* doctors */}
          <Section title="Related specialists">
            <div className="space-y-2">
              {tooth.type.doctors.map((id) => {
                const d = DOCTORS[id];
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-sm font-semibold text-white shadow-gold">
                      {d.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-ink-900">
                        {d.name}
                      </div>
                      <div className="truncate text-xs text-ink-500">
                        {d.specialty} · ★ {d.rating.toFixed(1)} · {d.experience}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          <a
            href="#contact"
            className="mt-5 block w-full rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 py-3.5 text-center text-sm font-semibold text-white shadow-gold transition-transform hover:scale-[1.02]"
          >
            Book an appointment
          </a>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-ink-100 pt-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
        {title}
      </div>
      {children}
    </div>
  );
}
