# 🚀 CARA HOSTING KE GITHUB PAGES

## Metode Tercepat (3 langkah)

### 1. Buat Repository di GitHub

- Buka github.com → New repository
- Nama: `shyrn-blog` (atau bebas)
- Centang **Public**
- Jangan centang "Initialize with README"

### 2. Upload Website

**Pilihan mudah:** Jalankan `deploy.bat`

```
cd c:\laragon\www\blog
deploy.bat
```

**Atau manual:** Drag & drop semua file ke GitHub (kecuali .htaccess dan .vscode)

### 3. Aktifkan GitHub Pages

- Repository → Settings → Pages
- Source: "Deploy from a branch"
- Branch: "main", folder: "/ (root)"
- Save

**Website langsung online di:** `https://username.github.io/shyrn-blog`

## Yang Sudah Siap ✅

- Website responsive
- PWA (bisa diinstall)
- Dark theme
- Search blog
- Keamanan optimal
- Performa tinggi

## File Penting

- `deploy.bat` → Script upload otomatis
- `deploy.ps1` → Versi PowerShell
- `DEPLOYMENT.md` → Panduan lengkap
- `_config.yml` → Konfigurasi GitHub Pages

**Selamat! Website Anda siap go live! 🎉**
