import { useEffect, useState } from 'react';
import { CheckCircle2, History, Sparkles, X } from 'lucide-react';
import { useUpdater } from '../context/UpdaterContext';
import {
  CHANGELOG_ENTRIES,
  getChangelogByVersion,
  parseRemoteReleaseSections,
} from '../data/changelog';
import { ReleaseNotesView } from './ReleaseNotesView';

export function ChangelogModal() {
  const {
    showChangelogModal,
    changelogVersion,
    changelogNotes,
    isAutoChangelog,
    closeChangelog,
  } = useUpdater();

  const [showAllVersions, setShowAllVersions] = useState(false);

  useEffect(() => {
    if (!showChangelogModal) {
      setShowAllVersions(false);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChangelog();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showChangelogModal, closeChangelog]);

  if (!showChangelogModal) return null;

  const entry = getChangelogByVersion(changelogVersion);
  const remoteSections = parseRemoteReleaseSections(changelogNotes);
  const olderEntries = CHANGELOG_ENTRIES.filter(
    (item) => item.version !== changelogVersion.replace(/^v/i, '')
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-300 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 id="changelog-modal-title" className="text-sm font-bold leading-snug">
                {isAutoChangelog
                  ? 'Aplikasi Berhasil Diperbarui'
                  : 'Catatan Perubahan (Changelog)'}
              </h3>
              <p className="text-xs text-slate-400 font-mono tabular-nums mt-0.5">
                v{changelogVersion}
                {entry?.date ? ` · ${entry.date}` : ''}
                {isAutoChangelog ? ' · Ditampilkan sekali' : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeChangelog}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            aria-label="Tutup changelog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-5 text-sm text-slate-700">
          {entry ? (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs leading-relaxed">
                {entry.summary}
              </p>

              {entry.sections.map((section) => (
                <div key={section.category} className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {section.category}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : remoteSections.length > 0 ? (
            <ReleaseNotesView notes={changelogNotes} tone="slate" />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">
              Aplikasi telah diperbarui ke versi <span className="font-mono font-semibold">v{changelogVersion}</span> dengan peningkatan stabilitas dan keamanan sistem.
            </p>
          )}

          {/* Optional History */}
          {olderEntries.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAllVersions((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <History size={13} />
                <span>
                  {showAllVersions ? 'Sembunyikan Versi Sebelumnya' : 'Lihat Riwayat Versi Sebelumnya'}
                </span>
              </button>

              {showAllVersions && (
                <div className="mt-3 space-y-4">
                  {olderEntries.map((old) => (
                    <div key={old.version} className="pt-3 border-t border-slate-100 first:border-t-0 first:pt-0 space-y-1.5">
                      <p className="text-xs font-semibold text-slate-800 font-mono tabular-nums">
                        v{old.version} <span className="text-slate-400 font-sans font-normal">· {old.date}</span>
                      </p>
                      <ul className="space-y-1">
                        {old.sections.flatMap((s) => s.items).map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                            <span className="text-slate-400 select-none">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={closeChangelog}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Mengerti &amp; Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
