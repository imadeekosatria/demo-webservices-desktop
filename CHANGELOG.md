# Changelog

Seluruh perubahan penting pada aplikasi **Verifikasi Penduduk Desktop** dicatat pada berkas ini mengikuti standar [Semantic Versioning](https://semver.org/).

## [1.0.6] - 2026-11-13
### Diperbaiki
- Menambahkan jarak (*gap* & *padding*) antara teks **Mulai Verifikasi** dan ikon panah pada kartu modul utama di halaman Beranda agar tidak terlihat rapat.
- Memastikan tampilan changelog pada modal **Info Sistem & Pembaruan** dan pop-up OTA tampil rapi dengan format daftar poin terstruktur.

## [1.0.5] - 2026-11-13
### Diperbaiki
- Merapikan format tampilan changelog pada modal **Info Sistem & Pembaruan** agar tampil terstruktur tanpa simbol Markdown mentah.
- Menyesuaikan layer pop-up notifikasi OTA agar tidak menutupi tombol kontrol modal yang sedang terbuka.
- Membersihkan isi catatan rilis otomatis agar lebih ringkas dan mudah dibaca pengguna.

### Ditambahkan
- Pengujian menyeluruh pembaruan OTA dari versi `1.0.4` ke `1.0.5` beserta pop-up changelog otomatis satu kali.

## [1.0.4] - 2026-11-13
### Ditambahkan
- Pop-up **Changelog ("Apa yang Baru")** otomatis yang muncul **hanya satu kali** setelah aplikasi diperbarui ke versi baru.
- Tombol **Riwayat Versi / Changelog** di dalam modal *Info Sistem & Pembaruan* untuk meninjau catatan pembaruan kapan saja.
- Ekstraksi changelog otomatis pada GitHub Actions sehingga setiap rilis dan `latest.json` (OTA) selalu menyertakan catatan perubahan.

### Diperbaiki
- Menambahkan manifest **Administrator (UAC)** Windows (`requireAdministrator`) pada `src-tauri/build.rs` agar proses OTA update dapat menulis ulang folder instalasi Windows (`Program Files`) tanpa error izin.
- Mengonfigurasi `plugins.updater.windows.installMode: "passive"` dan `bundle.windows.nsis.installMode: "perMachine"` di `tauri.conf.json`.
- Menambahkan pesan panduan berbahasa Indonesia jika terjadi penolakan akses folder Windows saat pembaruan OTA.

## [1.0.3] - 2026-11-13
### Diperbarui
- Peningkatan versi sinkron ke `1.0.3` pada seluruh konfigurasi proyek dan manifest Tauri untuk pengujian alur rilis OTA.

## [1.0.2] - 2026-11-13
### Ditambahkan
- Pembaruan **Over-The-Air (OTA) langsung di dalam aplikasi** menggunakan `tauri-plugin-updater` dan `tauri-plugin-process`.
- Notifikasi pop-up `UpdateNotification` dengan progress bar unduhan *real-time*, ukuran byte, dan tombol **Restart Sekarang** / **Nanti**.
- Pengecekan pembaruan otomatis secara senyap saat aplikasi desktop dibuka.

## [1.0.1] - 2026-11-12
### Ditambahkan
- Konfigurasi awal OTA updater Tauri v2 dan pengaturan GitHub Releases sebagai endpoint.
- Pembaruan identitas publisher ke `imadeekosatria`.
- Penggabungan fitur internal (By NIK & By NIK KK) dan info teknis ke dalam modal **Info Sistem & Pembaruan**.
- Dukungan Datepicker pada form *Tanggal Lahir* di halaman Verifikasi Elemen (format otomatis `DD-MM-YYYY`).

## [1.0.0] - 2026-11-11
### Ditambahkan
- Rilis perdana aplikasi desktop Tauri v2 untuk Sistem Verifikasi Kependudukan.
- Dukungan koneksi native HTTP (`tauri-plugin-http`) dengan bypass sertifikat SSL lokal server Dukcapil.
