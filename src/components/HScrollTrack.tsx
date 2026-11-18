
export function HScrollTrack({
  id,
  label,
  children,
  className = "hs__track",
}: {
  id: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="hs">
      <div className={className} id={id} tabIndex={0} role="region" aria-label={label}>
        {children}
      </div>
    </div>
  );
}

export function HScrollButtons({ targetId, onPrevLabel = "Geser ke kiri", onNextLabel = "Geser ke kanan" }: { targetId: string; onPrevLabel?: string; onNextLabel?: string }) {
  const scroll = (dir: -1 | 1) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 240), behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <div className="hs__controls">
      <button className="hs__btn" type="button" aria-label={onPrevLabel} onClick={() => scroll(-1)}>
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>
      <button className="hs__btn" type="button" aria-label={onNextLabel} onClick={() => scroll(1)}>
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </div>
  );
}
