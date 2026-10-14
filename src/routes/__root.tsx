import { useState, useEffect, FormEvent } from 'react';
import { createRootRoute, Outlet, Link, useLocation } from '@tanstack/react-router';
import { SettingsModal } from '../components/SettingsModal';
import { Menu, X, Lock, KeyRound, Loader2, ServerOff, RefreshCw, Monitor, Globe } from 'lucide-react';
import { useApiConfig } from '../context/ApiContext';
import { dukcapilFetch, isDesktopApp } from '../services/apiClient';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);
  
  const { config } = useApiConfig();
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Secret Internal Unlock Logic
  const [isInternalUnlocked, setIsInternalUnlocked] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretPassword, setSecretPassword] = useState('');
  const [secretError, setSecretError] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setIsInternalUnlocked(sessionStorage.getItem('unlocked_internal') === 'true');
  }, []);

  const inDesktop = isDesktopApp();

  const checkServer = async () => {
    try {
      setServerStatus('checking');
      
      const response = await dukcapilFetch('/dukcapil/', { 
        method: 'HEAD',
        cache: 'no-store' 
      }, config.serverUrl);
      
      if (response.status === 502 || response.status === 504) {
        throw new Error('Backend Offline');
      }
      
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  useEffect(() => {
    checkServer();
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => {
    const next = clickCount + 1;
    if (next >= 5) {
      if (isInternalUnlocked) {
        setIsInternalUnlocked(false);
        sessionStorage.removeItem('unlocked_internal');
        window.dispatchEvent(new Event('internal_locked'));
      } else {
        setShowSecretModal(true);
      }
      setClickCount(0);
    } else {
      setClickCount(next);
    }
  };

  const handleSecretSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (secretPassword === 'admin123') {
      setIsInternalUnlocked(true);
      sessionStorage.setItem('unlocked_internal', 'true');
      window.dispatchEvent(new Event('internal_unlocked'));
      setShowSecretModal(false);
      setSecretPassword('');
      setSecretError(false);
    } else {
      setSecretError(true);
      setSecretPassword('');
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-900">
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 md:px-6 shadow-md shrink-0 relative z-40 gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 mr-1 rounded-lg hover:bg-slate-800 transition-colors lg:hidden shrink-0"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <img 
            src="/logokemendagri.png" 
            alt="Logo Kemendagri" 
            onClick={handleLogoClick}
            className="w-8 h-8 object-contain shrink-0 cursor-pointer" 
          />
          <h1 className="text-lg md:text-xl font-bold tracking-tight uppercase hidden sm:block truncate">
            Sistem Verifikasi Kependudukan
          </h1>
        </div>
        
        <div className="flex items-center gap-3 lg:gap-6 text-sm font-medium shrink-0">
          <span className="opacity-70 hidden lg:inline-block">User: DEMO_OFFICER_01</span>
          <span className="h-4 w-px bg-slate-700 hidden lg:inline-block"></span>
          {serverStatus === 'offline' ? (
            <button 
              onClick={checkServer}
              className="flex items-center gap-2 group cursor-pointer hover:bg-slate-800/60 p-1.5 -m-1.5 rounded-md transition-all text-slate-400 hover:text-slate-200"
              title="Refresh status server"
            >
              <div className="relative flex items-center justify-center w-3.5 h-3.5 shrink-0 text-red-500 group-hover:text-slate-300">
                <ServerOff className="w-3.5 h-3.5 absolute transition-opacity duration-200 opacity-100 group-hover:opacity-0" />
                <RefreshCw className="w-3.5 h-3.5 absolute transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
              </div>
              <span className="hidden md:inline-block whitespace-nowrap">
                <span className="group-hover:hidden">Server Offline</span>
                <span className="hidden group-hover:inline-block">Refresh Status</span>
              </span>
            </button>
          ) : (
            <span className="flex items-center gap-2">
              {serverStatus === 'checking' ? (
                <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
              ) : (
                <span className="w-2 h-2 bg-green-500 rounded-full shrink-0 animate-pulse"></span>
              )}
              <span className="hidden md:inline-block whitespace-nowrap">
                {serverStatus === 'checking' ? 'Mengecek Server...' : 'Server Online'}
              </span>
            </span>
          )}
          <div className="ml-1">
            <SettingsModal />
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}

        <aside 
          className={`
            absolute lg:static inset-y-0 left-0 z-30
            w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            h-full
          `}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3 mt-2">Metode Pengecekan</p>
          
          <Link 
            to="/" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              location.pathname === '/' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600 hover:bg-slate-100 border border-transparent font-medium'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-lg">🏠</span> Beranda
          </Link>

          {isInternalUnlocked && (
            <>
              <Link 
                to="/by-nik" 
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  location.pathname === '/by-nik' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'text-slate-600 hover:bg-slate-100 border border-transparent font-medium'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">👤</span> By NIK
              </Link>
              
              <Link 
                to="/by-nik-kk" 
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  location.pathname === '/by-nik-kk' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'text-slate-600 hover:bg-slate-100 border border-transparent font-medium'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">👨‍👩‍👧</span> By NIK Get KK
              </Link>
            </>
          )}

          <Link 
            to="/by-elemen" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              location.pathname === '/by-elemen' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600 hover:bg-slate-100 border border-transparent font-medium'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-lg">🔍</span> Verifikasi Elemen
          </Link>

          <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Mode Aplikasi</p>
              <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded ${inDesktop ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                {inDesktop ? <Monitor size={10} /> : <Globe size={10} />}
                {inDesktop ? 'Tauri Desktop' : 'Web Browser'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Server Dukcapil</p>
            <p className="text-xs text-slate-600 leading-relaxed break-all mb-2">
              <code className="text-[10px] bg-slate-200 p-0.5 rounded break-all">{config.serverUrl || '172.16.160.177'}</code>
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-semibold text-slate-700">v1.0.1</span>
              <span>oleh <strong className="text-slate-700">imadeekosatria</strong></span>
            </div>
          </div>
        </aside>
        
        <main className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-x-hidden overflow-y-auto bg-slate-50 w-full relative">
          <Outlet />
        </main>
      </div>

      {/* Secret Internal Modal */}
      {showSecretModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setShowSecretModal(false); setClickCount(0); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Lock size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Internal Access</h2>
            <p className="text-sm text-slate-500 mb-6">
              Masukkan password untuk mengaktifkan fitur internal yang disembunyikan.
            </p>
            
            <form onSubmit={handleSecretSubmit} className="flex flex-col gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="password"
                    value={secretPassword}
                    onChange={(e) => { setSecretPassword(e.target.value); setSecretError(false); }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${secretError ? 'border-red-300 focus:ring-red-200 bg-red-50 text-red-900' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'}`}
                    placeholder="Password akses..."
                    autoFocus
                  />
                </div>
                {secretError && <p className="text-xs font-medium text-red-500 mt-2 text-left">Password tidak sesuai!</p>}
              </div>
              <button
                type="submit"
                disabled={!secretPassword}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm"
              >
                Buka Kunci Akses
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
