"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ToothIcon from "./ToothIcon";
import { CLINIC } from "@/data/clinic";

const LINKS = [
  { label: "Teeth", href: "#teeth" },
  { label: "Orthodontics", href: "#orthodontics" },
  { label: "Gums", href: "#gum-disease" },
  { label: "Implants", href: "#implants" },
  { label: "Cosmetic", href: "#cosmetic" },
];

/**
 * Floating top navigation. Translucent over the hero, condensing into a glass
 * pill once the visitor scrolls into the bright clinical journey.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.7, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "glass shadow-glass"
            : "border border-white/15 bg-white/5 backdrop-blur-sm"
        }`}
      >
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-gold">
            <ToothIcon className="h-4 w-4" />
          </span>
          <span
            className={`font-display text-lg tracking-wide transition-colors ${
              scrolled ? "text-ink-900" : "text-white"
            }`}
          >
            {CLINIC.name}
          </span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-ink-600 hover:text-ink-900"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2 text-sm font-semibold text-white shadow-gold transition-transform hover:scale-105 sm:inline-block"
          >
            Book a visit
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={`flex h-9 w-9 items-center justify-center rounded-full md:hidden ${
              scrolled ? "text-ink-900" : "text-white"
            }`}
          >
            <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass absolute left-4 right-4 top-20 flex flex-col gap-1 rounded-3xl p-4 shadow-glass md:hidden"
        >
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 font-medium text-ink-800 hover:bg-gold-50"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-3 text-center font-semibold text-white"
            >
              Book a visit
            </a>
          </li>
        </motion.ul>
      )}
    </motion.header>
  );
}
