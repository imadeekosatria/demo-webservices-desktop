import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import type { Update } from '@tauri-apps/plugin-updater';
import { isDesktopApp } from '../services/apiClient';
import {
  APP_FALLBACK_VERSION,
  getActiveAppVersion,
  checkForAppUpdate,
  downloadAndInstallAppUpdate,
  relaunchDesktopApp,
} from '../services/updaterService';

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'up-to-date'
  | 'available'
  | 'downloading'
  | 'installing'
  | 'ready'
  | 'error';

interface UpdaterContextValue {
  status: UpdateStatus;
  currentVersion: string;
  latestVersion?: string;
  notes?: string;
  downloadedBytes: number;
  totalBytes: number;
  progress: number;
  error?: string;
  isBannerDismissed: boolean;
  checkUpdate: (silent?: boolean) => Promise<void>;
  installUpdate: () => Promise<void>;
  relaunchApp: () => Promise<void>;
  dismissBanner: () => void;
}

const UpdaterContext = createContext<UpdaterContextValue | undefined>(undefined);

export function UpdaterProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [currentVersion, setCurrentVersion] = useState<string>(APP_FALLBACK_VERSION);
  const [latestVersion, setLatestVersion] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [downloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [totalBytes, setTotalBytes] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);

  const updateRef = useRef<Update | null>(null);
  const statusRef = useRef<UpdateStatus>(status);
  statusRef.current = status;

  useEffect(() => {
    let active = true;
    getActiveAppVersion().then((ver) => {
      if (active && ver) {
        setCurrentVersion(ver);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const checkUpdate = useCallback(async (silent: boolean = false) => {
    if (
      statusRef.current === 'checking' ||
      statusRef.current === 'downloading' ||
      statusRef.current === 'installing' ||
      statusRef.current === 'ready'
    ) {
      return;
    }

    if (!silent) {
      setStatus('checking');
      setError(undefined);
    }

    const res = await checkForAppUpdate();
    setCurrentVersion(res.currentVersion);

    if (res.available && res.updateInstance) {
      updateRef.current = res.updateInstance;
      setLatestVersion(res.latestVersion);
      setNotes(res.notes);
      setError(undefined);
      setIsBannerDismissed(false);
      setStatus('available');
      return;
    }

    if (res.error) {
      if (!silent) {
        setError(res.error);
        setStatus('error');
      } else {
        setStatus('idle');
      }
      return;
    }

    setNotes(res.notes);
    setError(undefined);
    setStatus('up-to-date');
  }, []);

  const installUpdate = useCallback(async () => {
    if (!updateRef.current) {
      setError('Data pembaruan tidak ditemukan. Silakan periksa pembaruan kembali.');
      setStatus('error');
      return;
    }

    setIsBannerDismissed(false);
    setError(undefined);
    setDownloadedBytes(0);
    setTotalBytes(0);
    setProgress(0);
    setStatus('downloading');

    try {
      await downloadAndInstallAppUpdate(updateRef.current, (downloaded, total, phase) => {
        setDownloadedBytes(downloaded);
        setTotalBytes(total);
        if (phase === 'installing') {
          setProgress(100);
          setStatus('installing');
        } else {
          setStatus('downloading');
          if (total > 0) {
            setProgress(Math.min(99, Math.round((downloaded / total) * 100)));
          }
        }
      });

      setProgress(100);
      setStatus('ready');
    } catch (err: any) {
      console.error('Gagal mengunduh/memasang pembaruan OTA:', err);
      setError(err?.message || 'Gagal mengunduh atau memasang paket pembaruan.');
      setStatus('error');
    }
  }, []);

  const relaunchApp = useCallback(async () => {
    try {
      await relaunchDesktopApp();
    } catch (err: any) {
      console.error('Gagal me-restart aplikasi:', err);
      setError(err?.message || 'Gagal me-restart aplikasi secara otomatis. Silakan tutup dan buka kembali aplikasi.');
      setStatus('error');
    }
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
  }, []);

  // Auto-check pembaruan secara senyap saat aplikasi desktop dibuka
  useEffect(() => {
    if (!isDesktopApp()) return;
    const timer = setTimeout(() => {
      checkUpdate(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [checkUpdate]);

  return (
    <UpdaterContext.Provider
      value={{
        status,
        currentVersion,
        latestVersion,
        notes,
        downloadedBytes,
        totalBytes,
        progress,
        error,
        isBannerDismissed,
        checkUpdate,
        installUpdate,
        relaunchApp,
        dismissBanner,
      }}
    >
      {children}
    </UpdaterContext.Provider>
  );
}

export function useUpdater() {
  const ctx = useContext(UpdaterContext);
  if (!ctx) {
    throw new Error('useUpdater must be used within an UpdaterProvider');
  }
  return ctx;
}
