export interface ChangelogSection {
  category: string;
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
    version: '1.0.7',
    date: '13 Nov 2026',
    summary: 'Perbaikan pembukaan tautan eksternal di desktop Tauri serta penyeragaman warna hijau pada changelog Info Sistem & Pembaruan.',
    sections: [
      {
        category: 'Diperbaiki',
        items: [
          'Menambahkan dukungan tauri-plugin-opener agar tombol Buka Instagram dan Chat WA di pop-up Tentang Pengembang langsung membuka browser default pada mode desktop.',
          'Menyeragamkan warna teks (tebal, kode, dan isi poin) pada kotak changelog pembaruan OTA di modal Info Sistem & Pembaruan menjadi hijau seluruhnya.',
        ],
      },
    ],
  },
  {
    version: '1.0.6',
    date: '13 Nov 2026',
    summary: 'Pop-up Tentang Pengembang, panduan instalasi README, perbaikan jarak tombol Beranda, serta penyempurnaan tampilan changelog.',
    sections: [
      {
        category: 'Ditambahkan',
        items: [
          'Pop-up khusus Tentang Pengembang (akses dari Beranda & sidebar) lengkap dengan foto profil, logo & unit kerja Kemendagri, serta kontak Instagram dan WhatsApp berikon Font Awesome.',
          'Panduan instalasi (Windows, macOS, Linux) dan cara pakai aplikasi di README.md.',
        ],
      },
      {
        category: 'Diperbaiki',
        items: [
          'Menambahkan jarak (gap & padding) antara teks Mulai Verifikasi dan ikon panah pada kartu modul utama di Beranda.',
          'Memastikan tampilan catatan perubahan di modal Info Sistem & Pembaruan serta pop-up OTA tampil terstruktur dan mudah dibaca.',
        ],
      },
    ],
  },
  {
    version: '1.0.5',
    date: '13 Nov 2026',
    summary: 'Perapihan tampilan catatan pembaruan (changelog) di Info Sistem & Pembaruan serta pop-up OTA.',
    sections: [
      {
        category: 'Diperbaiki',
        items: [
          'Merapikan format tampilan changelog pada modal Info Sistem & Pembaruan agar tampil sebagai daftar poin terstruktur tanpa simbol Markdown mentah.',
          'Menyesuaikan posisi layer notifikasi pop-up OTA agar tidak menutupi tombol Tutup ketika modal sedang terbuka.',
          'Membersihkan isi catatan rilis otomatis di GitHub Actions agar lebih ringkas dan mudah dibaca pengguna.',
        ],
      },
      {
        category: 'Ditambahkan',
        items: [
          'Pengujian menyeluruh alur OTA v1.0.4 ke v1.0.5 beserta pop-up changelog otomatis yang hanya muncul satu kali.',
        ],
      },
    ],
  },
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
  {
    version: '1.0.0',
    date: '11 Nov 2026',
    summary: 'Rilis perdana aplikasi desktop Tauri v2 untuk Sistem Verifikasi Kependudukan.',
    sections: [
      {
        category: 'Ditambahkan',
        items: [
          'Rilis perdana aplikasi desktop Tauri v2 untuk Sistem Verifikasi Kependudukan.',
          'Dukungan koneksi native HTTP (tauri-plugin-http) dengan bypass sertifikat SSL lokal server Dukcapil.',
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
 * Menghapus simbol formatting Markdown (**bold**, *italic*, `code`, ###) untuk ringkasan teks polos
 */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
}

/**
 * Mengurai teks release notes mentah dari GitHub Releases (latest.json)
 * menjadi daftar section terstruktur (menangani format multi-baris maupun yang tergabung satu baris).
 */
export function parseRemoteReleaseSections(rawNotes?: string): ChangelogSection[] {
  if (!rawNotes) return [];
  const trimmed = rawNotes.trim();
  if (!trimmed || trimmed === 'See the assets to download this version and install.') {
    return [];
  }

  // Normalisasi baris baru termasuk kasus di mana heading/bullet bergabung dalam satu baris
  const normalized = trimmed
    .replace(/\r\n/g, '\n')
    .replace(/\s+(#{2,3}\s+)/g, '\n$1')
    .replace(/(#{2,3}\s+[^\n-]+?)\s+(-\s+)/g, '$1\n$2')
    .replace(/\s+(-\s+(?:\*\*|[A-Z0-9`]))/g, '\n$1');

  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: ChangelogSection[] = [];
  let currentSection: ChangelogSection = { category: 'Pembaruan', items: [] };

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        category: stripInlineMarkdown(headingMatch[1]),
        items: [],
      };
      continue;
    }

    const cleanItem = line.replace(/^[-*•]\s+/, '').trim();
    if (cleanItem) {
      currentSection.items.push(cleanItem);
    }
  }

  if (currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  // Jika section non-commit sudah tersedia, sembunyikan section "Commit Terbaru" agar tetap rapi
  const nonCommitSections = sections.filter(
    (sec) => !sec.category.toLowerCase().includes('commit')
  );

  return nonCommitSections.length > 0 ? nonCommitSections : sections;
}

/**
 * Mengambil daftar baris ringkas tanpa simbol Markdown (untuk banner notifikasi kompak)
 */
export function parseRemoteReleaseNotes(rawNotes?: string): string[] {
  return parseRemoteReleaseSections(rawNotes).flatMap((sec) =>
    sec.items.map((item) => stripInlineMarkdown(item))
  );
}
