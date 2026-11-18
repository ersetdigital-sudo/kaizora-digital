
import { FAQS } from "@/lib/data";
import { useUI } from "./UIProvider";

export default function Faq({ embedded = false }: { embedded?: boolean }) {
  const { openInfo } = useUI();
  return (
    <section className="section" id={embedded ? undefined : "bantuan"} aria-labelledby={embedded ? undefined : "bantuan-title"}>
      <div className="container">
        {!embedded && (
          <div className="section__head" data-reveal>
            <div>
              <span className="eyebrow"><i className="fa-solid fa-headset" aria-hidden="true" /> Pusat Bantuan</span>
              <h2 id="bantuan-title">Pertanyaan yang Sering Diajukan</h2>
            </div>
          </div>
        )}
        <div className="faq-grid">
          <div className="faq" id="faqList" data-reveal>
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <div>{a}</div>
              </details>
            ))}
          </div>
          <aside className="contact-card" data-reveal>
            <span className="eyebrow eyebrow--light"><i className="fa-solid fa-comments" aria-hidden="true" /> Butuh bantuan?</span>
            <h3>Tim dukungan siap membantu</h3>
            <p>Kanal dukungan akan tersedia setelah platform diluncurkan. Lihat contoh informasi kontak di bawah.</p>
            <button className="btn btn--primary" type="button" onClick={() => openInfo("contact")}>
              <i className="fa-solid fa-address-book" aria-hidden="true" /> Lihat Kontak
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
