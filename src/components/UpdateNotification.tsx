import { DownloadCloud, RefreshCw, CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';
import { useUpdater } from '../context/UpdaterContext';
import { formatBytes } from '../services/updaterService';
import { parseRemoteReleaseNotes } from '../data/changelog';

export function UpdateNotification() {
  const {
    status,
    currentVersion,
    latestVersion,
    notes,
    downloadedBytes,
    totalBytes,
    progress,
    error,
    isBannerDismissed,
    installUpdate,
    relaunchApp,
    dismissBanner,
  } = useUpdater();

  if (isBannerDismissed) return null;

  const showBanner =
    status === 'available' ||
    status === 'downloading' ||
    status === 'installing' ||
    status === 'ready' ||
    (status === 'error' && Boolean(latestVersion));

  if (!showBanner) return null;

  const isBusy = status === 'downloading' || status === 'installing';
  const previewLines = parseRemoteReleaseNotes(notes).slice(0, 2);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-40 w-[calc(100%-2.5rem)] max-w-sm bg-white rounded-xl border border-slate-200 shadow-lg p-4 text-slate-900 transition-opacity duration-200"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            status === 'ready'
              ? 'bg-emerald-50 text-emerald-600'
              : status === 'error'
              ? 'bg-red-50 text-red-600'
              : 'bg-blue-50 text-blue-600'
          }`}
        >
          {status === 'ready' ? (
            <CheckCircle2 size={18} />
          ) : status === 'error' ? (
            <AlertCircle size={18} />
          ) : isBusy ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <DownloadCloud size={18} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900 leading-snug">
              {status === 'ready'
                ? 'Pembaruan Siap Diterapkan'
                : status === 'installing'
                ? 'Memasang Pembaruan...'
                : status === 'downloading'
                ? 'Mengunduh Pembaruan...'
                : status === 'error'
                ? 'Pembaruan Gagal'
                : 'Pembaruan Tersedia'}
            </h4>
            {!isBusy && (
              <button
                type="button"
                onClick={dismissBanner}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors shrink-0"
                aria-label="Tutup notifikasi pembaruan"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
            v{currentVersion}
            {latestVersion && (
              <>
                <span aria-hidden="true"> · </span>
                <span>Tersedia v{latestVersion}</span>
              </>
            )}
          </p>

          {status === 'available' && previewLines.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-slate-600 leading-relaxed">
              {previewLines.map((line, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-slate-400 select-none">•</span>
                  <span className="line-clamp-2">{line}</span>
                </li>
              ))}
            </ul>
          )}

          {isBusy && (
            <div className="mt-3 space-y-1.5">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full w-full bg-blue-600 transition-transform duration-150 ease-out"
                  style={{
                    transform: `scaleX(${Math.max(0.04, progress / 100)})`,
                    transformOrigin: 'left',
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-500">
                <span>
                  {totalBytes > 0
                    ? `${formatBytes(downloadedBytes)} / ${formatBytes(totalBytes)}`
                    : status === 'installing'
                    ? 'Menyelesaikan instalasi...'
                    : 'Mengunduh paket...'}
                </span>
                <span className="font-semibold text-slate-700">{progress}%</span>
              </div>
            </div>
          )}

          {status === 'ready' && (
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Paket v{latestVersion} telah berhasil dipasang. Restart aplikasi untuk mulai menggunakan versi terbaru.
            </p>
          )}

          {status === 'error' && error && (
            <p className="text-xs text-red-600 mt-2 leading-relaxed">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 mt-3.5">
            {status === 'available' && (
              <>
                <button
                  type="button"
                  onClick={dismissBanner}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Nanti
                </button>
                <button
                  type="button"
                  onClick={installUpdate}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <DownloadCloud size={14} />
                  <span>Unduh &amp; Pasang</span>
                </button>
              </>
            )}

            {status === 'ready' && (
              <>
                <button
                  type="button"
                  onClick={dismissBanner}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Nanti
                </button>
                <button
                  type="button"
                  onClick={relaunchApp}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Restart Sekarang</span>
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <button
                  type="button"
                  onClick={dismissBanner}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={installUpdate}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Coba Lagi
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
