// Model Data Dummy Kitasedekah.id

export const initialUsers = [
  {
    id: 'USR-001',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@kitasedekah.id',
    role: 'Admin Sedekah',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    joinedDate: '12 Jan 2025',
    phone: '0812-3456-7890',
    address: 'Jl. Merdeka No. 45, Bogor Tengah, Jawa Barat',
    bio: 'Pengelola program kampanye donasi, verifikasi transaksi pembayaran, dan laporan kas sedekah.',
    totalDonated: 750000,
    donationsCount: 3
  },
  {
    id: 'USR-002',
    name: 'Siti Rahma, S.Ak.',
    email: 'siti.rahma@kitasedekah.id',
    role: 'Admin Sedekah',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    joinedDate: '01 Mar 2025',
    phone: '0813-8899-1122',
    address: 'Jl. Pajajaran No. 12, Bogor Timur, Jawa Barat',
    bio: 'Verifikator transaksi mutasi rekening, rekonsiliasi payment gateway, dan audit penyaluran.',
    totalDonated: 1000000,
    donationsCount: 1
  },
  {
    id: 'USR-003',
    name: 'Budi Santoso',
    email: 'budi.santoso@kitasedekah.id',
    role: 'Admin Konten',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    joinedDate: '15 Mei 2025',
    phone: '0819-7766-5544',
    address: 'Jl. Sukajadi No. 88, Cibinong, Bogor',
    bio: 'Pengelola konten publikasi, artikel kabar penyaluran, dokumentasi lapangan, dan media sosial yayasan.',
    totalDonated: 250000,
    donationsCount: 1
  },
  {
    id: 'USR-004',
    name: 'Nadia Putri',
    email: 'nadia.putri@gmail.com',
    role: 'Donatur (Tamu/Guest)',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    joinedDate: '16 Okt 2026',
    phone: '0857-1234-9988',
    address: 'Perumahan Yasmin Sektor 3, Bogor Barat',
    bio: 'Donatur rutin sedekah paket pangan dhuafa dan beasiswa santri tahfidz Qur’an (Donasi langsung tanpa login).',
    totalDonated: 850000,
    donationsCount: 4
  },
  {
    id: 'USR-005',
    name: 'Rizky Maulana',
    email: 'rizky.m@yahoo.com',
    role: 'Donatur (Tamu/Guest)',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    joinedDate: '10 Sep 2026',
    phone: '0812-9988-7766',
    address: 'Jl. Surya Kencana No. 70, Bogor',
    bio: 'Donatur program air bersih dan infrastruktur sanitasi desa (Donasi langsung tanpa login).',
    totalDonated: 400000,
    donationsCount: 2
  }
]

export const paymentChannels = [
  {
    id: 'qris',
    name: 'QRIS Dinamis',
    type: 'Instant QR / E-Wallet',
    fee: 'Rp 0',
    provider: 'Payment Gateway Sandbox (Midtrans/Xendit)',
    settlement: 'Otomatis Real-time',
    status: 'Online',
    icon: 'QrCode'
  },
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    type: 'Bank Transfer (VA)',
    fee: 'Rp 0',
    provider: 'Payment Gateway Sandbox (Midtrans/Xendit)',
    settlement: 'Otomatis Real-time',
    status: 'Online',
    icon: 'Landmark'
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    type: 'Bank Transfer (VA)',
    fee: 'Rp 0',
    provider: 'Payment Gateway Sandbox (Midtrans/Xendit)',
    settlement: 'Otomatis Real-time',
    status: 'Online',
    icon: 'Landmark'
  },
  {
    id: 'bri_va',
    name: 'BRI Virtual Account',
    type: 'Bank Transfer (VA)',
    fee: 'Rp 0',
    provider: 'Payment Gateway Sandbox (Midtrans/Xendit)',
    settlement: 'Otomatis Real-time',
    status: 'Online',
    icon: 'Landmark'
  },
  {
    id: 'gopay',
    name: 'GoPay / ShopeePay',
    type: 'E-Wallet Direct',
    fee: 'Rp 0',
    provider: 'Payment Gateway Sandbox (Midtrans/Xendit)',
    settlement: 'Otomatis Real-time',
    status: 'Online',
    icon: 'CreditCard'
  }
]

