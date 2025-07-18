# 🚀 Panduan Hosting ke GitHub Pages

## Langkah-Langkah Mudah

### 1️⃣ Buat Repository GitHub

1. Buka [GitHub.com](https://github.com) dan login
2. Klik tombol "+" di pojok kanan atas → "New repository"
3. Beri nama repository (contoh: `shyrn-blog` atau `namaanda.github.io`)
4. Pastikan pilih **Public** (gratis untuk GitHub Pages)
5. **JANGAN** centang "Initialize with README" (kita sudah punya)
6. Klik "Create repository"

### 2️⃣ Upload Website

**Pilihan A: Menggunakan Script Otomatis (Mudah)**

1. Buka PowerShell atau Command Prompt
2. Masuk ke folder website: `cd c:\laragon\www\blog`
3. Jalankan script: `deploy.bat`
4. Ikuti instruksi yang muncul

**Pilihan B: Manual via Web**

1. Di halaman repository baru, klik "uploading an existing file"
2. Drag & drop semua file kecuali `.htaccess` dan folder `.vscode`
3. Tulis pesan commit: "Upload Shyrn blog website"
4. Klik "Commit changes"

### 3️⃣ Aktifkan GitHub Pages

1. Di repository GitHub, klik tab **"Settings"**
2. Scroll ke bagian **"Pages"** di menu kiri
3. Di "Source", pilih **"Deploy from a branch"**
4. Pilih branch **"main"** dan folder **"/ (root)"**
5. Klik **"Save"**

### 4️⃣ Akses Website Anda

- Website akan tersedia di: `https://USERNAME.github.io/NAMA-REPO`
- Proses deployment butuh 5-10 menit
- GitHub akan menampilkan centang hijau jika berhasil

### 5️⃣ Domain Kustom (Opsional)

Jika punya domain sendiri:

1. Di Settings → Pages, masukkan nama domain
2. Aktifkan "Enforce HTTPS"
3. Buat file `CNAME` berisi nama domain
4. Atur DNS domain ke GitHub Pages

## ⚠️ Penting untuk GitHub Pages

- ✅ HTTPS otomatis aktif
- ✅ CDN global tersedia
- ✅ Deployment otomatis saat ada perubahan
- ❌ File `.htaccess` tidak bekerja (GitHub pakai server sendiri)

## 🔄 Update Website

Untuk mengubah website:

1. Edit file di komputer atau langsung di GitHub
2. Commit dan push perubahan (jika pakai Git)
3. GitHub Pages akan otomatis rebuild dan deploy

## 🐛 Troubleshooting

### Website Tidak Muncul

- Tunggu 15 menit setelah aktifkan Pages
- Pastikan repository **Public**
- Cek file `index.html` ada di root folder

### Gambar Tidak Muncul

- Pastikan path gambar relatif (contoh: `images/foto.jpg`)
- Cek gambar sudah terupload ke repository

### Domain Kustom Bermasalah

- Cek pengaturan DNS di provider domain
- Tunggu 24-48 jam untuk propagasi DNS
- Pastikan file CNAME hanya berisi nama domain

## ✨ Fitur Sudah Optimal

Website Anda sudah dioptimalkan dengan:

- ✅ Gambar terkompresi
- ✅ CSS dan JavaScript diminifikasi
- ✅ Service Worker untuk caching
- ✅ Progressive Web App
- ✅ Responsive design
- ✅ SEO friendly

## 🔒 Keamanan Otomatis

GitHub Pages memberikan:

- ✅ Enkripsi HTTPS
- ✅ Perlindungan DDoS
- ✅ CDN global
- ✅ Update keamanan otomatis

Selamat! Website Anda siap go live! 🎉
