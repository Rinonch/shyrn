@echo off
chcp 65001 >nul
echo ================================
echo    Shyrn Blog - GitHub Pages
echo        Deployment Script
echo ================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git belum terinstall atau tidak ada di PATH
    echo Silakan install Git dari: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✓ Git terdeteksi
echo.

REM Check if we're in a git repository
if not exist .git (
    echo Menginisialisasi Git repository...
    git init
    echo ✓ Repository berhasil diinisialisasi
) else (
    echo ✓ Git repository sudah ada
)

echo.
echo Masukkan URL repository GitHub Anda:
echo Contoh: https://github.com/username/shyrn-blog.git
set /p REPO_URL="URL Repository: "

if "%REPO_URL%"=="" (
    echo ERROR: URL Repository wajib diisi
    pause
    exit /b 1
)

echo.
echo Menambahkan file ke git...
git add .

echo.
echo Membuat commit...
git commit -m "Deploy Shyrn blog ke GitHub Pages - %date% %time%"

echo.
echo Menambahkan remote repository...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Mengupload ke GitHub...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Gagal upload ke GitHub
    echo Silakan periksa:
    echo 1. URL repository sudah benar
    echo 2. Anda memiliki akses push ke repository
    echo 3. Repository sudah dibuat di GitHub
    echo 4. Kredensial GitHub sudah diatur
    echo.
    pause
    exit /b 1
)

echo.
echo ================================
echo      Upload Berhasil! 🎉
echo ================================
echo.
echo Website Anda telah diupload ke GitHub.
echo.
echo Langkah selanjutnya:
echo 1. Buka repository di GitHub
echo 2. Klik tab "Settings"
echo 3. Scroll ke bagian "Pages"
echo 4. Pilih "Deploy from a branch"
echo 5. Pilih branch "main" dan folder "/ (root)"
echo 6. Klik "Save"
echo.

REM Extract username and repo name from URL
for /f "tokens=4,5 delims=/" %%a in ("%REPO_URL%") do (
    set USERNAME=%%a
    set REPO_NAME=%%b
)

REM Remove .git extension
set REPO_NAME=%REPO_NAME:.git=%

echo Website Anda akan tersedia di:
echo https://%USERNAME%.github.io/%REPO_NAME%
echo.
echo (Tunggu 5-10 menit untuk proses deployment)
echo.
echo Terima kasih telah menggunakan Shyrn Blog! ✨
pause
