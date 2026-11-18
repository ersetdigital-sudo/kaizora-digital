export type ServiceKind = "game" | "ppob";

export type FieldRule =
  | { type: "digits"; min: number; max: number }
  | { type: "phone" }
  | { type: "regex"; re: RegExp; msg: string }
  | { type: "email" };

export interface ServiceField {
  id: string;
  label: string;
  ph?: string;
  type?: "text" | "email" | "select" | "tel";
  inputmode?: string;
  maxlength?: number;
  rule?: FieldRule;
  detect?: boolean;
  hint?: string;
  options?: string[];
}

export interface Product {
  id: string;
  label: string;
  price: number;
  tag?: string;
}

export interface Service {
  id: string;
  kind: ServiceKind;
  name: string;
  short: string;
  subtitle: string;
  desc?: string;
  aliases?: string[];
  category?: string;
  currency?: string;
  popular?: boolean;
  rank: number;
  layout?: "split" | "even";
  fields: ServiceField[];
  products?: Product[];
  inquiry?: boolean;
  billLabel?: string;
  cover?: string;
  icon: string;
  tone?: string;
  stepTitle: string;
}

export type PaymentFee = { type: "percent"; value: number } | { type: "flat"; value: number };

export interface Payment {
  id: string;
  name: string;
  desc: string;
  code: string;
  color: string;
  fee: PaymentFee;
}

export interface Promo {
  code: string;
  title: string;
  desc: string;
  type: "percent" | "flat";
  value: number;
  max?: number;
  min: number;
  scope: "all" | "game" | "ppob";
  firstOnly?: boolean;
}

export interface PromoSlide {
  code: string;
  icon: string;
  title: string;
  text: string;
}

export type TxStatus = "pending" | "processing" | "success" | "failed" | "cancelled";

export interface TxHistoryEntry {
  status: TxStatus;
  at: number;
  note: string;
}

export interface TxField {
  label: string;
  value: string;
  secret?: boolean;
}

export interface Tx {
  id: string;
  kind: ServiceKind;
  serviceId: string;
  serviceName: string;
  productLabel: string;
  fields: TxField[];
  subtotal: number;
  discount: number;
  promoCode: string | null;
  fee: number;
  total: number;
  paymentId: string;
  paymentName: string;
  status: TxStatus;
  createdAt: number;
  history: TxHistoryEntry[];
}

export interface OrderPayload {
  kind: ServiceKind;
  serviceId: string;
  serviceName: string;
  productLabel: string;
  fields: TxField[];
  subtotal: number;
  discount: number;
  promoCode: string | null;
  fee: number;
  total: number;
  paymentId: string;
  paymentName: string;
}

export interface BillInquiry {
  name: string;
  period: string;
  amount: number;
  admin: number;
  price: number;
  label: string;
}

export type PromoState =
  | { ok: true; amount: number }
  | { ok: false; hard: boolean; reason: string };

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  promoState: PromoState | null;
}
