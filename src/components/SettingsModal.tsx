import { useState, FormEvent } from 'react';
import { Settings, X, Monitor, Globe } from 'lucide-react';
import { useApiConfig } from '../context/ApiContext';
import { isDesktopApp } from '../services/apiClient';

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { config, setConfig } = useApiConfig();
  const [formData, setFormData] = useState(config);
  const isDesktop = isDesktopApp();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setConfig(formData);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => { setFormData(config); setIsOpen(true); }}
        className="flex items-center justify-center md:justify-start gap-2 px-2 md:px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        aria-label="Pengaturan API"
      >
        <Settings size={18} />
        <span className="hidden sm:inline-block">Pengaturan API</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Konfigurasi API Dukcapil</h3>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isDesktop ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {isDesktop ? <Monitor size={10} /> : <Globe size={10} />}
                  {isDesktop ? 'Tauri Desktop v2' : 'Web Mode'}
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">User ID</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">IP User</label>
                  <input
                    type="text"
                    value={formData.ipUser}
                    onChange={(e) => setFormData({...formData, ipUser: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Server Dukcapil URL</label>
                    <span className="text-[10px] text-slate-400">Desktop / Backend</span>
                  </div>
                  <input
                    type="text"
                    value={formData.serverUrl || ''}
                    onChange={(e) => setFormData({...formData, serverUrl: e.target.value})}
                    placeholder="https://172.16.160.177:8000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white"
                    required
                  />
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Digunakan saat aplikasi berjalan di Desktop (Tauri). Default: <code className="bg-slate-100 px-1 py-0.5 rounded">https://172.16.160.177:8000</code>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
