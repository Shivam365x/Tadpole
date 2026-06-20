/**
 * GitHub-style identicon generator.
 *
 * Produces a deterministic 5x5 mirrored pixel-art avatar (like GitHub's default
 * profile photos) from any seed string (name, email, id). Returns an inline SVG
 * data URI that can be used directly as an <img>/AvatarImage `src`.
 */

// Simple, fast 32-bit string hash (FNV-1a style).
function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Deterministic PRNG seeded from the hash (mulberry32).
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build a GitHub-style identicon for `seed` and return an SVG data URI.
 */
export function getIdenticon(seed: string | undefined | null): string {
  const key = (seed && seed.trim()) || "anonymous";
  const hash = hashSeed(key);
  const rand = mulberry32(hash);

  // Foreground color: saturated, GitHub-like. Background: light neutral.
  const hue = Math.floor(rand() * 360);
  const fg = `hsl(${hue}, 62%, 48%)`;
  const bg = "#f0f0f0";

  // 5x5 grid, left/right mirrored: generate columns 0,1,2 then mirror.
  const cells: boolean[][] = Array.from({ length: 5 }, () => new Array(5).fill(false));
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 5; row++) {
      const on = rand() > 0.5;
      cells[row][col] = on;
      cells[row][4 - col] = on; // mirror
    }
  }

  // viewBox: 5 blocks + 0.5 margin on each side = 6 units.
  const rects: string[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (cells[row][col]) {
        rects.push(
          `<rect x="${col + 0.5}" y="${row + 0.5}" width="1" height="1" fill="${fg}"/>`
        );
      }
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" shape-rendering="crispEdges">` +
    `<rect width="6" height="6" fill="${bg}"/>` +
    rects.join("") +
    `</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
