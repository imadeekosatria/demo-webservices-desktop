import { useState, FormEvent, ChangeEvent } from 'react';
import { useApiConfig } from '../context/ApiContext';
import { Search, Loader2, AlertCircle, ChevronDown, CheckCircle, XCircle, ChevronUp, Code2, X } from 'lucide-react';
import { dukcapilFetch } from '../services/apiClient';

export function ByElemen() {
  const { config } = useApiConfig();
  const [formData, setFormData] = useState({
    NIK: '',
    NO_KK: '',
    NAMA_LGKP: '',
    TMPT_LHR: '',
    JENIS_KLMIN: '',
    AGAMA: '',
    JENIS_PKRJN: '',
    ALAMAT: '',
    
    TGL_LHR: '',
    STAT_HBKEL: '',
    PDDK_AKH: '',
    STATUS_KAWIN: '',
    NO_PROP: '',
    PROP_NAME: '',
    NO_KAB: '',
    KAB_NAME: '',
    NO_KEC: '',
    KEC_NAME: '',
    NO_KEL: '',
    KEL_NAME: '',
    NO_RT: '',
    NO_RW: '',
    TRESHOLD: '80',
    transactionId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [requestPayload, setRequestPayload] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.NIK || formData.NIK.length !== 16) {
      setError('NIK harus berjumlah 16 digit');
      return;
    }

    if (!formData.TRESHOLD) {
      setError('Threshold wajib diisi');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRequestPayload(null);
    setRawResponse(null);

    try {
      // Remove empty strings from payload
      const payload: any = {
        USER_ID: (config.userId || '').trim(),
        PASSWORD: (config.password || '').trim(),
        IP_USER: (config.ipUser || '').trim(),
      };

      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim() !== '') {
          payload[key] = value.trim();
        }
      });

      if (payload.TRESHOLD) {
        payload.TRESHOLD = parseInt(payload.TRESHOLD, 10);
      }

      // Save sanitized payload for display
      const sanitizedPayload = { ...payload, PASSWORD: '••••••••' };
      setRequestPayload(sanitizedPayload);

      // Kirim request melalui apiClient (otomatis direct di Tauri desktop atau proxy di Web)
      const endpointUrl = '/dukcapil/get_json/DEMO/CALL_VERIFY_BY_ELEMEN';

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
        throw new Error(`Respon server bukan format JSON yang valid (Status: ${response.status}). Kemungkinan URL salah atau server mengembalikan halaman HTML. Pastikan Server URL di Pengaturan API sudah benar.`);
      }
      setRawResponse(data);
      
      if (data.content && data.content.length > 0) {
        const item = data.content[0];
        if (item.RESPONSE_CODE && item.RESPONSE_CODE !== '00') {
          setError(`Autentikasi Gagal: ${item.RESPONSE_DESC || item.RESPONSE || 'Login Gagal'} (Kode: ${item.RESPONSE_CODE}). Periksa User ID, Password, dan IP User di Pengaturan API.`);
          return;
        }
        setResult(item);
        setIsFormOpen(false);
      } else {
        setError('Data tidak ditemukan');
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
        setError('Gagal menghubungi server (Kemungkinan diblokir oleh kebijakan Mixed Content atau CORS dari browser karena Anda mengakses URL HTTP dari situs HTTPS). Menggunakan data simulasi untuk demo UI.');
        // Load mock data for preview purposes
        const mockResult = {
          "NO_KK": "Tidak Sesuai",
          "NAMA_LGKP": "Sesuai (94)",
          "TMPT_LHR": "Tidak Sesuai (0)",
          "TGL_LHR": "Tidak Sesuai",
          "PROP_NAME": "Tidak Sesuai",
          "KAB_NAME": "Tidak Sesuai",
          "KEC_NAME": "Tidak Sesuai",
          "KEL_NAME": "Tidak Sesuai",
          "NO_RT": "Tidak Sesuai",
          "NO_RW": "Tidak Sesuai",
          "ALAMAT": "Sesuai (80)",
          "AGAMA": "Sesuai",
          "STATUS_KAWIN": "Tidak Sesuai",
          "JENIS_PKRJN": "Tidak Sesuai",
          "JENIS_KLMIN": "Sesuai",
          "PDDK_AKH": "Tidak Sesuai",
          "STAT_HBKEL": "Tidak Sesuai",
          "NO_PROP": "Tidak Sesuai",
          "NO_KAB": "Tidak Sesuai",
          "NO_KEC": "Tidak Sesuai",
          "NO_KEL": "Tidak Sesuai",
          "NIK": "Sesuai"
        };
        setResult(mockResult);
        setRawResponse({ content: [mockResult] });
        setIsFormOpen(false);
      } else {
        setError(err.message || 'Terjadi kesalahan saat memproses permintaan');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderResultItem = (label: string, value: string | undefined, inputValue: string | undefined) => {
    if (!value || !inputValue || inputValue.trim() === '') return null;
    
    let score = 0;
    const match = value.match(/\((\d+)\)/);
    const isSesuai = value.toLowerCase().startsWith('sesuai');
    
    if (match) {
      score = parseInt(match[1], 10);
    } else {
      if (isSesuai) {
        score = 100;
      } else {
        score = 0;
      }
    }

    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    let colorClass = "text-red-500";
    let bgColorClass = "text-red-100";
    if (score >= 80 || (isSesuai && score > 0)) {
      colorClass = "text-green-500";
      bgColorClass = "text-green-100";
    } else if (score > 0) {
      colorClass = "text-amber-500";
      bgColorClass = "text-amber-100";
    } else if (isSesuai) {
      colorClass = "text-green-500";
      bgColorClass = "text-green-100";
    }

    return (
      <div key={label} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
        <div className="flex flex-col gap-1.5 flex-1 pr-3">
          <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md w-max ${isSesuai ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isSesuai ? 'SESUAI' : 'TIDAK SESUAI'}
          </span>
        </div>
        <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className={bgColorClass}
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-700">{score}%</span>
          </div>
        </div>
      </div>
    );
  };

  return ( <>
    
      <div className="flex flex-col h-full gap-6">
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm shrink-0 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Input Parameter Verifikasi by Elemen</h2>
            {result && (
              <button 
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="lg:hidden text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 bg-blue-50 px-2 py-1.5 rounded-md transition-colors"
              >
                {isFormOpen ? 'SEMBUNYIKAN FORM' : 'TAMPILKAN FORM'}
                <ChevronDown className={`w-4 h-4 transition-transform ${isFormOpen ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          <form onSubmit={handleSearch} className={`${isFormOpen ? 'flex' : 'hidden lg:flex'} flex-col gap-6`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5 lg:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">NIK (Wajib)</label>
                <input
                  type="text"
                  name="NIK"
                  value={formData.NIK}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  placeholder="16 DIGIT NIK"
                  maxLength={16}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 lg:col-span-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Threshold (%) (Wajib)</label>
                <input
                  type="number"
                  name="TRESHOLD"
                  value={formData.TRESHOLD}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  placeholder="Contoh: 80"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 lg:col-span-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">No. KK</label>
                <input
                  type="text"
                  name="NO_KK"
                  value={formData.NO_KK}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  placeholder="16 DIGIT NO. KK"
                  maxLength={16}
                />
              </div>

              <div className="flex flex-col gap-1.5 lg:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Nama Lengkap</label>
                <input
                  type="text"
                  name="NAMA_LGKP"
                  value={formData.NAMA_LGKP}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  placeholder="NAMA LENGKAP"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Tempat Lahir</label>
                <input
                  type="text"
                  name="TMPT_LHR"
                  value={formData.TMPT_LHR}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  placeholder="TEMPAT LAHIR"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Jenis Kelamin</label>
                <select
                  name="JENIS_KLMIN"
                  value={formData.JENIS_KLMIN}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white uppercase"
                >
                  <option value="">-- PILIH --</option>
                  <option value="LAKI-LAKI">LAKI-LAKI</option>
                  <option value="PEREMPUAN">PEREMPUAN</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 lg:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Agama</label>
                <select
                  name="AGAMA"
                  value={formData.AGAMA}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white uppercase"
                >
                  <option value="">-- PILIH --</option>
                  <option value="ISLAM">ISLAM</option>
                  <option value="KRISTEN">KRISTEN</option>
                  <option value="KATHOLIK">KATHOLIK</option>
                  <option value="HINDU">HINDU</option>
                  <option value="BUDHA">BUDHA</option>
                  <option value="KONGHUCU">KONGHUCU</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 lg:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Jenis Pekerjaan</label>
                <input
                  type="text"
                  name="JENIS_PKRJN"
                  value={formData.JENIS_PKRJN}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  placeholder="PEKERJAAN (CONTOH: PNS)"
                />
              </div>

              <div className="flex flex-col gap-1.5 lg:col-span-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Alamat Lengkap</label>
                <input
                  type="text"
                  name="ALAMAT"
                  value={formData.ALAMAT}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  placeholder="ALAMAT JALAN / DESA"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors uppercase tracking-wider"
              >
                {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isAdvancedOpen ? 'Tutup Elemen Lainnya' : 'Tampilkan Elemen Lainnya (Tgl Lahir, Status, Propinsi, dll)'}
              </button>
              
              {isAdvancedOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Tgl Lahir</label>
                    <input type="text" name="TGL_LHR" value={formData.TGL_LHR} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase" placeholder="DD-MM-YYYY" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Status Hub Keluarga</label>
                    <input type="text" name="STAT_HBKEL" value={formData.STAT_HBKEL} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase" placeholder="CONTOH: ANAK" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Pendidikan Terakhir</label>
                    <input type="text" name="PDDK_AKH" value={formData.PDDK_AKH} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase" placeholder="STRATA I" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Status Kawin</label>
                    <input type="text" name="STATUS_KAWIN" value={formData.STATUS_KAWIN} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase" placeholder="KAWIN" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">No. Propinsi</label>
                    <input type="number" name="NO_PROP" value={formData.NO_PROP} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Nama Propinsi</label>
                    <input type="text" name="PROP_NAME" value={formData.PROP_NAME} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">No. Kab/Kota</label>
                    <input type="number" name="NO_KAB" value={formData.NO_KAB} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Nama Kab/Kota</label>
                    <input type="text" name="KAB_NAME" value={formData.KAB_NAME} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">No. Kecamatan</label>
                    <input type="number" name="NO_KEC" value={formData.NO_KEC} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Nama Kecamatan</label>
                    <input type="text" name="KEC_NAME" value={formData.KEC_NAME} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">No. Kelurahan</label>
                    <input type="number" name="NO_KEL" value={formData.NO_KEL} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Nama Kelurahan</label>
                    <input type="text" name="KEL_NAME" value={formData.KEL_NAME} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">RT</label>
                    <input type="number" name="NO_RT" value={formData.NO_RT} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" placeholder="001" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">RW</label>
                    <input type="number" name="NO_RW" value={formData.NO_RW} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" placeholder="001" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Transaction ID</label>
                    <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading || !formData.NIK || formData.NIK.length !== 16 || !formData.TRESHOLD}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg text-sm shadow-lg shadow-blue-200 transition-all disabled:bg-blue-400 disabled:shadow-none flex items-center justify-center gap-2 h-[42px]"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <>
                    <Search size={18} />
                    Verifikasi Elemen
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg flex items-start gap-3 border border-amber-100 text-sm">
              <AlertCircle className="shrink-0 mt-0.5 w-5 h-5" />
              <p className="mt-0.5">{error}</p>
            </div>
          )}
        </section>

        {result && (
          <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-4 mb-2 flex justify-between items-center">
              Hasil Verifikasi
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 pb-4 pt-2">
              {renderResultItem('NIK', result.NIK, requestPayload?.NIK)}
              {renderResultItem('No. Kartu Keluarga', result.NO_KK, requestPayload?.NO_KK)}
              {renderResultItem('Nama Lengkap', result.NAMA_LGKP, requestPayload?.NAMA_LGKP)}
              {renderResultItem('Tempat Lahir', result.TMPT_LHR, requestPayload?.TMPT_LHR)}
              {renderResultItem('Tanggal Lahir', result.TGL_LHR, requestPayload?.TGL_LHR)}
              {renderResultItem('Jenis Kelamin', result.JENIS_KLMIN, requestPayload?.JENIS_KLMIN)}
              {renderResultItem('Agama', result.AGAMA, requestPayload?.AGAMA)}
              {renderResultItem('Status Kawin', result.STATUS_KAWIN, requestPayload?.STATUS_KAWIN)}
              {renderResultItem('Pendidikan Akhir', result.PDDK_AKH, requestPayload?.PDDK_AKH)}
              {renderResultItem('Jenis Pekerjaan', result.JENIS_PKRJN, requestPayload?.JENIS_PKRJN)}
              {renderResultItem('Status Hubungan Keluarga', result.STAT_HBKEL, requestPayload?.STAT_HBKEL)}
              {renderResultItem('Alamat', result.ALAMAT, requestPayload?.ALAMAT)}
              {renderResultItem('RT', result.NO_RT, requestPayload?.NO_RT)}
              {renderResultItem('RW', result.NO_RW, requestPayload?.NO_RW)}
              {renderResultItem('No. Kelurahan', result.NO_KEL, requestPayload?.NO_KEL)}
              {renderResultItem('Nama Kelurahan', result.KEL_NAME, requestPayload?.KEL_NAME)}
              {renderResultItem('No. Kecamatan', result.NO_KEC, requestPayload?.NO_KEC)}
              {renderResultItem('Nama Kecamatan', result.KEC_NAME, requestPayload?.KEC_NAME)}
              {renderResultItem('No. Kab/Kota', result.NO_KAB, requestPayload?.NO_KAB)}
              {renderResultItem('Nama Kab/Kota', result.KAB_NAME, requestPayload?.KAB_NAME)}
              {renderResultItem('No. Propinsi', result.NO_PROP, requestPayload?.NO_PROP)}
              {renderResultItem('Nama Propinsi', result.PROP_NAME, requestPayload?.PROP_NAME)}
            </div>
          </section>
        )}
      </div>
      
      {result && requestPayload && rawResponse && (
        <button
          onClick={() => setIsJsonModalOpen(true)}
          className="fixed bottom-6 right-6 bg-slate-800 text-white p-3 rounded-full shadow-xl hover:bg-slate-700 transition-colors z-40 flex items-center justify-center group"
          title="Lihat JSON Req & Res"
        >
          <Code2 size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2 text-sm font-semibold">
            Lihat JSON
          </span>
        </button>
      )}

      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Code2 className="text-blue-600" size={20} />
                JSON Request & Response
              </h2>
              <button 
                onClick={() => setIsJsonModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden bg-slate-100 p-4 gap-4">
              <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-slate-200">REQUEST PAYLOAD</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">POST</span>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-[#1e1e1e]">
                  <pre className="text-sm font-mono text-green-400">
                    {JSON.stringify(requestPayload, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-slate-200">RESPONSE</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">200 OK</span>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-[#1e1e1e]">
                  <pre className="text-sm font-mono text-sky-400">
                    {JSON.stringify(rawResponse, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
