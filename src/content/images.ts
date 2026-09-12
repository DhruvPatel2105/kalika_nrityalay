/**
 * Every image slot the site needs, defined before any photography
 * exists. Until `status` is "final", components render a labelled
 * PlaceholderImage at this exact aspect ratio instead of a real <img> —
 * never a stock photo, never an AI-generated dancer. See BRIEF.md
 * section 8 and the Appendix shot list.
 *
 * When real photography lands, set `path` and flip `status` to
 * "final" — no component changes required.
 */

export interface ImageSlot {
  id: string;
  alt: string;
  aspectRatio: string; // e.g. "4:5"
  width: number;
  height: number;
  focalPoint: "center" | "top" | "bottom";
  pages: string[];
  status: "placeholder" | "final";
  path: string | null;
}

export const images: ImageSlot[] = [
  {
    id: "hero-binni-aramandi",
    alt: "Binni Patel standing in full aramandi, the grounded half-seated stance of Bharatanatyam, facing the camera against a plain wall.",
    aspectRatio: "4:5",
    width: 1200,
    height: 1500,
    focalPoint: "center",
    pages: ["/"],
    status: "placeholder",
    path: null,
  },
  {
    id: "binni-portrait",
    alt: "Binni Patel, three-quarter portrait, looking warmly at the camera.",
    aspectRatio: "4:5",
    width: 1200,
    height: 1500,
    focalPoint: "top",
    pages: ["/guru"],
    status: "placeholder",
    path: null,
  },
  {
    id: "hasta-detail",
    alt: "Close crop of a single Bharatanatyam hasta, cleanly formed.",
    aspectRatio: "1:1",
    width: 1200,
    height: 1200,
    focalPoint: "center",
    pages: ["/", "/curriculum"],
    status: "placeholder",
    path: null,
  },
  {
    id: "feet-adavu",
    alt: "Close crop of feet in the first adavu position, salangai visible at the ankles.",
    aspectRatio: "1:1",
    width: 1200,
    height: 1200,
    focalPoint: "center",
    pages: ["/curriculum"],
    status: "placeholder",
    path: null,
  },
  {
    id: "binni-teaching",
    alt: "Binni Patel mid-correction, looking at a student during class.",
    aspectRatio: "4:3",
    width: 1200,
    height: 900,
    focalPoint: "center",
    pages: ["/classes"],
    status: "placeholder",
    path: null,
  },
  {
    id: "studio-wide",
    alt: "Wide view of the Vastral studio with students standing in a row, each in aramandi.",
    aspectRatio: "16:9",
    width: 1600,
    height: 900,
    focalPoint: "center",
    pages: ["/", "/classes"],
    status: "placeholder",
    path: null,
  },
  {
    id: "students-adavu-back",
    alt: "Three or four students practising an adavu, photographed from behind so faces are not identifiable.",
    aspectRatio: "16:9",
    width: 1600,
    height: 900,
    focalPoint: "center",
    pages: ["/classes", "/curriculum"],
    status: "placeholder",
    path: null,
  },
  {
    id: "detail-salangai",
    alt: "Close detail of salangai, the dancer's ankle bells, resting on the studio floor.",
    aspectRatio: "1:1",
    width: 800,
    height: 800,
    focalPoint: "center",
    pages: ["/guru"],
    status: "placeholder",
    path: null,
  },
  {
    id: "detail-diya",
    alt: "Close detail of a diya, the oil lamp, in the studio.",
    aspectRatio: "1:1",
    width: 800,
    height: 800,
    focalPoint: "center",
    pages: ["/guru"],
    status: "placeholder",
    path: null,
  },
  {
    id: "detail-doorway",
    alt: "The studio doorway at Kalika Nrityalay in Vastral, Ahmedabad.",
    aspectRatio: "1:1",
    width: 800,
    height: 800,
    focalPoint: "center",
    pages: ["/guru"],
    status: "placeholder",
    path: null,
  },
  {
    id: "og-home",
    alt: "Binni Patel's face alongside the Kalika Nrityalay name and 'Live classes for USA & Canada.'",
    aspectRatio: "1200:630",
    width: 1200,
    height: 630,
    focalPoint: "center",
    pages: ["/"],
    status: "placeholder",
    path: null,
  },
  {
    id: "og-default",
    alt: "Kalika Nrityalay wordmark and tagline on the brand oxblood background.",
    aspectRatio: "1200:630",
    width: 1200,
    height: 630,
    focalPoint: "center",
    pages: ["/guru", "/classes", "/curriculum", "/fees", "/trial"],
    status: "placeholder",
    path: null,
  },
];

export function getImage(id: string): ImageSlot {
  const slot = images.find((img) => img.id === id);
  if (!slot) throw new Error(`Unknown image slot: ${id}`);
  return slot;
}
