# Prompt Eksekusi — Tahap Awal Front-end

Bertindaklah sebagai senior React front-end engineer, UI/UX engineer, dan implementer yang mengikuti kontrak proyek.

## Sumber kebenaran
Baca `AGENTS.md` dan `docs/SOT.md` terlebih dahulu. Keduanya adalah kontrak utama. Jangan memperluas ruang lingkup tanpa persetujuan.

## Tujuan tugas
Bangun/rapikan prototype front-end **Rancang Bangun Sistem Informasi Management Platform Kitasedekah.id Berbasis Web** dengan React + Vite + Tailwind CSS dan data dummy lokal.

## Fitur dalam scope
- Dashboard admin dengan metrik, arus donasi, komposisi penyaluran, donasi terbaru, dan program unggulan.
- Program Donasi: daftar, cari, tambah program, hapus program lokal.
- Data Donasi: tabel transaksi dan pencarian.
- Verifikasi Pembayaran: simulasi setujui/tolak transaksi yang menunggu.
- Penyaluran Dana: rekap, penerima manfaat, tanggal, status, dan dokumentasi dummy.
- Laporan: dana masuk, dana tersalurkan, saldo, ringkasan per program.
- Konten & Dokumentasi: daftar kegiatan dan aksi demo.
- Preview website publik: hero, statistik, program, formulir donasi simulasi, kegiatan dan penyaluran.
- Responsif untuk desktop/tablet/mobile, warna hijau-putih kalem, ikon Lucide.

## Ketentuan
1. Jangan buat backend, database, autentikasi nyata, payment gateway, upload nyata, atau notifikasi server.
2. Jangan mengubah stack.
3. Jangan mengklaim fitur demo sebagai transaksi nyata.
4. Gunakan data dummy konsisten dan format mata uang IDR.
5. Pertahankan pemisahan data pada `src/data.js`.
6. Gunakan komponen bersama untuk status, progress, metric card, dan page title bila masuk akal.
7. Perbaiki aksesibilitas dasar: label form, alt gambar, tombol punya nama yang jelas.
8. Semua menu inti harus menghasilkan tampilan yang relevan, tidak blank.
9. Hindari dependency baru tanpa kebutuhan.
10. Bila menemukan ketidaksesuaian antara implementasi dan SOT, utamakan SOT dan jelaskan perubahan.

## Urutan kerja
1. Audit struktur dan baca file kontrak.
2. Identifikasi bagian yang sudah memenuhi SOT dan gap yang tersisa.
3. Implementasikan gap dengan perubahan sekecil mungkin.
4. Jalankan `npm install` bila perlu dan `npm run build`.
5. Laporkan hasil build, daftar file yang berubah, fitur yang diuji, serta batasan yang belum selesai.

## Format laporan akhir
- **Selesai:** poin fitur yang benar-benar selesai.
- **Pengujian:** perintah yang dijalankan dan hasilnya.
- **Batasan:** fitur yang masih dummy/belum terhubung.
- **Langkah berikutnya:** hanya prioritas paling relevan, tanpa menambah scope.
