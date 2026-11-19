"use client";

import Navbar from "@/components/sections/layout/Navbar";
import Footer from "@/components/sections/layout/Footer";
import UIProvider from "@/components/sections/ui/UIProvider";
import Preloader from "@/components/sections/layout/Preloader";
import ScrollToHash from "@/components/sections/layout/ScrollToHash";
import RevealController from "@/components/sections/layout/RevealController";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import Faq from "./Faq";

export function BantuanPageClient() {
  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten utama</a>
      <Preloader />
      <UIProvider>
        <ScrollToHash />
        <Navbar active="bantuan" />
        <main id="main">
          <section className="page-hero" aria-labelledby="bantuan-page-title">
            <div className="hero__bg" aria-hidden="true" />
            <div className="container">
              <nav className="crumbs" aria-label="Breadcrumb">
                <Link href="/">Beranda</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Bantuan</span>
              </nav>
              <span className="eyebrow eyebrow--light"><Icon name="fa-headset" /> Pusat Bantuan</span>
              <h1 id="bantuan-page-title">
                Pertanyaan yang Sering <span className="text-gradient">Diajukan.</span>
              </h1>
              <p className="hero__sub">Temukan jawaban cepat seputar top up game, pembayaran, dan layanan PPOB.</p>
            </div>
          </section>
          <Faq embedded />
        </main>
        <Footer page="bantuan" />
        <RevealController />
      </UIProvider>
    </>
  );
}
