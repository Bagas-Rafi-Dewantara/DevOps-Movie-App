# 🎬 MovieApp Enhancement & DevOps Implementation

## Final Project – Systems Development and Operations (PSO)

### Team 12 – Class A

| Name | Student ID |
|--------|--------|
| Batara Haryo Yudanto | 5026231008 |
| Izzuddin Hammadi Faiz | 5026231018 |
| Bagas Rafi Dewantara | 5026231091 |
| Adifa Fajri Sampurno | 5026231178 |

---

# 📖 Project Overview

This project is an enhancement of the open-source application:

**Original Repository**
https://github.com/SashenJayathilaka/Full-Stack-Movie-Application

Our team forked the original repository and extended it by implementing new application features and applying DevOps practices throughout the software development lifecycle.

The project focuses on:

- Feature enhancement
- Automated testing
- Continuous Integration (CI)
- Continuous Deployment (CD)
- Docker containerization
- Deployment automation
- Code quality assurance

---

# 🚀 New Features Implemented

The original application was enhanced with three major features:

## 🔐 Google Authentication

A secure authentication system was implemented using Google OAuth and NextAuth.js.

Features:

- Google Sign-In
- User Session Management
- Protected User Access
- Personalized User Profile

---

## 📂 Playlist Management

Users can create and manage their own movie playlists.

Features:

- Create Playlist
- Rename Playlist
- Delete Playlist
- Add Movies to Playlist
- Remove Movies from Playlist

---

## ⭐ Movie Review & Rating

A review system was added to allow users to rate and review movies.

Features:

- Create Review
- Update Review
- Movie Rating (1–10)
- Average Rating Calculation
- Personalized Review History

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

## DevOps & Deployment

- Git
- GitHub
- GitHub Actions
- Docker
- Azure Container Registry (ACR)
- Azure App Service
- Vercel
- Railway

---

# 🌳 Branching Strategy

The project follows a simplified Git Flow strategy.

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

Development Workflow:

1. Features are developed in feature branches.
2. Feature branches are merged into `dev`.
3. CI pipeline validates the code in `dev`.
4. Pull Requests are created from `dev` to `master`.
5. Production deployment is triggered after merging into `master`.

---

# 🔄 Continuous Integration (CI)

GitHub Actions is used to automatically validate every code change.

### CI Triggers

- Push to `dev`
- Push to `master`
- Pull Request to `dev`
- Pull Request to `master`

### Pipeline Stages

#### 1. Code Quality Check

The pipeline verifies code quality through:

- ESLint Validation
- Prettier Formatting Check
- Dependency Security Audit

#### 2. Unit Testing

The pipeline executes all Jest test suites and generates coverage reports.

#### 3. Build Validation

The application is validated through:

- Next.js Build
- Docker Build Verification

---

# 🧪 Unit Testing

The project uses **Jest** as the testing framework.

### Test Files

| File | Purpose |
|--------|--------|
| auth.test.js | Authentication Logic |
| movie.test.js | Movie Favorite Feature |
| playlist.test.js | Playlist Feature |
| review.test.js | Review Feature |
| search.test.js | Search & Filtering Feature |
| requests.test.js | Request Validation |
| basic.test.js | Basic Functional Validation |

### Tested Components

#### Authentication

- Session Validation
- User Authentication Status
- Route Protection
- User Data Extraction

#### Playlist

- Playlist Creation
- Playlist Renaming
- Playlist Deletion
- Add/Remove Movies

#### Reviews

- Review Validation
- Rating Validation
- Average Rating Calculation
- Create vs Update Logic

#### Search

- Genre Filtering
- Year Filtering
- Search Queries
- Sorting Functions

#### Movie Management

- Save Favorites
- Remove Favorites
- Favorite Validation
- User-Specific Data Handling

---

# 📊 Testing Results

### Test Execution Summary

```text
Test Suites : 7 Passed
Tests       : 181 Passed
Failures    : 0
```

### Coverage Report

| Metric | Coverage |
|----------|----------|
| Statements | 100% |
| Branches | 99.21% |
| Functions | 100% |
| Lines | 100% |

Coverage successfully exceeded the minimum threshold of 80% configured in Jest.

### Coverage Details

| File | Statements | Branches | Functions | Lines |
|--------|--------|--------|--------|--------|
| auth.utils.js | 100% | 100% | 100% | 100% |
| movie.utils.js | 100% | 96.42% | 100% | 100% |
| rating.utils.js | 100% | 100% | 100% | 100% |
| requests.utils.js | 100% | 100% | 100% | 100% |
| search.utils.js | 100% | 100% | 100% | 100% |
| user.utils.js | 100% | 100% | 100% | 100% |

---

# ⚙️ CI Configuration

The project uses the following quality thresholds:

```javascript
coverageThreshold: {
  global: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
}
```

The CI pipeline will fail if coverage falls below these requirements.

---

# 🐳 Docker Implementation

### Build Docker Image

```bash
docker build -t movie-app .
```

### Run Docker Container

```bash
docker run -p 3000:3000 movie-app
```

Docker ensures consistent environments across development, staging, and production.

---

# 🚀 Continuous Deployment (CD)

## Staging Environment

The staging environment is used for testing new changes before production release.

### Frontend

- Vercel

### Backend

- Railway

### Trigger

- Push or Merge into `dev`

---

## Production Environment

The production environment hosts the final application.

### Infrastructure

- Azure App Service
- Azure Container Registry (ACR)

### Trigger

- Merge Pull Request into `master`

---

# 📂 Project Structure

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
│   ├── auth.test.js
│   ├── movie.test.js
│   ├── playlist.test.js
│   ├── review.test.js
│   ├── search.test.js
│   ├── requests.test.js
│   └── basic.test.js
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

# 💻 Installation

Clone the repository:

```bash
git clone https://github.com/<your-repository>/movie-app.git
```

Navigate into the project directory:

```bash
cd movie-app
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# ▶️ Available Commands

### Start Development Server

```bash
npm run dev
```

### Build Application

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Run ESLint

```bash
npm run lint
```

### Run Unit Tests

```bash
npm test
```

### Generate Coverage Report

```bash
npm test -- --coverage --watchAll=false
```

---

# 🏆 DevOps Achievements

✅ Forked and Enhanced an Existing Full-Stack Application

✅ Implemented Google Authentication

✅ Implemented Playlist Management Feature

✅ Implemented Movie Review & Rating Feature

✅ Applied Git Branching Strategy

✅ Automated CI Pipeline with GitHub Actions

✅ Automated Code Quality Validation

✅ Automated Unit Testing with Jest

✅ Automated Coverage Reporting

✅ Docker Containerization

✅ Staging Deployment Pipeline

✅ Production Deployment Pipeline

✅ 181 Automated Test Cases Passed

✅ 99.21% Branch Coverage

✅ 100% Statement Coverage

✅ 100% Function Coverage

✅ 100% Line Coverage

---

# 📚 Academic Information

**Course:** Systems Development and Operations (PSO)

**Project Type:** Application Enhancement & DevOps Implementation

**Semester:** Spring 2025/2026

**Institution:** Institut Teknologi Sepuluh Nopember (ITS)
