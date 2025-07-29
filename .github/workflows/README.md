# GitHub Actions Workflow untuk NPM Publishing

## Setup

### 1. Buat NPM Token
1. Login ke [npmjs.com](https://www.npmjs.com/)
2. Pergi ke **Account Settings** → **Access Tokens**
3. Klik **Generate New Token**
4. Pilih **Automation** (untuk CI/CD)
5. Copy token yang dihasilkan

### 2. Tambahkan Secret ke GitHub Repository
1. Pergi ke repository GitHub Anda
2. Klik **Settings** → **Secrets and variables** → **Actions**
3. Klik **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: paste NPM token yang sudah dicopy
6. Klik **Add secret**

## Cara Menggunakan

### Metode 1: Menggunakan Git Tags
```bash
# Update version di package.json terlebih dahulu
npm version patch  # untuk bug fixes
# atau
npm version minor  # untuk new features
# atau
npm version major  # untuk breaking changes

# Push tag ke GitHub
git push origin --tags
```

### Metode 2: Menggunakan GitHub Releases
1. Pergi ke repository GitHub
2. Klik **Releases** → **Create a new release**
3. Buat tag baru (contoh: v1.3.2)
4. Isi release notes
5. Klik **Publish release**

## Workflow akan:
1. ✅ Checkout kode
2. ✅ Setup Node.js 18
3. ✅ Install dependencies
4. ✅ Menjalankan tests
5. ✅ Publish ke NPM secara otomatis

## Catatan Penting
- Pastikan version di `package.json` sudah diupdate sebelum membuat tag/release
- Workflow hanya akan berjalan pada tag yang dimulai dengan 'v' (contoh: v1.0.0)
- Pastikan semua tests pass sebelum publish