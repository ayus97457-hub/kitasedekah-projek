import React, { useState } from 'react'
import {
  KeyRound, ShieldCheck, UserCheck, X, Check, Lock,
  Mail, ArrowRight, Sparkles, UserPlus, Heart
} from 'lucide-react'

export default function AuthModal({
  isOpen,
  onClose,
  users,
  currentUser,
  setCurrentUser,
  setUsers,
  onShowToast
}) {
  const [tab, setTab] = useState('login') // 'login' | 'register' | 'forgot'

  // Only admin users for internal login
  const adminUsers = users.filter((u) => u.role.includes('Admin'))
  const [selectedUser, setSelectedUser] = useState(adminUsers[0] || currentUser)

  // Login form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register form (Pengurus Baru)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    role: 'Admin Sedekah',
    password: ''
  })

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStep, setForgotStep] = useState(1) // 1: input, 2: success

  if (!isOpen) return null

  const handleSelectUser = (u) => {
    setSelectedUser(u)
    setEmail(u.email)
    setPassword('demo123')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setCurrentUser(selectedUser)
    onShowToast('Login Berhasil', `Selamat bertugas, ${selectedUser.name} (${selectedUser.role}).`)
    onClose()
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (!regForm.name || !regForm.email) {
      onShowToast('Validasi Gagal', 'Harap lengkapi nama dan email yayasan.')
      return
    }

    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: regForm.name,
      email: regForm.email,
      role: regForm.role,
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1535713875002?auto=format&fit=crop&w=120&q=80',
      joinedDate: 'Hari ini',
      phone: '0812-3456-7890',
      address: 'Bogor, Jawa Barat',
      bio: `Staf internal terdaftar sebagai ${regForm.role}.`,
      totalDonated: 0,
      donationsCount: 0
    }

    if (setUsers) {
      setUsers((prev) => [newUser, ...prev])
    }
    setCurrentUser(newUser)
    onShowToast('Registrasi Berhasil', `Akun staf ${newUser.name} berhasil dibuat sebagai ${newUser.role}!`)
    onClose()
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    setForgotStep(2)
    onShowToast('Kode OTP Terkirim', `Tautan & OTP reset kata sandi dikirim ke ${forgotEmail} (Kode demo: 829140).`)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Banner Header */}
        <div className="bg-gradient-to-br from-emerald-800 to-forest p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <KeyRound size={20} className="text-white" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <h3 className="mt-4 text-xl font-black">Portal Akses Pengurus Yayasan</h3>
          <p className="mt-1 text-xs text-emerald-100">
            Khusus <strong>Admin Sedekah</strong> dan <strong>Admin Konten</strong>. Donatur tidak perlu login untuk bersedekah.
          </p>

          {/* Sub Navigation */}
          <div className="mt-4 flex rounded-xl bg-black/20 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 rounded-lg py-1.5 transition ${
                tab === 'login' ? 'bg-white text-forest shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Login Pengurus
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 rounded-lg py-1.5 transition ${
                tab === 'register' ? 'bg-white text-forest shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Daftar Staf
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('forgot')
                setForgotStep(1)
              }}
              className={`flex-1 rounded-lg py-1.5 transition ${
                tab === 'forgot' ? 'bg-white text-forest shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Lupa Password
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-xs space-y-4">
          {/* TAB 1: LOGIN PENGURUS */}
          {tab === 'login' && (
            <>
              <div>
                <p className="font-bold text-ink mb-2">Pilih Cepat Pengurus Yayasan (Demo):</p>
                <div className="space-y-1.5">
                  {adminUsers.map((u) => {
                    const isSelected = selectedUser.id === u.id
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectUser(u)}
                        className={`flex w-full items-center justify-between rounded-xl border p-2 text-left transition ${
                          isSelected
                            ? 'border-forest bg-emerald-50 text-forest ring-2 ring-emerald-100'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-ink leading-tight">{u.name}</p>
                            <p className="text-[10px] text-muted">{u.role}</p>
                          </div>
                        </div>
                        {isSelected && <Check size={16} className="text-forest" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700">Email Pengurus</label>
                  <input
                    type="email"
                    value={email || selectedUser.email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <label className="block font-bold text-slate-700">Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() => {
                        setTab('forgot')
                        setForgotStep(1)
                      }}
                      className="text-[10px] font-bold text-forest hover:underline"
                    >
                      Lupa Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password || 'demo123'}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-forest py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
                >
                  Masuk sebagai {selectedUser.name}
                </button>
              </form>
            </>
          )}

          {/* TAB 2: REGISTRASI STAF BARU */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700">Nama Lengkap Staf</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Ust. Hasan Basri"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Alamat Email Yayasan</label>
                <input
                  type="email"
                  required
                  placeholder="nama@kitasedekah.id"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Penugasan Peran</label>
                <select
                  value={regForm.role}
                  onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-800 outline-none focus:border-forest"
                >
                  <option value="Admin Sedekah">Admin Sedekah (Program, Transaksi & Kas)</option>
                  <option value="Admin Konten">Admin Konten (Berita & Lapangan)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700">Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-forest py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
              >
                Daftarkan Staf Baru
              </button>
            </form>
          )}

          {/* TAB 3: LUPA PASSWORD */}
          {tab === 'forgot' && (
            <div className="space-y-3">
              {forgotStep === 1 ? (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <p className="text-muted leading-relaxed">
                    Masukkan email pengurus terdaftar. Sistem akan mengirimkan kode verifikasi OTP simulasi.
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700">Email Pengurus Terdaftar</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@kitasedekah.id"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-forest py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
                  >
                    Kirim Kode OTP Pemulihan
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-3 py-2">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-forest">
                    <Check size={24} />
                  </div>
                  <p className="font-extrabold text-ink">Kode OTP Pemulihan Terkirim!</p>
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-100">
                    Kode verifikasi demo: <strong className="font-mono">829140</strong>
                  </div>
                  <p className="text-[11px] text-muted">
                    Buka modul <strong>Otentikasi & Manajemen Pengguna</strong> untuk proses verifikasi lengkap dan reset kata sandi baru.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Kembali ke Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
