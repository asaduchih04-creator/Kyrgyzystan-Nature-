/** Measured from the 9.02s reference; offsets follow the photo's 4.7s start. */
export const heroTimeline = {
  intro: 4700,
  photograph: 1800,
  brand: { start: 1050, duration: 700, stagger: 400 },
  welcome: { start: 1050, duration: 1300 },
  supporting: { start: 2400, duration: 600 },
  credit: { start: 3000, duration: 450 },
  location: { start: 3080, duration: 450 },
  navigation: { start: 3250, duration: 600, stagger: 80 },
  // Inferred from frame motion, not original Figma easing metadata.
  titleEase: "cubic-bezier(.22, 1, .36, 1)",
  detailEase: "cubic-bezier(.25, .1, .25, 1)",
} as const;

// Photograph width / final width, measured every 100ms from 4.7–6.5s.
const expansion = [0, .014, .05, .123, .28, .51, .663, .757, .822, .87, .907, .935, .957, .974, .987, .996, .998, .999, 1];

export function imageExpansionFrames(): Keyframe[] {
  const delta = expansion.slice(1).map((value, index) => value - expansion[index]);
  const slopes = expansion.map((_, index) => {
    if (index === 0 || index === expansion.length - 1) return 0;
    const before = delta[index - 1], after = delta[index];
    return before && after ? 2 * before * after / (before + after) : 0;
  });
  // Monotone cubic interpolation: smooth measured acceleration, no overshoot.
  return Array.from({ length: 181 }, (_, sample) => {
    const position = sample / 10, index = Math.min(17, Math.floor(position)), t = position - index;
    const value = (2 * t ** 3 - 3 * t ** 2 + 1) * expansion[index]
      + (t ** 3 - 2 * t ** 2 + t) * slopes[index]
      + (-2 * t ** 3 + 3 * t ** 2) * expansion[index + 1]
      + (t ** 3 - t ** 2) * slopes[index + 1];
    return { offset: sample / 180, transform: `scale(${value})`, transformOrigin: "100% 0%" };
  });
}
