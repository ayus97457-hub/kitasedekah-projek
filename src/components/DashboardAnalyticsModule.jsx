import React, { useMemo } from 'react'
import {
  LayoutDashboard, ArrowUpRight, ArrowDownRight, Users,
  HeartHandshake, Landmark, WalletCards, CheckCircle2,
  Clock3, AlertCircle, Zap, ChevronRight, BarChart3, PieChart
} from 'lucide-react'
import { rupiah } from '../data'

const money = (n) => rupiah(n).replace(',00', '')

export default function DashboardAnalyticsModule({
  programs,
  donations,
  distributions,
  onVerifyDonation,
  setActiveTab,
  onShowToast
}) {
  // Aggregate stats
  const analytics = useMemo(() => {
    const verifiedDonations = donations.filter((d) => d.status === 'Terverifikasi')
    const totalVerifiedIn = verifiedDonations.reduce((s, d) => s + (d.amount || 0), 0)
    const totalDistributed = distributions.reduce((s, d) => s + (d.amount || 0), 0)
    const netBalance = Math.max(totalVerifiedIn - totalDistributed, 0)
    const pendingCount = donations.filter((d) => d.status === 'Menunggu').length
    const uniqueDonors = new Set(donations.map((d) => d.donor)).size

    return {
      totalVerifiedIn,
      totalDistributed,
      netBalance,
      pendingCount,
      uniqueDonors,
      totalTransactions: donations.length
    }
  }, [donations, distributions])

  // Category distribution
  const categoryStats = useMemo(() => {
    const categories = ['Bantuan Pangan', 'Pendidikan', 'Infrastruktur', 'Kemanusiaan']
    const colors = {
      'Bantuan Pangan': 'bg-emerald-500',
      'Pendidikan': 'bg-blue-500',
      'Infrastruktur': 'bg-amber-500',
      'Kemanusiaan': 'bg-rose-500'
    }

    const totalPrograms = programs.length || 1
    return categories.map((cat) => {
      const progs = programs.filter((p) => p.category === cat)
      const count = progs.length
      const collected = progs.reduce((s, p) => s + (p.collected || 0), 0)
      const percentage = Math.round((count / totalPrograms) * 100)
      return {
        name: cat,
        count,
        collected,
        percentage,
        color: colors[cat]
      }
    })
  }, [programs])

  // Monthly dummy chart data
  const monthlyData = [
    { month: 'Mei', in: 14500000, out: 11000000 },
    { month: 'Jun', in: 19800000, out: 16200000 },
    { month: 'Jul', in: 24200000, out: 18500000 },
    { month: 'Agu', in: 28900000, out: 22400000 },
    { month: 'Sep', in: 34100000, out: 27800000 },
    { month: 'Okt', in: analytics.totalVerifiedIn, out: analytics.totalDistributed }
  ]

  const maxVal = Math.max(...monthlyData.map((m) => Math.max(m.in, m.out))) || 40000000

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest">
            <LayoutDashboard size={14} /> Modul 5
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Modul Dashboard & Analitik (Admin / Pengurus)
          </h2>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Ringkasan eksekutif seluruh data yayasan, analitik tren dana masuk vs penyaluran, dan kontrol sistem.
          </p>
        </div>

        {analytics.pendingCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
          >
            <Clock3 size={15} className="text-amber-600 animate-spin" />
            <span>{analytics.pendingCount} Donasi Perlu Verifikasi →</span>
          </button>
        )}
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted">Donasi Terverifikasi</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-forest">
              <Landmark size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-forest">{money(analytics.totalVerifiedIn)}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight size={13} /> +18.4% <span className="text-muted font-normal">dari bulan lalu</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted">Dana Tersalurkan</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <WalletCards size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-900">{money(analytics.totalDistributed)}</p>
          <p className="mt-2 text-[11px] text-muted">{distributions.length} kegiatan terealisasi</p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted">Saldo Kas Bersih</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-sky-50 text-sky-600">
              <Zap size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-sky-900">{money(analytics.netBalance)}</p>
          <p className="mt-2 text-[11px] text-emerald-600 font-semibold">Kas siap disalurkan</p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted">Donatur Terdata</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-600">
              <Users size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-purple-900">{analytics.uniqueDonors}</p>
          <p className="mt-2 text-[11px] text-muted">{analytics.totalTransactions} Total transaksi</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-ink">Tren Finansial Bulanan</h3>
              <p className="text-xs text-muted">Perbandingan donasi masuk terverifikasi vs penyaluran dana (6 bulan terakhir)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="h-2.5 w-2.5 rounded-sm bg-forest" /> Donasi Masuk
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Penyaluran
              </span>
            </div>
          </div>

          <div className="mt-6 flex h-60 items-end justify-between gap-3 pt-4 px-2">
            {monthlyData.map((d) => {
              const inHeight = Math.max(Math.round((d.in / maxVal) * 100), 12)
              const outHeight = Math.max(Math.round((d.out / maxVal) * 100), 12)
              return (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center gap-1.5 h-44">
                    {/* Bar In */}
                    <div
                      title={`Donasi Masuk: ${money(d.in)}`}
                      className="w-1/2 max-w-[26px] rounded-t-lg bg-forest transition-all hover:opacity-85"
                      style={{ height: `${inHeight}%` }}
                    />
                    {/* Bar Out */}
                    <div
                      title={`Penyaluran: ${money(d.out)}`}
                      className="w-1/2 max-w-[26px] rounded-t-lg bg-blue-500 transition-all hover:opacity-85"
                      style={{ height: `${outHeight}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-ink">Distribusi Kategori Program</h3>
              <p className="text-xs text-muted">Proporsi kampanye berdasarkan pilar sedekah</p>
            </div>

            <div className="mt-4 space-y-3.5">
              {categoryStats.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{cat.name}</span>
                    <span className="text-muted">{cat.count} Program ({money(cat.collected)})</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${Math.max(cat.percentage, 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-muted">
            <span className="font-bold text-slate-700">Payment Gateway Preferensi:</span> 48% donatur menggunakan QRIS Dinamis, 36% Virtual Account Bank, dan 16% E-Wallet.
          </div>
        </div>
      </div>

      {/* Recent Urgent Queue & Priority Campaigns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Donations Queue */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-ink">Antrean Verifikasi Donasi</h3>
              <p className="text-xs text-muted">Transaksi baru yang membutuhkan konfirmasi</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-bold text-forest hover:underline"
            >
              Buka Semua Transaksi →
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 text-xs">
            {donations.filter((d) => d.status === 'Menunggu').slice(0, 3).map((d) => (
              <div key={d.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-bold text-ink">{d.donor}</p>
                  <p className="text-[11px] text-muted">{d.program} · {d.method}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-forest">{money(d.amount)}</span>
                  <button
                    type="button"
                    onClick={() => onVerifyDonation(d.id, 'Terverifikasi')}
                    className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    Setujui
                  </button>
                </div>
              </div>
            ))}
            {donations.filter((d) => d.status === 'Menunggu').length === 0 && (
              <p className="py-6 text-center text-xs text-muted">
                Semua donasi telah diverifikasi. Antrean bersih!
              </p>
            )}
          </div>
        </div>

        {/* Priority Programs */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-ink">Kampanye Sedekah Prioritas</h3>
              <p className="text-xs text-muted">Program yang mendekati target capaian</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('programs')}
              className="text-xs font-bold text-forest hover:underline"
            >
              Kelola Program →
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {programs.slice(0, 3).map((p) => {
              const pct = Math.min(Math.round(((p.collected || 0) / (p.target || 1)) * 100), 100)
              return (
                <div key={p.id} className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-xs text-ink">{p.title}</p>
                      <p className="text-[11px] text-muted">{p.category} · {p.days} hari tersisa</p>
                    </div>
                    <span className="text-xs font-bold text-forest">{pct}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-muted">
                    <span>Terkumpul: {money(p.collected)}</span>
                    <span>Target: {money(p.target)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
