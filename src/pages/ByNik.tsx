import { useState, FormEvent } from 'react';
import { useApiConfig } from '../context/ApiContext';
import { Search, Loader2, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PasswordGate } from '../components/PasswordGate';
import { dukcapilFetch } from '../services/apiClient';

export function ByNik() {
  const { config } = useApiConfig();
  const [nik, setNik] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nik) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        USER_ID: (config.userId || '').trim(),
        PASSWORD: (config.password || '').trim(),
        IP_USER: (config.ipUser || '').trim(),
        NIK: nik.trim(),
        transactionId: trxId.trim()
      };

      const endpointUrl = '/dukcapil/get_json/DEMO/CALL_NIK';

      const response = await dukcapilFetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }, config.serverUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawText = await response.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Respon server bukan format JSON yang valid (Status: ${response.status}). Kemungkinan URL salah atau server mengembalikan halaman HTML.`);
      }
      
      if (data.content && data.content.length > 0) {
        const item = data.content[0];
        if (item.RESPONSE_CODE && item.RESPONSE_CODE !== '00') {
          setError(`Autentikasi Gagal: ${item.RESPONSE_DESC || item.RESPONSE || 'Login Gagal'} (Kode: ${item.RESPONSE_CODE}). Periksa User ID, Password, dan IP User di Pengaturan API.`);
          return;
        }
        setResult(item);
        if (window.innerWidth < 1024) setIsFormOpen(false);
      } else {
        setError('Data tidak ditemukan');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses permintaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PasswordGate featureId="internal">
      <div className="flex flex-col h-full gap-6">
        <section className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm shrink-0 transition-all duration-300 ${!isFormOpen && result ? 'lg:block hidden' : 'block'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Input Parameter Verifikasi</h2>
            {result && (
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="lg:hidden text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 bg-blue-50 px-2 py-1.5 rounded-md transition-colors"
              >
                TUTUP <ChevronUp size={14} />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="flex flex-col gap-1.5 md:col-span-5">
              <label className="text-[11px] font-bold text-slate-500 uppercase truncate">NIK Subjek</label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none h-[38px]"
                placeholder="16 digit NIK"
                required
                maxLength={16}
              />
            </div>
            
            <div className="flex flex-col gap-1.5 md:col-span-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase truncate">User ID</label>
              <input
                type="text"
                value={config.userId}
                readOnly
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 h-[38px]"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase truncate" title="Transaction ID (Opsional)">Trx ID (Opsional)</label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="Kosongkan"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none h-[38px]"
              />
            </div>
            
            <div className="flex items-end md:col-span-2">
              <button
                type="submit"
                disabled={loading || !nik}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg shadow-blue-200 transition-all disabled:bg-blue-400 disabled:shadow-none flex items-center justify-center h-[38px]"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <span className="flex items-center gap-2"><Search size={16} /> Cari</span>}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm flex gap-3 items-start">
              <AlertCircle className="shrink-0 mt-0.5 w-5 h-5" />
              <div>
                <p className="font-bold mb-1">Gagal memuat data</p>
                <p className="opacity-90 leading-relaxed text-xs">{error}</p>
              </div>
            </div>
          )}
        </section>

        {!isFormOpen && result && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm"
          >
            Tampilkan Form Pencarian <ChevronDown size={16} />
          </button>
        )}

        {result && (
          <section className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-bold text-slate-800">Hasil Pencarian Data Penduduk</h2>
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <CheckCircle size={12} className="hidden sm:block" /> Valid
              </span>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 sm:gap-8 overflow-y-auto">
              <div className="w-full md:w-40 flex flex-col gap-4 shrink-0 items-center md:items-stretch">
                <div className="w-32 sm:w-40 md:w-full aspect-[3/4] bg-slate-200 rounded-xl border-4 border-white shadow-md overflow-hidden relative">
                  {result.FOTO ? (
                    <>
                      <img 
                        src={`data:image/jpeg;base64,${result.FOTO}`} 
                        alt="Foto KTP" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-blue-600/90 text-[8px] text-white py-1 px-2 rounded text-center font-bold">VERIFIED PHOTO</div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs italic">TIDAK ADA FOTO</div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">No. Kartu Keluarga</p>
                  <p className="font-mono text-sm font-bold mt-0.5">{result.NO_KK || '-'}</p>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4 pr-0 sm:pr-2">
                <div className="col-span-1 sm:col-span-2 pb-2 border-b border-slate-100 text-center md:text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">{result.NAMA_LGKP || '-'}</p>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat / Tgl Lahir</label>
                  <p className="text-sm font-semibold mt-1">{result.TMPT_LHR || '-'}, {result.TGL_LHR || '-'}</p>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kelamin</label>
                  <p className="text-sm font-semibold mt-1">{result.JENIS_KLMIN || '-'}</p>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
                  <p className="text-sm font-semibold mt-1">{result.AGAMA || '-'}</p>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Status Perkawinan</label>
                  <p className="text-sm font-semibold mt-1">{result.STATUS_KAWIN || '-'}</p>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
                  <p className="text-sm font-semibold mt-1">{result.JENIS_PKRJN || '-'}</p>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Pendidikan Terakhir</label>
                  <p className="text-sm font-semibold mt-1">{result.PDDK_AKH || '-'}</p>
                </div>
                
                <div className="col-span-1 sm:col-span-2 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Alamat Domisili</label>
                  <p className="text-sm font-semibold leading-relaxed">
                    {result.ALAMAT} {result.NO_RT && `RT ${result.NO_RT}`}{result.NO_RW && `/RW ${result.NO_RW}`}<br/>
                    {result.KEL_NAME}, {result.KEC_NAME}<br/>
                    {result.KAB_NAME}, {result.PROP_NAME} {result.KODE_POS}
                  </p>
                </div>
                
                <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Data Ayah</label>
                    <div className="p-2 bg-slate-50 rounded-lg text-xs">
                      <span className="text-slate-500">NIK:</span> {result.NIK_AYAH || '-'}<br/>
                      <span className="text-slate-500">Nama:</span> <span className="font-bold">{result.NAMA_LGKP_AYAH || '-'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Data Ibu</label>
                    <div className="p-2 bg-slate-50 rounded-lg text-xs">
                      <span className="text-slate-500">NIK:</span> {result.NIK_IBU || '-'}<br/>
                      <span className="text-slate-500">Nama:</span> <span className="font-bold">{result.NAMA_LGKP_IBU || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </PasswordGate>
  );
}
