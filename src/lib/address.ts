import { site } from "@/content/site";

const loc = site.location;

// One line per address part — reads cleanly in narrow columns instead
// of wrapping mid-phrase.
export const streetLines = [...loc.streetAddress.split(", "), loc.area].filter(
  Boolean,
);

export const fullAddress = [
  loc.streetAddress,
  loc.area,
  loc.city,
  `${loc.state} ${loc.postalCode}`.trim(),
]
  .filter(Boolean)
  .join(", ");

export const directionsHref =
  loc.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.name}, ${fullAddress}`,
  )}`;
