import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { reduceMotion } from "@/lib/data";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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
  }, [pathname, hash]);

  return null;
}
