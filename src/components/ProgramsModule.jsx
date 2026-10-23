import React, { useState, useMemo } from 'react'
import {
  HeartHandshake, Plus, Search, Filter, CalendarDays, Users,
  Trash2, Eye, Pencil, CheckCircle2, AlertCircle, ArrowUpRight,
  Sparkles, Check, X, Leaf
} from 'lucide-react'
import { rupiah } from '../data'

const money = (n) => rupiah(n).replace(',00', '')

export default function ProgramsModule({
  programs,
  setPrograms,
  donations,
  onShowToast
}) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState(null)

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Bantuan Pangan',
    target: '',
    days: 30,
    status: 'Aktif',
    image: '',
    description: ''
  })

  const categories = ['Semua', 'Bantuan Pangan', 'Pendidikan', 'Infrastruktur', 'Kemanusiaan']

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchCat = categoryFilter === 'Semua' || p.category === categoryFilter
      const matchStatus = statusFilter === 'Semua' || p.status === statusFilter
      const text = `${p.title} ${p.category} ${p.description}`.toLowerCase()
      const matchQuery = text.includes(query.toLowerCase())
      return matchCat && matchStatus && matchQuery
    })
  }, [programs, query, categoryFilter, statusFilter])

  // Stats
  const stats = useMemo(() => {
    const totalTarget = programs.reduce((s, p) => s + (p.target || 0), 0)
    const totalCollected = programs.reduce((s, p) => s + (p.collected || 0), 0)
    const activeCount = programs.filter((p) => p.status === 'Aktif').length
    const finishedCount = programs.filter((p) => p.status === 'Tercapai').length
    return {
      total: programs.length,
      active: activeCount,
      finished: finishedCount,
      totalTarget,
      totalCollected,
      percentage: totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0
    }
  }, [programs])

  const handleOpenAdd = () => {
    setForm({
      title: '',
      category: 'Bantuan Pangan',
      target: '',
      days: 30,
      status: 'Aktif',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85',
      description: ''
    })
    setShowAddModal(true)
  }

  const handleDelete = (id, title) => {
    if (confirm(`Hapus program "${title}"?`)) {
      setPrograms((prev) => prev.filter((p) => p.id !== id))
      onShowToast('Program Dihapus', `Program "${title}" berhasil dihapus dari data lokal.`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.target) {
      onShowToast('Validasi Gagal', 'Harap isi judul kampanye dan target dana.')
      return
    }

    const newProg = {
      id: `PG-${String(programs.length + 1).padStart(3, '0')}`,
      title: form.title,
      category: form.category,
      target: Number(form.target),
      collected: 0,
      days: Number(form.days) || 30,
      status: form.status,
      image: form.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85',
      donors: 0,
      description: form.description
    }

    setPrograms((prev) => [newProg, ...prev])
    setShowAddModal(false)
    onShowToast('Kampanye Dibuat', `Program "${newProg.title}" berhasil ditambahkan.`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest">
            <HeartHandshake size={14} /> Modul 2
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Kelola Program Donasi / Kampanye Sedekah
          </h2>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Manajemen kampanye penggalangan dana, target dana sedekah, tenggat waktu, dan transparansi progres.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-forest/90"
        >
          <Plus size={16} />
          <span>Buat Kampanye Baru</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium text-muted">Total Kampanye</p>
          <p className="mt-1.5 text-2xl font-extrabold text-ink">{stats.total}</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">{stats.active} Sedang Aktif</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-soft">
          <p className="text-xs font-medium text-emerald-800">Dana Terkumpul</p>
          <p className="mt-1.5 text-xl font-extrabold text-forest">{money(stats.totalCollected)}</p>
          <p className="mt-1 text-[11px] text-emerald-700">{stats.percentage}% dari seluruh target</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium text-muted">Total Target</p>
          <p className="mt-1.5 text-xl font-extrabold text-slate-800">{money(stats.totalTarget)}</p>
          <p className="mt-1 text-[11px] text-muted">Akumulasi seluruh program</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4 shadow-soft">
          <p className="text-xs font-medium text-sky-800">Target Tercapai</p>
          <p className="mt-1.5 text-2xl font-extrabold text-sky-900">{stats.finished}</p>
          <p className="mt-1 text-[11px] text-sky-700">Kampanye berhasil 100%</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul program atau kategori sedekah..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-3 text-xs outline-none focus:border-forest focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex items-center overflow-x-auto rounded-xl bg-slate-100 p-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoryFilter(c)}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  categoryFilter === c
                    ? 'bg-white text-forest shadow-xs'
                    : 'text-slate-600 hover:text-ink'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-forest"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tercapai">Tercapai</option>
            <option value="Ditutup">Ditutup</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center text-muted">
            <HeartHandshake size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-ink">Tidak ada program donasi yang cocok</p>
            <p className="mt-1 text-xs text-muted">Silakan sesuaikan kata kunci pencarian atau kategori.</p>
          </div>
        ) : (
          filteredPrograms.map((p) => {
            const pct = Math.min(Math.round(((p.collected || 0) / (p.target || 1)) * 100), 100)
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition hover:shadow-lg"
              >
                {/* Image and badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${
                        p.status === 'Aktif'
                          ? 'bg-emerald-500 text-white'
                          : p.status === 'Tercapai'
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <span>{p.id}</span>
                    <span>·</span>
                    <span>{p.days > 0 ? `${p.days} hari tersisa` : 'Selesai'}</span>
                  </div>

                  <h3 className="mt-1 text-base font-extrabold text-ink line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs text-muted line-clamp-2">
                    {p.description}
                  </p>

                  {/* Progress */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-forest">{money(p.collected)}</span>
                      <span className="text-muted">{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-forest transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                      <span>Target: {money(p.target)}</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users size={12} /> {p.donors || 0} donatur
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProgram(p)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline"
                    >
                      <Eye size={14} /> Detail & Donatur
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Hapus Program"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add Program Modal */}
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
              <h3 className="text-lg font-extrabold text-ink">Buat Kampanye Donasi Baru</h3>
              <p className="text-xs text-muted">
                Tambahkan program penggalangan dana sedekah baru ke dalam sistem.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink">Judul Kampanye Donasi</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Misal: Sedekah Subuh Paket Pangan Yatim"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-ink">Kategori Program</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  >
                    <option value="Bantuan Pangan">Bantuan Pangan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="Kemanusiaan">Kemanusiaan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink">Target Dana (Rp)</label>
                  <input
                    type="number"
                    required
                    min="100000"
                    step="50000"
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                    placeholder="Contoh: 25000000"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-ink">Durasi Kampanye (Hari)</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink">Status Kampanye</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Draft">Draft</option>
                    <option value="Tercapai">Tercapai</option>
                    <option value="Ditutup">Ditutup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink">URL Foto Dokumentasi Kampanye</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-ink">Deskripsi Lengkap Kampanye</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Jelaskan tujuan penggalangan dana, target mustahik, dan urgensi sedekah ini..."
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
                  Terbitkan Kampanye
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                  {selectedProgram.category} · {selectedProgram.id}
                </span>
                <h3 className="text-lg font-extrabold text-ink">{selectedProgram.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <img
                src={selectedProgram.image}
                alt={selectedProgram.title}
                className="h-52 w-full rounded-2xl object-cover"
              />

              <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100">
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-forest">{money(selectedProgram.collected)}</span>
                  <span className="text-slate-600">Target: {money(selectedProgram.target)}</span>
                </div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-forest"
                    style={{
                      width: `${Math.min(
                        Math.round((selectedProgram.collected / selectedProgram.target) * 100),
                        100
                      )}%`
                    }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-muted">
                  <span>{selectedProgram.donors} Donatur telah berkontribusi</span>
                  <span>{selectedProgram.days} hari tersisa</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-ink">Tentang Program Ini</h4>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Related Donors */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-ink">Donasi Terkait Program Ini</h4>
                <div className="mt-2 space-y-1.5">
                  {donations
                    .filter((d) => d.program === selectedProgram.title)
                    .slice(0, 4)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5"
                      >
                        <div>
                          <p className="font-bold text-ink">{d.donor}</p>
                          <p className="text-[10px] text-muted">{d.date} · {d.method}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-forest">{money(d.amount)}</p>
                          <span className="text-[10px] font-semibold text-emerald-600">{d.status}</span>
                        </div>
                      </div>
                    ))}
                  {donations.filter((d) => d.program === selectedProgram.title).length === 0 && (
                    <p className="text-center py-3 text-muted">Belum ada donasi untuk program ini.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
