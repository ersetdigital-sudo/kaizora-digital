
import { useCallback, useEffect, useRef, useState } from "react";
import { PROMO_SLIDES, PROMOS, reduceMotion } from "@/lib/data";
import { useUI } from "./UIProvider";

export default function PromoCarousel() {
  const { usePromo } = useUI();
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const hoverRef = useRef(false);
  const activeRef = useRef(0);
  activeRef.current = active;

  const slideLeft = useCallback((el: HTMLElement) => {
    const track = trackRef.current;
    if (!track) return 0;
    const paddingLeft = parseFloat(getComputedStyle(track).paddingLeft || "0");
    return el.offsetLeft - track.offsetLeft - paddingLeft;
  }, []);

  const go = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const slides = [...track.querySelectorAll<HTMLElement>(".promo-slide")];
      if (!slides.length) return;
      const target = slides[(i + slides.length) % slides.length]!;
      track.scrollTo({ left: slideLeft(target), behavior: reduceMotion() ? "auto" : "smooth" });
    },
    [slideLeft],
  );

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = [...track.querySelectorAll<HTMLElement>(".promo-slide")];
    if (!slides.length) return;
    let idx = 0;
    let best = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(slideLeft(s) - track.scrollLeft);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) idx = slides.length - 1;
    setActive(idx);
  }, [slideLeft]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let t: number | undefined;
    const onScroll = () => {
      window.clearTimeout(t);
      t = window.setTimeout(update, 40);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, [update]);

  useEffect(() => {
    if (paused || reduceMotion()) return;
    const timer = window.setInterval(() => {
      if (!hoverRef.current && !document.hidden) go(activeRef.current + 1);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, go]);

  const dots = PROMO_SLIDES.map((_, i) => i);

  return (
    <section className="section" id="promo" aria-labelledby="promo-title">
      <div className="container">
        <div className="section__head" data-reveal>
          <div>
            <span className="eyebrow"><i className="fa-solid fa-ticket" aria-hidden="true" /> Promo Spesial</span>
            <h2 id="promo-title">Hemat Lebih Banyak, Setiap Hari</h2>
            <p>Pilih kode promo, lalu otomatis terpasang saat checkout.</p>
          </div>
          <div className="hs__controls">
            <button
              className="hs__btn"
              type="button"
              id="promoPause"
              aria-label={paused ? "Putar slide otomatis" : "Jeda slide otomatis"}
              aria-pressed={paused}
              onClick={() => setPaused((v) => !v)}
            >
              <i className={`fa-solid ${paused ? "fa-play" : "fa-pause"}`} aria-hidden="true" />
            </button>
            <button className="hs__btn" type="button" data-hs-prev="promoTrack" aria-label="Promo sebelumnya" onClick={() => go(active - 1)}>
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <button className="hs__btn" type="button" data-hs-next="promoTrack" aria-label="Promo berikutnya" onClick={() => go(active + 1)}>
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          className="hs"
          role="region"
          aria-roledescription="carousel"
          aria-label="Promo spesial"
          id="promoCarousel"
          onMouseEnter={() => (hoverRef.current = true)}
          onMouseLeave={() => (hoverRef.current = false)}
          onFocusCapture={() => (hoverRef.current = true)}
          onBlurCapture={() => (hoverRef.current = false)}
        >
          <div className="hs__track" id="promoTrack" tabIndex={0} aria-live="off" ref={trackRef}>
            {PROMO_SLIDES.map((s, i) => {
              const promo = PROMOS.find((x) => x.code === s.code);
              return (
                <article
                  className={`promo-slide promo-slide--${i + 1}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} dari ${PROMO_SLIDES.length}`}
                  key={s.code}
                >
                  <i className={`fa-solid ${s.icon} promo-slide__ico`} aria-hidden="true" />
                  <div><h3>{s.title}</h3><p>{s.text}</p></div>
                  <div className="promo-slide__foot">
                    <span className="code-chip">{promo?.code ?? s.code}</span>
                    <button className="btn btn--sm" type="button" onClick={() => usePromo(s.code)}>
                      <i className="fa-solid fa-copy" aria-hidden="true" /> Pakai Kode
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="carousel__bar">
            <div className="dots" id="promoDots" aria-label="Pilih slide promo">
              {dots.map((i) => (
                <button
                  className="dot"
                  type="button"
                  key={i}
                  aria-label={`Ke slide ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
