"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { useUI } from "../ui/UIProvider";

export default function Footer({ page }: { page: "home" | "cek" | "bantuan" }) {
  const { openInfo, openOrder } = useUI();
  const year = new Date().getFullYear();
  const isHome = page === "home";

  const filterLink = (filter: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("kaizora:filter-games", { detail: filter }));
    document.getElementById("topup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link className="brand" href="/">
              <img src="/assets/icons/logo-mark.svg" width={36} height={36} alt="" />
              <span>KAIZORA DIGITAL</span>
            </Link>
            <p>Marketplace digital untuk top up game dan layanan PPOB. Semua kebutuhan digital, satu tempat.</p>
            <div className="social" aria-label="Media sosial (placeholder)">
              {(["Instagram", "TikTok", "YouTube", "X"] as const).map((name) => {
                const icon = { Instagram: "fa-instagram", TikTok: "fa-tiktok", YouTube: "fa-youtube", X: "fa-x-twitter" }[name];
                return (
                  <button key={name} type="button" onClick={() => openInfo("social", name)} aria-label={name}>
                    <Icon name={icon} />
                  </button>
                );
              })}
            </div>
          </div>
          <nav aria-label="Navigasi footer">
            <h4>Navigasi</h4>
            <ul>
              <li><Link href={isHome ? "#home" : "/"}>Beranda</Link></li>
              <li><Link href={isHome ? "#topup" : "/#topup"}>Top Up Game</Link></li>
              <li><Link href={isHome ? "#ppob" : "/#ppob"}>PPOB</Link></li>
              <li><Link href="/cek-transaksi" prefetch={false}>Cek Transaksi</Link></li>
              <li><Link href={isHome ? "#promo" : "/#promo"}>Promo</Link></li>
            </ul>
          </nav>
          <nav aria-label="Kategori produk">
            <h4>Kategori Produk</h4>
            <ul>
              <li><a href={isHome ? "#topup" : "/#topup"} onClick={filterLink("MOBA")}>Game MOBA</a></li>
              <li><a href={isHome ? "#topup" : "/#topup"} onClick={filterLink("Battle Royale")}>Battle Royale</a></li>
              <li><button className="link-btn" type="button" onClick={() => openOrder("ppob", "pulsa")}>Pulsa</button></li>
              <li><button className="link-btn" type="button" onClick={() => openOrder("ppob", "pln")}>Token PLN</button></li>
              <li><button className="link-btn" type="button" onClick={() => openOrder("ppob", "ewallet")}>E-Wallet</button></li>
            </ul>
          </nav>
          <nav aria-label="Bantuan dan legal">
            <h4>Bantuan</h4>
            <ul>
              <li><Link href="/bantuan" prefetch={false}>Pusat Bantuan</Link></li>
              <li><button className="link-btn" type="button" onClick={() => openInfo("contact")}>Kontak</button></li>
              <li><button className="link-btn" type="button" onClick={() => openInfo("terms")}>Syarat &amp; Ketentuan</button></li>
              <li><button className="link-btn" type="button" onClick={() => openInfo("privacy")}>Kebijakan Privasi</button></li>
            </ul>
          </nav>
        </div>
        <div className="footer__bottom"><span>© {year} KAIZORA DIGITAL.</span></div>
      </div>
    </footer>
  );
}
