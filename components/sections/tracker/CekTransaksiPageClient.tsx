"use client";

import Link from "next/link";
import Navbar from "@/components/sections/layout/Navbar";
import Footer from "@/components/sections/layout/Footer";
import UIProvider from "@/components/sections/ui/UIProvider";
import Preloader from "@/components/sections/layout/Preloader";
import ScrollToHash from "@/components/sections/layout/ScrollToHash";
import RevealController from "@/components/sections/layout/RevealController";
import { Icon } from "@/components/ui/Icon";
import Tracker from "./Tracker";

export function CekTransaksiPageClient() {
  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten utama</a>
      <Preloader />
      <UIProvider>
        <ScrollToHash />
        <Navbar active="cek" />
        <main id="main">
          <section className="page-hero" aria-labelledby="cek-title">
            <div className="hero__bg" aria-hidden="true" />
            <div className="container">
              <nav className="crumbs" aria-label="Breadcrumb">
                <Link href="/">Beranda</Link><span aria-hidden="true">/</span><span aria-current="page">Cek Transaksi</span>
              </nav>
              <span className="eyebrow eyebrow--light"><Icon name="fa-magnifying-glass-dollar" /> Cek Transaksi</span>
              <h1 id="cek-title">Lacak Status <span className="text-gradient">Pesananmu.</span></h1>
              <p className="hero__sub">Masukkan nomor invoice untuk melihat status dan riwayat pesanan Anda.</p>
            </div>
          </section>

          <Tracker />

          <section className="section section--alt track-cta" aria-label="Belum punya invoice">
            <div className="container track-cta__inner">
              <div><h2>Belum punya invoice?</h2><p>Mulai pesanan baru dan invoice akan muncul di sini.</p></div>
              <div className="track-cta__btns">
                <Link className="btn btn--primary" href="/#topup"><Icon name="fa-gamepad" /> Top Up Game</Link>
                <Link className="btn btn--outline" href="/#ppob"><Icon name="fa-receipt" /> Bayar PPOB</Link>
              </div>
            </div>
          </section>
        </main>
        <Footer page="cek" />
        <RevealController />
      </UIProvider>
    </>
  );
}
