"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { reduceMotion } from "@/lib/utils";

export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      const scroll = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
      };
      const t = window.setTimeout(scroll, 0);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
