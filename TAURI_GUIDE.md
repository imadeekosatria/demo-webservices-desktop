# Panduan Aplikasi Desktop Tauri v2 (Sistem Verifikasi Penduduk)

Proyek ini telah dikonfigurasi menggunakan **Tauri Framework Versi Terbaru (Tauri 2.x)** yang menggabungkan frontend React + Vite + Tailwind CSS dengan backend Rust yang ringan dan aman.

---

## 🚀 Keunggulan Menggunakan Tauri v2

1. **Ringan & Cepat**: Menggunakan WebView bawaan sistem operasi (WebView2 di Windows, WebKitGTK di Linux, WebKit di macOS), ukuran installer hanya ~5–15 MB (jauh lebih ringan dibanding Electron yang memakan >100 MB).
2. **Bypass CORS & Self-Signed SSL**: Memanfaatkan `@tauri-apps/plugin-http` untuk request langsung ke endpoint Dukcapil (`https://172.16.160.177:8000`) dari sisi native Rust tanpa terhalang pembatasan CORS browser.
3. **Fleksibel**: Dapat dijalankan di mode web (browser dengan Vite proxy) maupun mode desktop (Tauri native HTTP).

---

## 🛠️ Prasyarat (Requirements) di Komputer Lokal

Sebelum menjalankan atau meng-compile Tauri di komputer lokal:

### 1. Install Node.js
Pastikan Node.js (v18+) sudah terpasang.

### 2. Install Rust
Install Rust toolchain resmi:
- **Windows / macOS / Linux**: Kunjungi [https://rustup.rs](https://rustup.rs) atau jalankan di terminal:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

### 3. Dependencies Sistem Operasi
- **Windows**:
  - C++ Build Tools (melalui Visual Studio Build Tools / Visual Studio Community)
  - WebView2 (biasanya sudah ada di Windows 10 & 11)
- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt update
  sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libayatana-appindicator3-dev librsvg2-dev
  ```
- **macOS**:
  - Xcode Command Line Tools: `xcode-select --install`

---

## 💻 Menjalankan & Membangun Aplikasi

### 1. Mode Development Desktop
Jalankan dev server frontend bersamaan dengan jendela desktop Tauri:
```bash
bun tauri:dev
# atau jika menggunakan npm:
npm run tauri:dev
```
Perintah ini akan menjalankan dev server dan membuka window aplikasi desktop dengan fitur Hot-Reloading.

### 2. Membangun Installer Desktop (Production Build)
Untuk membuat file installer / executable:
```bash
bun tauri:build
# atau jika menggunakan npm:
npm run tauri:build
```
Hasil build installer akan berada di:
- **Windows**: `src-tauri/target/release/bundle/msi/` atau `nsis/` (`.exe` / `.msi`)
- **Linux**: `src-tauri/target/release/bundle/deb/` (`.deb`) atau `appimage/` (`.AppImage`)
- **macOS**: `src-tauri/target/release/bundle/dmg/` (`.dmg`) atau `macos/` (`.app`)

---

## 📁 Struktur Konfigurasi Tauri v2

- **`src-tauri/tauri.conf.json`**: Konfigurasi jendela aplikasi (versi `1.0.4`), identifier paket (`com.imadeekosatria.verifikasi.penduduk`), plugins (HTTP & Updater dengan `installMode: "passive"`), dan bundle (`nsis.installMode: "perMachine"`).
- **`src-tauri/Cargo.toml`**: Dependency Rust untuk Tauri v2 (`tauri`, `tauri-plugin-http`, `tauri-plugin-updater`, `tauri-plugin-process`, `serde`).
- **`src-tauri/build.rs`**: Menyematkan manifest Windows (`requireAdministrator`) agar aplikasi dan proses OTA update memiliki izin menulis ulang ke folder instalasi Windows (`Program Files`). *(Catatan: saat menjalankan `bun tauri:dev` di Windows, buka terminal sebagai Administrator).*
- **`src-tauri/capabilities/default.json`**: Sistem perizinan keamanan v2 (Capability) untuk mengizinkan request HTTP native, OTA updater (`updater:default`), dan restart proses (`process:default`, `process:allow-restart`).
- **`src-tauri/src/main.rs` & `src-tauri/src/lib.rs`**: Entry point aplikasi desktop Rust dengan plugin HTTP, Updater, dan Process diinisialisasi.
- **`src-tauri/icons/`**: Kumpulan icon aplikasi (32x32, 128x128, 256x256, 512x512, .ico, .icns).
- **`src/services/apiClient.ts`**: Client komunikasi hybrid (otomatis mendeteksi jika berjalan di runtime Tauri atau Web Browser).
- **`src/services/updaterService.ts`**: Modul pemeriksa, pengunduh, pemasang pembaruan OTA, dan relaunch aplikasi.
- **`src/context/UpdaterContext.tsx` & `src/components/UpdateNotification.tsx`**: State global OTA (auto-check saat startup) dan pop-up notifikasi progress unduhan langsung di dalam aplikasi.

---

## 🔄 Konfigurasi Update OTA (Over-The-Air) Otomatis

Aplikasi telah dikonfigurasi menggunakan plugin resmi **`tauri-plugin-updater` v2** dan **`tauri-plugin-process` v2**:

### 1. Menghasilkan Kunci Tanda Tangan (Signing Key)
Jalankan perintah ini sekali di terminal lokal untuk membuat pasangan kunci:
```bash
bun tauri signer generate -w ~/.tauri/verifikasi.key
```
Perintah ini akan mencetak:
- **Public Key**: Tempelkan ke dalam `src-tauri/tauri.conf.json` di bagian `"plugins" -> "updater" -> "pubkey"`.
- **Private Key**: Simpan di **GitHub Repository Secrets** dengan nama `TAURI_SIGNING_PRIVATE_KEY` (dan `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` jika menggunakan password).

### 2. Alur Kerja Rilis & Update Otomatis di Dalam Aplikasi
1. Update versi secara seragam di `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, dan `APP_FALLBACK_VERSION` di `src/services/updaterService.ts` (contoh: ke `1.0.4`).
2. Push ke branch `release` (atau jalankan manual melalui **Actions → publish → Run workflow**); GitHub Action akan meng-compile aplikasi, menandatangani installer, dan membuat Draft Release berisi `latest.json` beserta `.sig`. Setelah selesai, buka GitHub Releases dan klik **Publish release**.
3. Saat aplikasi desktop dibuka, aplikasi otomatis memeriksa rilis baru melalui endpoint:
   `https://github.com/imadeekosatria/demo-webservices-desktop/releases/latest/download/latest.json`
4. Jika ada versi baru, muncul notifikasi pop-up (atau lewat tombol **Periksa Pembaruan** di **Info Sistem & Pembaruan**). Pengguna dapat langsung menekan **Unduh & Pasang**, memantau progress unduhan, lalu menekan **Restart Sekarang** untuk menerapkan versi baru.
