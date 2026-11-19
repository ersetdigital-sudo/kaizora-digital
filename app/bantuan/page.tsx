import type { Metadata } from "next";
import { BantuanPageClient } from "@/components/sections/bantuan/BantuanPageClient";

export const metadata: Metadata = {
  title: "Pusat Bantuan",
};

export default function BantuanPage() {
  return <BantuanPageClient />;
}
