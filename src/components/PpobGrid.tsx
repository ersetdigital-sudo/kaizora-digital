
import { PPOB } from "@/lib/data";
import { useUI } from "./UIProvider";

export default function PpobGrid() {
  const { openOrder } = useUI();
  return (
    <section className="section section--ppob" id="ppob" aria-labelledby="ppob-title">
      <div className="hero__bg" aria-hidden="true"><span className="blob blob--1" /><span className="blob blob--2" /></div>
      <div className="container" style={{ position: "relative" }}>
        <div className="section__head" data-reveal>
          <div>
            <span className="eyebrow eyebrow--light"><i className="fa-solid fa-receipt" aria-hidden="true" /> PPOB</span>
            <h2 id="ppob-title">Bayar Semua Tagihan, Tanpa Antre</h2>
            <p>Pulsa, data, listrik, BPJS, air, internet, hingga e-wallet — satu form yang sama untuk semuanya.</p>
          </div>
        </div>
        <div className="ppob-grid" id="ppobGrid">
          {PPOB.map((s, i) => (
            <button
              key={s.id}
              className={`ppob-card tone-${s.tone}`}
              type="button"
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => openOrder("ppob", s.id)}
            >
              <span className="ppob-card__ico"><i className={`fa-solid ${s.icon}`} aria-hidden="true" /></span>
              <div className="ppob-card__text"><h3>{s.short}</h3><p>{s.desc}</p></div>
              <i className="fa-solid fa-arrow-right ppob-card__go" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
