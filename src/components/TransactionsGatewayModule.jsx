import React, { useState, useMemo } from 'react'
import {
  Landmark, QrCode, CreditCard, Search, Filter, Download,
  CheckCircle2, XCircle, Clock3, AlertCircle, Eye, ShieldCheck,
  Zap, ArrowUpRight, RefreshCw, Send, Check, X, FileText
} from 'lucide-react'
import { rupiah, paymentChannels } from '../data'

const money = (n) => rupiah(n).replace(',00', '')

export default function TransactionsGatewayModule({
  donations,
  onVerifyDonation,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('history') // 'history' | 'gateway'
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [channelFilter, setChannelFilter] = useState('Semua')
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [selectedPendingId, setSelectedPendingId] = useState('')
  const [webhookLogs, setWebhookLogs] = useState([
    {
      id: 'EVT-9021',
      event: 'payment.settled',
      ref: 'PGW-QRS-882319',
      channel: 'QRIS Dinamis',
      amount: 500000,
      time: '16 Okt 2026, 13:52',
      status: 200
    },
    {
      id: 'EVT-9020',
      event: 'payment.settled',
      ref: 'PGW-MND-771239',
      channel: 'Mandiri Virtual Account',
      amount: 100000,
      time: '16 Okt 2026, 12:40',
      status: 200
    },
    {
      id: 'EVT-9019',
      event: 'payment.expired',
      ref: 'PGW-GPY-661021',
      channel: 'GoPay / ShopeePay',
      amount: 150000,
      time: '15 Okt 2026, 19:14',
      status: 200
    }
  ])

  // Filtered transactions
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const matchStatus = statusFilter === 'Semua' || d.status === statusFilter
      const matchChannel = channelFilter === 'Semua' || d.method === channelFilter
      const text = `${d.id} ${d.donor} ${d.program} ${d.method} ${d.gatewayRef || ''}`.toLowerCase()
      const matchQuery = text.includes(query.toLowerCase())
      return matchStatus && matchChannel && matchQuery
    })
  }, [donations, query, statusFilter, channelFilter])

  // Stats
  const stats = useMemo(() => {
    const totalCount = donations.length
    const pendingCount = donations.filter((d) => d.status === 'Menunggu').length
    const verifiedCount = donations.filter((d) => d.status === 'Terverifikasi').length
    const verifiedSum = donations
      .filter((d) => d.status === 'Terverifikasi')
      .reduce((s, d) => s + (d.amount || 0), 0)

    return {
      totalCount,
      pendingCount,
      verifiedCount,
      verifiedSum
    }
  }, [donations])

  const pendingDonations = useMemo(() => {
    return donations.filter((d) => d.status === 'Menunggu')
  }, [donations])

  // Trigger simulated payment gateway webhook (Instant Settlement)
  const handleTriggerWebhook = () => {
    const targetId = selectedPendingId || (pendingDonations[0] ? pendingDonations[0].id : null)
    if (!targetId) {
      onShowToast('Peringatan', 'Tidak ada transaksi pending yang dapat disimulasikan pembayarannya.')
      return
    }

    const targetDonation = donations.find((d) => d.id === targetId)
    if (!targetDonation) return

    // Execute verification
    onVerifyDonation(targetId, 'Terverifikasi')

    // Add webhook log
    const newLog = {
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      event: 'payment.settled',
      ref: targetDonation.gatewayRef || `PGW-${Math.floor(100000 + Math.random() * 900000)}`,
      channel: targetDonation.method,
      amount: targetDonation.amount,
      time: 'Baru saja',
      status: 200
    }
    setWebhookLogs((prev) => [newLog, ...prev])

    onShowToast(
      'Payment Gateway Auto-Settlement',
      `Webhook sukses! Transaksi ${targetId} sebesar ${money(
        targetDonation.amount
      )} otomatis Terverifikasi.`
    )
  }

  const handleExportCSV = () => {
    onShowToast('Ekspor Transaksi', 'Data mutasi donasi format CSV siap diunduh (Simulasi).')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest">
            <Landmark size={14} /> Modul 3
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Modul Transaksi & Payment Gateway
          </h2>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Pantau arus transaksi donasi, saluran payment gateway resmi (QRIS, VA Bank, E-Wallet), dan simulator webhook settlement.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'history'
                ? 'bg-white text-forest shadow-sm'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            Riwayat Transaksi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gateway')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'gateway'
                ? 'bg-white text-forest shadow-sm'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <Zap size={13} className="text-amber-500" />
            <span>Gateway Sandbox</span>
            {stats.pendingCount > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[9px] text-white">
                {stats.pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium text-muted">Total Donasi Masuk</p>
          <p className="mt-1.5 text-xl font-extrabold text-forest">{money(stats.verifiedSum)}</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">{stats.verifiedCount} Transaksi Sukses</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shadow-soft">
          <p className="text-xs font-medium text-amber-800">Menunggu Pembayaran</p>
          <p className="mt-1.5 text-2xl font-extrabold text-amber-700">{stats.pendingCount}</p>
          <p className="mt-1 text-[11px] text-amber-800">Perlu auto-settle / verifikasi</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium text-muted">Total Transaksi</p>
          <p className="mt-1.5 text-2xl font-extrabold text-ink">{stats.totalCount}</p>
          <p className="mt-1 text-[11px] text-muted">Seluruh status donasi</p>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 shadow-soft">
          <p className="text-xs font-medium text-purple-800">Payment Gateway</p>
          <p className="mt-1.5 text-lg font-extrabold text-purple-900">Sandbox Active</p>
          <p className="mt-1 text-[11px] text-purple-700">QRIS, VA Bank & E-Wallet</p>
        </div>
      </div>

      {activeTab === 'history' ? (
        /* TAB 1: RIWAYAT TRANSAKSI */
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari ID transaksi, nama donatur, program, atau nomor gateway..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-3 text-xs outline-none focus:border-forest focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-forest"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Ditolak">Ditolak</option>
              </select>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-forest"
              >
                <option value="Semua">Semua Saluran</option>
                <option value="QRIS Dinamis">QRIS Dinamis</option>
                <option value="BCA Virtual Account">BCA Virtual Account</option>
                <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
                <option value="GoPay / ShopeePay">GoPay / ShopeePay</option>
              </select>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Download size={14} /> Ekspor
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-bold">ID & Waktu</th>
                    <th className="px-4 py-3 font-bold">Donatur</th>
                    <th className="px-4 py-3 font-bold">Program Donasi</th>
                    <th className="px-4 py-3 font-bold">Nominal Sedekah</th>
                    <th className="px-4 py-3 font-bold">Metode / Gateway</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-ink">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted">
                        Tidak ada catatan transaksi yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3.5">
                          <p className="font-extrabold text-ink">{d.id}</p>
                          <p className="text-[11px] text-muted">{d.date}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-900">{d.donor}</p>
                          {d.notes && <p className="text-[11px] text-muted italic line-clamp-1">"{d.notes}"</p>}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-800 line-clamp-1">{d.program}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-extrabold text-forest">{money(d.amount)}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-700">{d.method}</p>
                          <p className="text-[10px] text-slate-400">{d.gatewayRef || 'PGW-SANDBOX'}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                              d.status === 'Terverifikasi'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : d.status === 'Menunggu'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                d.status === 'Terverifikasi'
                                  ? 'bg-emerald-500'
                                  : d.status === 'Menunggu'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedDonation(d)}
                              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:border-forest hover:text-forest"
                              title="Detail Gateway & Bukti"
                            >
                              <Eye size={14} />
                            </button>
                            {d.status === 'Menunggu' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onVerifyDonation(d.id, 'Terverifikasi')}
                                  className="rounded-lg bg-emerald-50 border border-emerald-200 p-1.5 text-emerald-700 hover:bg-emerald-100"
                                  title="Setujui Pembayaran"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onVerifyDonation(d.id, 'Ditolak')}
                                  className="rounded-lg bg-rose-50 border border-rose-200 p-1.5 text-rose-700 hover:bg-rose-100"
                                  title="Tolak Transaksi"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            )}
                          </div>
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
        /* TAB 2: GATEWAY SANDBOX & SIMULATOR */
        <div className="space-y-6">
          {/* Simulator Action Widget */}
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 p-5 shadow-soft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                  <Zap size={13} className="text-amber-600" /> Payment Gateway Webhook Simulator
                </span>
                <h3 className="mt-1.5 text-lg font-extrabold text-ink">
                  Simulasikan Pembayaran Berhasil (Auto-Settlement)
                </h3>
                <p className="mt-0.5 text-xs text-muted max-w-2xl">
                  Uji coba skenario saat donatur berhasil mentransfer via QRIS atau Virtual Account. Sistem akan menerima webhook simulasi dan langsung mengubah status transaksi menjadi <strong>Terverifikasi</strong>, menambah saldo program, dan mencatat mutasi.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={selectedPendingId}
                  onChange={(e) => setSelectedPendingId(e.target.value)}
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                >
                  <option value="">-- Pilih Transaksi Menunggu ({pendingDonations.length}) --</option>
                  {pendingDonations.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} · {p.donor} ({money(p.amount)})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleTriggerWebhook}
                  disabled={pendingDonations.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-900/10 hover:bg-amber-700 disabled:opacity-50"
                >
                  <Zap size={15} />
                  <span>Kirim Webhook Sukses</span>
                </button>
              </div>
            </div>
          </div>

          {/* Connected Gateway Channels */}
          <div>
            <h3 className="text-sm font-extrabold text-ink">Saluran Pembayaran Gateway Terhubung</h3>
            <p className="text-xs text-muted">Konfigurasi saluran pembayaran yang aktif pada sistem Kitasedekah.id:</p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paymentChannels.map((ch) => (
                <div
                  key={ch.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-ink">{ch.name}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {ch.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{ch.type}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-muted">
                    <span>Biaya Transaksi: <strong className="text-forest">{ch.fee}</strong></span>
                    <span className="text-[10px] text-slate-400">{ch.settlement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook Log History */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-ink">Log Webhook Masuk (HTTP 200 OK)</h3>
                <p className="text-xs text-muted">Riwayat payload notifikasi pembayaran yang diterima dari payment gateway.</p>
              </div>
              <span className="text-xs font-semibold text-muted">Simulasi Sandbox</span>
            </div>

            <div className="mt-3 divide-y divide-slate-100 text-xs">
              {webhookLogs.map((log) => (
                <div key={log.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-forest">{log.event}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                        {log.ref}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted">
                      Saluran: <strong>{log.channel}</strong> · Nominal: {money(log.amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-muted">{log.time}</span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                      HTTP {log.status} OK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedDonation && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setSelectedDonation(null)}
        >
          <div
            className="w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                  Rincian Transaksi Donasi
                </span>
                <h3 className="text-lg font-extrabold text-ink">{selectedDonation.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Nama Donatur</span>
                  <span className="font-bold text-ink">{selectedDonation.donor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Program Tujuan</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[250px]">
                    {selectedDonation.program}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Nominal Sedekah</span>
                  <span className="font-extrabold text-forest text-sm">
                    {money(selectedDonation.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Saluran Pembayaran</span>
                  <span className="font-bold text-slate-700">{selectedDonation.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Gateway Reference ID</span>
                  <span className="font-mono text-slate-600">{selectedDonation.gatewayRef || 'PGW-DEMO'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Waktu Transaksi</span>
                  <span className="text-slate-600">{selectedDonation.date}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200/70">
                  <span className="text-muted">Status Transaksi</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-bold text-[11px] ${
                      selectedDonation.status === 'Terverifikasi'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedDonation.status === 'Menunggu'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedDonation.status}
                  </span>
                </div>
              </div>

              {selectedDonation.notes && (
                <div className="rounded-xl border border-slate-100 p-3 bg-white">
                  <p className="text-[11px] font-bold text-slate-500">Doa / Pesan Donatur:</p>
                  <p className="mt-1 text-slate-700 italic">"{selectedDonation.notes}"</p>
                </div>
              )}

              {/* Action buttons inside modal */}
              {selectedDonation.status === 'Menunggu' && (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onVerifyDonation(selectedDonation.id, 'Terverifikasi')
                      setSelectedDonation(null)
                    }}
                    className="flex-1 rounded-xl bg-forest py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
                  >
                    Setujui Pembayaran
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onVerifyDonation(selectedDonation.id, 'Ditolak')
                      setSelectedDonation(null)
                    }}
                    className="flex-1 rounded-xl border border-rose-200 bg-rose-50 py-2.5 font-bold text-rose-700 hover:bg-rose-100"
                  >
                    Tolak Transaksi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
