import { Route, Routes } from "react-router-dom";
import UIProvider from "@/components/UIProvider";
import Preloader from "@/components/Preloader";
import ScrollToHash from "@/components/ScrollToHash";
import HomePage from "@/pages/HomePage";
import BantuanPage from "@/pages/BantuanPage";
import CekTransaksiPage from "@/pages/CekTransaksiPage";

export default function App() {
  return (
    <>
      <Preloader />
      <UIProvider>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bantuan" element={<BantuanPage />} />
          <Route path="/cek-transaksi" element={<CekTransaksiPage />} />
        </Routes>
      </UIProvider>
    </>
  );
}
