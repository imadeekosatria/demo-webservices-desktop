import { isDesktopApp } from './apiClient';

export interface UpdateInfo {
  available: boolean;
  currentVersion: string;
  latestVersion?: string;
  notes?: string;
  error?: string;
}

/**
 * Memeriksa pembaruan aplikasi OTA melalui endpoint GitHub Releases
 */
export async function checkAppUpdate(): Promise<UpdateInfo> {
  const currentVersion = '1.0.1';

  if (!isDesktopApp()) {
    return {
      available: false,
      currentVersion,
      notes: 'Pembaruan OTA otomatis aktif saat aplikasi dijalankan sebagai desktop app (Tauri).'
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
        notes: update.body || 'Pembaruan versi baru tersedia.'
      };
    }

    return {
      available: false,
      currentVersion,
      notes: 'Aplikasi sudah menggunakan versi terbaru (v' + currentVersion + ').'
    };
  } catch (err: any) {
    console.warn('Cek pembaruan gagal:', err);
    return {
      available: false,
      currentVersion,
      error: err.message || 'Gagal menghubungi server rilis pembaruan.'
    };
  }
}
