# 🎬 MovieApp Enhancement & DevOps Implementation

## Final Project - Pengembangan Sistem dan Operasi (PSO)

### Team 12 - Class A

| Name | NRP |
|--------|--------|
| Batara Haryo Yudanto | 5026231008 |
| Izzuddin Hammadi Faiz | 5026231018 |
| Bagas Rafi Dewantara | 5026231091 |
| Adifa Fajri Sampurno | 5026231178 |

---

# 📖 Project Overview

Project ini merupakan pengembangan dari aplikasi open-source:

Repository Asal:
https://github.com/SashenJayathilaka/Full-Stack-Movie-Application

Tim melakukan proses forking repository tersebut kemudian menambahkan beberapa fitur baru serta menerapkan praktik DevOps modern untuk meningkatkan kualitas pengembangan dan deployment aplikasi.

Fokus utama project ini adalah:

- Pengembangan fitur baru
- Implementasi unit testing
- Continuous Integration (CI)
- Continuous Deployment (CD)
- Containerization menggunakan Docker
- Deployment pada environment staging dan production

---

# 🎯 Enhancement Features

Beberapa fitur yang ditambahkan oleh tim:

## 🔐 Google Authentication

Menambahkan sistem autentikasi menggunakan Google OAuth melalui NextAuth.js sehingga pengguna dapat login secara aman menggunakan akun Google.

Fitur:

- Login menggunakan akun Google
- Session management
- Protected user access
- User profile integration

---

## ❤️ Favorite Movies

Pengguna dapat menyimpan film favorit ke akun masing-masing.

Fitur:

- Save favorite movie
- Remove favorite movie
- Personalized favorite list
- Data isolation antar pengguna

---

## 📂 Playlist Management

Menambahkan fitur playlist untuk mengelompokkan film sesuai preferensi pengguna.

Fitur:

- Create playlist
- Rename playlist
- Delete playlist
- Add movie to playlist
- Remove movie from playlist

---

## ⭐ Movie Review & Rating

Menambahkan sistem review dan rating yang memungkinkan pengguna memberikan ulasan terhadap film.

Fitur:

- Create review
- Update review
- Movie rating (1-10)
- Average rating calculation

---

# 🛠 Technology Stack

## Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS

## Backend

- Node.js
- Next.js API Routes

## Authentication

- NextAuth.js
- Google OAuth

## Database

- MongoDB

## DevOps

- Git
- GitHub
- GitHub Actions
- Docker
- Azure Container Registry
- Azure App Service
- Railway
- Vercel

---

# 🌳 Git Branching Strategy

Project menggunakan Git Flow sederhana.

```text
master
  │
  └── dev
       │
       ├── feature-auth
       ├── feature-playlist
       ├── feature-review
       └── feature-devops
```

Alur pengembangan:

1. Developer membuat feature branch dari `dev`
2. Feature branch di-merge ke `dev`
3. CI dijalankan pada branch `dev`
4. Setelah lolos testing, dibuat Pull Request ke `master`
5. Merge ke `master`
6. CI/CD production dijalankan

---

# 🔄 Continuous Integration

GitHub Actions digunakan untuk melakukan validasi otomatis setiap terdapat perubahan kode.

Workflow akan berjalan ketika:

- Push ke branch `dev`
- Push ke branch `master`
- Pull Request ke branch `dev`
- Pull Request ke branch `master`

Tahapan CI:

## 1. Code Quality Check

Melakukan pengecekan kualitas kode menggunakan:

- ESLint
- Prettier
- Dependency Audit

## 2. Unit Testing

Menjalankan seluruh pengujian menggunakan Jest.

Output:

- Test Result
- Coverage Report

## 3. Build Validation

Melakukan validasi build aplikasi:

- Next.js Build
- Docker Build

---

# 🧪 Unit Testing

Framework yang digunakan:

```bash
Jest
```

File pengujian:

| Test File | Function Tested |
|------------|------------|
| auth.test.js | Authentication Logic |
| movie.test.js | Favorite Movie Feature |
| playlist.test.js | Playlist Feature |
| review.test.js | Review Feature |
| search.test.js | Search Feature |
| requests.test.js | Request Validation |
| basic.test.js | Basic Testing |

---

# 📊 Testing Result

## Test Summary

```text
Test Suites : 7 Passed
Tests       : 181 Passed
Failures    : 0
```

## Coverage Result

| Metric | Coverage |
|----------|----------|
| Statements | 100% |
| Branches | 99.21% |
| Functions | 100% |
| Lines | 100% |

Coverage berhasil melampaui threshold minimum 80% yang ditentukan pada konfigurasi Jest.

---

# ⚙️ Jest Configuration

Project menggunakan konfigurasi coverage berikut:

```javascript
coverageThreshold: {
  global: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  }
}
```

---

# 🐳 Docker Implementation

## Build Image

```bash
docker build -t movie-app .
```

## Run Container

```bash
docker run -p 3000:3000 movie-app
```

Docker digunakan untuk memastikan konsistensi environment antara development, staging, dan production.

---

# 🚀 Continuous Deployment

## Staging Environment

Deployment staging digunakan untuk melakukan validasi sebelum aplikasi dipublikasikan ke production.

Frontend:

- Vercel

Backend:

- Railway

Trigger:

- Push atau merge ke branch `dev`

---

## Production Environment

Deployment production digunakan untuk aplikasi yang siap digunakan oleh pengguna.

Infrastructure:

- Azure App Service
- Azure Container Registry (ACR)

Trigger:

- Merge Pull Request ke branch `master`

---

# 📂 Repository Structure

```text
movie-app/
│
├── .github/
│   └── workflows/
│       ├── ci-dev.yml
│       ├── cd-staging.yml
│       └── cd-production.yml
│
├── __tests__/
│
├── app/
├── components/
├── pages/
├── public/
├── server/
├── lib/
│
├── Dockerfile
├── package.json
├── jest.config.js
├── .prettierrc
├── .prettierignore
└── README.md
```

---

# ▶️ Installation

Clone repository:

```bash
git clone <repository-url>
```

Masuk ke project:

```bash
cd movie-app
```

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Aplikasi dapat diakses pada:

```text
http://localhost:3000
```

---

# 🏃 Available Commands

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Lint

```bash
npm run lint
```

## Unit Test

```bash
npm test
```

## Coverage Report

```bash
npm test -- --coverage --watchAll=false
```

---

# 📌 DevOps Achievements

✅ Fork and Enhancement of Existing Application

✅ Google Authentication Feature

✅ Playlist Management Feature

✅ Movie Review & Rating Feature

✅ Git Branching Strategy

✅ GitHub Actions CI Pipeline

✅ Automated Testing with Jest

✅ Automated Coverage Report

✅ ESLint & Prettier Validation

✅ Docker Containerization

✅ Staging Deployment

✅ Production Deployment

✅ 181 Automated Test Cases

✅ 99.21% Branch Coverage

✅ 100% Statements Coverage

✅ 100% Functions Coverage

✅ 100% Lines Coverage

---

# 📚 Course Information

Course : Pengembangan Sistem dan Operasi (PSO)

Semester : Genap 2025/2026

Institution : Institut Teknologi Sepuluh Nopember (ITS)

Project Type : DevOps Implementation & Application Enhancement
