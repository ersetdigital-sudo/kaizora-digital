"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROMO_SLIDES, PROMOS } from "@/lib/data/promos";
import { reduceMotion } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useUI } from "../ui/UIProvider";

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
    const pad = parseFloat(getComputedStyle(track).paddingLeft || "0");
    return el.offsetLeft - track.offsetLeft - pad;
  }, []);

  const go = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = [...track.querySelectorAll<HTMLElement>(".promo-slide")];
    if (!slides.length) return;
    const target = slides[(i + slides.length) % slides.length]!;
    track.scrollTo({ left: slideLeft(target), behavior: reduceMotion() ? "auto" : "smooth" });
  }, [slideLeft]);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = [...track.querySelectorAll<HTMLElement>(".promo-slide")];
    if (!slides.length) return;
    let idx = 0, best = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(slideLeft(s) - track.scrollLeft);
      if (d < best) { best = d; idx = i; }
    });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) idx = slides.length - 1;
    setActive(idx);
  }, [slideLeft]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let t: number | undefined;
    const onScroll = () => { window.clearTimeout(t); t = window.setTimeout(update, 40); };
    track.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { track.removeEventListener("scroll", onScroll); window.clearTimeout(t); };
  }, [update]);

  useEffect(() => {
    if (paused || reduceMotion()) return;
    const timer = window.setInterval(() => {
      if (!hoverRef.current && !document.hidden) go(activeRef.current + 1);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, go]);

  return (
    <section className="section" id="promo" aria-labelledby="promo-title">
      <div className="container">
        <div className="section__head" data-reveal>
          <div>
            <span className="eyebrow"><Icon name="fa-ticket" /> Promo Spesial</span>
            <h2 id="promo-title">Hemat Lebih Banyak, Setiap Hari</h2>
            <p>Pilih kode promo, lalu otomatis terpasang saat checkout.</p>
          </div>
          <div className="hs__controls">
            <button className="hs__btn" type="button" aria-label={paused ? "Putar slide otomatis" : "Jeda slide otomatis"} aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
              <Icon name={paused ? "fa-play" : "fa-pause"} />
            </button>
            <button className="hs__btn" type="button" aria-label="Promo sebelumnya" onClick={() => go(active - 1)}><Icon name="fa-chevron-left" /></button>
            <button className="hs__btn" type="button" aria-label="Promo berikutnya" onClick={() => go(active + 1)}><Icon name="fa-chevron-right" /></button>
          </div>
        </div>
        <div className="hs" role="region" aria-roledescription="carousel" aria-label="Promo spesial" id="promoCarousel"
          onMouseEnter={() => (hoverRef.current = true)} onMouseLeave={() => (hoverRef.current = false)}
          onFocusCapture={() => (hoverRef.current = true)} onBlurCapture={() => (hoverRef.current = false)}>
          <div className="hs__track" id="promoTrack" tabIndex={0} aria-live="off" ref={trackRef}>
            {PROMO_SLIDES.map((s, i) => {
              const promo = PROMOS.find((x) => x.code === s.code);
              return (
                <article className={`promo-slide promo-slide--${i + 1}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} dari ${PROMO_SLIDES.length}`} key={s.code}>
                  <span className="promo-slide__ico"><Icon name={s.icon} /></span>
                  <div><h3>{s.title}</h3><p>{s.text}</p></div>
                  <div className="promo-slide__foot">
                    <span className="code-chip">{promo?.code ?? s.code}</span>
                    <button className="btn btn--sm" type="button" onClick={() => usePromo(s.code)}><Icon name="fa-copy" /> Pakai Kode</button>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="carousel__bar">
            <div className="dots" id="promoDots" aria-label="Pilih slide promo">
              {PROMO_SLIDES.map((_, i) => (
                <button className="dot" type="button" key={i} aria-label={`Ke slide ${i + 1}`} aria-current={i === active ? "true" : undefined} onClick={() => go(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
