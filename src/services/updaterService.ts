import type { Update, DownloadEvent } from '@tauri-apps/plugin-updater';
import { isDesktopApp } from './apiClient';

export const APP_FALLBACK_VERSION = '1.0.7';

export interface UpdateCheckResult {
  available: boolean;
  currentVersion: string;
  latestVersion?: string;
  notes?: string;
  date?: string;
  updateInstance?: Update;
  error?: string;
}

/**
 * Mengambil versi aplikasi aktif dari runtime Tauri (atau fallback ke konstanta)
 */
export async function getActiveAppVersion(): Promise<string> {
  if (!isDesktopApp()) {
    return APP_FALLBACK_VERSION;
  }

  try {
    const { getVersion } = await import('@tauri-apps/api/app');
    return await getVersion();
  } catch {
    return APP_FALLBACK_VERSION;
  }
}

/**
 * Memeriksa pembaruan aplikasi OTA melalui endpoint GitHub Releases
 */
export async function checkForAppUpdate(): Promise<UpdateCheckResult> {
  const currentVersion = await getActiveAppVersion();

  if (!isDesktopApp()) {
    return {
      available: false,
      currentVersion,
      notes: 'Pembaruan OTA otomatis aktif saat aplikasi dijalankan sebagai desktop app (Tauri).',
    };
  }

  try {
    const { check } = await import('@tauri-apps/plugin-updater');
    const update = await check();

    if (update && update.available) {
      return {
        available: true,
        currentVersion,
        latestVersion: update.version,
        notes: update.body || 'Pembaruan versi baru tersedia dan siap dipasang.',
        date: update.date,
        updateInstance: update,
      };
    }

    return {
      available: false,
      currentVersion,
      notes: `Aplikasi sudah menggunakan versi terbaru (v${currentVersion}).`,
    };
  } catch (err: any) {
    console.warn('Cek pembaruan gagal:', err);
    return {
      available: false,
      currentVersion,
      error: err?.message || 'Gagal menghubungi server rilis pembaruan.',
    };
  }
}

/**
 * Mengunduh dan memasang pembaruan OTA langsung di dalam aplikasi
 */
export async function downloadAndInstallAppUpdate(
  update: Update,
  onProgress: (downloadedBytes: number, totalBytes: number, phase: 'downloading' | 'installing') => void
): Promise<void> {
  let downloaded = 0;
  let contentLength = 0;

  try {
    await update.downloadAndInstall((event: DownloadEvent) => {
      switch (event.event) {
        case 'Started':
          contentLength = event.data.contentLength ?? 0;
          downloaded = 0;
          onProgress(downloaded, contentLength, 'downloading');
          break;
        case 'Progress':
          downloaded += event.data.chunkLength;
          onProgress(downloaded, contentLength, 'downloading');
          break;
        case 'Finished':
          onProgress(contentLength || downloaded, contentLength || downloaded, 'installing');
          break;
      }
    });
  } catch (err: any) {
    const rawMsg = String(err?.message || err || '');
    const lower = rawMsg.toLowerCase();
    if (
      lower.includes('access is denied') ||
      lower.includes('permission denied') ||
      lower.includes('elevation') ||
      lower.includes('740') ||
      lower.includes('os error 5')
    ) {
      throw new Error(
        'Akses penulisan folder instalasi ditolak oleh Windows. Tutup aplikasi lalu jalankan kembali dengan klik kanan → "Run as administrator".'
      );
    }
    throw err;
  }
}

/**
 * Me-restart aplikasi desktop untuk menerapkan versi terbaru
 */
export async function relaunchDesktopApp(): Promise<void> {
  const { relaunch } = await import('@tauri-apps/plugin-process');
  await relaunch();
}

/**
 * Format ukuran byte agar mudah dibaca pengguna
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i >= 2 ? 1 : 0)} ${units[i]}`;
}
