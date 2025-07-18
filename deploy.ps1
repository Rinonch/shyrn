# Shyrn Blog - GitHub Pages Deployment Script (PowerShell)
# Jalankan dengan: powershell -ExecutionPolicy Bypass -File deploy.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "    Shyrn Blog - GitHub Pages" -ForegroundColor Cyan
Write-Host "        Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git terdeteksi: $gitVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR: Git belum terinstall" -ForegroundColor Red
    Write-Host "Silakan install Git dari: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Menginisialisasi Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Repository berhasil diinisialisasi" -ForegroundColor Green
}
else {
    Write-Host "✓ Git repository sudah ada" -ForegroundColor Green
}

Write-Host ""
Write-Host "Masukkan URL repository GitHub Anda:" -ForegroundColor Cyan
Write-Host "Contoh: https://github.com/username/shyrn-blog.git" -ForegroundColor Gray

do {
    $repoUrl = Read-Host "URL Repository"
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ URL Repository wajib diisi!" -ForegroundColor Red
    }
} while ([string]::IsNullOrWhiteSpace($repoUrl))

Write-Host ""
Write-Host "Menambahkan file ke git..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Membuat commit..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deploy Shyrn blog ke GitHub Pages - $timestamp"

Write-Host ""
Write-Host "Menambahkan remote repository..." -ForegroundColor Yellow
try {
    git remote remove origin 2>$null
}
catch {}
git remote add origin $repoUrl

Write-Host ""
Write-Host "Mengupload ke GitHub..." -ForegroundColor Yellow
git branch -M main

try {
    git push -u origin main
    
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "      Upload Berhasil! 🎉" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    
    # Extract username and repo name from URL
    if ($repoUrl -match "github\.com[:/]([^/]+)/([^/]+?)(?:\.git)?/?$") {
        $username = $matches[1]
        $repoName = $matches[2]
        
        Write-Host "Website Anda akan tersedia di:" -ForegroundColor Cyan
        Write-Host "https://$username.github.io/$repoName" -ForegroundColor Green
        Write-Host ""
    }
    
    Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
    Write-Host "1. Buka repository di GitHub" -ForegroundColor White
    Write-Host "2. Klik tab 'Settings'" -ForegroundColor White
    Write-Host "3. Scroll ke bagian 'Pages'" -ForegroundColor White
    Write-Host "4. Pilih 'Deploy from a branch'" -ForegroundColor White
    Write-Host "5. Pilih branch 'main' dan folder '/ (root)'" -ForegroundColor White
    Write-Host "6. Klik 'Save'" -ForegroundColor White
    Write-Host ""
    Write-Host "(Tunggu 5-10 menit untuk proses deployment)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Terima kasih telah menggunakan Shyrn Blog! ✨" -ForegroundColor Magenta
    
}
catch {
    Write-Host ""
    Write-Host "❌ ERROR: Gagal upload ke GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "Silakan periksa:" -ForegroundColor Yellow
    Write-Host "1. URL repository sudah benar" -ForegroundColor White
    Write-Host "2. Anda memiliki akses push ke repository" -ForegroundColor White
    Write-Host "3. Repository sudah dibuat di GitHub" -ForegroundColor White
    Write-Host "4. Kredensial GitHub sudah diatur" -ForegroundColor White
    Write-Host ""
}

Read-Host "Tekan Enter untuk keluar"
