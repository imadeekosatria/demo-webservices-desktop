import { MouseEvent, useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { isDesktopApp } from '../services/apiClient';

interface AboutDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEVELOPER_INFO = {
  name: 'I Made Eko Satria W',
  handle: 'imadeekosatria',
  photoUrl: '/assets/aistudio/IMG_3058_Original_fecaa48c.jpg',
  directorate: 'Direktorat Integrasi Data Kependudukan Daerah',
  directorateGeneral: 'Direktorat Jenderal Kependudukan dan Pencatatan Sipil',
  ministry: 'Kementerian Dalam Negeri',
  instagramHandle: 'imadeekosatria',
  instagramUrl: 'https://instagram.com/imadeekosatria',
  whatsappDisplay: '081803634659',
  whatsappUrl: 'https://wa.me/6281803634659',
};

export function AboutDeveloperModal({ isOpen, onClose }: AboutDeveloperModalProps) {
  const [copiedField, setCopiedField] = useState<'ig' | 'wa' | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (value: string, field: 'ig' | 'wa') => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleOpenExternalUrl = async (e: MouseEvent<HTMLAnchorElement>, url: string) => {
    if (!isDesktopApp()) return;
    e.preventDefault();
    try {
      const { openUrl } = await import('@tauri-apps/plugin-opener');
      await openUrl(url);
    } catch (err) {
      console.error('Gagal membuka tautan eksternal:', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-developer-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div>
            <h3 id="about-developer-title" className="text-sm font-bold leading-tight">
              Tentang Pengembang
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Profil pembuat &amp; kontak pengelola aplikasi
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Tutup profil pengembang"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Summary */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
              <img
                src={DEVELOPER_INFO.photoUrl}
                alt={DEVELOPER_INFO.name}
                className="w-full h-full object-cover object-[42%_22%]"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">
                {DEVELOPER_INFO.name}
              </h4>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                @{DEVELOPER_INFO.handle}
              </p>
            </div>
          </div>

          {/* Instansi / Unit Kerja */}
          <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0 mt-0.5">
              <img
                src="/logokemendagri.png"
                alt="Logo Kemendagri"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-xs leading-relaxed">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Unit Kerja / Instansi
              </span>
              <p className="font-semibold text-slate-800">{DEVELOPER_INFO.directorate}</p>
              <p className="text-slate-600 mt-0.5">{DEVELOPER_INFO.directorateGeneral}</p>
              <p className="text-slate-500 mt-0.5">{DEVELOPER_INFO.ministry}</p>
            </div>
          </div>

          {/* Kontak Langsung */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Kontak &amp; Media Sosial
            </span>

            {/* Instagram */}
            <div className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faInstagram} className="text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Instagram</span>
                  <span className="text-xs font-semibold text-slate-800 truncate block">
                    @{DEVELOPER_INFO.instagramHandle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(DEVELOPER_INFO.instagramUrl, 'ig')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
                  title="Salin tautan Instagram"
                >
                  {copiedField === 'ig' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
                <a
                  href={DEVELOPER_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenExternalUrl(e, DEVELOPER_INFO.instagramUrl)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <span>Buka</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">WhatsApp</span>
                  <span className="text-xs font-semibold font-mono tabular-nums text-slate-800 block">
                    {DEVELOPER_INFO.whatsappDisplay}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(DEVELOPER_INFO.whatsappUrl, 'wa')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
                  title="Salin tautan WhatsApp"
                >
                  {copiedField === 'wa' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
                <a
                  href={DEVELOPER_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenExternalUrl(e, DEVELOPER_INFO.whatsappUrl)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                >
                  <span>Chat WA</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
