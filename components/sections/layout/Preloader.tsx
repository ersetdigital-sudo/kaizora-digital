"use client";

import { useEffect, useState } from "react";
import { reduceMotion } from "@/lib/utils";

export default function Preloader() {
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("fade"), reduceMotion() ? 0 : 650);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "fade") return;
    const t = window.setTimeout(() => setPhase("gone"), reduceMotion() ? 0 : 600);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div className={`preloader${phase === "fade" ? " is-done" : ""}`} role="status" aria-label="Memuat halaman">
      <div className="preloader__box">
        <img src="/assets/icons/logo-mark.svg" width={56} height={56} alt="" />
        <span>KAIZORA DIGITAL</span>
        <div className="preloader__bar" />
      </div>
    </div>
  );
}
