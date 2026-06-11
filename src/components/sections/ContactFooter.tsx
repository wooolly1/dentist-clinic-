"use client";

import { motion } from "framer-motion";
import ToothIcon from "@/components/ui/ToothIcon";
import { CLINIC } from "@/data/problems";

/**
 * Closing call-to-action + footer. Brings the journey back to a warm, bright
 * clinical space and invites the visitor to book.
 */
export default function ContactFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-ivory to-clinical-50 px-6 pb-12 pt-28"
    >
      {/* soft ambient blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-clinical-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gold-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-clinical-500 to-clinical-700 text-white shadow-glass-lg"
        >
          <ToothIcon className="h-8 w-8" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl text-clinical-900 sm:text-6xl"
        >
          Your healthiest smile
          <br />
          <span className="text-gradient-clinical">starts with a scroll</span>
        </motion.h2>

        <p className="mx-auto mt-6 max-w-xl text-lg text-clinical-600">
          Book a consultation and let our specialists craft a treatment plan as
          precise and considered as the journey you just took.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={`tel:${CLINIC.phone.replace(/[^0-9+]/g, "")}`}
            className="rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-8 py-4 font-semibold text-white shadow-gold transition-transform hover:scale-105"
          >
            Book your visit
          </a>
          <a
            href={`mailto:${CLINIC.email}`}
            className="glass rounded-full px-8 py-4 font-semibold text-clinical-800 transition-transform hover:scale-105"
          >
            Email the clinic
          </a>
        </motion.div>

        <div className="mt-14 grid gap-6 border-t border-clinical-100 pt-10 text-left sm:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-clinical-400">
              Call
            </div>
            <div className="mt-1 text-clinical-800">{CLINIC.phone}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-clinical-400">
              Email
            </div>
            <div className="mt-1 text-clinical-800">{CLINIC.email}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-clinical-400">
              Visit
            </div>
            <div className="mt-1 text-clinical-800">{CLINIC.address}</div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 text-sm text-clinical-400 sm:flex-row">
          <span className="flex items-center gap-2">
            <ToothIcon className="h-4 w-4 text-clinical-400" />
            {CLINIC.name}
          </span>
          <span>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
