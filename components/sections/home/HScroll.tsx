"use client";

import { Icon } from "@/components/ui/Icon";

export function HScrollTrack({ id, label, children }: { id: string; label?: string; children: React.ReactNode }) {
  return (
    <div className="hs">
      <div className="hs__track" id={id} tabIndex={0} role="region" aria-label={label}>{children}</div>
    </div>
  );
}

export function HScrollButtons({ targetId, prevLabel = "Geser ke kiri", nextLabel = "Geser ke kanan" }: { targetId: string; prevLabel?: string; nextLabel?: string }) {
  const scroll = (dir: -1 | 1) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 240), behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <div className="hs__controls">
      <button className="hs__btn" type="button" aria-label={prevLabel} onClick={() => scroll(-1)}><Icon name="fa-chevron-left" /></button>
      <button className="hs__btn" type="button" aria-label={nextLabel} onClick={() => scroll(1)}><Icon name="fa-chevron-right" /></button>
    </div>
  );
}
