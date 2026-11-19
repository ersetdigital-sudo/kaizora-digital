"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/sections/layout/Navbar";
import Footer from "@/components/sections/layout/Footer";
import UIProvider from "@/components/sections/ui/UIProvider";
import Preloader from "@/components/sections/layout/Preloader";
import ScrollToHash from "@/components/sections/layout/ScrollToHash";
import Hero from "./Hero";
import PpobGrid from "./PpobGrid";
import Steps from "./Steps";
import RevealController from "@/components/sections/layout/RevealController";

const PromoCarousel = dynamic(() => import("./PromoCarousel"), { ssr: false });
const GameCatalog = dynamic(() => import("./GameCatalog"), { ssr: false });
const Populer = dynamic(() => import("./Populer"), { ssr: false });

export function HomePageClient() {
  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten utama</a>
      <Preloader />
      <UIProvider>
        <ScrollToHash />
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
      </UIProvider>
    </>
  );
}
