# Sistem Verifikasi Kependudukan — Desktop App

Aplikasi desktop untuk melakukan verifikasi data kependudukan melalui *web services* Kemendagri/Dukcapil secara cepat, aman, dan mendukung pembaruan aplikasi langsung dari dalam aplikasi.

- **Versi Saat Ini:** `1.0.9`
- **Publisher:** `imadeekosatria`

---

## ✨ Fitur Utama

- **Verifikasi by Elemen:** Pencocokan 16 digit NIK dengan elemen pembanding (nama lengkap, tempat/tanggal lahir dengan *datepicker* format otomatis `DD-MM-YYYY`, jenis kelamin, alamat hingga RT/RW) serta pengaturan ambang batas kemiripan (*threshold*).
- **Koneksi Terenkripsi Lokal:** Mendukung koneksi langsung ke endpoint server Dukcapil lokal termasuk sertifikat SSL *self-signed*.
- **Pembaruan Aplikasi Terintegrasi:** Pengecekan pembaruan, progres unduhan *real-time*, pemasangan, hingga pop-up ringkasan perubahan (*changelog*) setelah versi diperbarui.

---

## 📥 Panduan Instalasi

Unduh berkas *installer* terbaru dari halaman **[Releases](https://github.com/imadeekosatria/demo-webservices-desktop/releases/latest)** sesuai sistem operasi Anda:

### Windows (64-bit)
1. Unduh **`Verifikasi.Penduduk.Desktop_<versi>_x64-setup.exe`** *(disarankan)* atau **`Verifikasi.Penduduk.Desktop_<versi>_x64_en-US.msi`**.
2. Jalankan *installer*, setujui permintaan **Administrator (UAC)** jika muncul, lalu ikuti langkah hingga selesai.
3. Saat menjalankan aplikasi, Windows akan meminta izin **Administrator** agar aplikasi memiliki hak akses untuk memperbarui berkas di folder instalasi saat pembaruan versi berlangsung.
   > *Catatan: Jika muncul peringatan Windows SmartScreen pada rilis awal, klik **More info → Run anyway**.*

### macOS (Apple Silicon & Intel)
1. Unduh **`Verifikasi.Penduduk.Desktop_<versi>_aarch64.dmg`** (Apple Silicon M1/M2/M3/M4) atau **`Verifikasi.Penduduk.Desktop_<versi>_x64.dmg`** (Mac Intel).
2. Buka berkas `.dmg` dan seret ikon aplikasi ke folder **Applications**.

### Linux (Ubuntu / Debian / Fedora)
- **Debian / Ubuntu:** Unduh berkas `.deb`, lalu jalankan:
  ```bash
  sudo dpkg -i Verifikasi.Penduduk.Desktop_*_amd64.deb
  ```
- **Fedora / RHEL:** Unduh berkas `.rpm`, lalu jalankan:
  ```bash
  sudo rpm -i Verifikasi.Penduduk.Desktop-*.x86_64.rpm
  ```

---

## 📖 Cara Menggunakan Aplikasi

### 1. Konfigurasi Koneksi Server & API Dukcapil
Sebelum melakukan pengecekan data, pastikan kredensial dan alamat server sudah sesuai:
1. Klik tombol **Pengaturan API** di pojok kanan atas aplikasi.
2. Masukkan kredensial yang Anda miliki:
   - **User ID**
   - **Password**
   - **IP User** *(alamat IP client yang terdaftar di server Dukcapil)*
   - **Server Dukcapil URL** *(contoh: `https://<alamat-server-dukcapil>:<port-jika-ada>`)*
3. Klik **Simpan Konfigurasi**. Indikator status server di bilah atas akan berubah menjadi **Server Online** jika endpoint dapat dijangkau.

### 2. Verifikasi Data Penduduk (By Elemen)
1. Dari halaman **Beranda**, klik **Mulai Verifikasi** (atau pilih menu **Verifikasi Elemen** di sidebar kiri).
2. Isi **NIK** (16 digit) beserta elemen pembanding yang ingin diuji (Nama Lengkap, Tanggal Lahir menggunakan *datepicker*, Tempat Lahir, Jenis Kelamin, dan/atau Alamat).
3. Sesuaikan **Ambang Batas (Threshold)** jika diperlukan (default `80%`).
4. Klik tombol verifikasi untuk mengirim permintaan dan melihat hasil pencocokan tiap elemen secara *real-time*.

### 3. Memperbarui Aplikasi
1. Aplikasi otomatis memeriksa pembaruan versi terbaru saat dijalankan dengan koneksi internet aktif (atau cek manual lewat **Info Sistem & Pembaruan → Periksa Pembaruan**).
2. Jika tersedia versi baru, klik **Unduh & Pasang**, tunggu proses unduhan mencapai `100%`, lalu klik **Restart Sekarang**.
3. Setelah aplikasi terbuka pada versi terbaru, pop-up catatan perubahan (*changelog*) akan muncul satu kali secara otomatis.
