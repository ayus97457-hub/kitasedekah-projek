import React, { useState, useMemo } from 'react'
import {
  Users, HeartHandshake, Landmark, FileChartColumn,
  LayoutDashboard, Globe, Bell, Menu, X, Leaf, ShieldCheck,
  CheckCircle2, KeyRound, LogOut, ExternalLink, Sparkles
} from 'lucide-react'

// Import dummy datasets
import {
  initialUsers,
  programs as seedPrograms,
  donations as seedDonations,
  distributions as seedDistributions,
  activities as seedActivities,
  rupiah
} from './data'

// Import the 6 dedicated modules
import UserManagementModule from './components/UserManagementModule'
import ProgramsModule from './components/ProgramsModule'
import TransactionsGatewayModule from './components/TransactionsGatewayModule'
import TransparencyModule from './components/TransparencyModule'
import DashboardAnalyticsModule from './components/DashboardAnalyticsModule'
import LandingPageModule from './components/LandingPageModule'
import AuthModal from './components/AuthModal'

const money = (n) => rupiah(n).replace(',00', '')

export default function App() {
  // Shared reactive state
  const [users, setUsers] = useState(initialUsers)
  const [currentUser, setCurrentUser] = useState(initialUsers[0]) // Super Admin default
  const [programs, setPrograms] = useState(seedPrograms)
  const [donations, setDonations] = useState(seedDonations)
  const [distributions, setDistributions] = useState(seedDistributions)
  const [activities, setActivities] = useState(seedActivities)

  // Navigation state (Default to dashboard)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (title, message) => {
    setToast({ title, message })
    setTimeout(() => setToast(null), 4500)
  }

  // Pending count calculation
  const pendingCount = useMemo(
    () => donations.filter((d) => d.status === 'Menunggu').length,
    [donations]
  )

  // Verification handler that updates program funds
  const handleVerifyDonation = (donationId, newStatus) => {
    let affectedDonation = null

    setDonations((prev) =>
      prev.map((d) => {
        if (d.id === donationId) {
          affectedDonation = { ...d, status: newStatus }
          return affectedDonation
        }
        return d
      })
    )

    // If verified, automatically update corresponding program collected & donors
    if (newStatus === 'Terverifikasi') {
      const target = donations.find((d) => d.id === donationId)
      if (target) {
        setPrograms((prev) =>
          prev.map((p) => {
            if (p.title === target.program) {
              return {
                ...p,
                collected: (p.collected || 0) + (target.amount || 0),
                donors: (p.donors || 0) + 1
              }
            }
            return p
          })
        )
      }
      showToast('Verifikasi Berhasil', `Transaksi ${donationId} disetujui. Saldo kas dan kampanye bertambah.`)
    } else {
      showToast('Transaksi Ditolak', `Transaksi ${donationId} telah ditandai Ditolak.`)
    }
  }

  // Handler for new donation from public landing page
  const handleAddDonation = (newDonation) => {
    setDonations((prev) => [newDonation, ...prev])

    // If verified immediately by payment gateway settlement simulation
    if (newDonation.status === 'Terverifikasi') {
      setPrograms((prev) =>
        prev.map((p) => {
          if (p.title === newDonation.program) {
            return {
              ...p,
              collected: (p.collected || 0) + (newDonation.amount || 0),
              donors: (p.donors || 0) + 1
            }
          }
          return p
        })
      )
    }
  }

  // The 6 modules navigation items
  const moduleNavItems = [
    {
      id: 'dashboard',
      num: '5',
      label: 'Dashboard & Analitik',
      desc: 'Admin / Pengurus',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'programs',
      num: '2',
      label: 'Kelola Program Donasi',
      desc: 'Kampanye Sedekah',
      icon: HeartHandshake,
      badge: programs.length
    },
    {
      id: 'transactions',
      num: '3',
      label: 'Transaksi & Payment Gateway',
      desc: 'QRIS, VA Bank & Settle',
      icon: Landmark,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'transparency',
      num: '4',
      label: 'Penyaluran & Lap. Keuangan',
      desc: 'Transparansi Realisasi',
      icon: FileChartColumn,
      badge: null
    },
    {
      id: 'users',
      num: '1',
      label: 'Otentikasi & User Mgmt',
      desc: 'Hak Akses & Pengguna',
      icon: Users,
      badge: users.length
    },
    {
      id: 'public',
      num: '6',
      label: 'Halaman Publik / Landing Page',
      desc: 'Tampilan Donatur Publik',
      icon: Globe,
      badge: 'Portal',
      badgeColor: 'bg-forest'
    }
  ]

  // If activeTab is 'public', render the full landing page view
  if (activeTab === 'public') {
    return (
      <>
        <LandingPageModule
          programs={programs}
          distributions={distributions}
          activities={activities}
          donations={donations}
          onAddDonation={handleAddDonation}
          onBackToAdmin={() => setActiveTab('dashboard')}
          onShowToast={showToast}
        />
        {/* Toast Notification */}
        {toast && (
          <aside
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-2xl"
          >
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-forest">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">{toast.title}</p>
              <p className="text-[11px] text-muted">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            >
              <X size={14} />
            </button>
          </aside>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7faf7] text-ink antialiased">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <button
          aria-label="Tutup menu navigasi"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-emerald-950/5 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-[80px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-white shadow-md shadow-emerald-900/15">
            <Leaf size={22} />
          </div>
          <div>
            <div className="text-[18px] font-black tracking-tight text-ink">
              kitasedekah<span className="text-forest">.id</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
              Management Platform
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto text-slate-400 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current User Session Bar */}
        <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-mint/40 to-white p-3 border border-emerald-100/80">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-9 w-9 rounded-xl object-cover border border-emerald-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-ink truncate">{currentUser.name}</p>
              <p className="text-[10px] text-forest font-semibold">{currentUser.role}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              title="Ganti Sesi Akun / Login"
              className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-forest transition"
            >
              <KeyRound size={15} />
            </button>
          </div>
        </div>

        {/* Navigation Items (The 6 Modules) */}
        <div className="mt-4 flex-1 overflow-y-auto px-3 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-[.16em] text-slate-400 uppercase">
            6 MODUL UTAMA SISTEM
          </p>

          {moduleNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                  isActive
                    ? 'bg-forest text-white shadow-md shadow-emerald-900/15'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-forest'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="truncate">
                    <p className={`font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] ${isActive ? 'text-emerald-100' : 'text-muted'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.badgeColor
                        ? `${item.badgeColor} text-white`
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Sidebar Footer Link to Public */}
        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('public')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 py-2.5 text-xs font-bold text-forest transition hover:bg-emerald-100"
          >
            <Globe size={15} />
            <span>Lihat Website Publik</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-h-screen lg:pl-[280px]">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex min-h-[80px] items-center justify-between border-b border-slate-200/70 bg-[#f7faf7]/95 px-4 backdrop-blur-md sm:px-8 xl:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden shadow-xs"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-forest">
                Kitasedekah.id · Panel Manajemen
              </div>
              <h1 className="text-lg font-black tracking-tight text-ink sm:text-xl">
                {moduleNavItems.find((m) => m.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Public View */}
            <button
              type="button"
              onClick={() => setActiveTab('public')}
              className="hidden items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-forest shadow-xs transition hover:bg-emerald-50 sm:inline-flex"
            >
              <Globe size={14} />
              <span>Buka Landing Page</span>
            </button>

            {/* Auth Switcher Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-xs hover:border-forest transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-6 w-6 rounded-lg object-cover"
              />
              <div className="hidden text-left sm:block">
                <p className="text-[11px] font-bold text-ink leading-none">{currentUser.name}</p>
                <p className="text-[9px] text-muted">{currentUser.role}</p>
              </div>
              <KeyRound size={13} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Main Body with the active module */}
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardAnalyticsModule
              programs={programs}
              donations={donations}
              distributions={distributions}
              onVerifyDonation={handleVerifyDonation}
              setActiveTab={setActiveTab}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'programs' && (
            <ProgramsModule
              programs={programs}
              setPrograms={setPrograms}
              donations={donations}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsGatewayModule
              donations={donations}
              onVerifyDonation={handleVerifyDonation}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'transparency' && (
            <TransparencyModule
              distributions={distributions}
              setDistributions={setDistributions}
              programs={programs}
              donations={donations}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'users' && (
            <UserManagementModule
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              donations={donations}
              onShowToast={showToast}
            />
          )}

          {/* Footer Info */}
          <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-200/70 pt-6 text-[11px] text-slate-400 sm:flex-row">
            <span>© 2026 Kitasedekah.id · Sistem Informasi Manajemen Platform Sedekah</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              Sistem 6 Modul Lengkap Berjalan Aktif
            </span>
          </footer>
        </main>
      </div>

      {/* Simulated Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setUsers={setUsers}
        onShowToast={showToast}
      />

      {/* Feedback Toast Notification */}
      {toast && (
        <aside
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-2xl"
        >
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-forest">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">{toast.title}</p>
            <p className="text-[11px] text-muted">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
          >
            <X size={14} />
          </button>
        </aside>
      )}
    </div>
  )
}
