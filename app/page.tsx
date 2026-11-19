import type { Metadata } from "next";
import { HomePageClient } from "@/components/sections/home/HomePageClient";

export const metadata: Metadata = {
  title: "KAIZORA DIGITAL — Top Up Game & PPOB dalam Satu Tempat",
};

export default function HomePage() {
  return <HomePageClient />;
}
