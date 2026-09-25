/**
 * Every image slot the site needs. Until `status` is "final", <SiteImage>
 * renders a labelled placeholder at this exact aspect ratio instead of a
 * real <img> — never a stock photo, never an AI-generated dancer. See
 * BRIEF.md section 8 and the Appendix shot list.
 *
 * When a real photo lands: drop the file in src/images/, set `path` to
 * its filename there, flip `status` to "final". <SiteImage> picks it up
 * automatically via the glob map in lib/imageAssets.ts — no component
 * changes needed.
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
    alt: "Binni Patel captured mid-jump, one arm raised overhead and one leg bent up behind her.",
    aspectRatio: "396:1245",
    width: 396,
    height: 1245,
    focalPoint: "center",
    pages: ["/"],
    status: "final",
    path: "binni-hero.png",
  },
  {
    id: "binni-portrait",
    alt: "Binni Patel, warm and direct, looking straight at the camera.",
    aspectRatio: "4:5",
    width: 1200,
    height: 1500,
    focalPoint: "top",
    pages: ["/guru"],
    status: "final",
    path: "binni-portrait.jpg",
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
    alt: "Illustration of the Tripataka hasta, one of the hand gestures taught in Year One.",
    aspectRatio: "849:1063",
    width: 849,
    height: 1063,
    focalPoint: "center",
    pages: ["/curriculum"],
    status: "final",
    path: "hasta-detail.png",
  },
  {
    id: "feet-adavu",
    alt: "Hand-drawn illustration of feet in Bharatanatyam costume with salangai (ankle bells), sketched in a notebook.",
    aspectRatio: "460:498",
    width: 460,
    height: 498,
    focalPoint: "center",
    pages: ["/curriculum"],
    status: "final",
    path: "feet-adavu.jpg",
  },
  {
    id: "group-sixteen",
    alt: "Sixteen students in blue and maroon Bharatanatyam costume standing with Binni Patel, hands folded in namaskaram.",
    aspectRatio: "1600:848",
    width: 1600,
    height: 848,
    focalPoint: "center",
    pages: ["/"],
    status: "final",
    path: "group-sixteen.jpg",
  },
  {
    id: "students-namaskaram",
    alt: "Seven students, including Binni Patel, in green and maroon Bharatanatyam costume, hands folded in namaskaram.",
    aspectRatio: "1600:826",
    width: 1600,
    height: 826,
    focalPoint: "center",
    pages: ["/classes"],
    status: "final",
    path: "students-namaskaram.jpg",
  },
  {
    id: "aramandi-row",
    alt: "Six students in true, correct aramandi — turned-out, symmetric, grounded — practising on the studio lawn.",
    aspectRatio: "1600:688",
    width: 1600,
    height: 688,
    focalPoint: "center",
    pages: ["/curriculum"],
    status: "final",
    path: "aramandi-row.jpg",
  },
  {
    id: "og-home",
    alt: "Binni Patel's face alongside the Kalika Nrityalay name and 'Live classes for USA & Canada.'",
    aspectRatio: "1200:630",
    width: 1200,
    height: 630,
    focalPoint: "center",
    pages: ["/"],
    status: "final",
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
    status: "final",
    path: null,
  },
];

export function getImage(id: string): ImageSlot {
  const slot = images.find((img) => img.id === id);
  if (!slot) throw new Error(`Unknown image slot: ${id}`);
  return slot;
}
