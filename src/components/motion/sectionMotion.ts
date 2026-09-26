/** One-shot viewport choreography, independent of the Hero's page-load timeline. */
export function createSectionMotion(root: HTMLElement, mobile: boolean) {
  const style = getComputedStyle(root);
  const token = (name: string) => Number(style.getPropertyValue(`--motion-${name}`));
  const easing = style.getPropertyValue("--motion-ease").trim();
  const groups = new Map<Element, Animation[]>();
  const animations = new Set<Animation>();
  const marked = new Set<HTMLElement>();
  let disposed = false;
  let enabled = false;
  const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));

  // Only gate lower sections during the Hero intro. No section-scale or scroll scrub.
  const gates = all(".about, .nature, .contact-invitation, .site-footer").map(element => {
    const animation = element.animate([{ visibility: "hidden" }, { visibility: "visible" }], { duration: 1, fill: "both" });
    animation.pause();
    animation.currentTime = 0;
    return animation;
  });
  const play = (target: Element) => {
    // Layered/off-axis assets should be ready even in the existing wide mobile layout.
    target.querySelectorAll<HTMLImageElement>("img").forEach(image => { image.loading = "eager"; });
    groups.get(target)?.forEach(animation => animation.play());
    groups.delete(target);
    observer.unobserve(target);
  };
  const observer = new IntersectionObserver(entries => {
    if (disposed || !enabled) return;
    entries.forEach(entry => { if (entry.isIntersecting) play(entry.target); });
  }, { rootMargin: mobile ? "0px" : "0px 0px -15% 0px", threshold: 0 });

  const animate = (element: HTMLElement, trigger: Element, frames: Keyframe[], duration: number, delay = 0) => {
    element.dataset.motion = "";
    marked.add(element);
    const animation = element.animate(frames, { duration, delay, easing, fill: "both" });
    animation.pause();
    animation.currentTime = 0;
    animations.add(animation);
    animation.onfinish = () => {
      animation.cancel();
      animations.delete(animation);
      delete element.dataset.motion;
    };
    const group = groups.get(trigger) ?? [];
    group.push(animation);
    groups.set(trigger, group);
  };
  const reveal = (selector: string, trigger: Element, duration: number, delay = 0, distance = token("distance"), stagger = 0) => {
    all(selector).forEach((element, index) => animate(element, trigger, [
      { opacity: 0, translate: `0 ${distance}px` },
      { opacity: 1, translate: "0 0" },
    ], duration, delay + index * stagger));
  };
  const duration = token("reveal"), short = token("short"), fade = token("fade");
  const about = root.querySelector(".about-heading");
  if (about) {
    reveal(".about-heading", about, duration);
    reveal(".about-description", about, duration, token("copy-stagger"));
    reveal(".about .section-meta", about, short, token("copy-stagger") * 2, mobile ? 4 : 8);
  }
  const aboutBottom = root.querySelector(".about-bottom");
  if (aboutBottom) reveal(".about-bottom > *", aboutBottom, duration, 0, token("distance"), token("copy-stagger"));

  const nature = root.querySelector(".nature");
  if (nature) {
    reveal(".nature-meta", nature, short, 0, mobile ? 4 : 8);
    reveal(".nature h2", nature, short, token("heading-stagger"), mobile ? 4 : 8);
    reveal(".destination-controls > li", nature, fade, token("controls-delay"), mobile ? 6 : 10, token("stagger"));
    reveal(".scroll-label", nature, fade, token("controls-delay"), mobile ? 4 : 8);
    const layers = all(".destination-layer");
    const layerDuration = token("stack") - Math.max(0, layers.length - 1) * token("layer-stagger");
    layers.forEach((element, index) => animate(element, nature, [
      // Preserve the existing translateX centering, order, crop, and overlaps.
      { opacity: 0, transform: `translateX(-50%) translateY(${mobile ? 14 : 28}px) scale(${mobile ? .96 : .93})` },
      { opacity: 1, transform: "translateX(-50%) translateY(0) scale(1)" },
    ], layerDuration, token("stack-delay") + index * token("layer-stagger")));
    reveal(".destination-badge, .destination-description", nature, fade, token("stack-delay") + token("stack") - 300, mobile ? 5 : 10);
  }

  const invitation = root.querySelector(".invitation-heading");
  if (invitation) {
    reveal(".invitation-heading", invitation, duration, 0, mobile ? 8 : 16);
    reveal(".invitation-cta", invitation, duration, token("copy-stagger"), mobile ? 8 : 16);
  }
  const footer = root.querySelector(".site-footer");
  if (footer) reveal(".footer-title", footer, mobile ? 550 : 800, 0, mobile ? 8 : 18);

  const observe = () => {
    if (disposed || !enabled || scrollY === 0) return;
    window.removeEventListener("scroll", observe);
    for (const [target, group] of groups) {
      // Rapid scrolling must not leave already-passed content hidden.
      if (target.getBoundingClientRect().bottom <= 0) {
        group.forEach(animation => animation.finish());
        groups.delete(target);
      } else observer.observe(target);
    }
  };
  return {
    start() {
      if (disposed || enabled) return;
      enabled = true;
      gates.forEach(animation => animation.cancel());
      // The Hero unlocks normally; this listener only arms the viewport observer.
      window.addEventListener("scroll", observe, { passive: true });
      observe();
    },
    finish() {
      if (disposed) return;
      disposed = true;
      window.removeEventListener("scroll", observe);
      observer.disconnect();
      gates.forEach(animation => animation.cancel());
      animations.forEach(animation => animation.cancel());
      groups.clear();
      animations.clear();
      marked.forEach(element => delete element.dataset.motion);
    },
  };
}
