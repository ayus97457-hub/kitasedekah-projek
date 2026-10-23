import React, { useState, useMemo } from 'react'
import {
  Users, UserPlus, ShieldCheck, CheckCircle2, XCircle, Search, Filter,
  Pencil, Trash2, KeyRound, Phone, Mail, Calendar, UserCheck, AlertCircle,
  RefreshCw, Check, ArrowRight, UserCog, Lock, Eye, EyeOff, Send, Heart,
  FileText, MapPin, Sparkles, LogIn, ExternalLink, HelpCircle, CheckCheck
} from 'lucide-react'
import { rupiah } from '../data'

const money = (n) => rupiah(n).replace(',00', '')

export default function UserManagementModule({
  users,
  setUsers,
  currentUser,
  setCurrentUser,
  donations,
  onShowToast
}) {
  // Main view tabs: 'roles' | 'donor-directory' | 'auth-portal'
  const [activeSubTab, setActiveSubTab] = useState('roles')

  // Search & Filter state for Roles tab
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Selected donor for Donor Directory tab
  const defaultDonor = users.find((u) => u.role.includes('Donatur')) || users[0]
  const [selectedDonorId, setSelectedDonorId] = useState(defaultDonor ? defaultDonor.id : '')

  // Form state for Add/Edit Admin
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin Sedekah',
    status: 'Aktif',
    address: '',
    bio: ''
  })

  // Auth Portal Simulator State (Pengurus Internal)
  const [authView, setAuthView] = useState('login') // 'login' | 'register' | 'forgot'
  const [loginEmail, setLoginEmail] = useState(currentUser.email)
  const [loginPassword, setLoginPassword] = useState('demo123')
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin Sedekah',
    password: '',
    confirmPassword: ''
  })
  const [forgotStep, setForgotStep] = useState(1) // 1: input email, 2: input OTP, 3: new password, 4: success
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Filtered users (Pengurus & Donatur)
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole =
        roleFilter === 'Semua'
          ? true
          : roleFilter === 'Pengurus'
          ? u.role.includes('Admin')
          : u.role.includes(roleFilter)
      const matchStatus = statusFilter === 'Semua' || u.status === statusFilter
      const text = `${u.name} ${u.email} ${u.role} ${u.phone || ''} ${u.address || ''}`.toLowerCase()
      const matchQuery = text.includes(query.toLowerCase())
      return matchRole && matchStatus && matchQuery
    })
  }, [users, query, roleFilter, statusFilter])

  // Active Donor Profile data
  const currentDonorProfile = useMemo(() => {
    return users.find((u) => u.id === selectedDonorId) || defaultDonor || users[0]
  }, [users, selectedDonorId, defaultDonor])

  // Donor's personal donation history
  const donorDonations = useMemo(() => {
    if (!currentDonorProfile) return []
    return donations.filter((d) =>
      d.donor.toLowerCase().includes(currentDonorProfile.name.toLowerCase()) ||
      (currentDonorProfile.role.includes('Donatur') && d.donor === currentDonorProfile.name)
    )
  }, [donations, currentDonorProfile])

  const donorTotalDonated = useMemo(() => {
    return donorDonations
      .filter((d) => d.status === 'Terverifikasi')
      .reduce((sum, d) => sum + (d.amount || 0), currentDonorProfile?.totalDonated || 0)
  }, [donorDonations, currentDonorProfile])

  // Role Counts
  const roleStats = useMemo(() => {
    return {
      total: users.length,
      adminSedekah: users.filter((u) => u.role === 'Admin Sedekah').length,
      adminKonten: users.filter((u) => u.role === 'Admin Konten').length,
      donaturGuest: users.filter((u) => u.role.includes('Donatur')).length,
      activePengurus: users.filter((u) => u.role.includes('Admin') && u.status === 'Aktif').length
    }
  }, [users])

  // Open Add Admin
  const handleOpenAdd = () => {
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Admin Sedekah',
      status: 'Aktif',
      address: '',
      bio: ''
    })
    setShowAddModal(true)
  }

  // Open Edit User
  const handleOpenEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      address: user.address || '',
      bio: user.bio || ''
    })
    setShowAddModal(true)
  }

  // Toggle user active status
  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
          onShowToast('Status Pengguna', `${u.name} kini berstatus ${newStatus}.`)
          return { ...u, status: newStatus }
        }
        return u
      })
    )
  }

  // Delete user
  const handleDeleteUser = (user) => {
    if (user.id === currentUser.id) {
      onShowToast('Peringatan', 'Tidak dapat menghapus akun pengurus yang sedang aktif digunakan.')
      return
    }
    setUsers((prev) => prev.filter((u) => u.id !== user.id))
    onShowToast('Hapus Pengguna', `Akun ${user.name} berhasil dihapus dari sistem.`)
  }

  // Switch current active user
  const handleSwitchUser = (user) => {
    setCurrentUser(user)
    setLoginEmail(user.email)
    onShowToast('Sesi Berubah', `Sekarang Anda aktif sebagai ${user.name} (${user.role}).`)
  }

  // Submit Add / Edit User
  const handleSubmitUser = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      onShowToast('Validasi Gagal', 'Mohon isi nama lengkap dan alamat email.')
      return
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      )
      if (currentUser.id === editingUser.id) {
        setCurrentUser((prev) => ({ ...prev, ...formData }))
      }
      onShowToast('Sukses', `Data pengguna ${formData.name} berhasil diperbarui.`)
    } else {
      const newUser = {
        id: `USR-${String(users.length + 1).padStart(3, '0')}`,
        ...formData,
        avatar: `https://images.unsplash.com/photo-${1535713875000 + users.length}?auto=format&fit=crop&w=120&q=80`,
        joinedDate: 'Hari ini',
        totalDonated: 0,
        donationsCount: 0
      }
      setUsers((prev) => [newUser, ...prev])
      onShowToast('Akun Pengurus Ditambahkan', `Akun ${newUser.name} sebagai ${newUser.role} berhasil dibuat.`)
    }
    setShowAddModal(false)
  }

  // Submit Donor Profile Update
  const handleUpdateDonorProfile = (e) => {
    e.preventDefault()
    setUsers((prev) =>
      prev.map((u) => (u.id === currentDonorProfile.id ? { ...u, ...currentDonorProfile } : u))
    )
    onShowToast('Data Donatur Disimpan', `Informasi donatur ${currentDonorProfile.name} berhasil diperbarui.`)
  }

  // Authentication: Handle Login Submit (Pengurus)
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    const found = users.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase())
    if (found) {
      setCurrentUser(found)
      onShowToast('Login Berhasil', `Selamat bertugas, ${found.name} (${found.role}).`)
    } else {
      onShowToast('Login Gagal', 'Alamat email pengurus tidak ditemukan dalam sistem.')
    }
  }

  // Authentication: Handle Register Submit (Pengurus Baru)
  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (!registerForm.name || !registerForm.email) {
      onShowToast('Validasi Gagal', 'Harap isi nama dan alamat email pengurus.')
      return
    }

    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone || '0812-0000-0000',
      role: registerForm.role || 'Admin Sedekah',
      status: 'Aktif',
      avatar: `https://images.unsplash.com/photo-1535713875002?auto=format&fit=crop&w=120&q=80`,
      joinedDate: 'Baru saja',
      address: 'Bogor, Jawa Barat',
      bio: `Staf internal terdaftar sebagai ${registerForm.role}.`,
      totalDonated: 0,
      donationsCount: 0
    }

    setUsers((prev) => [newUser, ...prev])
    setCurrentUser(newUser)
    onShowToast('Registrasi Berhasil', `Akun staf ${newUser.name} berhasil terdaftar sebagai ${newUser.role}.`)
    setAuthView('login')
  }

  // Authentication: Handle Forgot Password Step 1 (Send Reset OTP)
  const handleSendResetLink = (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      onShowToast('Peringatan', 'Masukkan alamat email pengurus Anda.')
      return
    }
    setOtpCode('829140')
    setForgotStep(2)
    onShowToast('Kode OTP Terkirim', `Kode verifikasi dikirim ke ${forgotEmail} (Kode demo: 829140).`)
  }

  // Authentication: Handle Forgot Password Step 2 (Verify OTP)
  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setForgotStep(3)
    onShowToast('Verifikasi Berhasil', 'Kode OTP valid. Silakan tentukan kata sandi baru pengurus.')
  }

  // Authentication: Handle Forgot Password Step 3 (Set New Password)
  const handleSaveNewPassword = (e) => {
    e.preventDefault()
    setForgotStep(4)
    onShowToast('Kata Sandi Diperbarui', 'Kata sandi pengurus berhasil diubah. Silakan masuk kembali.')
  }

  const getRoleBadgeStyle = (role) => {
    if (role === 'Admin Sedekah') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200'
    } else if (role === 'Admin Konten') {
      return 'bg-blue-50 text-blue-800 border-blue-200'
    } else {
      return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest">
            <Users size={14} /> Modul 1
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Modul Otentikasi & Manajemen Pengguna
          </h2>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Pengelolaan hak akses pengurus internal (Admin Sedekah & Admin Konten), profil donatur, serta autentikasi sistem.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('roles')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'roles'
                ? 'bg-white text-forest shadow-sm'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Role Pengurus</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('donor-directory')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'donor-directory'
                ? 'bg-white text-forest shadow-sm'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <Heart size={14} />
            <span>Direktori Donatur</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('auth-portal')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'auth-portal'
                ? 'bg-white text-forest shadow-sm'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <KeyRound size={14} />
            <span>Auth Pengurus</span>
          </button>
        </div>
      </div>

      {/* HIGHLIGHT BANNER: KEBIJAKAN DONATUR TANPA LOGIN */}
      <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50 via-mint/40 to-white p-4 sm:p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-white shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-forest">
                  Kebijakan Efisiensi Sedekah: Donatur Tanpa Login
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[9px] font-extrabold text-emerald-800">
                  Frictionless UX
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed max-w-3xl">
                Sesuai ketentuan, <strong>donatur tidak perlu membuat akun atau login untuk berdonasi</strong>. Siapa saja dapat langsung berinfaq di halaman publik secara cepat, memilih opsi anonim (Hamba Allah), dan mengecek status transaksi dengan ID Donasi. Otentikasi dan login difokuskan penuh untuk <strong>Admin Sedekah</strong> dan <strong>Admin Konten</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sesi Pengguna Aktif Banner */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-11 w-11 rounded-xl border border-slate-200 object-cover"
            />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Sesi Pengurus Aktif Saat Ini
              </p>
              <h3 className="text-sm font-extrabold text-ink">{currentUser.name}</h3>
              <p className="text-xs text-forest font-semibold">{currentUser.role} · {currentUser.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Ganti Pengurus Cepat:</span>
            {users
              .filter((u) => u.role.includes('Admin'))
              .map((admin) => (
                <button
                  key={admin.id}
                  type="button"
                  onClick={() => handleSwitchUser(admin)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                    admin.id === currentUser.id
                      ? 'bg-forest text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-forest hover:text-forest'
                  }`}
                >
                  {admin.name.split(' ')[0]} ({admin.role.replace('Admin ', '')})
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* TAB 1: MANAJEMEN ROLE PENGURUS & HAK AKSES */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6">
          {/* KPI Role Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
              <p className="text-xs font-medium text-muted">Pengurus Aktif</p>
              <p className="mt-1 text-2xl font-black text-ink">{roleStats.activePengurus}</p>
              <p className="mt-1 text-[11px] font-semibold text-emerald-600">Admin Yayasan</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-soft">
              <p className="text-xs font-medium text-emerald-800">Admin Sedekah</p>
              <p className="mt-1 text-2xl font-black text-emerald-900">{roleStats.adminSedekah}</p>
              <p className="mt-1 text-[11px] text-emerald-700">Program, Transaksi & Kas</p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 shadow-soft">
              <p className="text-xs font-medium text-blue-800">Admin Konten</p>
              <p className="mt-1 text-2xl font-black text-blue-900">{roleStats.adminKonten}</p>
              <p className="mt-1 text-[11px] text-blue-700">Publikasi & Dokumentasi</p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 shadow-soft">
              <p className="text-xs font-medium text-purple-800">Donatur Terdata</p>
              <p className="mt-1 text-2xl font-black text-purple-900">{roleStats.donaturGuest}</p>
              <p className="mt-1 text-[11px] text-purple-700">Tamu Donasi (Tanpa Login)</p>
            </div>
          </div>

          {/* Action and Filter Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama pengurus, email, atau peran..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-3 text-xs outline-none focus:border-forest focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-forest"
              >
                <option value="Semua">Semua Pengguna</option>
                <option value="Admin Sedekah">Admin Sedekah</option>
                <option value="Admin Konten">Admin Konten</option>
                <option value="Donatur">Donatur (Tamu)</option>
              </select>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-forest/90"
              >
                <UserPlus size={14} /> Tambah Akun Pengurus
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-bold">Pengguna</th>
                    <th className="px-4 py-3 font-bold">Email & Kontak</th>
                    <th className="px-4 py-3 font-bold">Peran (Role)</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold">Tipe Akses</th>
                    <th className="px-4 py-3 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-ink">
                  {filteredUsers.map((user) => {
                    const isCurrent = user.id === currentUser.id
                    const isAdmin = user.role.includes('Admin')

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-50/60 transition ${
                          isCurrent ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-9 w-9 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-ink">{user.name}</span>
                                {isCurrent && (
                                  <span className="rounded-md bg-forest px-1.5 py-0.2 text-[9px] font-bold text-white">
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted line-clamp-1">{user.bio || user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-slate-800">{user.email}</p>
                          <p className="text-[11px] text-muted">{user.phone}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getRoleBadgeStyle(
                              user.role
                            )}`}
                          >
                            <ShieldCheck size={12} />
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user.id)}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                              user.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            {user.status}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              isAdmin
                                ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isAdmin ? 'Login Pengurus' : 'Tamu (Tanpa Login)'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isAdmin && !isCurrent && (
                              <button
                                type="button"
                                onClick={() => handleSwitchUser(user)}
                                title="Ganti Sesi ke Pengurus Ini"
                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:border-forest hover:text-forest"
                              >
                                <UserCheck size={14} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(user)}
                              title="Edit Data"
                              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:border-forest hover:text-forest"
                            >
                              <Pencil size={14} />
                            </button>
                            {!isCurrent && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                title="Hapus Akun"
                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:border-rose-300 hover:text-rose-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matriks Hak Akses Peran Pengurus */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
            <h3 className="text-sm font-extrabold text-ink">
              Matriks Hak Akses Resmi Pengurus Kitasedekah.id
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Pembagian kewenangan sistem antara Admin Sedekah dan Admin Konten:
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Admin Sedekah */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-lg bg-emerald-600 p-1.5 text-white">
                    <ShieldCheck size={16} />
                  </span>
                  <p className="font-extrabold text-emerald-900 text-sm">1. Admin Sedekah</p>
                </div>
                <p className="text-[11px] text-emerald-800 mb-3">
                  Wewenang operasional penggalangan dana, transaksi, dan perbendaharaan kas:
                </p>
                <ul className="space-y-1.5 text-[11px] text-emerald-950 font-medium">
                  <li className="flex items-center gap-2">✓ Mengelola kampanye sedekah (Target dana, sisa hari, status program)</li>
                  <li className="flex items-center gap-2">✓ Verifikasi mutasi transaksi donasi masuk & simulasi Payment Gateway</li>
                  <li className="flex items-center gap-2">✓ Realisasi penyaluran dana santunan ke penerima manfaat</li>
                  <li className="flex items-center gap-2">✓ Akses neraca keuangan, arus kas, dan ekspor laporan transparansi</li>
                </ul>
              </div>

              {/* Admin Konten */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-lg bg-blue-600 p-1.5 text-white">
                    <FileText size={16} />
                  </span>
                  <p className="font-extrabold text-blue-900 text-sm">2. Admin Konten</p>
                </div>
                <p className="text-[11px] text-blue-800 mb-3">
                  Wewenang publikasi informasi, artikel kabar lapangan, dan transparansi sosial:
                </p>
                <ul className="space-y-1.5 text-[11px] text-blue-950 font-medium">
                  <li className="flex items-center gap-2">✓ Publikasi berita kegiatan penyaluran dan kabar dampak donasi</li>
                  <li className="flex items-center gap-2">✓ Upload foto dokumentasi penyerahan bantuan di lapangan</li>
                  <li className="flex items-center gap-2">✓ Pengaturan materi landing page publik dan artikel yayasan</li>
                  <li className="flex items-center gap-2">✓ Mengelola rubrik Tanya Jawab (FAQ) donatur</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIREKTORI & PROFIL DONATUR (TANPA LOGIN) */}
      {activeSubTab === 'donor-directory' && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-ink">Direktori & Profil Donatur (Non-Login)</h3>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-forest border border-emerald-200">
                  Data Terkumpul dari Transaksi
                </span>
              </div>
              <p className="text-xs text-muted">
                Data donatur dicatat otomatis dari formulir donasi tanpa mewajibkan donatur login.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Pilih Donatur:</span>
              <select
                value={selectedDonorId}
                onChange={(e) => setSelectedDonorId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-forest"
              >
                {users
                  .filter((u) => u.role.includes('Donatur'))
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.email})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Donor Detail Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Card: Donor Identity & Stats */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft space-y-6">
              <div className="text-center">
                <img
                  src={currentDonorProfile.avatar}
                  alt={currentDonorProfile.name}
                  className="mx-auto h-24 w-24 rounded-3xl object-cover border-4 border-white shadow-md ring-4 ring-emerald-100"
                />
                <h3 className="mt-4 text-lg font-black text-ink">{currentDonorProfile.name}</h3>
                <p className="text-xs text-muted">{currentDonorProfile.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest border border-emerald-200">
                  <Heart size={13} className="fill-forest text-forest" />
                  <span>Donatur Tamu (Guest)</span>
                </div>
              </div>

              {/* Personal Sedekah Stats */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Total Sedekah Disalurkan:</span>
                  <span className="font-extrabold text-forest text-sm">{money(donorTotalDonated)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Frekuensi Berdonasi:</span>
                  <span className="font-bold text-ink">{donorDonations.length || currentDonorProfile.donationsCount || 1} Transaksi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Metode Donasi:</span>
                  <span className="font-bold text-slate-700">QRIS & VA Bank (Tanpa Akun)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Kontak WhatsApp:</span>
                  <span className="text-slate-800 font-medium">{currentDonorProfile.phone}</span>
                </div>
              </div>

              <div className="text-xs text-muted space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" /> {currentDonorProfile.address || 'Bogor, Jawa Barat'}
                </p>
                <p className="text-[11px] text-slate-500 italic">"{currentDonorProfile.bio}"</p>
              </div>
            </div>

            {/* Right Card: Form Edit Data Kontak Donatur & Riwayat */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft">
              <h4 className="text-sm font-extrabold text-ink border-b border-slate-100 pb-3">
                Informasi Kontak Donatur
              </h4>

              <form onSubmit={handleUpdateDonorProfile} className="mt-4 space-y-4 text-xs">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-ink">Nama Donatur</label>
                    <input
                      type="text"
                      value={currentDonorProfile.name}
                      onChange={(e) => {
                        const val = e.target.value
                        setUsers((prev) =>
                          prev.map((u) => (u.id === currentDonorProfile.id ? { ...u, name: val } : u))
                        )
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink">Alamat Email (Pengiriman Nota)</label>
                    <input
                      type="email"
                      value={currentDonorProfile.email}
                      onChange={(e) => {
                        const val = e.target.value
                        setUsers((prev) =>
                          prev.map((u) => (u.id === currentDonorProfile.id ? { ...u, email: val } : u))
                        )
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-ink">Nomor WhatsApp</label>
                    <input
                      type="text"
                      value={currentDonorProfile.phone}
                      onChange={(e) => {
                        const val = e.target.value
                        setUsers((prev) =>
                          prev.map((u) => (u.id === currentDonorProfile.id ? { ...u, phone: val } : u))
                        )
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink">Kota Domisili</label>
                    <input
                      type="text"
                      value={currentDonorProfile.address || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setUsers((prev) =>
                          prev.map((u) => (u.id === currentDonorProfile.id ? { ...u, address: val } : u))
                        )
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-forest px-5 py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
                  >
                    Simpan Perubahan Data Donatur
                  </button>
                </div>
              </form>

              {/* Riwayat Sedekah Donatur Ini */}
              <div className="mt-8 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-forest mb-3">
                  Riwayat Sedekah Donatur Ini (Tanpa Login)
                </h4>

                <div className="space-y-2">
                  {donorDonations.length === 0 ? (
                    <p className="text-center py-4 text-xs text-muted">Belum ada riwayat donasi untuk nama ini.</p>
                  ) : (
                    donorDonations.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs"
                      >
                        <div>
                          <p className="font-bold text-ink">{d.program}</p>
                          <p className="text-[10px] text-muted">{d.date} · {d.method}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-forest">{money(d.amount)}</p>
                          <span
                            className={`text-[10px] font-bold ${
                              d.status === 'Terverifikasi' ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {d.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PORTAL AUTH PENGURUS (LOGIN, REGISTRASI, LUPA PASSWORD) */}
      {activeSubTab === 'auth-portal' && (
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-soft">
          <div className="text-center mb-6">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest border border-emerald-100">
              Autentikasi Internal Yayasan
            </span>
            <h3 className="mt-2 text-xl font-black text-ink">Portal Akses Pengurus Platform</h3>
            <p className="mt-1 text-xs text-muted">
              Hanya untuk <strong>Admin Sedekah</strong> dan <strong>Admin Konten</strong>. Donatur tidak memerlukan login.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 border-b border-slate-100 pb-4">
            <button
              type="button"
              onClick={() => setAuthView('login')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                authView === 'login'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-slate-600 hover:text-ink hover:bg-slate-50'
              }`}
            >
              1. Login Pengurus
            </button>
            <button
              type="button"
              onClick={() => setAuthView('register')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                authView === 'register'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-slate-600 hover:text-ink hover:bg-slate-50'
              }`}
            >
              2. Registrasi Staf Baru
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthView('forgot')
                setForgotStep(1)
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                authView === 'forgot'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-slate-600 hover:text-ink hover:bg-slate-50'
              }`}
            >
              3. Lupa Kata Sandi
            </button>
          </div>

          {/* VIEW: LOGIN PENGURUS */}
          {authView === 'login' && (
            <div className="mt-6 space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-ink">Alamat Email Pengurus</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@kitasedekah.id"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block font-bold text-ink">Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthView('forgot')
                        setForgotStep(1)
                      }}
                      className="text-[11px] font-bold text-forest hover:underline"
                    >
                      Lupa Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-forest py-3 font-extrabold text-white shadow-md hover:bg-forest/90"
                >
                  Masuk ke Panel Pengurus
                </button>
              </form>

              {/* Quick Login Chips for 2 Admin Roles */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-bold mb-2">Login Cepat Pengurus Yayasan (Demo):</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      const admin = users.find((u) => u.role === 'Admin Sedekah') || users[0]
                      handleSwitchUser(admin)
                    }}
                    className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-left hover:bg-emerald-100 transition"
                  >
                    <p className="font-extrabold text-emerald-950 text-xs">Admin Sedekah</p>
                    <p className="text-[11px] text-emerald-700">Ahmad Fauzi (Kelola Donasi & Kas)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const konten = users.find((u) => u.role === 'Admin Konten') || users[2]
                      handleSwitchUser(konten)
                    }}
                    className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-left hover:bg-blue-100 transition"
                  >
                    <p className="font-extrabold text-blue-950 text-xs">Admin Konten</p>
                    <p className="text-[11px] text-blue-700">Budi Santoso (Berita & Lapangan)</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: REGISTRASI PENGURUS BARU */}
          {authView === 'register' && (
            <div className="mt-6 space-y-4">
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-ink">Nama Lengkap Staf / Pengurus</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Ust. Hasan Basri"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-ink">Email Resmi Yayasan</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@kitasedekah.id"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink">Peran yang Ditugaskan</label>
                  <select
                    value={registerForm.role}
                    onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-800 outline-none focus:border-forest"
                  >
                    <option value="Admin Sedekah">Admin Sedekah (Program, Transaksi & Kas)</option>
                    <option value="Admin Konten">Admin Konten (Berita & Dokumentasi Lapangan)</option>
                  </select>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-ink">Kata Sandi</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimal 6 karakter"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink">Konfirmasi Kata Sandi</label>
                    <input
                      type="password"
                      required
                      placeholder="Ulangi kata sandi"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-forest py-3 font-extrabold text-white shadow-md hover:bg-forest/90"
                >
                  Daftarkan Staf Pengurus Baru
                </button>
              </form>
            </div>
          )}

          {/* VIEW: LUPA KATA SANDI PENGURUS */}
          {authView === 'forgot' && (
            <div className="mt-6 space-y-4">
              {forgotStep === 1 && (
                <form onSubmit={handleSendResetLink} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-ink">Alamat Email Pengurus Terdaftar</label>
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
                    Kirim Kode OTP Pemulihan →
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5 text-xs">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 border border-emerald-100">
                    <p className="font-bold">Kode OTP Simulasi: <code className="bg-white px-2 py-0.5 rounded font-mono text-forest">829140</code></p>
                    <p className="mt-0.5 text-[10px]">Gunakan kode 6-digit di atas untuk verifikasi.</p>
                  </div>

                  <div>
                    <label className="block font-bold text-ink">Masukkan 6 Digit Kode OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="829140"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-center font-mono font-bold tracking-widest text-lg outline-none focus:border-forest"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-forest py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
                  >
                    Verifikasi Kode OTP →
                  </button>
                </form>
              )}

              {forgotStep === 3 && (
                <form onSubmit={handleSaveNewPassword} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-ink">Kata Sandi Baru</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimal 6 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-forest py-2.5 font-bold text-white shadow-md hover:bg-forest/90"
                  >
                    Simpan Kata Sandi Baru
                  </button>
                </form>
              )}

              {forgotStep === 4 && (
                <div className="text-center space-y-3 text-xs py-3">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-forest">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="font-extrabold text-sm text-ink">Kata Sandi Berhasil Diperbarui!</p>
                  <p className="text-muted">
                    Pengurus dapat masuk kembali ke panel manajemen menggunakan kata sandi baru.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="rounded-xl bg-forest px-5 py-2 font-bold text-white hover:bg-forest/90"
                  >
                    Masuk ke Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Admin Modal */}
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
              <h3 className="text-lg font-extrabold text-ink">
                {editingUser ? 'Edit Pengurus' : 'Tambah Pengurus Yayasan Baru'}
              </h3>
              <p className="text-xs text-muted">
                {editingUser
                  ? 'Perbarui hak peran atau kontak pengurus.'
                  : 'Daftarkan Admin Sedekah atau Admin Konten baru.'}
              </p>
            </div>

            <form onSubmit={handleSubmitUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Misal: Ust. Farhan Al-Hafidz"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-ink">Email Yayasan</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@kitasedekah.id"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-ink">Hak Akses / Peran</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold outline-none focus:border-forest"
                  >
                    <option value="Admin Sedekah">Admin Sedekah (Program & Keuangan)</option>
                    <option value="Admin Konten">Admin Konten (Berita & Lapangan)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-forest"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink">Deskripsi Tugas / Bio Singkat</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Deskripsi tugas atau peranan pengurus..."
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
                  {editingUser ? 'Simpan Perubahan' : 'Buat Pengurus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