export const programs = [
  {
    id: 'PG-001',
    title: 'Paket Pangan untuk Keluarga',
    category: 'Bantuan Pangan',
    target: 25000000,
    collected: 18450000,
    days: 8,
    status: 'Aktif',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85',
    donors: 148,
    description: 'Penyaluran paket bahan pokok bergizi untuk 100+ keluarga dhuafa dan prasejahtera di pelosok Jawa Barat guna menjamin ketersediaan pangan bergizi.'
  },
  {
    id: 'PG-002',
    title: 'Beasiswa Santri Penghafal Qur’an',
    category: 'Pendidikan',
    target: 40000000,
    collected: 27600000,
    days: 14,
    status: 'Aktif',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85',
    donors: 216,
    description: 'Bantuan biaya SPP, fasilitas asrama, dan perlengkapan belajar santri yatim dhuafa penghafal Al-Qur’an di pesantren pedesaan binaan.'
  },
  {
    id: 'PG-003',
    title: 'Air Bersih untuk Desa Harapan',
    category: 'Infrastruktur',
    target: 30000000,
    collected: 30000000,
    days: 0,
    status: 'Tercapai',
    image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=900&q=85',
    donors: 189,
    description: 'Pengeboran sumur sedalam 40 meter, pemasangan pipa jaringan, dan instalasi tandon air komunal untuk 150 KK di kawasan rawan kekeringan.'
  },
  {
    id: 'PG-004',
    title: 'Layanan Medis Keliling Dhuafa',
    category: 'Kemanusiaan',
    target: 20000000,
    collected: 9800000,
    days: 21,
    status: 'Aktif',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=85',
    donors: 94,
    description: 'Pemeriksaan kesehatan gratis, pengobatan dasar, dan konsultasi dokter bagi lansia serta anak-anak di daerah pelosok yang sulit akses puskesmas.'
  }
]

export const donations = [
  {
    id: 'KS-24081',
    donor: 'Nadia Putri',
    program: 'Paket Pangan untuk Keluarga',
    amount: 250000,
    date: '16 Okt 2026, 14:28',
    method: 'BCA Virtual Account',
    channel: 'bca_va',
    gatewayRef: 'PGW-BCA-948102',
    gatewayStatus: 'Pending',
    status: 'Menunggu',
    notes: 'Semoga berkah untuk keluarga penerima'
  },
  {
    id: 'KS-24080',
    donor: 'Hamba Allah',
    program: 'Beasiswa Santri Penghafal Qur’an',
    amount: 500000,
    date: '16 Okt 2026, 13:52',
    method: 'QRIS Dinamis',
    channel: 'qris',
    gatewayRef: 'PGW-QRS-882319',
    gatewayStatus: 'Settlement',
    status: 'Terverifikasi',
    notes: 'Untuk beasiswa adik-adik santri tercinta'
  },
  {
    id: 'KS-24079',
    donor: 'Rizky Maulana',
    program: 'Paket Pangan untuk Keluarga',
    amount: 100000,
    date: '16 Okt 2026, 12:40',
    method: 'Mandiri Virtual Account',
    channel: 'mandiri_va',
    gatewayRef: 'PGW-MND-771239',
    gatewayStatus: 'Settlement',
    status: 'Terverifikasi',
    notes: 'Bismillah berkah'
  },
  {
    id: 'KS-24078',
    donor: 'Anonim',
    program: 'Air Bersih untuk Desa Harapan',
    amount: 150000,
    date: '15 Okt 2026, 19:14',
    method: 'GoPay / ShopeePay',
    channel: 'gopay',
    gatewayRef: 'PGW-GPY-661021',
    gatewayStatus: 'Expired',
    status: 'Ditolak',
    notes: 'Waktu pembayaran kedaluwarsa'
  },
  {
    id: 'KS-24077',
    donor: 'Siti Rahmah',
    program: 'Beasiswa Santri Penghafal Qur’an',
    amount: 1000000,
    date: '15 Okt 2026, 17:02',
    method: 'BCA Virtual Account',
    channel: 'bca_va',
    gatewayRef: 'PGW-BCA-551980',
    gatewayStatus: 'Settlement',
    status: 'Terverifikasi',
    notes: 'Sedekah atas nama orang tua'
  },
  {
    id: 'KS-24076',
    donor: 'Ahmad Fauzi',
    program: 'Layanan Medis Keliling Dhuafa',
    amount: 300000,
    date: '15 Okt 2026, 10:15',
    method: 'QRIS Dinamis',
    channel: 'qris',
    gatewayRef: 'PGW-QRS-440912',
    gatewayStatus: 'Pending',
    status: 'Menunggu',
    notes: 'Semoga lekas sembuh para dhuafa'
  }
]

