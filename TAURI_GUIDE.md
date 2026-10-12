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
npm run tauri:dev
```
Perintah ini akan menjalankan Vite dev server dan membuka window aplikasi desktop dengan fitur Hot-Reloading.

### 2. Membangun Installer Desktop (Production Build)
Untuk membuat file installer / executable:
```bash
npm run tauri:build
```
Hasil build installer akan berada di:
- **Windows**: `src-tauri/target/release/bundle/msi/` atau `nsis/` (`.exe` / `.msi`)
- **Linux**: `src-tauri/target/release/bundle/deb/` (`.deb`) atau `appimage/` (`.AppImage`)
- **macOS**: `src-tauri/target/release/bundle/dmg/` (`.dmg`) atau `macos/` (`.app`)

---

## 📁 Struktur Konfigurasi Tauri v2

- **`src-tauri/tauri.conf.json`**: Konfigurasi jendela aplikasi, identifier paket (`com.kemendagri.verifikasi.penduduk`), plugins, dan bundle.
- **`src-tauri/Cargo.toml`**: Dependency Rust untuk Tauri v2 (`tauri`, `tauri-plugin-http`, `serde`).
- **`src-tauri/capabilities/default.json`**: Sistem perizinan keamanan v2 (Capability) untuk mengizinkan request HTTP native.
- **`src-tauri/src/main.rs` & `src-tauri/src/lib.rs`**: Entry point aplikasi desktop Rust dengan plugin HTTP diinisialisasi.
- **`src-tauri/icons/`**: Kumpulan icon aplikasi (32x32, 128x128, 256x256, 512x512, .ico, .icns).
- **`src/services/apiClient.ts`**: Client komunikasi hybrid (otomatis mendeteksi jika berjalan di runtime Tauri atau Web Browser).
