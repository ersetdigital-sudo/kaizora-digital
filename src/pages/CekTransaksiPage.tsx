import { Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";
import RevealController from "@/components/RevealController";

export default function CekTransaksiPage() {
  useEffect(() => {
    document.title = "Cek Transaksi | KAIZORA DIGITAL";
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten utama</a>
      <Navbar active="cek" />
      <main id="main">
        <section className="page-hero" aria-labelledby="cek-title">
          <div className="hero__bg" aria-hidden="true" />
          <div className="container">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Beranda</Link><span aria-hidden="true">/</span><span aria-current="page">Cek Transaksi</span>
            </nav>
            <span className="eyebrow eyebrow--light"><i className="fa-solid fa-magnifying-glass-dollar" aria-hidden="true" /> Cek Transaksi</span>
            <h1 id="cek-title">Lacak Status <span className="text-gradient">Pesananmu.</span></h1>
            <p className="hero__sub">Masukkan nomor invoice untuk melihat status dan riwayat pesanan Anda.</p>
          </div>
        </section>

        <Suspense fallback={null}>
          <Tracker />
        </Suspense>

        <section className="section section--alt track-cta" aria-label="Belum punya invoice">
          <div className="container track-cta__inner">
            <div><h2>Belum punya invoice?</h2><p>Mulai pesanan baru dan invoice akan muncul di sini.</p></div>
            <div className="track-cta__btns">
              <Link className="btn btn--primary" to="/#topup"><i className="fa-solid fa-gamepad" aria-hidden="true" /> Top Up Game</Link>
              <Link className="btn btn--outline" to="/#ppob"><i className="fa-solid fa-receipt" aria-hidden="true" /> Bayar PPOB</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer page="cek" />
      <RevealController />
    </>
  );
}
