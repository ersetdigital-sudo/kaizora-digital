
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { copyText, reduceMotion } from "@/lib/data";
import type { ToastInput, ToastType, UIContextValue, OpenOrderOptions, OrderTarget } from "./ui-context";
import OrderModal from "./OrderModal";
import AuthModal from "./AuthModal";
import InfoModal from "./InfoModal";
import InvoiceModal from "./InvoiceModal";

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within <UIProvider>");
  return ctx;
}

export type InfoState =
  | { kind: "legal"; key: string }
  | { kind: "social"; name: string }
  | { kind: "confirm"; title: string; text: string; label: string; onConfirm: () => void }
  | null;

interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
  icon?: string;
}

const TOAST_ICONS: Record<ToastType, string> = {
  success: "fa-circle-check",
  error: "fa-circle-exclamation",
  info: "fa-circle-info",
};


export default function UIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [orderTarget, setOrderTarget] = useState<OrderTarget | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const [infoState, setInfoState] = useState<InfoState>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const pendingPromoRef = useRef<string | null>(null);
  const toastIdRef = useRef(0);

  const toast = useCallback((input: ToastInput) => {
    const id = ++toastIdRef.current;
    const item: ToastItem = {
      id,
      msg: input.msg,
      type: input.type ?? "info",
      icon: input.icon,
    };
    setToasts((list) => [...list, item].slice(-3));
    const duration = input.duration ?? 4000;
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, reduceMotion() ? 100 : duration);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const openOrder = useCallback((kind: "game" | "ppob", serviceId: string, opts?: OpenOrderOptions) => {
    setOrderTarget({ kind, id: serviceId, productId: opts?.productId, promo: opts?.promo });
  }, []);

  const usePromo = useCallback(
    (code: string) => {
      pendingPromoRef.current = code;
      void (async () => {
        const copied = await copyText(code);
        toast({
          msg: `Kode ${code} ${copied ? "disalin dan " : ""}disimpan — otomatis terpasang di checkout berikutnya.`,
          type: "success",
          icon: "fa-ticket",
        });
      })();
      if (typeof document !== "undefined") {
        document.getElementById("topup")?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
      }
    },
    [toast],
  );

  const openAuth = useCallback((mode: "login" | "register") => setAuthMode(mode), []);
  const openInfo = useCallback((key: string, extra?: string) => {
    if (key === "social") setInfoState({ kind: "social", name: extra ?? "Media Sosial" });
    else setInfoState({ kind: "legal", key });
  }, []);
  const confirmInfo = useCallback(
    (opts: { title: string; text: string; label: string; onConfirm: () => void }) =>
      setInfoState({ kind: "confirm", ...opts }),
    [],
  );
  const openInvoice = useCallback((id: string) => setInvoiceId(id), []);
  const pendingPromo = useCallback(() => pendingPromoRef.current, []);
  const consumePromo = useCallback(() => {
    const v = pendingPromoRef.current;
    pendingPromoRef.current = null;
    return v;
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      toast,
      openOrder,
      openAuth,
      openInfo,
      confirmInfo,
      openInvoice,
      pendingPromo,
      consumePromo,
      usePromo,
    }),
    [toast, openOrder, openAuth, openInfo, confirmInfo, openInvoice, pendingPromo, consumePromo, usePromo],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <div className="toasts" id="toasts" role="region" aria-label="Notifikasi" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast--${t.type}`}
            role={t.type === "error" ? "alert" : "status"}
          >
            <span className="toast__ico">
              <i className={`fa-solid ${t.icon ?? TOAST_ICONS[t.type]}`} aria-hidden="true" />
            </span>
            <p>{t.msg}</p>
            <button type="button" aria-label="Tutup notifikasi" onClick={() => dismissToast(t.id)}>
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <OrderModal target={orderTarget} onClose={() => setOrderTarget(null)} />
      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      <InfoModal state={infoState} onClose={() => setInfoState(null)} />
      <InvoiceModal id={invoiceId} onClose={() => setInvoiceId(null)} />
    </UIContext.Provider>
  );
}
