/**
 * Maps a filename in src/images/ to its imported, build-time-
 * optimized asset — so <SiteImage> can resolve an ImageSlot.path by
 * plain filename without a dynamic import per component.
 */
import type { ImageMetadata } from "astro";

const modules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/images/*.{jpg,jpeg,png}",
  { eager: true },
);

const byFilename = new Map<string, ImageMetadata>();
for (const [filePath, mod] of Object.entries(modules)) {
  byFilename.set(filePath.split("/").pop()!, mod.default);
}

export function resolveImageAsset(filename: string): ImageMetadata {
  const asset = byFilename.get(filename);
  if (!asset) {
    throw new Error(
      `No image found at src/images/${filename} — check images.ts path`,
    );
  }
  return asset;
}
