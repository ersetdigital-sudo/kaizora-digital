import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import RevealController from "@/components/RevealController";

export default function BantuanPage() {
  useEffect(() => {
    document.title = "Pusat Bantuan | KAIZORA DIGITAL";
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten utama</a>
      <Navbar active="bantuan" />
      <main id="main">
        <section className="page-hero" aria-labelledby="bantuan-page-title">
          <div className="hero__bg" aria-hidden="true" />
          <div className="container">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Bantuan</span>
            </nav>
            <span className="eyebrow eyebrow--light">
              <i className="fa-solid fa-headset" aria-hidden="true" /> Pusat Bantuan
            </span>
            <h1 id="bantuan-page-title">
              Pertanyaan yang Sering <span className="text-gradient">Diajukan.</span>
            </h1>
            <p className="hero__sub">
              Temukan jawaban cepat seputar top up game, pembayaran, dan layanan PPOB.
            </p>
          </div>
        </section>

        <Faq embedded />
      </main>
      <Footer page="bantuan" />
      <RevealController />
    </>
  );
}
