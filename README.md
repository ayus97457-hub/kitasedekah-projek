# Kitasedekah.id — Management Platform

Prototype front-end untuk **Rancang Bangun Sistem Informasi Management Platform Kitasedekah.id Berbasis Web** dengan struktur 6 modul terpadu.

## Teknologi
- **Framework**: React 18 + Vite 6
- **Styling**: Tailwind CSS
- **Ikonografi**: Lucide React
- **Data**: State reaktif lokal dengan dataset dummy terpadu (`src/data.js`)

## Cara Menjalankan Project
Pastikan Node.js versi LTS sudah terpasang.

```bash
# Menjalankan server development
npm run dev

# Membangun bundle produksi
npm run build

# Meninjau hasil build produksi
npm run preview
```

Buka alamat lokal di browser: `http://localhost:5173`.

---

## 6 Modul Utama Sistem

1. **Modul 1: Otentikasi & Manajemen Pengguna (User Management)**
   - Akses pengurus internal yayasan: **Admin Sedekah** dan **Admin Konten**.
   - **Kebijakan Efisiensi**: Donatur tidak perlu login/registrasi untuk berdonasi (*frictionless donation*).
   - Fitur Pengurus: Registrasi staf baru, Login pengurus, Lupa kata sandi dengan verifikasi kode OTP simulasi.
   - Fitur Donatur: Direktori donatur dan profil loyalitas yang dicatat otomatis dari transaksi.
   - Matriks kewenangan sistem berbasis peran (RBAC).

2. **Modul 2: Kelola Program Donasi / Kampanye Sedekah**
   - Manajemen kampanye sosial: target dana, sisa hari, kategori program, dan deskripsi.
   - Filter kategori (*Bantuan Pangan, Pendidikan, Infrastruktur, Kemanusiaan*) dan status program.
   - Form modal buat kampanye baru, detail program & donatur terkait, dan hapus kampanye pada state lokal.

3. **Modul 3: Transaksi & Payment Gateway**
   - Riwayat transaksi donasi masuk dengan pencarian dan filter status.
   - Dukungan saluran payment gateway resmi: QRIS Dinamis, BCA VA, Mandiri VA, BRI VA, dan GoPay.
   - **Simulator Payment Gateway Sandbox**: Fitur simulasi webhook instan (*auto-settlement*) untuk persetujuan otomatis, serta verifikasi manual (Setujui / Tolak).

4. **Modul 4: Penyaluran & Laporan Keuangan (Transparansi)**
   - Realisasi penyaluran dana santunan ke mustahik di lapangan lengkap dengan foto dokumentasi.
   - Form modal catat penyaluran dana baru.
   - Laporan akuntabilitas keuangan publik (*Saldo Kas = Donasi Terverifikasi − Penyaluran Dana*).
   - Neraca finansial per program dan tombol simulasi ekspor CSV serta PDF.

5. **Modul 5: Dashboard & Analitik (Admin / Pengurus)**
   - Ringkasan KPI eksekutif (Donasi Terverifikasi, Penyaluran, Saldo Kas, Total Donatur).
   - Visualisasi grafik tren finansial bulanan (donasi masuk vs penyaluran dana).
   - Grafik distribusi kategori program dan preferensi saluran payment gateway.
   - Antrean transaksi mendesak yang butuh konfirmasi.

6. **Modul 6: Informasi & Halaman Publik (Landing Page)**
   - Halaman utama publik donatur dengan navigasi responsif dan tombol ke Panel Admin.
   - Hero section dengan ajakan sedekah dan live counter dampak sosial.
   - Katalog program sedekah unggulan.
   - **Formulir Donasi Cepat Terintegrasi Payment Gateway (100% Tanpa Login)**.
   - Galeri berita kabar kegiatan lapangan dan dokumentasi aksi sosial.
   - **Fitur Cek Status & Nota Donasi Mandiri**: Donatur cukup memasukkan ID transaksi (contoh: `KS-24080`) untuk melihat nota resmi tanpa login akun.
   - Rubrik Tanya Jawab (FAQ).

---

## Batasan Prototipe Front-end
- Data disimpan pada state React selama sesi aktif; refresh browser akan memulihkan data awal dari `src/data.js`.
- Integrasi backend nyata, database SQL, push notification WhatsApp/email nyata, dan transfer uang riil di bank belum terpasang (tahap front-end prototype).
- Gambar dokumentasi menggunakan tautan Unsplash berlisensi bebas.

---
© 2026 Kitasedekah.id · Management Platform
