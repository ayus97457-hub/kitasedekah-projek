# AGENTS.md — Kontrak Kerja Agen

Dokumen ini menjadi kontrak awal bagi AI coding agent/developer saat mengembangkan Kitasedekah.id. Jika instruksi lain bertentangan, prioritaskan urutan berikut:
1. Permintaan eksplisit terbaru dari pemilik proyek.
2. `docs/SOT.md`.
3. Kontrak ini.
4. Pola kode yang sudah ada.

## Misi
Mengembangkan front-end sistem informasi manajemen Kitasedekah.id sesuai SOT, dengan React + Vite + Tailwind CSS, data dummy pada tahap prototype, dan UI hijau-putih yang modern serta responsif.

## Batasan wajib
- Jangan mengubah tujuan produk atau menambahkan modul bisnis di luar SOT tanpa persetujuan.
- Jangan mengintegrasikan backend, database, payment gateway, autentikasi sungguhan, atau layanan pihak ketiga pada tahap front-end saja.
- Jangan menyatakan transaksi, upload, verifikasi, ekspor, atau penyimpanan sebagai tindakan nyata bila hanya simulasi.
- Jangan menambahkan kredensial, token, API key, atau data pribadi nyata.
- Jangan menghapus fitur yang sudah ada hanya untuk menyederhanakan implementasi.
- Gunakan data dummy yang konsisten dan tandai batasan prototipe dengan jelas.
- Jangan memasukkan library baru jika fungsi bisa diselesaikan dengan dependency yang sudah tersedia, kecuali ada alasan kuat.

## Aturan implementasi
- Ikuti React function components dan hooks.
- Gunakan Tailwind untuk layout/spacing/responsivitas; gunakan `src/styles.css` hanya untuk komponen atau aturan global yang memang diperlukan.
- Gunakan ikon dari `lucide-react`; hindari emoji sebagai pengganti ikon antarmuka inti.
- Pisahkan data contoh dari UI pada `src/data.js` bila memungkinkan.
- Gunakan nama variabel dan komponen yang deskriptif.
- Hindari duplikasi komponen untuk status, metrik, progres, judul halaman, dan pola tabel.
- Semua tombol yang tampak interaktif harus memiliki aksi yang jelas atau ditandai sebagai demo/nonaktif; hindari kontrol palsu yang seolah-olah berhasil.
- Semua form perlu label, validasi dasar, serta state feedback.
- Gunakan Bahasa Indonesia untuk konten UI.
- Sediakan alt text pada gambar informatif; dekorasi murni boleh menggunakan alt kosong.
- Pastikan tabel dan modal tetap bisa digunakan di viewport kecil, termasuk fokus dan tombol tutup.
- Jangan hardcode nilai finansial hasil perhitungan yang seharusnya dihitung dari data, kecuali metrik dashboard yang secara eksplisit menjadi data dummy ilustratif.

## Proses sebelum mengubah kode
1. Baca `docs/SOT.md` dan file terkait.
2. Ringkas tujuan perubahan dan file yang akan disentuh.
3. Terapkan perubahan sekecil mungkin yang menyelesaikan kebutuhan.
4. Jalankan `npm run build`.
5. Periksa konsol/build error, tautan navigasi, state kosong, dan layout mobile.
6. Laporkan perubahan, pengujian yang dilakukan, batasan yang tersisa.

## Definition of Done
- Perubahan sesuai SOT dan tidak memperluas scope.
- Build produksi berhasil.
- Navigasi yang terpengaruh tetap bekerja.
- Tidak ada error React yang diketahui.
- Layout responsif dan aksesibilitas dasar dijaga.
- Hasil akhir menyebutkan apa yang nyata, apa yang dummy, dan apa yang belum diimplementasikan.

## Gaya komunikasi
- Hemat token: gunakan ringkasan, hindari mengulang SOT penuh.
- Jika ada ambiguitas yang memengaruhi arsitektur atau ruang lingkup, ajukan satu pertanyaan terpenting sebelum mengubahnya.
- Jangan mengarang keputusan produk. Catat asumsi yang diperlukan.
