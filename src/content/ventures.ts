export type VentureStatus =
  | "Deployed"
  | "Completed"
  | "In development"
  | "Concept"
  | "Learning";

export interface Venture {
  id: string;
  name: string;
  category: string;
  status: VentureStatus;
  description: string;
  domain?: string;
}

export const ventures: Venture[] = [
  {
    id: "chronyx",
    name: "Chronyx",
    category: "Horology & Craft",
    status: "In development",
    description: "Handmade wooden wall clocks engineered with tactile materials and minimal silhouettes.",
    domain: "chronyx.in",
  },
  {
    id: "the-rig-space",
    name: "The Rig Space",
    category: "Automotive Art",
    status: "Concept",
    description: "3D car blueprint artwork and technical motorsport vector compositions.",
  },
  {
    id: "ell-edition",
    name: "ELL Edition",
    category: "Apparel & Objects",
    status: "Concept",
    description: "Minimal apparel exploring utilitarian patterns and monochrome textile design.",
  },
];
