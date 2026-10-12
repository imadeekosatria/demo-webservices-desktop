import { useState, FormEvent } from 'react';
import { useApiConfig } from '../context/ApiContext';
import { Search, Loader2, AlertCircle, Users, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PasswordGate } from '../components/PasswordGate';
import { dukcapilFetch } from '../services/apiClient';

interface DukcapilData {
  NIK: string;
  NAMA_LGKP: string;
  TMPT_LHR: string;
  TGL_LHR: string;
  JENIS_KLMIN: string;
  STAT_HBKEL: string;
  STATUS_KAWIN: string;
  NAMA_LGKP_IBU: string;
  NAMA_LGKP_AYAH: string;
  KWRNGRN: string;
  NO_KK: string;
  NO_PROP: number;
  PROP_NAME: string;
  NO_KAB: number;
  KAB_NAME: string;
  NO_KEC: number;
  KEC_NAME: string;
  NO_KEL: number;
  KEL_NAME: string;
  ALAMAT: string;
  NO_RT: string;
  NO_RW: string;
  KODE_POS: number;
  NO_AKTA_LHR: string;
  TGL_KWN: string;
  NO_AKTA_KWN: string;
  TGL_CRAI: string;
  NIK_IBU: string;
  NIK_AYAH: string;
  GOL_DARAH: string;
  AGAMA: string;
  JENIS_PKRJN: string;
  PDDK_AKH: string;
  DUSUN: string;
  FOTO: string;
}

interface DukcapilResponse {
  content: DukcapilData[];
  lastPage: boolean;
  numberOfElements: number;
  sort: any;
  totalElements: number;
  firstPage: boolean;
  number: number;
  size: number;
}

export function ByNikKk() {
  const { config } = useApiConfig();
  const [nik, setNik] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DukcapilResponse | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!nik || nik.length !== 16) {
      setError('NIK harus berjumlah 16 digit');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setExpandedIndex(0);

    try {
      const payload = {
        USER_ID: config.userId,
        PASSWORD: config.password,
        IP_USER: config.ipUser,
        NIK: nik,
        transactionId: trxId
      };

      const endpointUrl = '/dukcapil/get_json/DEMO/CALL_NIK_GET_KK';
      
      const response = await dukcapilFetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }, config.serverUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
        throw new Error('Data KK tidak ditemukan atau format respon tidak sesuai.');
      }
      
      setResult(data);
      
      if (window.innerWidth < 1024) {
        setIsFormOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memanggil API. Pastikan konfigurasi dan koneksi benar.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <PasswordGate featureId="internal">
      <div className="flex flex-col h-full gap-6">
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm shrink-0 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Verifikasi Data by NIK Get KK</h2>
            {result && result.content && result.content.length > 0 && (
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
          <form onSubmit={handleSearch} className={`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isFormOpen ? 'grid' : 'hidden lg:grid'}`}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase truncate">NIK Subjek</label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none h-[38px]"
                placeholder="16 digit NIK"
                maxLength={16}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase truncate">User ID</label>
              <input
                type="text"
                value={config.userId}
                readOnly
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 h-[38px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase truncate" title="Transaction ID (Opsional)">Trx ID (Opsional)</label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="Kosongkan"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none h-[38px]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || nik.length !== 16}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg shadow-blue-200 transition-all disabled:bg-blue-400 disabled:shadow-none flex items-center justify-center h-[38px]"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Cari Kartu Keluarga'}
              </button>
            </div>
          </form>

          {error && (
            <div className={`mt-4 p-3 rounded-lg flex items-start gap-3 border text-sm ${result ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-red-50 text-red-700 border-red-100'}`}>
              <AlertCircle className="shrink-0 mt-0.5 w-5 h-5" />
              <div>
                <h4 className="font-bold">{result ? 'Peringatan Koneksi' : 'Pencarian Gagal'}</h4>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </section>

        {result && result.content && result.content.length > 0 && (
          <section className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-800 truncate">Kartu Keluarga: {result.content[0].NO_KK}</h2>
                  <p className="text-[11px] text-slate-500 font-medium truncate">Ditemukan {result.numberOfElements} anggota keluarga</p>
                </div>
              </div>
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <CheckCircle size={12} className="hidden sm:block" />
                Valid
              </span>
            </div>
            
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex flex-col gap-3 sm:gap-4">
              {result.content.map((member, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all shrink-0">
                  {/* Header / Summary Row */}
                  <div 
                    className={`px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between cursor-pointer transition-colors ${expandedIndex === index ? 'bg-blue-50/50 border-b border-slate-200' : 'bg-white hover:bg-slate-50'}`}
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${member.STAT_HBKEL === 'KEPALA KELUARGA' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm truncate">{member.NAMA_LGKP}</h3>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-[11px]">
                          <span className="font-mono text-slate-500">{member.NIK}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0"></span>
                          <span className={`font-semibold truncate ${member.STAT_HBKEL === 'KEPALA KELUARGA' ? 'text-blue-600' : 'text-slate-600'}`}>
                            {member.STAT_HBKEL}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-400 shrink-0 ml-2">
                      {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedIndex === index && (
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 sm:gap-6 bg-white animate-in slide-in-from-top-2 duration-200">
                      <div className="w-full md:w-32 flex flex-col gap-3 shrink-0 items-center md:items-stretch">
                        <div className="w-24 sm:w-32 aspect-[3/4] bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative shadow-inner">
                          {member.FOTO ? (
                            <img 
                              src={member.FOTO.startsWith('data:image') ? member.FOTO : `data:image/jpeg;base64,${member.FOTO}`} 
                              alt="Foto Penduduk" 
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-[10px] italic">FOTO KOSONG</div>
                          )}
                        </div>
                        <div className="text-center md:text-left hidden md:block">
                          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase w-full text-center">
                            {member.JENIS_KLMIN}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat / Tgl Lahir</label>
                          <p className="font-medium text-slate-800">{member.TMPT_LHR}, {member.TGL_LHR}</p>
                        </div>
                        <div className="md:hidden">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kelamin</label>
                          <p className="font-medium text-slate-800">{member.JENIS_KLMIN}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
                          <p className="font-medium text-slate-800">{member.AGAMA}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Status Kawin</label>
                          <p className="font-medium text-slate-800">{member.STATUS_KAWIN}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
                          <p className="font-medium text-slate-800">{member.JENIS_PKRJN}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Pendidikan</label>
                          <p className="font-medium text-slate-800">{member.PDDK_AKH}</p>
                        </div>
                        
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-2 pt-4 border-t border-slate-100">
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Alamat Terdaftar</label>
                          <p className="font-medium text-slate-800 text-sm leading-relaxed">
                            {member.ALAMAT} RT {member.NO_RT}/RW {member.NO_RW}<br/>
                            Kel. {member.KEL_NAME}, Kec. {member.KEC_NAME}, Kab. {member.KAB_NAME}, {member.PROP_NAME} {member.KODE_POS}
                          </p>
                        </div>

                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <label className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 block">Nama Ayah</label>
                            <p className="font-bold text-slate-700 text-xs">{member.NAMA_LGKP_AYAH || '-'}</p>
                            <p className="font-mono text-[10px] text-slate-500 mt-0.5">{member.NIK_AYAH || '-'}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <label className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 block">Nama Ibu</label>
                            <p className="font-bold text-slate-700 text-xs">{member.NAMA_LGKP_IBU || '-'}</p>
                            <p className="font-mono text-[10px] text-slate-500 mt-0.5">{member.NIK_IBU || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PasswordGate>
  );
}

