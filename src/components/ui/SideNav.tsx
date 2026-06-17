"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/data/clinic";

/**
 * Fixed vertical navigation rail. Highlights the active section via an
 * IntersectionObserver scroll-spy and smooth-scrolls on click. Condenses to a
 * dot rail on small screens.
 */
export default function SideNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed right-4 top-1/2 z-40 -translate-y-1/2 sm:right-6"
    >
      <ul className="flex flex-col gap-1">
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex items-center justify-end gap-3"
                aria-current={on ? "true" : undefined}
              >
                <span
                  className={`hidden whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 sm:block ${
                    on
                      ? "bg-ink-900 text-white shadow-glass"
                      : "text-ink-400 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <span className="mr-1 text-gold-400">{s.index}</span>
                  {s.label}
                </span>
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    on
                      ? "h-6 w-[6px] bg-gold-500"
                      : "h-[6px] w-[6px] bg-ink-200 group-hover:bg-gold-400"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
