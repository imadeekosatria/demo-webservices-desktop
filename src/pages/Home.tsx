import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldCheck, UserCheck, Users, Database, Monitor, Terminal, Copy, Check, ExternalLink, Cpu, Sparkles } from 'lucide-react';
import { isDesktopApp } from '../services/apiClient';
import { useApiConfig } from '../context/ApiContext';

export function Home() {
  const [isInternalUnlocked, setIsInternalUnlocked] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
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

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-center shrink-0">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <Sparkles size={13} />
          Tauri Framework v2.x Ready
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
          Portal Sistem Verifikasi Penduduk
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
          Aplikasi terintegrasi dengan layanan API kependudukan Kemendagri, kini siap dijalankan sebagai aplikasi desktop native berkinerja tinggi menggunakan Tauri v2.
        </p>
      </div>

      {/* Tauri v2 Desktop Integration Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700/60 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
              isDesktop ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              <Monitor size={12} />
              Status: {isDesktop ? 'Berjalan di Tauri Desktop' : 'Mode Web Browser / Preview'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Tauri v2.x</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Konfigurasi Desktop Native Tersedia
          </h3>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Struktur <code>src-tauri/</code>, security capabilities, dan plugin HTTP natif telah dikonfigurasi untuk mengatasi pembatasan CORS dan sertifikat SSL saat mengakses endpoint Dukcapil (<code>{config.serverUrl}</code>).
          </p>
        </div>

        {/* Quick Commands */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <div className="bg-slate-950/70 border border-slate-700 rounded-xl p-3 flex flex-col justify-between min-w-[220px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Terminal size={11} /> Dev Desktop
            </span>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs font-mono text-emerald-400">npm run tauri:dev</code>
              <button 
                onClick={() => copyToClipboard('npm run tauri:dev')}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                title="Salin Perintah"
              >
                {copiedCmd === 'npm run tauri:dev' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-700 rounded-xl p-3 flex flex-col justify-between min-w-[220px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Cpu size={11} /> Build Installer
            </span>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs font-mono text-blue-400">npm run tauri:build</code>
              <button 
                onClick={() => copyToClipboard('npm run tauri:build')}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                title="Salin Perintah"
              >
                {copiedCmd === 'npm run tauri:build' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Menu Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
          Pilihan Modul Verifikasi
        </h3>
        <div className={`grid grid-cols-1 ${isInternalUnlocked ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          {isInternalUnlocked && (
            <>
              <Link to="/by-nik" className="group">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full transition-all hover:shadow-md hover:border-amber-300 flex flex-col">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <UserCheck size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Verifikasi by NIK</h4>
                  <p className="text-slate-500 text-xs leading-relaxed flex-1">
                    Pencarian dan verifikasi data penduduk langsung menggunakan Nomor Induk Kependudukan (NIK 16 digit).
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
                    Mulai Verifikasi &rarr;
                  </div>
                </div>
              </Link>
              
              <Link to="/by-nik-kk" className="group">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full transition-all hover:shadow-md hover:border-amber-300 flex flex-col">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Users size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Verifikasi by NIK & KK</h4>
                  <p className="text-slate-500 text-xs leading-relaxed flex-1">
                    Pencarian data keluarga lengkap dengan kartu keluarga berdasarkan NIK dan Nomor KK.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
                    Mulai Verifikasi &rarr;
                  </div>
                </div>
              </Link>
            </>
          )}

          <Link to="/by-elemen" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full transition-all hover:shadow-md hover:border-blue-300 flex flex-col">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Database size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">Verifikasi by Elemen</h4>
              <p className="text-slate-500 text-xs leading-relaxed flex-1">
                Pencocokan akurasi data penduduk berdasarkan elemen nama, tempat/tanggal lahir, alamat, dan threshold.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                Mulai Verifikasi &rarr;
              </div>
            </div>
          </Link>

          {!isInternalUnlocked && (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 mb-2">
                🔒
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">Akses Tambahan Tersembunyi</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Klik logo Kemendagri di pojok kiri atas 5 kali untuk membuka modul By NIK dan By NIK Get KK.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

