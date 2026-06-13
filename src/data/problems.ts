/**
 * Central content model for the scroll storytelling journey.
 *
 * Each "problem" is a chapter in the cinematic experience. It carries the
 * educational copy, the visual treatment used by the canvas / overlay layers,
 * and the specialist doctor responsible for treating the condition.
 *
 * All imagery is intentionally procedural (CSS / SVG / WebGL driven) so the
 * project is fully self-contained — swap `doctor.photo` for real assets later.
 */

export type ProblemVisual =
  | "cavity"
  | "gum"
  | "braces"
  | "plaque"
  | "fracture"
  | "rootcanal"
  | "missing"
  | "healthy";

/** Which tooth in the 10-tooth upper arch a localised condition affects. */
export type ToothTarget = number | "all" | "gumline";

export interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  /** Initials are used to render a tasteful avatar placeholder. */
  initials: string;
  /** Gradient accent for the avatar / card glow. */
  accent: string;
  rating: number;
}

export interface Problem {
  id: string;
  index: number;
  /** Eyebrow label shown above the title. */
  kicker: string;
  title: string;
  description: string;
  /** Short reinforcing stats shown as glass pills. */
  highlights: string[];
  visual: ProblemVisual;
  /** Tailwind-friendly accent hex used across the chapter. */
  color: string;
  /** Which tooth (or region) of the smile this condition sits on. */
  target: ToothTarget;
  /** Short label shown in the hover tooltip on the affected tooth. */
  tooltip: string;
  doctor: Doctor;
}

