export interface ChangelogSection {
  category: 'Ditambahkan' | 'Diperbarui' | 'Diperbaiki';
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  summary: string;
  sections: ChangelogSection[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: '1.0.4',
    date: '13 Nov 2026',
    summary: 'Peningkatan hak akses Windows Administrator untuk OTA update serta pop-up changelog otomatis.',
    sections: [
      {
        category: 'Ditambahkan',
        items: [
          'Pop-up changelog otomatis ("Apa yang Baru") yang muncul satu kali setelah aplikasi berhasil diperbarui.',
          'Riwayat versi di menu Info Sistem & Pembaruan agar catatan rilis dapat dibuka kembali kapan saja.',
          'Sertakan changelog otomatis di setiap push rilis GitHub Actions dan manifest OTA (latest.json).',
        ],
      },
      {
        category: 'Diperbaiki',
        items: [
          'Menambahkan manifest Administrator Windows (requireAdministrator) agar penulisan ulang file pembaruan di folder instalasi berjalan lancar.',
          'Mengonfigurasi mode instalasi perMachine (NSIS) dan passive updater untuk Windows.',
          'Menambahkan pesan panduan berbahasa Indonesia jika terjadi kendala izin folder Windows.',
        ],
      },
    ],
  },
  {
    version: '1.0.3',
    date: '13 Nov 2026',
    summary: 'Sinkronisasi versi rilis untuk pengujian pembaruan OTA.',
    sections: [
      {
        category: 'Diperbarui',
        items: [
          'Pembaruan versi seragam ke v1.0.3 di konfigurasi aplikasi desktop dan frontend.',
        ],
      },
    ],
  },
  {
    version: '1.0.2',
    date: '13 Nov 2026',
    summary: 'Pembaruan Over-The-Air (OTA) penuh langsung di dalam aplikasi desktop.',
    sections: [
      {
        category: 'Ditambahkan',
        items: [
          'Unduh, pasang, dan restart aplikasi langsung dari dalam aplikasi via Tauri Updater & Process plugin.',
          'Pop-up notifikasi pembaruan dengan progress bar unduhan real-time.',
          'Pengecekan pembaruan otomatis secara senyap saat aplikasi desktop dibuka.',
        ],
      },
    ],
  },
  {
    version: '1.0.1',
    date: '12 Nov 2026',
    summary: 'Penyederhanaan beranda, datepicker tanggal lahir, dan konfigurasi awal OTA.',
    sections: [
      {
        category: 'Ditambahkan',
        items: [
          'Konfigurasi endpoint GitHub Releases OTA updater dan identitas publisher imadeekosatria.',
          'Pop-up Info Sistem & Pembaruan yang menggabungkan info teknis serta akses fitur internal.',
          'Datepicker tanggal lahir dengan konversi otomatis ke format API DD-MM-YYYY.',
        ],
      },
    ],
  },
];

export function getChangelogByVersion(version: string): ChangelogEntry | undefined {
  const normalized = version.replace(/^v/i, '').trim();
  return CHANGELOG_ENTRIES.find((entry) => entry.version === normalized);
}

/**
 * Mengurai teks release notes mentah dari GitHub Releases (latest.json) menjadi daftar poin bersih
 */
export function parseRemoteReleaseNotes(rawNotes?: string): string[] {
  if (!rawNotes) return [];
  const trimmed = rawNotes.trim();
  if (!trimmed || trimmed === 'See the assets to download this version and install.') {
    return [];
  }

  return trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('### '))
    .map((line) => line.replace(/^[-*•]\s+/, '').trim())
    .filter(Boolean);
}
