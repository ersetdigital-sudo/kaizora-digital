
import { useEffect } from "react";
import { GAMES, PPOB, PAYMENTS, reduceMotion } from "@/lib/data";

export default function RevealController() {
  useEffect(() => {
    const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (!("IntersectionObserver" in window) || reduceMotion()) {
      items.forEach((i) => i.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-visible");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      items.forEach((i) => io.observe(i));
    }

    const totals: Record<string, number> = {
      games: GAMES.length,
      ppob: PPOB.length,
      products: [...GAMES, ...PPOB].reduce((a, s) => a + (s.products ? s.products.length : 0), 0),
      payments: PAYMENTS.length,
    };
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const target = totals[el.dataset.count ?? ""] ?? 0;
      if (reduceMotion()) {
        el.textContent = String(target);
        return;
      }
      const start = performance.now();
      const dur = 1300;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, []);

  return null;
}
