import { useState, useEffect, FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Database, 
  Monitor, 
  Terminal, 
  Copy, 
  Check, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  Lock,
  Unlock,
  KeyRound,
  Code2
} from 'lucide-react';
import { isDesktopApp } from '../services/apiClient';
import { useApiConfig } from '../context/ApiContext';

export function Home() {
  const [isInternalUnlocked, setIsInternalUnlocked] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  
  // Password state for internal feature unlock inside Tech Modal
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  const isDesktop = isDesktopApp();
  const { config } = useApiConfig();

  useEffect(() => {
    setIsInternalUnlocked(sessionStorage.getItem('unlocked_internal') === 'true');
    const handleUnlock = () => setIsInternalUnlocked(true);
    const handleLock = () => setIsInternalUnlocked(false);
    window.addEventListener('internal_unlocked', handleUnlock);
    window.addEventListener('internal_locked', handleLock);
    return () => {
      window.removeEventListener('internal_unlocked', handleUnlock);
      window.removeEventListener('internal_locked', handleLock);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleUnlockSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (unlockPassword === 'admin123') {
      setIsInternalUnlocked(true);
      sessionStorage.setItem('unlocked_internal', 'true');
      window.dispatchEvent(new Event('internal_unlocked'));
      setUnlockPassword('');
      setUnlockError(false);
    } else {
      setUnlockError(true);
      setUnlockPassword('');
    }
  };

  const handleLockAgain = () => {
    setIsInternalUnlocked(false);
    sessionStorage.removeItem('unlocked_internal');
    window.dispatchEvent(new Event('internal_locked'));
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-8">
      {/* Hero Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5 z-10">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <ShieldCheck size={36} />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                Direktorat Jenderal Kependudukan & Pencatatan Sipil
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sistem Aktif
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Sistem Layanan Verifikasi Kependudukan
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mt-1 leading-relaxed">
              Platform validasi identitas penduduk berbasis web services Kemendagri. Lakukan pencocokan elemen data secara aman, cepat, dan terpercaya.
            </p>
          </div>
        </div>

        {/* Action Button: Technical Info Modal */}
        <div className="shrink-0 z-10 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2">
          <button
            onClick={() => setShowTechModal(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-xs"
            title="Buka informasi teknis framework dan developer"
          >
            <Code2 size={15} className="text-slate-500" />
            <span>Info Sistem & Teknis</span>
          </button>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-50/70 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Verification Modules Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isInternalUnlocked ? 'Modul Pengecekan Lengkap (Akses Terbuka)' : 'Modul Verifikasi Utama'}
          </h3>
          {isInternalUnlocked && (
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <Unlock size={12} /> Mode Akses Internal Aktif
            </span>
          )}
        </div>

        <div className={`grid grid-cols-1 ${isInternalUnlocked ? 'md:grid-cols-3' : 'grid-cols-1'} gap-5`}>
          {/* Module: Verifikasi by Elemen (Primary standard module) */}
          <Link to="/by-elemen" className="group">
            <div className={`bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-7 h-full transition-all hover:shadow-md hover:border-blue-400 flex flex-col relative overflow-hidden ${!isInternalUnlocked ? 'md:flex-row md:items-center md:gap-8' : ''}`}>
              <div className={`flex items-start justify-between ${!isInternalUnlocked ? 'md:flex-col md:items-start md:mb-0 mb-4' : 'mb-4'}`}>
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                  <Database size={28} />
                </div>
                {isInternalUnlocked && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    Standar
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Verifikasi by Elemen
                  </h4>
                  {!isInternalUnlocked && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      Metode Rekomendasi
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-4">
                  Pencocokan akurasi data penduduk berdasarkan NIK dengan elemen pembanding seperti nama lengkap, tanggal/tempat lahir, alamat, dan ambang batas kecocokan (threshold).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                    <span>Perhitungan kemiripan nama (Levenshtein)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                    <span>Validasi alamat detail hingga tingkat RT/RW</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                    <span>Pencocokan tanggal lahir dan jenis kelamin</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                    <span>Ambang batas akurasi dapat disesuaikan</span>
                  </div>
                </div>
              </div>

              <div className={`${!isInternalUnlocked ? 'md:border-t-0 md:pt-0 md:pl-4 border-t pt-4' : 'border-t pt-3'} border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform shrink-0`}>
                <span className="hidden sm:inline">Mulai Verifikasi</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>

          {/* Internal Modules (Only visible when unlocked via Info Sistem & Teknis modal) */}
          {isInternalUnlocked && (
            <>
              {/* Module: Verifikasi by NIK */}
              <Link to="/by-nik" className="group">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 h-full transition-all hover:shadow-md hover:border-amber-400 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
                      <UserCheck size={24} />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                      Internal Khusus
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-800 mb-1.5 group-hover:text-amber-600 transition-colors">
                    Verifikasi by NIK
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed flex-1 mb-4">
                    Pencarian dan penarikan profil data penduduk secara langsung menggunakan 16 digit Nomor Induk Kependudukan (NIK).
                  </p>

                  <div className="space-y-1.5 py-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-amber-500" />
                      <span>Data lengkap biodata penduduk</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-amber-500" />
                      <span>Status perkawinan & orang tua</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Akses Modul NIK</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>

              {/* Module: Verifikasi by NIK & KK */}
              <Link to="/by-nik-kk" className="group">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 h-full transition-all hover:shadow-md hover:border-amber-400 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
                      <Users size={24} />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                      Internal Khusus
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-800 mb-1.5 group-hover:text-amber-600 transition-colors">
                    Verifikasi by NIK & KK
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed flex-1 mb-4">
                    Pencarian data Kartu Keluarga lengkap beserta susunan daftar seluruh anggota keluarga dalam satu Kartu Keluarga.
                  </p>

                  <div className="space-y-1.5 py-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-amber-500" />
                      <span>Daftar seluruh anggota keluarga</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-amber-500" />
                      <span>Status hubungan dalam keluarga (SHDK)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Akses Modul KK</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Informational Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
            1
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800 mb-0.5">Input NIK & Pembanding</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Masukkan 16 digit NIK dan parameter yang ingin diverifikasi seperti nama dan alamat.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
            2
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800 mb-0.5">Tentukan Ambang Batas</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Atur persentase threshold kecocokan data (default 80%) untuk toleransi perbedaan penulisan.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
            3
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800 mb-0.5">Validasi Real-Time</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sistem memproses request ke endpoint web services dan menampilkan hasil verifikasi elemen.
            </p>
          </div>
        </div>
      </div>

      {/* POP-UP MODAL: Technical & Developer Info (Includes Hidden Internal Access) */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/50 flex items-center justify-center text-blue-300">
                  <Terminal size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Informasi Sistem & Teknis</h3>
                  <p className="text-[11px] text-slate-400">Detail runtime framework, arsitektur, dan akses khusus</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowTechModal(false); setUnlockError(false); setUnlockPassword(''); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-slate-800 text-sm">
              {/* Runtime Status */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Status Runtime Aplikasi
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Lingkungan</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 ${isDesktop ? 'text-emerald-700' : 'text-blue-700'}`}>
                      <Monitor size={13} />
                      {isDesktop ? 'Tauri Desktop v2' : 'Web Browser'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Endpoint Server</span>
                    <span className="text-xs font-mono font-bold text-slate-700 block truncate mt-1" title={config.serverUrl}>
                      {config.serverUrl || 'https://172.16.160.177:8000'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Framework & Security Info */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <Layers size={14} className="text-blue-600" />
                  <span>Arsitektur & Keamanan Desktop</span>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Aplikasi dibangun menggunakan <strong>Tauri Framework 2.x</strong> dengan frontend React 19. Koneksi ke endpoint Dukcapil menggunakan plugin HTTP natif (<code>@tauri-apps/plugin-http</code>) dengan fitur <code>dangerous-settings</code> yang mem-bypass batasan CORS dan sertifikat SSL internal (self-signed).
                </p>
              </div>

              {/* MERGED: Internal Feature Access Management */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound size={15} className="text-slate-600" />
                    <span className="text-xs font-bold text-slate-800">Akses Fitur Khusus Internal</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isInternalUnlocked ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                    {isInternalUnlocked ? 'Aktif' : 'Terkunci'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Modul pencarian langsung (<strong>By NIK</strong> dan <strong>By NIK & KK</strong>) disembunyikan secara default untuk keamanan. Masukkan password pengembang untuk mengaktifkannya.
                </p>

                {isInternalUnlocked ? (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                      <Unlock size={14} className="text-emerald-600" />
                      Semua modul internal sedang aktif
                    </span>
                    <button
                      type="button"
                      onClick={handleLockAgain}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Lock size={12} />
                      Kunci Kembali
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUnlockSubmit} className="flex gap-2 items-center pt-1">
                    <div className="relative flex-1">
                      <input
                        type="password"
                        value={unlockPassword}
                        onChange={(e) => { setUnlockPassword(e.target.value); setUnlockError(false); }}
                        placeholder="Password akses internal..."
                        className={`w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          unlockError ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500 bg-white'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!unlockPassword}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white font-semibold rounded-lg text-xs transition-colors shrink-0"
                    >
                      Buka Kunci
                    </button>
                  </form>
                )}
                {unlockError && (
                  <p className="text-[11px] text-red-600 font-medium">Password tidak sesuai!</p>
                )}
              </div>

              {/* Developer CLI Commands */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Perintah CLI Pengembang
                </span>
                <div className="space-y-2.5">
                  <div className="bg-slate-900 text-slate-200 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Jalankan Mode Desktop Dev</span>
                      <code className="text-emerald-400 font-bold">bun tauri:dev</code>
                      <span className="text-slate-500 text-[11px] ml-2 font-sans">(atau npm run tauri:dev)</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('bun tauri:dev')}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Salin perintah"
                    >
                      {copiedCmd === 'bun tauri:dev' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-200 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Build Installer / Executable (.msi / .exe)</span>
                      <code className="text-blue-400 font-bold">bun tauri:build</code>
                      <span className="text-slate-500 text-[11px] ml-2 font-sans">(atau npm run tauri:build)</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('bun tauri:build')}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Salin perintah"
                    >
                      {copiedCmd === 'bun tauri:build' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Documentation file reference */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                <span>Dokumentasi lengkap: <code>TAURI_GUIDE.md</code></span>
                <span className="text-slate-400 text-[11px]">Tauri 2.x • Rust Backend</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => { setShowTechModal(false); setUnlockError(false); setUnlockPassword(''); }}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
