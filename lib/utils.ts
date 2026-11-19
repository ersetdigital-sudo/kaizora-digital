import { siteConfig } from "@/config/site";

export const idr = (n: number) =>
  (n < 0 ? "-" : "") + "Rp" + Math.abs(Math.round(n)).toLocaleString("id-ID");

export const fmtDate = (ts: number) =>
  new Intl.DateTimeFormat(siteConfig.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ts);

export const mask = (v: string) => {
  const s = String(v);
  if (s.includes("@")) {
    const [u = "", d = ""] = s.split("@");
    return `${u[0] || ""}•••@${d}`;
  }
  return s.length <= 4 ? s : s.slice(0, 2) + "•".repeat(Math.min(s.length - 4, 6)) + s.slice(-2);
};

export const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const wait = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, reduceMotion() ? Math.min(ms, 40) : ms));

const randomCode = (n: number) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const buf = new Uint32Array(n);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) window.crypto.getRandomValues(buf);
  else for (let i = 0; i < n; i++) buf[i] = Math.floor(Math.random() * 4e9);
  return [...buf].map((x) => chars[x % chars.length]).join("");
};

export const newInvoiceId = () => {
  const d = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `INV-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${randomCode(5)}`;
};

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* fallback below */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;top:0";
    document.body.appendChild(ta);
    ta.select();
    const okCopy = document.execCommand("copy");
    ta.remove();
    return okCopy;
  } catch {
    return false;
  }
}
