import { heroTimeline } from "./heroTimeline";

/** Percentage is visual intro progress, not network byte progress. */
export function startIntro(root: HTMLElement, onReady: () => void, onFailure: () => void) {
  const overlay = document.createElement("div");
  overlay.className = "motion-intro";
  const ring = document.createElement("div");
  ring.className = "motion-intro-ring";
  ring.setAttribute("role", "progressbar");
  ring.setAttribute("aria-label", "Киришүү");
  ring.setAttribute("aria-valuemin", "0");
  ring.setAttribute("aria-valuemax", "100");
  ring.setAttribute("aria-valuenow", "0");
  ring.textContent = "0%";
  ring.style.opacity = "0";
  overlay.append(ring);
  root.append(overlay);
  let disposed = false;
  let frame = 0;
  let animation: Animation | undefined;
  let lastValue = -1;
  const remove = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    clearTimeout(watchdog);
    animation?.cancel();
    overlay.remove();
  };
  // Failure ceiling, never a minimum wait. Skip decoration if readiness stalls.
  const watchdog = window.setTimeout(() => { remove(); onFailure(); }, 8000);
  const images = Array.from(root.querySelectorAll<HTMLImageElement>(".site-header img, .hero-photo img, .welcome img"));
  const tasks = [document.fonts.ready, ...images.map(image => {
    image.loading = "eager";
    return image.decode();
  })];
  Promise.allSettled(tasks).then(() => {
    if (disposed) return;
    clearTimeout(watchdog);
    animation = ring.animate([
      { opacity: 0, transform: "scale(1)", offset: 0 },
      { opacity: 1, transform: "scale(1)", offset: .8 / 4.7 },
      { opacity: 1, transform: "scale(1)", offset: 4 / 4.7, easing: "ease-in-out" },
      { opacity: 0, transform: "scale(.15)", offset: 4.5 / 4.7 },
      { opacity: 0, transform: "scale(.15)", offset: 1 },
    ], { duration: heroTimeline.intro, fill: "both" });
    animation.onfinish = () => { remove(); onReady(); };
    const tick = () => {
      if (disposed || !animation) return;
      const progress = Math.max(0, Math.min(1, (Number(animation.currentTime) - 1000) / 2400));
      const value = Math.round(100 * progress * progress * (3 - 2 * progress));
      if (value !== lastValue) {
        ring.textContent = String(value) + "%";
        ring.setAttribute("aria-valuenow", String(value));
        lastValue = value;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  });
  return remove;
}
