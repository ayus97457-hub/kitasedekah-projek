# SOT — Source of Truth
## Rancang Bangun Sistem Informasi Management Platform Kitasedekah.id Berbasis Web

**Versi:** 1.0  
**Status:** Baseline untuk tahap front-end prototype  
**Prinsip:** SOT adalah sumber kebenaran utama. Implementasi tidak boleh menambah ruang lingkup tanpa persetujuan.

## 1. Tujuan produk
Membangun antarmuka web yang membantu Kitasedekah.id mengelola program donasi, transaksi, verifikasi pembayaran, penyaluran dana, laporan, dan konten publik secara terstruktur. Pengalaman publik berfokus pada kejelasan program, kemudahan simulasi donasi, dan transparansi kegiatan.

## 2. Pengguna dan hak akses
1. **Donatur/pengunjung publik:** melihat informasi platform, program, progres dana, kegiatan, laporan penyaluran, dan mengisi formulir donasi simulasi.
2. **Administrator:** masuk melalui autentikasi (belum diimplementasikan pada prototype), lalu mengelola program, donasi, verifikasi, penyaluran, laporan, dan konten.

## 3. Ruang lingkup fitur
### Publik / donatur
- **P-01 Beranda:** pengenalan Kitasedekah.id, program unggulan, ringkasan dana, kegiatan sosial.
- **P-02 Program donasi:** kartu program berisi judul, kategori, target, dana terkumpul, progres, tenggat, dan status.
- **P-03 Formulir donasi:** pilih program, nominal, nama donatur, metode pembayaran.
- **P-04 Konfirmasi pembayaran:** konsep metode pembayaran, unggah bukti bila diperlukan, status verifikasi. Prototype hanya memberi informasi bahwa pembayaran belum nyata.
- **P-05 Kegiatan & penyaluran:** dokumentasi, penerima manfaat, tanggal, ringkasan dan jumlah penyaluran.

### Administrator
- **A-01 Login admin:** autentikasi dan pembatasan akses (di luar prototype front-end).
- **A-02 Manajemen program:** daftar, tambah, detail, ubah, hapus; data target, deskripsi, gambar, kategori dan status. Prototype mendukung daftar, tambah dasar, hapus lokal.
- **A-03 Manajemen donasi:** lihat donatur, nominal, tanggal, program, metode, status.
- **A-04 Verifikasi pembayaran:** meninjau transaksi dan simulasi setujui/tolak.
- **A-05 Manajemen penyaluran dana:** catat jumlah, tanggal, tujuan, penerima manfaat dan dokumentasi. Prototype menampilkan rekap dan modal demo.
- **A-06 Laporan:** rekap dana masuk, dana tersalurkan, dan saldo berdasarkan periode/program.
- **A-07 Konten & dokumentasi:** daftar berita/kegiatan/foto/laporan. Prototype memberi tampilan dan simulasi daftar.
- **A-08 Pengaturan dasar:** hanya area demo; bukan modul bisnis wajib di luar spesifikasi inti.

## 4. Navigasi dan layar
### Admin shell
- Sidebar: Dashboard, Program Donasi, Data Donasi, Verifikasi Pembayaran, Penyaluran Dana, Laporan, Konten & Dokumentasi, Pengaturan.
- Header: judul halaman, pencarian visual, notifikasi, profil admin.
- Konten: dashboard ringkasan, tabel/kartu, status, aksi relevan, dan footer status prototype.
- Tombol **Preview website publik** tersedia dari menu profil/sidebar (ditampilkan sebagai menu Preview website publik).

### Halaman publik
- Hero / pengenalan platform
- Statistik ringkas
- Daftar program
- Form donasi dalam modal
- Ringkasan penyaluran dan kegiatan sosial

## 5. Model data dummy
- **Program:** id, title, category, target, collected, days, status, image, donors, description.
- **Donation:** id, donor, program, amount, date, method, status.
- **Distribution:** id, program, recipient, amount, date, status, documentation (rencana backend).
- **Content/Activity:** title, date, location, image, description, status (rencana backend).
- **Admin:** id, name, email, password_hash, role (rencana backend; tidak ada kredensial dummy pada prototype).

## 6. Aturan bisnis dasar
1. Donasi yang belum diverifikasi tidak boleh dihitung sebagai dana terverifikasi pada laporan final.
2. Status pembayaran yang disarankan: Menunggu, Terverifikasi, Ditolak.
3. Status program yang disarankan: Draft, Aktif, Tercapai, Ditutup.
4. Dana tersalurkan harus memiliki tanggal, jumlah, tujuan/penerima manfaat, program terkait dan dokumentasi.
5. Saldo laporan dihitung dari dana masuk terverifikasi dikurangi dana yang benar-benar tersalurkan; jangan menyamakan total donasi yang dijanjikan dengan dana diterima.
6. Semua nominal ditampilkan dalam format Rupiah Indonesia.
7. Data dalam prototype adalah data contoh dan tidak boleh dipakai untuk keputusan keuangan nyata.

## 7. Prinsip UI/UX
- Visual modern SaaS, bersih, ringan, ramah, dan terpercaya.
- Warna utama hijau kalem dan putih; warna status hanya sebagai aksen semantik.
- Layout responsif untuk desktop, tablet, dan ponsel.
- Hierarki visual kuat: metrik utama, progres program, status transaksi, lalu detail.
- Tabel dapat digulir horizontal di layar kecil.
- Ikon konsisten; tombol aksi memiliki label atau tooltip yang jelas.
- Bahasa antarmuka: Bahasa Indonesia.

## 8. Teknologi dan arsitektur front-end
- React + Vite.
- Tailwind CSS.
- Lucide React untuk ikon.
- Data dummy berada pada `src/data.js`; komponen antarmuka pada `src/App.jsx`; gaya tambahan `src/styles.css`.
- Tidak ada API, autentikasi nyata, penyimpanan permanen, atau payment gateway pada tahap ini.

## 9. Non-goals / di luar ruang lingkup tahap ini
- Backend, database SQL, REST API, autentikasi dan otorisasi nyata.
- Integrasi QRIS/bank/payment gateway.
- Upload bukti pembayaran/dokumentasi ke server.
- Email, WhatsApp, push notification.
- Rekonsiliasi bank, audit keuangan, pajak, dan laporan legal.
- Mengubah sistem menjadi aplikasi mobile native.
- Mengganti stack teknologi yang sudah ditentukan.

## 10. Kriteria penerimaan prototype
- `npm install` dan `npm run dev` dapat menjalankan aplikasi.
- `npm run build` berhasil tanpa error.
- Semua menu inti dapat dibuka tanpa halaman kosong.
- Program dapat ditambahkan dan dihapus pada state lokal.
- Transaksi berstatus Menunggu dapat disimulasikan menjadi Terverifikasi atau Ditolak.
- Halaman publik menampilkan program, progres, kegiatan, dan modal simulasi donasi.
- Semua layar menggunakan tema hijau-putih dan memiliki layout responsif.
- Data dummy diberi batasan yang jelas, tidak ada klaim pembayaran nyata.

## 11. Keputusan yang masih terbuka
- Detail branding resmi (logo, font, tagline, aset foto resmi).
- Skema database final dan aturan nomor transaksi.
- Alur unggah bukti pembayaran dan bukti penyaluran.
- Peran admin tambahan, bila kelak dibutuhkan.
- Filter periode, format ekspor, dan format laporan final.
