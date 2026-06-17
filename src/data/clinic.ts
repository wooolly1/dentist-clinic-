/**
 * Single source of truth for the Aurea Dental experience: the clinic identity,
 * the specialist team, the per-tooth clinical knowledge that powers the
 * interactive 3D jaw, and the content for each themed section.
 */

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  initials: string;
  rating: number;
}

export const DOCTORS: Record<string, Doctor> = {
  restorative: {
    id: "restorative",
    name: "Dr. Layla Hassan",
    specialty: "Restorative & General Dentistry",
    experience: "12 yrs",
    initials: "LH",
    rating: 4.9,
  },
  ortho: {
    id: "ortho",
    name: "Dr. Hana Saleh",
    specialty: "Orthodontics",
    experience: "16 yrs",
    initials: "HS",
    rating: 5.0,
  },
  perio: {
    id: "perio",
    name: "Dr. Omar Khalil",
    specialty: "Periodontology",
    experience: "15 yrs",
    initials: "OK",
    rating: 5.0,
  },
  implant: {
    id: "implant",
    name: "Dr. Karim Adel",
    specialty: "Implantology & Oral Surgery",
    experience: "20 yrs",
    initials: "KA",
    rating: 5.0,
  },
  cosmetic: {
    id: "cosmetic",
    name: "Dr. Nadia Farouk",
    specialty: "Cosmetic & Endodontics",
    experience: "14 yrs",
    initials: "NF",
    rating: 4.9,
  },
  endo: {
    id: "endo",
    name: "Dr. Yusuf Rahman",
    specialty: "Endodontics",
    experience: "18 yrs",
    initials: "YR",
    rating: 4.9,
  },
};

/** The eight tooth archetypes, each carrying its clinical knowledge. */
export type ToothTypeKey =
  | "central"
  | "lateral"
  | "canine"
  | "premolar1"
  | "premolar2"
  | "molar1"
  | "molar2"
  | "wisdom";

export interface ToothType {
  key: ToothTypeKey;
  label: string;
  /** Crown shape family used by the 3D mesh. */
  shape: "incisor" | "canine" | "premolar" | "molar";
  problems: string[];
  treatments: string[];
  doctors: string[]; // doctor ids
}

export const TOOTH_TYPES: Record<ToothTypeKey, ToothType> = {
  central: {
    key: "central",
    label: "Central Incisor",
    shape: "incisor",
    problems: ["Chips & fractures", "Discoloration", "Gaps (diastema)"],
    treatments: ["Composite bonding", "Porcelain veneers", "Whitening"],
    doctors: ["cosmetic", "restorative"],
  },
  lateral: {
    key: "lateral",
    label: "Lateral Incisor",
    shape: "incisor",
    problems: ["Peg-shaped teeth", "Enamel wear", "Crowding"],
    treatments: ["Veneers", "Bonding", "Clear aligners"],
    doctors: ["cosmetic", "ortho"],
  },
  canine: {
    key: "canine",
    label: "Canine",
    shape: "canine",
    problems: ["Impaction", "Gum recession", "Attrition"],
    treatments: ["Orthodontic exposure", "Gum grafting", "Reshaping"],
    doctors: ["ortho", "perio"],
  },
  premolar1: {
    key: "premolar1",
    label: "First Premolar",
    shape: "premolar",
    problems: ["Cavities", "Cracked cusps", "Sensitivity"],
    treatments: ["Tooth-coloured fillings", "Onlays", "Crowns"],
    doctors: ["restorative"],
  },
  premolar2: {
    key: "premolar2",
    label: "Second Premolar",
    shape: "premolar",
    problems: ["Decay", "Old failing fillings", "Fractures"],
    treatments: ["Inlays / onlays", "Ceramic crowns", "Root canal"],
    doctors: ["restorative", "endo"],
  },
  molar1: {
    key: "molar1",
    label: "First Molar",
    shape: "molar",
    problems: ["Deep decay", "Pulp infection", "Heavy wear"],
    treatments: ["Root canal therapy", "Ceramic crown", "Night guard"],
    doctors: ["endo", "restorative"],
  },
  molar2: {
    key: "molar2",
    label: "Second Molar",
    shape: "molar",
    problems: ["Cavities", "Gum pockets", "Cracked tooth"],
    treatments: ["Fillings", "Deep cleaning", "Crowns"],
    doctors: ["restorative", "perio"],
  },
  wisdom: {
    key: "wisdom",
    label: "Wisdom Tooth",
    shape: "molar",
    problems: ["Impaction", "Pericoronitis", "Crowding pressure"],
    treatments: ["Surgical extraction", "Monitoring", "Cleaning"],
    doctors: ["implant"],
  },
};

/** Position 0 (centre) → 7 (back) maps to a tooth archetype. */
const POSITION_TYPE: ToothTypeKey[] = [
  "central",
  "lateral",
  "canine",
  "premolar1",
  "premolar2",
  "molar1",
  "molar2",
  "wisdom",
];

export type Arch = "upper" | "lower";
export type Side = "L" | "R";

export interface Tooth {
  id: string;
  arch: Arch;
  side: Side;
  /** 0 = centre incisor … 7 = rearmost molar. */
  pos: number;
  type: ToothType;
  name: string;
  /** FDI-style two-digit notation, e.g. "11", "48". */
  notation: string;
}

function fdiQuadrant(arch: Arch, side: Side): number {
  if (arch === "upper") return side === "R" ? 1 : 2;
  return side === "R" ? 4 : 3;
}

function buildTeeth(): Tooth[] {
  const teeth: Tooth[] = [];
  (["upper", "lower"] as Arch[]).forEach((arch) => {
    (["R", "L"] as Side[]).forEach((side) => {
      for (let pos = 0; pos < 8; pos++) {
        const type = TOOTH_TYPES[POSITION_TYPE[pos]];
        const q = fdiQuadrant(arch, side);
        teeth.push({
          id: `${arch}-${side}-${pos}`,
          arch,
          side,
          pos,
          type,
          name: `${arch === "upper" ? "Upper" : "Lower"} ${
            side === "R" ? "Right" : "Left"
          } ${type.label}`,
          notation: `${q}${pos + 1}`,
        });
      }
    });
  });
  return teeth;
}

export const TEETH: Tooth[] = buildTeeth();

export const SECTIONS = [
  { id: "teeth", label: "Teeth", index: "01" },
  { id: "orthodontics", label: "Orthodontics", index: "02" },
  { id: "gum-disease", label: "Gum Diseases", index: "03" },
  { id: "implants", label: "Dental Implants", index: "04" },
  { id: "cosmetic", label: "Cosmetic Dentistry", index: "05" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const CLINIC = {
  name: "Aurea Dental",
  tagline: "The future of the perfect smile",
  phone: "+1 (800) 555-0147",
  email: "hello@aureadental.com",
  address: "100 Riverside Avenue, Suite 1200",
};