export const PROBLEMS: Problem[] = [
  {
    id: "cavities",
    index: 1,
    kicker: "Chapter 01 — Decay",
    title: "Dental Cavities",
    description:
      "Acids produced by plaque bacteria slowly dissolve enamel, opening a dark micro-cavity that deepens toward the nerve. Caught early, it is a painless, single-visit fix.",
    highlights: ["Painless laser fillings", "Same-day treatment", "Tooth-coloured resin"],
    visual: "cavity",
    color: "#2A86CE",
    target: 6,
    tooltip: "Cavity — decay eating the enamel",
    doctor: {
      name: "Dr. Layla Hassan",
      specialty: "Restorative Dentistry",
      experience: "12 years experience",
      initials: "LH",
      accent: "from-clinical-400 to-clinical-600",
      rating: 4.9,
    },
  },
  {
    id: "gum-disease",
    index: 2,
    kicker: "Chapter 02 — Inflammation",
    title: "Gum Disease",
    description:
      "When bacterial biofilm lingers at the gumline, tissues become inflamed, red and tender. Left untreated, gingivitis advances to periodontitis and threatens the bone that anchors your teeth.",
    highlights: ["Deep cleaning", "Laser gum therapy", "Tissue regeneration"],
    visual: "gum",
    color: "#E0556B",
    target: "gumline",
    tooltip: "Gum disease — inflamed, bleeding gums",
    doctor: {
      name: "Dr. Omar Khalil",
      specialty: "Periodontology",
      experience: "15 years experience",
      initials: "OK",
      accent: "from-rose-400 to-rose-600",
      rating: 5.0,
    },
  },
  {
    id: "orthodontics",
    index: 3,
    kicker: "Chapter 03 — Alignment",
    title: "Crooked Teeth & Braces",
    description:
      "Misaligned and crowded teeth strain the bite and trap plaque where a brush can't reach. Modern braces gently guide every tooth into a straight, balanced arch over time.",
    highlights: ["Self-ligating braces", "Clear aligners", "3D smile preview"],
    visual: "braces",
    color: "#7C5CD4",
    target: "all",
    tooltip: "Crowding — straightened with braces",
    doctor: {
      name: "Dr. Hana Saleh",
      specialty: "Orthodontics",
      experience: "16 years experience",
      initials: "HS",
      accent: "from-violet-400 to-indigo-600",
      rating: 5.0,
    },
  },
  {
    id: "plaque-tartar",
    index: 4,
    kicker: "Chapter 04 — Buildup",
    title: "Plaque & Tartar",
    description:
      "Soft plaque hardens into tartar within 48 hours, forming a rough mineral crust that brushing cannot remove. Professional scaling restores a glass-smooth, healthy surface.",
    highlights: ["Ultrasonic scaling", "Air-polishing", "Before / after clarity"],
    visual: "plaque",
    color: "#C9972E",
    target: "all",
    tooltip: "Plaque & tartar — hardened buildup",
    doctor: {
      name: "Dr. Sara Mansour",
      specialty: "Dental Hygiene & Prophylaxis",
      experience: "9 years experience",
      initials: "SM",
      accent: "from-gold-300 to-gold-500",
      rating: 4.8,
    },
  },
  {
    id: "tooth-fracture",
    index: 5,
    kicker: "Chapter 05 — Trauma",
    title: "Tooth Fracture",
    description:
      "A hairline crack can race through enamel and dentin under everyday biting forces. Digital X-ray imaging maps the fracture so we can stabilise the tooth before it splits.",
    highlights: ["Digital X-ray mapping", "Ceramic crowns", "Bonded reinforcement"],
    visual: "fracture",
    color: "#5B7C99",
    target: 3,
    tooltip: "Fracture — a crack through the crown",
    doctor: {
      name: "Dr. Yusuf Rahman",
      specialty: "Prosthodontics",
      experience: "18 years experience",
      initials: "YR",
      accent: "from-slate-400 to-slate-600",
      rating: 4.9,
    },
  },
  {
    id: "root-canal",
    index: 6,
    kicker: "Chapter 06 — Infection",
    title: "Root Canal Infection",
    description:
      "Deep within the tooth, the pulp chamber can become infected and inflamed, sending pain signals through the nerve. Microscopic endodontics removes the infection and seals the canal for life.",
    highlights: ["Microscope endodontics", "Single-visit option", "Pain-free recovery"],
    visual: "rootcanal",
    color: "#B5462F",
    target: 5,
    tooltip: "Infection — inflamed pulp inside",
    doctor: {
      name: "Dr. Nadia Farouk",
      specialty: "Endodontics",
      experience: "14 years experience",
      initials: "NF",
      accent: "from-orange-400 to-red-600",
      rating: 5.0,
    },
  },
  {
    id: "missing-tooth",
    index: 7,
    kicker: "Chapter 07 — Restoration",
    title: "Missing Tooth",
    description:
      "A gap is more than cosmetic — neighbouring teeth drift and the jawbone resorbs. A titanium implant rebuilds the root and crown, restoring full strength and a complete smile.",
    highlights: ["Titanium implants", "3D-guided surgery", "Lifetime restoration"],
    visual: "missing",
    color: "#1F9D8F",
    target: 4,
    tooltip: "Missing tooth — a gap in the arch",
    doctor: {
      name: "Dr. Karim Adel",
      specialty: "Implantology & Oral Surgery",
      experience: "20 years experience",
      initials: "KA",
      accent: "from-teal-400 to-emerald-600",
      rating: 5.0,
    },
  },
];

/**
 * The triumphant final frame of the journey: every condition treated, a
 * flawless, healthy smile with nothing left to fix.
 */
export const FINALE = {
  id: "healthy-smile",
  kicker: "The Result",
  title: "A flawless, healthy smile",
  description:
    "Every condition treated, every tooth restored. This is where the journey ends — a bright, complete smile with nothing left to fix.",
  highlights: ["No cavities", "Healthy gums", "Perfectly aligned"],
  color: "#1F9D8F",
};

export const CLINIC = {
  name: "Lumière Dental",
  tagline: "Cinematic, painless, precise dentistry",
  phone: "+1 (800) 555-0147",
  email: "hello@lumieredental.com",
  address: "100 Riverside Avenue, Suite 1200",
};
