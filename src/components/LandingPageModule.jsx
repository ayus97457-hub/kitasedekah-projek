import React, { useState } from 'react'
import {
  Heart, Leaf, ArrowRight, ShieldCheck, CheckCircle2,
  Users, Landmark, QrCode, CreditCard, ChevronDown, ChevronUp,
  Share2, Globe, Clock, Sparkles, AlertCircle, Check, X,
  FileText, ArrowUpRight, Phone, Mail, MapPin
} from 'lucide-react'
import { rupiah, faqs, paymentChannels } from '../data'

const money = (n) => rupiah(n).replace(',00', '')

export default function LandingPageModule({
  programs,
  distributions,
  activities,
  donations = [],
  onAddDonation,
  onBackToAdmin,
  onShowToast
}) {
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  // Cek Status Donasi Mandiri State (Tanpa Login)
  const [searchTrxQuery, setSearchTrxQuery] = useState('')
  const [searchedTrxResult, setSearchedTrxResult] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Donation Wizard State
  const [step, setStep] = useState(1) // 1: Nominal, 2: Identitas, 3: Metode Bayar, 4: Gateway Pay, 5: Sukses
  const [donationForm, setDonationForm] = useState({
    program: '',
    amount: 100000,
    customAmount: '',
    donorName: '',
    isAnonymous: false,
    phone: '',
    notes: '',
    method: 'QRIS Dinamis',
    channel: 'qris'
  })
  const [generatedTrx, setGeneratedTrx] = useState(null)

  const quickAmounts = [25000, 50000, 100000, 250000, 500000]

  const handleOpenDonate = (program) => {
    setSelectedProgram(program)
    setDonationForm({
      program: program ? program.title : (programs[0] ? programs[0].title : ''),
      amount: 100000,
      customAmount: '',
      donorName: '',
      isAnonymous: false,
      phone: '',
      notes: '',
      method: 'QRIS Dinamis',
      channel: 'qris'
    })
    setStep(1)
    setShowDonationModal(true)
  }

  const handleSelectAmount = (amt) => {
    setDonationForm({ ...donationForm, amount: amt, customAmount: '' })
  }

  const handleCustomAmountChange = (e) => {
    const val = Number(e.target.value) || 0
    setDonationForm({ ...donationForm, amount: val, customAmount: e.target.value })
  }

  // Submit and create simulated transaction
  const handleProceedToPayment = () => {
    if (!donationForm.amount || donationForm.amount < 10000) {
      onShowToast('Nominal Kurang', 'Minimal nominal sedekah adalah Rp 10.000.')
      return
    }

    const trxId = `KS-${Math.floor(24082 + Math.random() * 900)}`
    const gatewayRef = `PGW-${donationForm.channel.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
    const finalDonor = donationForm.isAnonymous
      ? 'Hamba Allah'
      : donationForm.donorName.trim() || 'Hamba Allah'

    const newDonation = {
      id: trxId,
      donor: finalDonor,
      program: donationForm.program,
      amount: donationForm.amount,
      date: 'Baru saja',
      method: donationForm.method,
      channel: donationForm.channel,
      gatewayRef: gatewayRef,
      gatewayStatus: 'Pending',
      status: 'Menunggu',
      notes: donationForm.notes
    }

    setGeneratedTrx(newDonation)
    setStep(4) // Move to Payment Gateway Sandbox Screen
  }

  // Simulate Instant Payment in Gateway
  const handleSimulatePaymentSuccess = () => {
    if (!generatedTrx) return

    // Add to shared platform state as Terverifikasi directly via simulation
    onAddDonation({
      ...generatedTrx,
      gatewayStatus: 'Settlement',
      status: 'Terverifikasi'
    })

    setStep(5) // Success Receipt Screen
    onShowToast('Donasi Diterima', 'Pembayaran via Payment Gateway berhasil disimulasikan!')
  }

  // Handle Search Donation Status (Tanpa Login)
  const handleSearchDonation = (e) => {
    e.preventDefault()
    setHasSearched(true)
    const q = searchTrxQuery.trim().toLowerCase()
    if (!q) {
      setSearchedTrxResult(null)
      return
    }
    const found = donations.find(
      (d) => d.id.toLowerCase() === q || d.donor.toLowerCase().includes(q)
    )
    setSearchedTrxResult(found || null)
  }

  const totalCollectedAll = programs.reduce((s, p) => s + (p.collected || 0), 0)
  const totalDistributedAll = distributions.reduce((s, d) => s + (d.amount || 0), 0)

  return (
    <div className="min-h-screen bg-[#f7faf7] text-ink antialiased">
      {/* Public Sticky Header */}
      <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between border-b border-emerald-950/5 bg-white/95 px-4 backdrop-blur-md sm:px-8 xl:px-12">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-white shadow-md shadow-emerald-900/15">
            <Leaf size={22} />
          </div>
          <div>
            <div className="text-[19px] font-black tracking-tight text-ink">
              kitasedekah<span className="text-forest">.id</span>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[.18em] text-slate-400">
              Platform Sedekah & Transparansi
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-xs font-bold text-slate-600 md:flex">
          <a href="#beranda" className="text-forest hover:text-forest">Beranda</a>
          <a href="#program" className="hover:text-forest transition">Program Sedekah</a>
          <a href="#penyaluran" className="hover:text-forest transition">Kabar Penyaluran</a>
          <a href="#cek-status" className="hover:text-forest transition">Cek Donasi</a>
          <a href="#faq" className="hover:text-forest transition">Tanya Jawab</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenDonate(programs[0])}
            className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition hover:bg-forest/90"
          >
            <Heart size={14} className="fill-white" />
            <span>Sedekah Sekarang</span>
          </button>

          <button
            type="button"
            onClick={onBackToAdmin}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50"
          >
            <ShieldCheck size={14} className="text-forest" />
            <span>Panel Admin</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="beranda" className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-forest shadow-xs">
              <Sparkles size={14} className="text-emerald-600" /> Modul 6 · Halaman Publik & Landing Page
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
              Bantu Sesama, Tebar Berkah Melalui <span className="text-forest">Sedekah Nyata</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
              Platform sedekah digital terpercaya dengan integrasi Payment Gateway instan (QRIS & Virtual Account) serta transparansi bukti penyaluran 100% terbuka untuk publik.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenDonate(programs[0])}
                className="inline-flex items-center gap-2 rounded-2xl bg-forest px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-900/20 transition hover:bg-forest/90 hover:scale-[1.02]"
              >
                <Heart size={16} className="fill-white" />
                <span>Mulai Sedekah Sekarang</span>
              </button>

              <a
                href="#program"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-soft transition hover:bg-slate-50"
              >
                <span>Lihat Program Pilihan</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Impact Metric Counter Pill */}
            <div className="mt-12 mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-soft backdrop-blur-sm sm:p-6">
              <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                <div className="px-2">
                  <p className="text-xs text-muted font-medium">Dana Terkumpul</p>
                  <p className="mt-1 text-lg sm:text-2xl font-black text-forest">
                    {money(totalCollectedAll)}
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-xs text-muted font-medium">Dana Tersalurkan</p>
                  <p className="mt-1 text-lg sm:text-2xl font-black text-blue-900">
                    {money(totalDistributedAll)}
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-xs text-muted font-medium">Mustahik Terbantu</p>
                  <p className="mt-1 text-lg sm:text-2xl font-black text-ink">
                    150+ KK
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars / Keunggulan */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/70 p-6 bg-[#fcfdfc]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-forest mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-extrabold text-base text-ink">Amanah & Transparan</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Setiap rupiah sedekah yang masuk tercatat terbuka dalam sistem keuangan yang dapat dipantau oleh seluruh donatur.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 p-6 bg-[#fcfdfc]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
                <QrCode size={24} />
              </div>
              <h3 className="font-extrabold text-base text-ink">Payment Gateway Instan</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Sedekah cepat melalui scan QRIS Dinamis dan Virtual Account bank terkemuka dengan verifikasi otomatis secara real-time.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 p-6 bg-[#fcfdfc]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-extrabold text-base text-ink">Penyaluran Tepat Sasaran</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Relawan kami mengantar langsung santunan ke mustahik dan mendokumentasikan foto kegiatan di lapangan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Katalog Sedekah Section */}
      <section id="program" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Katalog Program
              </span>
              <h2 className="mt-1 text-2xl font-black text-ink sm:text-3xl">
                Pilih Kampanye Sedekah Kebaikan
              </h2>
            </div>
            <p className="text-xs text-muted max-w-md">
              Pilih program bantuan sosial atau keagamaan yang ingin Anda dukung hari ini.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => {
              const pct = Math.min(Math.round(((p.collected || 0) / (p.target || 1)) * 100), 100)
              return (
                <div
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition hover:shadow-xl"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-slate-900/75 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-extrabold text-base text-ink line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted line-clamp-2">
                      {p.description}
                    </p>

                    <div className="mt-5 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-forest">{money(p.collected)}</span>
                        <span className="text-muted">{pct}%</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full bg-forest transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-[11px] text-muted">
                        <span>Target: {money(p.target)}</span>
                        <span>{p.days} hari lagi</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenDonate(p)}
                      className="mt-5 w-full rounded-xl bg-forest py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-900/10 transition hover:bg-forest/90"
                    >
                      Sedekah Sekarang
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Kabar Penyaluran Lapangan (Informasi) Section */}
      <section id="penyaluran" className="py-16 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Informasi & Lapangan
            </span>
            <h2 className="mt-1 text-2xl font-black text-ink sm:text-3xl">
              Kabar Realisasi & Penyaluran Sedekah
            </h2>
            <p className="mt-1 text-xs text-muted">
              Dokumentasi nyata kegiatan penyaluran santunan langsung kepada para mustahik.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft"
              >
                <img
                  src={act.image}
                  alt={act.title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[10px] text-muted font-bold">
                    <span>{act.date}</span>
                    <span>·</span>
                    <span className="text-forest">{act.location}</span>
                  </div>
                  <h3 className="mt-1.5 font-extrabold text-sm text-ink line-clamp-1">
                    {act.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted line-clamp-2">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cek Status Donasi Mandiri (Tanpa Login) Section */}
      <section id="cek-status" className="py-16 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest border border-emerald-200">
              <Sparkles size={14} /> Donasi Tanpa Login
            </span>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">
              Cek Status & Nota Donasi Mandiri
            </h2>
            <p className="mt-1 text-xs text-muted max-w-md mx-auto">
              Sudah berdonasi? Masukkan ID Transaksi (misal <strong>KS-24080</strong>) atau nama Anda untuk melihat status verifikasi secara langsung tanpa perlu login.
            </p>
          </div>

          <form onSubmit={handleSearchDonation} className="flex gap-2">
            <input
              type="text"
              value={searchTrxQuery}
              onChange={(e) => setSearchTrxQuery(e.target.value)}
              placeholder="Masukkan ID Transaksi (contoh: KS-24080) atau Nama..."
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-semibold outline-none focus:border-forest focus:bg-white"
            />
            <button
              type="submit"
              className="rounded-2xl bg-forest px-6 font-bold text-white shadow-md hover:bg-forest/90"
            >
              Cek Status
            </button>
          </form>

          {hasSearched && (
            <div className="mt-6">
              {searchedTrxResult ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-forest">{searchedTrxResult.id}</span>
                      <h4 className="font-extrabold text-ink text-sm mt-0.5">{searchedTrxResult.donor}</h4>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 font-bold text-[11px] ${
                        searchedTrxResult.status === 'Terverifikasi'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {searchedTrxResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <p className="text-muted text-[10px]">Program Tujuan:</p>
                      <p className="font-bold">{searchedTrxResult.program}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px]">Nominal Sedekah:</p>
                      <p className="font-extrabold text-forest text-sm">{money(searchedTrxResult.amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px]">Metode Pembayaran:</p>
                      <p className="font-semibold">{searchedTrxResult.method}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px]">Waktu Transaksi:</p>
                      <p className="font-semibold">{searchedTrxResult.date}</p>
                    </div>
                  </div>

                  {searchedTrxResult.notes && (
                    <div className="pt-2 border-t border-emerald-100/80 text-[11px] italic text-slate-600">
                      Doa/Pesan: "{searchedTrxResult.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 p-6 text-center text-xs text-muted bg-slate-50">
                  Transaksi dengan kata kunci "{searchTrxQuery}" tidak ditemukan. Pastikan ID transaksi sesuai (contoh: KS-24080).
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Tanya Jawab
            </span>
            <h2 className="mt-1 text-2xl font-black text-ink sm:text-3xl">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-xs font-bold text-ink"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-xs text-muted">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-4 mb-8">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 font-black text-lg text-ink">
                <Leaf className="text-forest" size={20} />
                kitasedekah<span className="text-forest">.id</span>
              </div>
              <p className="mt-2 text-xs text-muted max-w-sm leading-relaxed">
                Platform sistem informasi manajemen sedekah berbasis web dengan transparansi data akuntabel dan integrasi payment gateway.
              </p>
            </div>
            <div>
              <p className="font-bold text-ink mb-2">Program Utama</p>
              <ul className="space-y-1.5 text-muted">
                <li>Sedekah Pangan Dhuafa</li>
                <li>Beasiswa Santri Yatim</li>
                <li>Infrastruktur Air Bersih</li>
                <li>Layanan Medis Keliling</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-ink mb-2">Kontak Yayasan</p>
              <ul className="space-y-1.5 text-muted">
                <li className="flex items-center gap-1.5"><Phone size={13} /> 0812-3456-7890</li>
                <li className="flex items-center gap-1.5"><Mail size={13} /> info@kitasedekah.id</li>
                <li className="flex items-center gap-1.5"><MapPin size={13} /> Bogor, Jawa Barat</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px]">
            <span>© 2026 Kitasedekah.id. Hak cipta dilindungi.</span>
            <span className="flex items-center gap-1 text-forest font-semibold">
              <CheckCircle2 size={13} /> Prototype Front-end 6 Modul Lengkap
            </span>
          </div>
        </div>
      </footer>

      {/* Multi-Step Donation Modal with Payment Gateway Sandbox */}
      {showDonationModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setShowDonationModal(false)}
        >
          <div
            className="w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                  Formulir Donasi Online
                </span>
                <h3 className="text-base font-extrabold text-ink">
                  {step === 4
                    ? 'Payment Gateway Sandbox'
                    : step === 5
                    ? 'Donasi Berhasil'
                    : donationForm.program}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDonationModal(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* STEP 1: NOMINAL */}
            {step === 1 && (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-ink">Pilih Nominal Sedekah</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectAmount(amt)}
                        className={`rounded-xl border p-2.5 font-bold transition text-center ${
                          donationForm.amount === amt && !donationForm.customAmount
                            ? 'border-forest bg-emerald-50 text-forest ring-2 ring-emerald-100'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {money(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink">Atau Masukkan Nominal Bebas (Rp)</label>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    placeholder="Contoh: 150000"
                    value={donationForm.customAmount}
                    onChange={handleCustomAmountChange}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 font-bold outline-none focus:border-forest"
                  />
                  <p className="mt-1 text-[10px] text-muted">Minimal sedekah Rp 10.000</p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-xl bg-forest py-3 font-extrabold text-white shadow-md hover:bg-forest/90"
                >
                  Lanjut ke Data Donatur →
                </button>
              </div>
            )}

            {/* STEP 2: DATA DONATUR */}
            {step === 2 && (
              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-ink">Nama Lengkap</label>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={donationForm.isAnonymous}
                        onChange={(e) =>
                          setDonationForm({ ...donationForm, isAnonymous: e.target.checked })
                        }
                        className="rounded accent-forest"
                      />
                      <span>Hamba Allah (Anonim)</span>
                    </label>
                  </div>
                  {!donationForm.isAnonymous && (
                    <input
                      type="text"
                      placeholder="Masukkan nama donatur"
                      value={donationForm.donorName}
                      onChange={(e) =>
                        setDonationForm({ ...donationForm, donorName: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-bold text-ink">Nomor WhatsApp / Email</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={donationForm.phone}
                    onChange={(e) =>
                      setDonationForm({ ...donationForm, phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                  <p className="mt-1 text-[10px] text-muted">Untuk pengiriman bukti transaksi</p>
                </div>

                <div>
                  <label className="block font-bold text-ink">Doa / Pesan Kebaikan (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan doa atau pesan untuk para penerima sedekah..."
                    value={donationForm.notes}
                    onChange={(e) =>
                      setDonationForm({ ...donationForm, notes: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl bg-forest py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
                  >
                    Pilih Metode Pembayaran →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PILIH METODE BAYAR */}
            {step === 3 && (
              <div className="mt-4 space-y-3.5 text-xs">
                <p className="font-bold text-ink">Pilih Saluran Payment Gateway</p>

                <div className="space-y-2">
                  {paymentChannels.map((ch) => (
                    <label
                      key={ch.id}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                        donationForm.channel === ch.id
                          ? 'border-forest bg-emerald-50/70 ring-2 ring-emerald-100'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="channel"
                          checked={donationForm.channel === ch.id}
                          onChange={() =>
                            setDonationForm({
                              ...donationForm,
                              channel: ch.id,
                              method: ch.name
                            })
                          }
                          className="accent-forest"
                        />
                        <div>
                          <p className="font-bold text-ink">{ch.name}</p>
                          <p className="text-[10px] text-muted">{ch.type}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {ch.fee}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="rounded-xl bg-slate-50 p-3 flex justify-between text-xs">
                  <span className="text-muted">Total Donasi:</span>
                  <span className="font-extrabold text-forest text-sm">
                    {money(donationForm.amount)}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="flex-1 rounded-xl bg-forest py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
                  >
                    Bayar Sekarang →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT GATEWAY SANDBOX SIMULATOR */}
            {step === 4 && generatedTrx && (
              <div className="mt-4 space-y-4 text-xs text-center">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-forest">
                    Payment Gateway Sandbox
                  </span>
                  <p className="mt-2 text-xs text-muted">Total Tagihan Sedekah:</p>
                  <p className="text-2xl font-black text-forest">{money(generatedTrx.amount)}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    Ref ID: {generatedTrx.gatewayRef}
                  </p>
                </div>

                {/* QRIS / VA Display Mock */}
                {generatedTrx.channel === 'qris' ? (
                  <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                    <div className="mx-auto w-40 h-40 bg-slate-900 rounded-xl flex items-center justify-center p-3 text-white">
                      <QrCode size={120} className="text-white" />
                    </div>
                    <p className="mt-2 font-bold text-ink">Scan QRIS Dinamis</p>
                    <p className="text-[10px] text-muted">
                      Mendukung GoPay, OVO, ShopeePay, Dana, LinkAja & BCA Mobile
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 p-4 bg-white text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted">Nomor Virtual Account:</span>
                      <span className="font-mono font-bold text-forest text-sm">
                        8809 1029 3847 21
                      </span>
                    </div>
                    <p className="text-[10px] text-muted">
                      Transfer sesuai nominal sebelum batas waktu 24 jam.
                    </p>
                  </div>
                )}

                <div className="rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-800 text-left border border-amber-200">
                  <span className="font-bold">Sandbox Simulator:</span> Klik tombol di bawah untuk mensimulasikan notifikasi pembayaran sukses dari payment gateway secara instan.
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePaymentSuccess}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-extrabold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700"
                >
                  ⚡ Simulasikan Pembayaran Berhasil
                </button>
              </div>
            )}

            {/* STEP 5: SUKSES BUKTI TRANSAKSI */}
            {step === 5 && generatedTrx && (
              <div className="mt-4 space-y-4 text-xs text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-forest">
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <h4 className="text-lg font-extrabold text-ink">Alhamdulillah, Donasi Diterima!</h4>
                  <p className="mt-1 text-muted">
                    Terima kasih atas sedekah terbaik Anda. Dana telah tercatat resmi di sistem Kitasedekah.id.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-left space-y-1.5 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-muted">ID Transaksi:</span>
                    <span className="font-mono font-bold text-ink">{generatedTrx.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Atas Nama:</span>
                    <span className="font-bold text-ink">{generatedTrx.donor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Nominal:</span>
                    <span className="font-extrabold text-forest">{money(generatedTrx.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Status:</span>
                    <span className="font-bold text-emerald-700">Terverifikasi (Settlement)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="w-full rounded-xl bg-forest py-2.5 font-bold text-white hover:bg-forest/90"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
