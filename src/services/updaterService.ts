import type { Update, DownloadEvent } from '@tauri-apps/plugin-updater';
import { isDesktopApp } from './apiClient';
import { getChangelogByVersion } from '../data/changelog';

export const APP_FALLBACK_VERSION = '1.0.12';
const GITHUB_REPO = 'imadeekosatria/demo-webservices-desktop';
const DEFAULT_TAURI_BODY = 'See the assets to download this version and install.';

function isUsableReleaseNotes(text?: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed !== DEFAULT_TAURI_BODY;
}

async function fetchReleaseNotesFallback(version: string): Promise<string | undefined> {
  const cleanVer = version.replace(/^v/i, '').trim();
  const tagsToTry = [`app-v${cleanVer}`, `v${cleanVer}`];

  try {
    const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
    for (const tag of tagsToTry) {
      try {
        const res = await tauriFetch(
          `https://api.github.com/repos/${GITHUB_REPO}/releases/tags/${encodeURIComponent(tag)}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/vnd.github+json',
              'User-Agent': 'Verifikasi-Penduduk-Desktop',
            },
          }
        );
        if (res.ok) {
          const data = (await res.json()) as { body?: string };
          if (isUsableReleaseNotes(data?.body)) {
            return data.body!.trim();
          }
        }
      } catch {
        // Lanjut coba tag berikutnya
      }
    }
  } catch {
    // Abaikan jika plugin-http gagal diinisialisasi
  }

  const localEntry = getChangelogByVersion(cleanVer);
  if (localEntry && localEntry.sections.length > 0) {
    return localEntry.sections
      .map((sec) => `### ${sec.category}\n${sec.items.map((item) => `- ${item}`).join('\n')}`)
      .join('\n\n');
  }

  return undefined;
}

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
 * Mengambil versi aplikasi aktif dari runtime aplikasi desktop (atau fallback ke konstanta)
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
      notes: 'Pembaruan OTA otomatis aktif saat aplikasi dijalankan sebagai aplikasi desktop.',
    };
  }

  try {
    const { check } = await import('@tauri-apps/plugin-updater');
    const update = await check();

    if (update && update.available) {
      const resolvedNotes = isUsableReleaseNotes(update.body)
        ? update.body!.trim()
        : (await fetchReleaseNotesFallback(update.version)) ||
          'Pembaruan versi baru tersedia dan siap dipasang.';

      return {
        available: true,
        currentVersion,
        latestVersion: update.version,
        notes: resolvedNotes,
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