export const distributions = [
  {
    id: 'SL-009',
    program: 'Paket Pangan untuk Keluarga',
    recipient: '42 keluarga — Cibinong',
    amount: 6200000,
    date: '12 Okt 2026',
    status: 'Tersalurkan',
    documentation: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85',
    notes: 'Penyaluran paket beras, minyak goreng, telur, dan lauk siap saji bagi warga lansia dan janda dhuafa di RT 03 Cibinong.'
  },
  {
    id: 'SL-008',
    program: 'Beasiswa Santri Penghafal Qur’an',
    recipient: '20 santri — Bogor',
    amount: 4500000,
    date: '09 Okt 2026',
    status: 'Tersalurkan',
    documentation: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85',
    notes: 'Penyerahan beasiswa pendidikan semester ganjil dan bingkisan mushaf Al-Qur’an bagi 20 santri binaan berprestasi.'
  },
  {
    id: 'SL-007',
    program: 'Air Bersih untuk Desa Harapan',
    recipient: 'Warga Desa Sukamaju',
    amount: 12000000,
    date: '03 Okt 2026',
    status: 'Tersalurkan',
    documentation: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=900&q=85',
    notes: 'Peresmian instalasi sumur bor dan keran umum untuk memfasilitasi kebutuhan air bersih 150 KK di Desa Sukamaju.'
  }
]

export const activities = [
  {
    id: 'ACT-001',
    title: 'Penyaluran Paket Pangan Berkah',
    date: '12 Oktober 2026',
    location: 'Cibinong, Bogor',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85',
    description: 'Bantuan paket kebutuhan bahan pokok diantar langsung oleh relawan ke rumah-rumah keluarga dhuafa.',
    status: 'Aktif'
  },
  {
    id: 'ACT-002',
    title: 'Dukungan Pendidikan Santri Berprestasi',
    date: '09 Oktober 2026',
    location: 'Bogor, Jawa Barat',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85',
    description: 'Penyaluran beasiswa bulanan dan bantuan perlengkapan belajar bagi santri penghafal Al-Qur’an.',
    status: 'Aktif'
  },
  {
    id: 'ACT-003',
    title: 'Peresmian Sumur Bor Air Bersih',
    date: '03 Oktober 2026',
    location: 'Desa Sukamaju, Jawa Barat',
    image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=900&q=85',
    description: 'Uji alir air dan peresmian instalasi pompa listrik ramah lingkungan untuk warga masyarakat desa.',
    status: 'Aktif'
  }
]

export const faqs = [
  {
    q: 'Bagaimana cara berdonasi di Kitasedekah.id?',
    a: 'Pilih kampanye sedekah yang ingin Anda bantu di katalog program, klik "Donasi Sekarang", masukkan nominal dan nama, lalu pilih metode pembayaran (QRIS, Virtual Account, atau E-Wallet). Anda akan langsung mendapatkan instruksi pembayaran resmi.'
  },
  {
    q: 'Apakah saya bisa berdonasi secara anonim?',
    a: 'Tentu saja. Anda cukup mencentang pilihan "Sembunyikan nama saya (Hamba Allah)" saat mengisi formulir sedekah.'
  },
  {
    q: 'Bagaimana transparansi penyaluran dana donasi?',
    a: 'Setiap penyaluran dana di lapangan kami dokumentasikan secara lengkap (foto kegiatan, rincian biaya, dan tanda terima penerima manfaat) dan dipublikasikan di menu Penyaluran & Laporan Keuangan.'
  },
  {
    q: 'Metode pembayaran apa saja yang didukung oleh Payment Gateway?',
    a: 'Kami mendukung QRIS Dinamis (GoPay, OVO, ShopeePay, Dana, LinkAja, BCA), serta Virtual Account Bank Mandiri, BCA, BRI, dan BNI melalui Payment Gateway Sandbox.'
  }
]

export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n || 0)
