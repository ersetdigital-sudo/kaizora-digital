"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { copyText, reduceMotion } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { InfoState, OpenOrderOptions, OrderTarget, ToastInput, ToastType, UIContextValue } from "./ui-context";

const OrderModal = dynamic(() => import("../order/OrderModal"), { ssr: false });
const AuthModal = dynamic(() => import("../auth/AuthModal"), { ssr: false });
const InfoModal = dynamic(() => import("../info/InfoModal"), { ssr: false });
const InvoiceModal = dynamic(() => import("../invoice/InvoiceModal"), { ssr: false });

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within <UIProvider>");
  return ctx;
}

interface ToastItem { id: number; msg: string; type: ToastType; icon?: string }

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
    setToasts((list) => [...list, { id, msg: input.msg, type: input.type ?? "info", icon: input.icon }].slice(-3));
    const duration = input.duration ?? 4000;
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), reduceMotion() ? 100 : duration);
  }, []);

  const openOrder = useCallback((kind: "game" | "ppob", serviceId: string, opts?: OpenOrderOptions) => {
    setOrderTarget({ kind, id: serviceId, productId: opts?.productId, promo: opts?.promo });
  }, []);

  const usePromo = useCallback((code: string) => {
    pendingPromoRef.current = code;
    void (async () => {
      const copied = await copyText(code);
      toast({ msg: `Kode ${code} ${copied ? "disalin dan " : ""}disimpan — otomatis terpasang di checkout berikutnya.`, type: "success", icon: "fa-ticket" });
    })();
    document.getElementById("topup")?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
  }, [toast]);

  const openAuth = useCallback((mode: "login" | "register") => setAuthMode(mode), []);
  const openInfo = useCallback((key: string, extra?: string) => {
    if (key === "social") setInfoState({ kind: "social", name: extra ?? "Media Sosial" });
    else setInfoState({ kind: "legal", key });
  }, []);
  const confirmInfo = useCallback((opts: { title: string; text: string; label: string; onConfirm: () => void }) => setInfoState({ kind: "confirm", ...opts }), []);
  const openInvoice = useCallback((id: string) => setInvoiceId(id), []);
  const consumePromo = useCallback(() => {
    const v = pendingPromoRef.current;
    pendingPromoRef.current = null;
    return v;
  }, []);

  const value = useMemo<UIContextValue>(() => ({
    toast, openOrder, openAuth, openInfo, confirmInfo, openInvoice, consumePromo, usePromo,
  }), [toast, openOrder, openAuth, openInfo, confirmInfo, openInvoice, consumePromo, usePromo]);

  return (
    <UIContext.Provider value={value}>
      {children}
      <div className="toasts" id="toasts" role="region" aria-label="Notifikasi" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`} role={t.type === "error" ? "alert" : "status"}>
            <span className="toast__ico"><Icon name={t.icon ?? TOAST_ICONS[t.type]} /></span>
            <p>{t.msg}</p>
            <button type="button" aria-label="Tutup notifikasi" onClick={() => setToasts((l) => l.filter((x) => x.id !== t.id))}>
              <Icon name="fa-xmark" />
            </button>
          </div>
        ))}
      </div>
      {orderTarget ? <OrderModal target={orderTarget} onClose={() => setOrderTarget(null)} /> : null}
      {authMode ? <AuthModal mode={authMode} onClose={() => setAuthMode(null)} /> : null}
      {infoState ? <InfoModal state={infoState} onClose={() => setInfoState(null)} /> : null}
      {invoiceId ? <InvoiceModal id={invoiceId} onClose={() => setInvoiceId(null)} /> : null}
    </UIContext.Provider>
  );
}
