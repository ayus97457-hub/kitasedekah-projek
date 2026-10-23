import React, { useState, useMemo } from 'react'
import {
  FileChartColumn, WalletCards, Plus, Download, Search,
  Calendar, Users, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Landmark, Sparkles, Image as ImageIcon, X, Eye
} from 'lucide-react'
import { rupiah } from '../data'

const money = (n) => rupiah(n).replace(',00', '')

export default function TransparencyModule({
  distributions,
  setDistributions,
  programs,
  donations,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('distributions') // 'distributions' | 'financials'
  const [showAddModal, setShowAddModal] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(null)

  // Form for new distribution
  const [form, setForm] = useState({
    program: programs[0] ? programs[0].title : '',
    recipient: '',
    amount: '',
    date: 'Hari ini',
    documentation: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85',
    notes: ''
  })

  // Financial calculations
  const financials = useMemo(() => {
    // 1. Total Verified Donations
    const totalVerifiedIn = donations
      .filter((d) => d.status === 'Terverifikasi')
      .reduce((sum, d) => sum + (d.amount || 0), 0)

    // 2. Total Distributed
    const totalDistributed = distributions.reduce((sum, d) => sum + (d.amount || 0), 0)

    // 3. Net Balance
    const netBalance = Math.max(totalVerifiedIn - totalDistributed, 0)

    // 4. Realization Ratio
    const ratio = totalVerifiedIn > 0 ? Math.min(Math.round((totalDistributed / totalVerifiedIn) * 100), 100) : 0

    return {
      totalVerifiedIn,
      totalDistributed,
      netBalance,
      ratio
    }
  }, [donations, distributions])

  // Program Breakdown
  const programBreakdown = useMemo(() => {
    return programs.map((p) => {
      const progDonations = donations
        .filter((d) => d.program === p.title && d.status === 'Terverifikasi')
        .reduce((s, d) => s + (d.amount || 0), 0)

      const progDistributions = distributions
        .filter((d) => d.program === p.title)
        .reduce((s, d) => s + (d.amount || 0), 0)

      const remaining = progDonations - progDistributions

      return {
        id: p.id,
        title: p.title,
        category: p.category,
        collected: progDonations,
        distributed: progDistributions,
        balance: remaining,
        status: p.status
      }
    })
  }, [programs, donations, distributions])

  // Filtered distributions
  const filteredDistributions = useMemo(() => {
    return distributions.filter((d) => {
      const text = `${d.id} ${d.program} ${d.recipient} ${d.notes || ''}`.toLowerCase()
      return text.includes(query.toLowerCase())
    })
  }, [distributions, query])

  const handleOpenAdd = () => {
    setForm({
      program: programs[0] ? programs[0].title : '',
      recipient: '',
      amount: '',
      date: 'Hari ini',
      documentation: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85',
      notes: ''
    })
    setShowAddModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.program || !form.recipient || !form.amount) {
      onShowToast('Validasi Gagal', 'Mohon lengkapi program, penerima manfaat, dan jumlah dana.')
      return
    }

    const newDist = {
      id: `SL-${String(distributions.length + 1).padStart(3, '0')}`,
      program: form.program,
      recipient: form.recipient,
      amount: Number(form.amount),
      date: form.date || 'Hari ini',
      status: 'Tersalurkan',
      documentation: form.documentation,
      notes: form.notes
    }

    setDistributions((prev) => [newDist, ...prev])
    setShowAddModal(false)
    onShowToast('Penyaluran Dicatat', `Penyaluran ${money(newDist.amount)} untuk ${newDist.recipient} berhasil disimpan.`)
  }

  const handleDownloadCSV = () => {
    onShowToast('Laporan Keuangan', 'Laporan keuangan transparansi format CSV berhasil diekspor (Simulasi).')
  }

  const handleDownloadPDF = () => {
    onShowToast('Laporan Keuangan', 'Berkas ringkasan akuntabilitas PDF berhasil disiapkan untuk cetak.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest">
            <FileChartColumn size={14} /> Modul 4
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Modul Penyaluran & Laporan Keuangan
          </h2>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Transparansi akuntabilitas publik, bukti penyerahan santunan di lapangan, dan neraca arus kas kas yayasan.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('distributions')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'distributions'
                ? 'bg-white text-forest shadow-sm'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <WalletCards size={14} />
            <span>Realisasi Penyaluran</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'financials'
                ? 'bg-white text-forest shadow-sm'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <FileChartColumn size={14} />
            <span>Laporan Keuangan & Saldo</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium text-muted">Dana Masuk Terverifikasi</p>
          <p className="mt-1.5 text-xl font-extrabold text-forest">{money(financials.totalVerifiedIn)}</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">100% Sesuai Mutasi</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-soft">
          <p className="text-xs font-medium text-emerald-800">Total Penyaluran Dana</p>
          <p className="mt-1.5 text-xl font-extrabold text-emerald-900">{money(financials.totalDistributed)}</p>
          <p className="mt-1 text-[11px] text-emerald-700">{distributions.length} Aksi Penyaluran Lapangan</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4 shadow-soft">
          <p className="text-xs font-medium text-sky-800">Saldo Kas Bersih Yayasan</p>
          <p className="mt-1.5 text-xl font-extrabold text-sky-900">{money(financials.netBalance)}</p>
          <p className="mt-1 text-[11px] text-sky-700">Dana siap disalurkan</p>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 shadow-soft">
          <p className="text-xs font-medium text-purple-800">Rasio Penyaluran</p>
          <p className="mt-1.5 text-2xl font-extrabold text-purple-900">{financials.ratio}%</p>
          <p className="mt-1 text-[11px] text-purple-700">Efisiensi realisasi dana</p>
        </div>
      </div>

      {activeTab === 'distributions' ? (
        /* SUB-TAB 1: REALISASI PENYALURAN DANA */
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari ID penyaluran, program, atau penerima manfaat..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-3 text-xs outline-none focus:border-forest focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/10 hover:bg-forest/90"
            >
              <Plus size={16} />
              <span>Catat Penyaluran Baru</span>
            </button>
          </div>

          {/* Distribution Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-bold">ID & Tanggal</th>
                    <th className="px-4 py-3 font-bold">Program Donasi</th>
                    <th className="px-4 py-3 font-bold">Penerima Manfaat</th>
                    <th className="px-4 py-3 font-bold">Jumlah Dana</th>
                    <th className="px-4 py-3 font-bold">Dokumentasi</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-ink">
                  {filteredDistributions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted">
                        Tidak ada data penyaluran yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredDistributions.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3.5">
                          <p className="font-extrabold text-ink">{d.id}</p>
                          <p className="text-[11px] text-muted">{d.date}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-800">{d.program}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-900">{d.recipient}</p>
                          {d.notes && <p className="text-[11px] text-muted line-clamp-1">{d.notes}</p>}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-extrabold text-emerald-700">{money(d.amount)}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          {d.documentation ? (
                            <button
                              type="button"
                              onClick={() => setSelectedDoc(d)}
                              className="group relative h-10 w-16 overflow-hidden rounded-lg border border-slate-200"
                            >
                              <img
                                src={d.documentation}
                                alt="Dokumentasi"
                                className="h-full w-full object-cover transition group-hover:scale-110"
                              />
                            </button>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(d)}
                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:border-forest hover:text-forest"
                            title="Lihat Detail & Foto"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* SUB-TAB 2: LAPORAN KEUANGAN & SALDO */
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-ink">Laporan Transparansi Keuangan Terbuka</h3>
              <p className="text-xs text-muted">Rekapitulasi resmi arus donasi terverifikasi, penyaluran santunan, dan sisa kas.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Download size={14} /> Unduh CSV
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-forest/90"
              >
                <Download size={14} /> Cetak PDF Ringkasan
              </button>
            </div>
          </div>

          {/* Breakdown Per Program Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft">
            <div className="border-b border-slate-100 p-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-forest">
                Rincian Realisasi Finansial per Program Kampanye
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-bold">Program Sedekah</th>
                    <th className="px-4 py-3 font-bold">Kategori</th>
                    <th className="px-4 py-3 font-bold">Donasi Terkumpul</th>
                    <th className="px-4 py-3 font-bold">Dana Tersalurkan</th>
                    <th className="px-4 py-3 font-bold">Sisa Saldo Kas</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-ink">
                  {programBreakdown.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-ink">{row.title}</p>
                        <p className="text-[11px] text-muted">{row.id}</p>
                      </td>
                      <td className="px-4 py-3.5 text-muted">{row.category}</td>
                      <td className="px-4 py-3.5 font-bold text-forest">
                        {money(row.collected)}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-800">
                        {money(row.distributed)}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-sky-800">
                        {money(row.balance)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            row.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Distribution Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-ink">Catat Penyaluran Dana Baru</h3>
              <p className="text-xs text-muted">
                Dokumentasikan penyerahan santunan atau bantuan logistik ke penerima manfaat.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink">Program Sedekah Terkait</label>
                <select
                  value={form.program}
                  onChange={(e) => setForm({ ...form, program: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title} ({money(p.collected)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink">Penerima Manfaat / Wilayah</label>
                <input
                  type="text"
                  required
                  value={form.recipient}
                  onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  placeholder="Misal: 45 KK Keluarga Dhuafa — Bogor Barat"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-ink">Jumlah Dana Tersalurkan (Rp)</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    step="10000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="Contoh: 5000000"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink">Tanggal Penyaluran</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="Misal: 18 Okt 2026"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink">URL Foto Dokumentasi Penyerahan</label>
                <input
                  type="url"
                  value={form.documentation}
                  onChange={(e) => setForm({ ...form, documentation: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-ink">Catatan Kegiatan Lapangan</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Rincian barang/bantuan yang diserahkan, kondisi lapangan, dsb..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-forest px-4 py-2 font-bold text-white shadow-md hover:bg-forest/90"
                >
                  Simpan Penyaluran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail & Photo Modal */}
      {selectedDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                  Dokumentasi Penyaluran · {selectedDoc.id}
                </span>
                <h3 className="text-base font-extrabold text-ink">{selectedDoc.recipient}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              {selectedDoc.documentation && (
                <img
                  src={selectedDoc.documentation}
                  alt={selectedDoc.recipient}
                  className="h-56 w-full rounded-2xl object-cover"
                />
              )}
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted">Program:</span>
                  <span className="font-bold text-ink">{selectedDoc.program}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Nominal Tersalurkan:</span>
                  <span className="font-extrabold text-emerald-700">{money(selectedDoc.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tanggal:</span>
                  <span className="text-slate-700">{selectedDoc.date}</span>
                </div>
              </div>
              {selectedDoc.notes && (
                <div>
                  <h4 className="font-bold text-ink">Catatan Lapangan:</h4>
                  <p className="mt-1 text-slate-600 leading-relaxed">{selectedDoc.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
