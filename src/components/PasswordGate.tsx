import { useState, useEffect, ReactNode, FormEvent } from 'react';
import { Lock, KeyRound } from 'lucide-react';

export function PasswordGate({ children, featureId }: { children: ReactNode, featureId: string }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if user already unlocked this feature in the current session
    const unlocked = sessionStorage.getItem(`unlocked_${featureId}`);
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }

    if (featureId === 'internal') {
      const handleUnlock = () => setIsUnlocked(true);
      const handleLock = () => setIsUnlocked(false);
      window.addEventListener('internal_unlocked', handleUnlock);
      window.addEventListener('internal_locked', handleLock);
      return () => {
        window.removeEventListener('internal_unlocked', handleUnlock);
        window.removeEventListener('internal_locked', handleLock);
      };
    }
  }, [featureId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Default password for this demo is 'admin123'
    if (password === 'admin123') {
      setIsUnlocked(true);
      sessionStorage.setItem(`unlocked_${featureId}`, 'true');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Lock size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Fitur Terkunci</h2>
        <p className="text-sm text-slate-500 mb-6">
          Fitur ini bersifat sensitif. Masukkan password akses untuk melanjutkan.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-200 bg-red-50 text-red-900' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'}`}
                placeholder="Password akses..."
                autoFocus
              />
            </div>
            {error && <p className="text-xs font-medium text-red-500 mt-2 text-left">Password tidak sesuai!</p>}
          </div>
          <button
            type="submit"
            disabled={!password}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm"
          >
            Buka Kunci Akses
          </button>
        </form>
      </div>
    </div>
  );
}
