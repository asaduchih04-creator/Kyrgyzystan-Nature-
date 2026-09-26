"use client";

import { useLayoutEffect } from "react";
import { heroTimeline, imageExpansionFrames } from "./heroTimeline";
import { startIntro } from "./intro";
import { createSectionMotion } from "./sectionMotion";

/** Progressive enhancement: server-rendered content is visible without JS. */
export function HomepageMotion() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".desktop-homepage");
    if (!root) return;
    const masks = Array.from(root.querySelectorAll<HTMLElement>(".hero-photo, .hero-overlay"));
    const releaseInitialMask = () => masks.forEach(element => { element.dataset.heroInitialized = ""; });
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!Element.prototype.animate || !window.IntersectionObserver || preference.matches) {
      releaseInitialMask();
      return;
    }
    const mobile = matchMedia("(max-width: 767px)");
    const sections = createSectionMotion(root, mobile.matches);
    const animations = new Set<Animation>();
    const marked = new Set<HTMLElement>();
    let stopped = false;
    let cancelIntro = () => {};
    let heroStarted = false;
    let unlock = () => {};
    let heroWatchdog = 0;
    const heroAnimations: Animation[] = [];
    const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
    const animate = (element: HTMLElement, frames: Keyframe[], duration: number, delay = 0, curve: string = heroTimeline.titleEase) => {
      element.dataset.motion = "";
      marked.add(element);
      const animation = element.animate(frames, { duration, delay, easing: curve, fill: "both" });
      animation.pause();
      animation.currentTime = 0;
      animations.add(animation);
      heroAnimations.push(animation);
      // Remove all temporary effects to restore the exact static composition.
      animation.onfinish = () => { animation.cancel(); animations.delete(animation); };
    };

    all(".hero-photo, .hero-overlay").forEach(element => {
      if (mobile.matches) {
        animate(element, imageExpansionFrames(), heroTimeline.photograph, 0, "linear");
      } else {
        // Keep the outer geometry fixed; open only its visible bounds.
        // The intro ends at 4.7s, so a 100ms offset starts this at 4.8s.
        animate(element, [
          { clipPath: "inset(0 0 100% 100%)", offset: 0, easing: "cubic-bezier(.42,0,1,1)" },
          { clipPath: "inset(0 0 72% 72%)", offset: .25, easing: heroTimeline.titleEase },
          { clipPath: "inset(0 0 7% 7%)", offset: .625, easing: heroTimeline.titleEase },
          { clipPath: "inset(0 0 0% 0%)", offset: 1 },
        ], 1600, 100, "linear");
      }
    });
    // Only the photograph settles; the existing outer mask trajectory is unchanged.
    all(".hero-photo img").forEach(element => animate(element, [
      { scale: mobile.matches ? 1.08 : 1.10 },
      { scale: 1 },
    ], mobile.matches ? heroTimeline.photograph : 1600, mobile.matches ? 0 : 100));
    // Transfer CSS's pre-hydration state only after both WAAPI effects are at t=0.
    releaseInitialMask();
    const heroReveal = (selector: string, timing: { start: number; duration: number }, stagger = 0) => {
      all(selector).forEach((element, index) => animate(element, [
        { opacity: 0, translate: "0 4px" }, { opacity: 1, translate: "0 0" },
      ], timing.duration, timing.start + index * stagger, heroTimeline.detailEase));
    };
    heroReveal(".site-header > a", heroTimeline.brand, heroTimeline.brand.stagger);
    heroReveal(".hero-introduction", heroTimeline.supporting);
    heroReveal(".hero-credit", heroTimeline.credit);
    heroReveal(".hero-bottom > .location-label", heroTimeline.location);
    heroReveal(".hero-bottom .pill", heroTimeline.navigation, heroTimeline.navigation.stagger);

    // Animate the supplied composition as one image, including its subtitle.
    // The unspecified mobile Welcome composition remains unchanged.
    if (!mobile.matches) {
      all(".welcome-composition").forEach(element => {
        animate(element, [
          { clipPath: "inset(100% 50% 0 50%)" },
          { clipPath: "inset(0% 0% 0 0%)" },
        ], heroTimeline.welcome.duration, heroTimeline.welcome.start, heroTimeline.titleEase);
        const image = element.querySelector<HTMLElement>("img");
        if (image) animate(image, [
          { transform: "scale(1.16)", transformOrigin: "50% 50%" },
          { transform: "scale(1)", transformOrigin: "50% 50%" },
        ], heroTimeline.welcome.duration, heroTimeline.welcome.start, heroTimeline.titleEase);
      });
    }

    const finishAll = () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(heroWatchdog);
      unlock();
      cancelIntro();
      sections.finish();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      marked.forEach(element => delete element.dataset.motion);
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      // Never put a focused control behind a gate, intro, or delayed entrance.
      finishAll();
    };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") finishAll(); };
    const onVisibility = () => { if (document.hidden) finishAll(); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    const onHash = () => { if (location.hash) finishAll(); };
    root.addEventListener("focusin", onFocus);
    preference.addEventListener("change", finishAll);
    mobile.addEventListener("change", finishAll);
    window.addEventListener("hashchange", onHash);
    const startHero = () => {
      if (stopped || heroStarted) return;
      heroStarted = true;
      const pending = heroAnimations.filter(animation => animations.has(animation));
      Promise.allSettled(pending.map(animation => animation.finished)).then(() => {
        clearTimeout(heroWatchdog);
        unlock();
        if (!stopped) sections.start();
      });
      pending.forEach(animation => animation.play());
      heroWatchdog = window.setTimeout(finishAll, 6000);
    };
    if (location.hash || scrollY > 0) finishAll();
    else {
      const html = document.documentElement;
      const body = document.body;
      const overflowY = html.style.overflowY;
      const properties = ["position", "top", "right", "bottom", "left", "width"] as const;
      const saved = properties.map(property => body.style[property]);
      // Keep the native scrollbar present instead of reserving a blank gutter.
      // Fixing the body prevents scrolling without changing the Hero's width.
      html.style.overflowY = "scroll";
      Object.assign(body.style, { position: "fixed", top: "0", right: "0", bottom: "auto", left: "0", width: "auto" });
      unlock = () => {
        properties.forEach((property, index) => { body.style[property] = saved[index]; });
        html.style.overflowY = overflowY;
      };
      cancelIntro = startIntro(root, startHero, finishAll);
    }
    return () => {
      finishAll();
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("focusin", onFocus);
      preference.removeEventListener("change", finishAll);
      mobile.removeEventListener("change", finishAll);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return null;
}
