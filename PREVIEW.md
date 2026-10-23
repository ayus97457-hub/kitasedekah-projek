# Preview Paket Kitasedekah.id

Dokumen ini merangkum arsitektur 6 modul sistem informasi Kitasedekah.id.

## 1. Aplikasi Front-End
- `src/App.jsx`: Entry root komponen manajemen panel, navigasi 6 modul, dan pengatur state reaktif.
- `src/components/UserManagementModule.jsx`: **Modul 1** — Otentikasi & Manajemen Pengguna (Role: Admin Sedekah & Admin Konten, Direktori Donatur, Login, Registrasi Staf, Lupa Password OTP).
- `src/components/ProgramsModule.jsx`: **Modul 2** — Kelola Program Donasi / Kampanye Sedekah (Kategori, Target, Progres Bar, Tambah Kampanye).
- `src/components/TransactionsGatewayModule.jsx`: **Modul 3** — Transaksi & Payment Gateway (Riwayat Donasi, QRIS, VA Bank, Simulator Auto-Settlement).
- `src/components/TransparencyModule.jsx`: **Modul 4** — Penyaluran & Laporan Keuangan (Realisasi Dana Mustahik, Dokumentasi Foto, Neraca Saldo Kas).
- `src/components/DashboardAnalyticsModule.jsx`: **Modul 5** — Dashboard & Analitik (KPI Finansial, Grafik Tren Bulanan, Distribusi Program).
- `src/components/LandingPageModule.jsx`: **Modul 6** — Informasi & Halaman Publik (Landing Page Donatur 100% Tanpa Login, Form Donasi Cepat, Cek Status Donasi Mandiri).
- `src/components/AuthModal.jsx`: Modal otentikasi login cepat pengurus yayasan.
- `src/data.js`: Dataset dummy terpadu (users, payment channels, programs, donations, distributions, activities, faqs).

## 2. Cara Menjalankan
```bash
npm run dev
```
Buka URL lokal: `http://localhost:5173`.

Untuk build produksi:
```bash
npm run build
```
