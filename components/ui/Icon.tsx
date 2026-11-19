import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { name: string; title?: string };

const paths: Record<string, React.ReactNode> = {
  "arrow-right": <path d="M5 12h14M13 5l7 7-7 7" />,
  "arrow-left": <path d="M19 12H5m7-7-7 7 7 7" />,
  "bolt": <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  "gem": <path d="M6 3h12l4 6-10 12L2 9zM2 9h20M9 3l3 6 3-6m-3 6 0 12" />,
  "magnifying-glass": <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  "magnifying-glass-dollar": <><circle cx="10" cy="10" r="6" /><path d="m19 19-4-4M10 7v6m-2-2.5c0 1 1 1.5 2 1.5s2-.5 2-1.5-1-1.5-2-1.5-2-.5-2-1.5 1-1.5 2-1.5 2 .5 2 1.5" /></>,
  "gamepad": <><path d="M7 8h10a5 5 0 0 1 4.6 7l-1 2.2A3 3 0 0 1 17.9 19h-.4a3 3 0 0 1-2.4-1.2L14 16h-4l-1.1 1.8A3 3 0 0 1 6.5 19h-.4a3 3 0 0 1-2.7-1.8l-1-2.2A5 5 0 0 1 7 8Z" /><path d="M8 11v4m-2-2h4m5 1h.01M17 11h.01" /></>,
  "receipt": <><path d="M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21z" /><path d="M9 8h6m-6 4h6m-6 4h4" /></>,
  "ticket": <><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" /><path d="M13 6v12" strokeDasharray="2 2" /></>,
  "fire": <path d="M12 3c1 3-2 4-2 7a4 4 0 0 0 8 1c0-3-2-4-2-6 0 2-2 2-2 4a2 2 0 0 1-4 0c0-4 3-5 2-6Z" />,
  "circle-check": <><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 4.5-5.5" /></>,
  "circle-exclamation": <><circle cx="12" cy="12" r="9" /><path d="M12 8v5m0 3h.01" /></>,
  "circle-info": <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
  "circle-xmark": <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
  "circle-question": <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 4 2c-.8.6-1.5 1-1.5 2.5m0 2.5h.01" /></>,
  "xmark": <path d="M6 6l12 12M18 6 6 18" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "copy": <><rect x="9" y="9" width="10" height="10" rx="2" /><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" /></>,
  "qrcode": <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" /><rect x="18" y="18" width="3" height="3" /><rect x="14" y="18" width="3" height="3" /><rect x="18" y="14" width="3" height="3" /></>,
  "file-invoice": <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9 12h6m-6 4h4" /></>,
  "file-circle-check": <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="m9.5 14 1.8 1.8 3.7-4" /></>,
  "clock": <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  "gear": <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3 1a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z" /></>,
  "ban": <><circle cx="12" cy="12" r="9" /><path d="m6.5 6.5 11 11" /></>,
  "rotate-right": <><path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21 3v6h-6" /></>,
  "signal": <path d="M4 20h2v-4H4zm4 0h2v-7H8zm4 0h2V9h-2zm4 0h2V4h-2z" />,
  "mobile-screen-button": <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 17h2" /></>,
  "wifi": <path d="M4 8a13 13 0 0 1 16 0M7 11a9 9 0 0 1 10 0m-7 3a5 5 0 0 1 4 0m-2 3h.01" />,
  "plug-circle-bolt": <><path d="M10 3v4m4-4v4M8 7h8v3a4 4 0 0 1-3 3.87V17h-2v-3.13A4 4 0 0 1 8 10z" /><path d="M18 13l-2.5 4h2l-1 3 3-4h-2z" /></>,
  "heart-pulse": <><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /><path d="M7 11h2l1.5-2 2 4 1.5-2H17" /></>,
  "droplet": <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  "tv": <><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
  "wallet": <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 13h4M3 10h18" /></>,
  "percent": <><path d="M18 6 6 18" /><circle cx="7.5" cy="7.5" r="1.5" /><circle cx="16.5" cy="16.5" r="1.5" /></>,
  "gift": <><rect x="4" y="8" width="16" height="12" rx="1" /><path d="M12 8v12M4 12h16M8.5 8a2.5 2.5 0 1 1 3.5-3.5c0 2-3.5 3.5-3.5 3.5s-3.5-1.5-3.5-3.5A2.5 2.5 0 1 1 8.5 8c0 2 3.5 3.5 3.5 3.5" /></>,
  "play": <path d="M8 6l10 6-10 6z" />,
  "pause": <path d="M7 6h3v12H7zm7 0h3v12h-3z" />,
  "route": <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H14a4 4 0 0 1 0 8h-4a4 4 0 0 0 0 8h5.5" /></>,
  "headset": <><path d="M4 12a8 8 0 0 1 16 0" /><rect x="3" y="12" width="4" height="6" rx="1" /><rect x="17" y="12" width="4" height="6" rx="1" /><path d="M7 18v1a2 2 0 0 0 2 2h2" /></>,
  "comments": <><path d="M14 4H6a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h1v3l3-3h4a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Z" /><path d="M17 9h1a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-1v3l-3-3" /></>,
  "address-book": <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M5 7H3m2 5H3m2 5H3m9-8a2 2 0 1 1 0 .01M9 16c0-1.7 1.3-3 3-3s3 1.3 3 3" /></>,
  "building-columns": <><path d="M4 20h16M6 17V10m4 7V10m4 7V10m4 7V10M3 10l9-6 9 6" /></>,
  "money-bill-transfer": <><rect x="3" y="6" width="14" height="9" rx="1" /><circle cx="10" cy="10.5" r="2" /><path d="M17 13l2 2 2-2m-2 2v-5" /></>,
  "triangle-exclamation": <><path d="M12 4 2.5 20h19z" /><path d="M12 9v4m0 3h.01" /></>,
  "shield-halved": <path d="M12 3 4 7v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7zM12 3v19" />,
  "face-frown": <><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M9 16c.8-1 1.8-1.5 3-1.5s2.2.5 3 1.5" /></>,
  "ranking-star": <><path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7z" /><path d="M4 20h4v-4H4zm6 4h4v-8h-4zm6 0h4v-6h-4z" /></>,
  "instagram": <><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></>,
  "tiktok": <path d="M14 4v8.5a3.5 3.5 0 1 1-3-3.45V12a1 1 0 1 0 1 1V4h2a4 4 0 0 0 4 4V6a6 6 0 0 1-4-2Z" fill="currentColor" stroke="none" />,
  "youtube": <><path d="M22 12s0-3.5-.45-5a2.8 2.8 0 0 0-2-2C18 4.5 12 4.5 12 4.5s-6 0-7.55.5a2.8 2.8 0 0 0-2 2C2 8.5 2 12 2 12s0 3.5.45 5a2.8 2.8 0 0 0 2 2c1.55.5 7.55.5 7.55.5s6 0 7.55-.5a2.8 2.8 0 0 0 2-2c.45-1.5.45-5 .45-5Z" /><path d="m10 9 5 3-5 3z" fill="#fff" stroke="none" /></>,
  "x-twitter": <path d="M4 4h4.5l3.3 4.8L15.8 4H20l-6 7 6.5 9h-4.5l-3.7-5.3L7.8 20H4l6.5-7.5z" fill="currentColor" stroke="none" />,
};

export function Icon({ name, title, ...props }: IconProps) {
  const key = name.replace(/^fa-(solid|regular|brands)\s+fa-/, "fa-").replace(/^fa-/, "");
  const body = paths[key] ?? paths["circle-info"];
  const isBrand = key === "x-twitter" || key === "tiktok";
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill={isBrand ? "currentColor" : "none"}
      stroke={isBrand ? "none" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {body}
    </svg>
  );
}
