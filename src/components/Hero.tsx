import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="eyebrow eyebrow--light">
            <i className="fa-solid fa-bolt" aria-hidden="true" /> Top Up Game &amp; PPOB
          </span>
          <h1 id="hero-title">
            Semua Kebutuhan Digital, <span className="text-gradient">Satu Tempat.</span>
          </h1>
          <p className="hero__sub">
            Top up game, bayar tagihan, dan beli produk digital dengan mudah, cepat, dan praktis.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary btn--lg" href="#topup">
              Jelajahi Produk <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
            <Link className="btn btn--light btn--lg" to="/cek-transaksi">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" /> Cek Transaksi
            </Link>
          </div>
          <ul className="hero__stats" aria-label="Ringkasan katalog">
            <li className="stat"><strong data-count="games">0</strong><span>Game tersedia</span></li>
            <li className="stat"><strong data-count="ppob">0</strong><span>Layanan PPOB</span></li>
            <li className="stat"><strong data-count="products">0</strong><span>Pilihan produk</span></li>
            <li className="stat"><strong data-count="payments">0</strong><span>Metode bayar</span></li>
          </ul>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <span className="blob blob--1" /><span className="blob blob--2" /><span className="blob blob--3" />
          <div className="device">
            <div className="device__bar"><i /><i /><i /></div>
            <div className="device__game">
              <img src="/assets/images/games/mlbb.svg" width={52} height={65} alt="" />
              <div><b>Mobile Legends</b><small>Pilih nominal Diamond</small></div>
            </div>
            <div className="device__grid">
              <div className="device__opt"><b>12 <i className="fa-solid fa-gem" /></b>Rp3.500</div>
              <div className="device__opt"><b>59 <i className="fa-solid fa-gem" /></b>Rp15.000</div>
              <div className="device__opt is-active"><b>86 <i className="fa-solid fa-gem" /></b>Rp21.500</div>
              <div className="device__opt"><b>172 <i className="fa-solid fa-gem" /></b>Rp42.500</div>
            </div>
            <div className="device__pay"><span>Total</span><span>Rp21.500</span></div>
          </div>
          <div className="float-card float-card--success">
            <span className="float-card__icon"><i className="fa-solid fa-circle-check" /></span>
            <div><b>Transaksi Berhasil</b><small>Contoh tampilan · 86 Diamonds</small></div>
          </div>
          <div className="float-card float-card--token">
            <span className="float-card__icon"><i className="fa-solid fa-bolt" /></span>
            <div><b>Token PLN</b><small>Contoh · Rp100.000</small></div>
          </div>
          <div className="float-card float-card--pay">
            <span className="float-card__icon"><i className="fa-solid fa-qrcode" /></span>
            <div><b>Bayar via QRIS</b><small>Contoh metode</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}
