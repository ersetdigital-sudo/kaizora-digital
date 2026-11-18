import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RevealController from "@/components/RevealController";
import PromoCarousel from "@/components/PromoCarousel";
import GameCatalog from "@/components/GameCatalog";
import Populer from "@/components/Populer";
import PpobGrid from "@/components/PpobGrid";
import Steps from "@/components/Steps";
import Footer from "@/components/Footer";

export default function HomePage() {
  useEffect(() => {
    document.title = "KAIZORA DIGITAL — Top Up Game & PPOB dalam Satu Tempat";
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten utama</a>
      <Navbar active="home" />
      <main id="main">
        <Hero />
        <PpobGrid />
        <PromoCarousel />
        <GameCatalog />
        <Populer />
        <Steps />
      </main>
      <Footer page="home" />
      <RevealController />
    </>
  );
}
