"use client";

export type ToastType = "success" | "error" | "info";

export interface ToastInput {
  msg: string;
  type?: ToastType;
  icon?: string;
  duration?: number;
}

export interface OpenOrderOptions {
  productId?: string;
  promo?: string;
}

export interface OrderTarget {
  kind: "game" | "ppob";
  id: string;
  productId?: string;
  promo?: string;
}

export interface InfoStateConfirm {
  kind: "confirm";
  title: string;
  text: string;
  label: string;
  onConfirm: () => void;
}
export type InfoState =
  | { kind: "legal"; key: string }
  | { kind: "social"; name: string }
  | InfoStateConfirm
  | null;

export interface UIContextValue {
  toast: (input: ToastInput) => void;
  openOrder: (kind: "game" | "ppob", serviceId: string, opts?: OpenOrderOptions) => void;
  openAuth: (mode: "login" | "register") => void;
  openInfo: (key: string, extra?: string) => void;
  confirmInfo: (opts: { title: string; text: string; label: string; onConfirm: () => void }) => void;
  openInvoice: (id: string) => void;
  consumePromo: () => string | null;
  usePromo: (code: string) => void;
}
