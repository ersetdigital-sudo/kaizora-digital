import type { Metadata } from "next";
import { Suspense } from "react";
import { CekTransaksiPageClient } from "@/components/sections/tracker/CekTransaksiPageClient";

export const metadata: Metadata = {
  title: "Cek Transaksi",
};

export default function CekTransaksiPage() {
  return (
    <Suspense fallback={null}>
      <CekTransaksiPageClient />
    </Suspense>
  );
}
