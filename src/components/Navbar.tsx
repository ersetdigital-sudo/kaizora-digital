import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ active }: { active?: "home" | "cek" | "bantuan" }) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [spy, setSpy] = useState<string>(active ?? "home");

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy (home page only)
  useEffect(() => {
    if (active) {
      setSpy(active);
      return;
    }
    const map: Record<string, string> = {
      home: "home",
      promo: "home",
      topup: "topup",
      populer: "topup",
      ppob: "ppob",
      cara: "ppob",
    };
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setSpy(map[en.target.id] ?? "home");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    Object.keys(map).forEach((id) => {
      const s = document.getElementById(id);
      if (s) io.observe(s);
    });
    return () => io.disconnect();
  }, [active, pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        document.getElementById("burger")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (open && !(e.target as HTMLElement).closest("#navbar")) setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const isHome = !active || active === "home";

  const links: { key: string; label: string; href: string }[] = [
    { key: "home", label: "Beranda", href: isHome ? "#home" : "/" },
    { key: "topup", label: "Top Up Game", href: isHome ? "#topup" : "/#topup" },
    { key: "ppob", label: "PPOB", href: isHome ? "#ppob" : "/#ppob" },
    { key: "cek", label: "Cek Transaksi", href: "/cek-transaksi" },
    { key: "bantuan", label: "Bantuan", href: "/bantuan" },
  ];

  return (
    <header className={`navbar${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`} id="navbar">
      <div className="container navbar__inner">
        <Link className="brand" to="/" aria-label="KAIZORA DIGITAL — ke Beranda">
          <img src="/assets/icons/logo-mark.svg" width={36} height={36} alt="" />
          <span>KAIZORA DIGITAL</span>
        </Link>
        <button
          className="burger"
          id="burger"
          type="button"
          aria-expanded={open}
          aria-controls="mainNav"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className="nav" id="mainNav" aria-label="Navigasi utama">
          <ul className="nav__list">
            {links.map((l) =>
              l.href.startsWith("/") ? (
                <li key={l.key}>
                  <Link className="nav__link" to={l.href} data-spy={l.key} aria-current={spy === l.key ? "true" : undefined} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.key}>
                  <a className="nav__link" href={l.href} data-spy={l.key} aria-current={spy === l.key ? "true" : undefined} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
