import { siteConfig } from "@/config/site";
import { newInvoiceId, wait } from "@/lib/utils";
import type { BillInquiry, OrderPayload, Service, Tx, TxStatus } from "@/types";

function storageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    window.localStorage.setItem("__kt", "1");
    window.localStorage.removeItem("__kt");
    return true;
  } catch {
    return false;
  }
}

const memoryStore = new Map<string, string>();
let localOk: boolean | null = null;
const ok = () => (localOk === null ? (localOk = storageAvailable()) : localOk);

export const Store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = ok() ? window.localStorage.getItem(key) : (memoryStore.get(key) ?? null);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    const s = JSON.stringify(value);
    try {
      if (ok()) window.localStorage.setItem(key, s);
      else memoryStore.set(key, s);
    } catch {
      memoryStore.set(key, s);
    }
  },
  remove(key: string) {
    try {
      if (ok()) window.localStorage.removeItem(key);
      else memoryStore.delete(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};

const listeners = new Set<(id: string | null) => void>();
export function onTxChange(cb: (id: string | null) => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
const emit = (id: string | null) => listeners.forEach((cb) => cb(id));

export const TxStore = {
  local(): Tx[] {
    return Store.get<Tx[]>(siteConfig.storageKeys.tx, []);
  },
  localCount(): number {
    return TxStore.local().length;
  },
  all(): Tx[] {
    return TxStore.local();
  },
  find(id: string | null | undefined): Tx | null {
    const key = String(id ?? "").trim().toUpperCase();
    return TxStore.all().find((t) => t.id === key) ?? null;
  },
  create(payload: OrderPayload): Tx {
    const now = Date.now();
    const tx: Tx = {
      ...payload,
      id: newInvoiceId(),
      createdAt: now,
      status: "pending",
      history: [{ status: "pending", at: now, note: "Invoice dibuat. Menunggu pembayaran." }],
    };
    const list = TxStore.local();
    list.unshift(tx);
    Store.set(siteConfig.storageKeys.tx, list.slice(0, 30));
    emit(tx.id);
    return tx;
  },
  setStatus(id: string, status: TxStatus, note: string): Tx | null {
    const list = TxStore.local();
    const tx = list.find((t) => t.id === id);
    if (!tx) return null;
    tx.status = status;
    tx.history.push({ status, at: Date.now(), note });
    Store.set(siteConfig.storageKeys.tx, list);
    emit(id);
    return tx;
  },
  clear() {
    Store.set(siteConfig.storageKeys.tx, []);
    emit(null);
  },
  settle() {
    const list = TxStore.local();
    let changed = false;
    list.forEach((t) => {
      const last = t.history[t.history.length - 1];
      if (t.status === "processing" && last && Date.now() - last.at > 3500) {
        t.status = "success";
        t.history.push({ status: "success", at: last.at + 3500, note: "Pesanan selesai diproses." });
        changed = true;
      }
    });
    if (changed) Store.set(siteConfig.storageKeys.tx, list);
  },
};

export function isFirstTransaction(): boolean {
  try {
    return TxStore.localCount() === 0;
  } catch {
    return true;
  }
}

export const api = {
  async inquireBill(svc: Pick<Service, "billLabel">, customerId: string): Promise<BillInquiry> {
    await wait(850);
    const sum = [...customerId].reduce((a, c) => a + (Number(c) || 0) * 7 + 13, 0);
    const names = ["A*** S****", "B*** W******", "D*** P*****", "R*** H*****"];
    const amount = Math.round((60000 + ((sum * 917) % 340000)) / 100) * 100;
    const admin = 2500;
    const period = new Intl.DateTimeFormat(siteConfig.locale, { month: "long", year: "numeric" }).format(new Date());
    return {
      name: names[sum % names.length]!,
      period,
      amount,
      admin,
      price: amount + admin,
      label: `${svc.billLabel ?? "Tagihan"} ${period}`,
    };
  },
  async createOrder(payload: OrderPayload) {
    await wait(1100);
    return TxStore.create(payload);
  },
  async getTransaction(id: string) {
    await wait(600);
    return TxStore.find(id);
  },
};
