import { useEffect, useMemo, useState } from "react";
import { GAMES, idr, minPrice, reduceMotion } from "@/lib/data";
import { useUI } from "./UIProvider";

const CATEGORIES = ["Semua", ...new Set(GAMES.map((g) => g.category!))];

type Sort = "popular" | "price" | "name";

export default function GameCatalog() {
  const { openOrder } = useUI();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [sort, setSort] = useState<Sort>("popular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), reduceMotion() ? 0 : 700);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onFilter = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setCat(detail);
    };
    window.addEventListener("kaizora:filter-games", onFilter as EventListener);
    return () => window.removeEventListener("kaizora:filter-games", onFilter as EventListener);
  }, []);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    let out = GAMES.filter(
      (g) =>
        (cat === "Semua" || g.category === cat) &&
        (!query || [g.name, g.short, g.category ?? "", ...(g.aliases ?? [])].some((t) => t.toLowerCase().includes(query))),
    );
    if (sort === "price") out = [...out].sort((a, b) => minPrice(a) - minPrice(b));
    else if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    else out = [...out].sort((a, b) => a.rank - b.rank);
    return out;
  }, [q, cat, sort]);

  const shown = items.length > 0;

  return (
    <section className="section section--alt" id="topup" aria-labelledby="topup-title">
      <div className="container">
        <div className="section__head" data-reveal>
          <div>
            <span className="eyebrow"><i className="fa-solid fa-gamepad" aria-hidden="true" /> Top Up Game</span>
            <h2 id="topup-title">Pilih Game Favoritmu</h2>
            <p>Masukkan ID akun, pilih nominal, bayar. Cari berdasarkan nama atau filter kategori.</p>
          </div>
        </div>
        <div className="toolbar" data-reveal>
          <div className="search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <label className="sr-only" htmlFor="gameSearch">Cari game</label>
            <input
              className="input"
              id="gameSearch"
              type="search"
              placeholder="Cari game, mis. Mobile Legends"
              autoComplete="off"
              spellCheck={false}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button className="icon-btn search__clear" type="button" id="gameSearchClear" aria-label="Hapus pencarian" onClick={() => setQ("")}>
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="filters" id="gameFilters" role="group" aria-label="Filter kategori game">
            {CATEGORIES.map((c) => (
              <button key={c} className="chip" type="button" data-cat={c} aria-pressed={c === cat} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="toolbar__sort">
            <label className="sr-only" htmlFor="gameSort">Urutkan game</label>
            <select className="input" id="gameSort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="popular">Terpopuler</option>
              <option value="price">Harga terendah</option>
              <option value="name">Nama A–Z</option>
            </select>
          </div>
        </div>
        <p className="sr-only" id="gameCount" role="status" aria-live="polite">{items.length} game ditemukan</p>

        {loading ? (
          <div className="grid-games" id="gameGrid" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <div className="sk-card" key={i}>
                <div className="skeleton" />
                <div className="skeleton sk-line" />
                <div className="skeleton sk-line w60" />
              </div>
            ))}
          </div>
        ) : shown ? (
          <div className="grid-games" id="gameGrid">
            {items.map((g, i) => (
              <article className="game-card" style={{ "--i": i } as React.CSSProperties} key={g.id}>
                <div className="game-card__cover">
                  <img src={g.cover!} width={360} height={450} alt={`Cover ${g.name}`} loading="lazy" />
                  {g.popular && (
                    <span className="badge badge--fire">
                      <i className="fa-solid fa-fire" aria-hidden="true" /> Populer
                    </span>
                  )}
                  <span className="game-card__cat">{g.category}</span>
                </div>
                <div className="game-card__body">
                  <h3>{g.name}</h3>
                  <p className="game-card__price">Mulai <b>{idr(minPrice(g))}</b></p>
                  <button
                    className="btn btn--primary btn--block stretched"
                    type="button"
                    onClick={() => openOrder("game", g.id)}
                    aria-label={`Top up ${g.name}`}
                  >
                    Top Up
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty" id="gameEmpty">
            <i className="fa-regular fa-face-frown" aria-hidden="true" />
            <h3>Game tidak ditemukan</h3>
            <p>Coba kata kunci lain atau tampilkan semua kategori.</p>
            <button className="btn btn--primary" type="button" id="gameReset" onClick={() => { setQ(""); setCat("Semua"); }}>
              Reset pencarian
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
