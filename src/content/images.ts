/**
 * Every image slot the site needs, defined before any photography
 * exists. Until `status` is "final", <SiteImage> renders a labelled
 * placeholder at this exact aspect ratio instead of a real <img> —
 * never a stock photo, never an AI-generated dancer. See BRIEF.md
 * section 8 and the Appendix shot list.
 *
 * When a real photo lands: drop the file in src/images/, set `path`
 * to its filename there, flip `status` to "final". <SiteImage> picks
 * it up automatically via the glob map in lib/imageAssets.ts — no
 * component changes needed.
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
  /** Filename within src/images/, e.g. "studio-wide.jpg". Null until shot. */
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
    id: "binni-performing",
    alt: "Binni Patel performing Bharatanatyam on stage, in full costume and makeup.",
    aspectRatio: "1144:1430",
    width: 1144,
    height: 1430,
    focalPoint: "top",
    pages: ["/guru"],
    status: "final",
    path: "binni-performing.jpg",
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
    alt: "Five students at the Vastral studio in Bharatanatyam costume, hands folded in a namaskaram greeting.",
    aspectRatio: "1404:790",
    width: 1404,
    height: 790,
    focalPoint: "center",
    pages: ["/classes"],
    status: "final",
    path: "studio-wide.jpg",
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
