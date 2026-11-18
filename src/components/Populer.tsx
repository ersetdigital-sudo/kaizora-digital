import { useEffect, useState } from "react";
import { BEST, getProduct, getService, idr, reduceMotion } from "@/lib";
import { HScrollTrack, HScrollButtons } from "./HScrollTrack";
import { useUI } from "./UIProvider";

function thumb(kind: "game" | "ppob", s: { cover?: string; icon: string; tone?: string }) {
  return kind === "game" ? (
    <img className="mini-card__img" src={s.cover!} width={48} height={60} alt="" loading="lazy" />
  ) : (
    <span className={`mini-card__ico tone-${s.tone}`}>
      <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
    </span>
  );
}

export default function Populer() {
  const { openOrder } = useUI();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), reduceMotion() ? 0 : 800);
    return () => window.clearTimeout(t);
  }, []);

  const wideSkeleton = (n: number) =>
    Array.from({ length: n }, (_, i) => (
      <div className="sk-card sk-card--wide" key={i} aria-hidden="true">
        <div className="skeleton" />
        <div className="skeleton sk-line" style={{ margin: "12px 0 0" }} />
      </div>
    ));

  return (
    <section className="section" id="populer" aria-labelledby="populer-title">
      <div className="container">
        <div className="section__head" data-reveal>
          <div>
            <span className="eyebrow"><i className="fa-solid fa-fire" aria-hidden="true" /> Populer</span>
            <h2 id="populer-title">Produk Terlaris</h2>
            <p>Pilihan favorit pengguna, siap dibeli dalam sekali klik.</p>
          </div>
        </div>

        <div className="sub-head" data-reveal>
          <h3><i className="fa-solid fa-ranking-star" aria-hidden="true" /> Produk Terlaris</h3>
          <HScrollButtons targetId="bestTrack" />
        </div>
        <HScrollTrack id="bestTrack" label="Daftar produk terlaris">
          {loading
            ? wideSkeleton(4)
            : BEST.map(([kind, sid, pid], i) => {
                const s = getService(kind, sid);
                const p = getProduct(kind, sid, pid);
                if (!s || !p) return null;
                return (
                  <article className="mini-card" role="group" aria-label={`${s.short} ${p.label}`} key={`${sid}-${pid}`}>
                    <span className="badge badge--fire mini-card__badge">#{i + 1}</span>
                    <div className="mini-card__top">
                      {thumb(kind, s)}
                      <div><h4>{s.short}</h4><small>{p.label}</small></div>
                    </div>
                    <div className="mini-card__price">{idr(p.price)}</div>
                    <button className="btn btn--primary btn--block stretched" type="button" onClick={() => openOrder(kind, sid, { productId: pid })} aria-label={`Beli ${s.short} ${p.label}`}>
                      Beli
                    </button>
                  </article>
                );
              })}
        </HScrollTrack>
      </div>
    </section>
  );
}
