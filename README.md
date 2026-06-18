# Movie App

**ES234632 - Pengembangan Sistem dan Operasi**

A full-stack movie streaming platform with playlist management, user reviews, secure Google authentication, and real-time updates via Pusher.

**Production Deployment**: https://pso-fp-movieapp12-ecbzfqf9d9bmf2dq.southeastasia-01.azurewebsites.net/

## Group 12

- Batara Haryo Yudanto (5026231008)
- Izzudin Hamadi Faiz (5026231018)
- Bagas Rafi Dewantara (5026231091)
- Adifa Fajri Sampurno (5026231178)

## Features

- Browse movies by category: Trending, Top Rated, Action, Comedy, Horror, Romance, Documentaries
- Movie and TV show detail pages with trailer, cast, and TMDB ratings
- Search and filter by title, genre, or media type
- Google OAuth authentication via NextAuth.js
- Bookmark favorite movies and actors to profile
- Create and manage personal movie playlists (add, rename, delete)
- Write, edit, and read user reviews with 1–10 star rating
- Dark/light theme toggle
- Real-time updates via Pusher for movie data, person data, and reviews
- Responsive design for desktop and mobile

## Tech Stack

**Frontend**: Next.js 13, React 18, TypeScript, Tailwind CSS, Material UI (MUI), Framer Motion  
**Backend**: Node.js, Express.js  
**Database**: MongoDB, Mongoose  
**Auth**: NextAuth.js v4 (Google OAuth)  
**Real-time**: Pusher  
**API**: TMDB (The Movie Database)  
**Testing**: Jest  
**Code Quality**: ESLint, Prettier  
**Deployment**: Azure Web App, Azure Container Registry (ACR)  
**CI/CD**: GitHub Actions  
**Containerization**: Docker

## Technical Architecture

### Technology Stack

| Component              | Technology               | Version | Purpose                                      |
| ---------------------- | ------------------------ | ------- | -------------------------------------------- |
| **Runtime**            | Node.js                  | 18+     | JavaScript runtime environment               |
| **Package Manager**    | npm                      | 9+      | Dependency management                        |
| **Frontend Framework** | Next.js                  | 13      | React meta-framework with SSR and App Router |
| **Language**           | TypeScript               | 4.9     | Type-safe application development            |
| **UI Library**         | React                    | 18      | Component-based UI framework                 |
| **Styling**            | Tailwind CSS             | 3       | Utility-first CSS framework                  |
| **UI Components**      | Material UI (MUI)        | 5       | Accessible component library                 |
| **Animation**          | Framer Motion            | 10      | Declarative animations                       |
| **Backend**            | Express.js               | 4       | REST API server on port 3001                 |
| **Authentication**     | NextAuth.js              | 4       | Google OAuth session management              |
| **ORM / ODM**          | Mongoose                 | Latest  | MongoDB object modeling                      |
| **Database**           | MongoDB                  | Latest  | NoSQL document database                      |
| **Real-time**          | Pusher                   | 8       | WebSocket-based live data streaming          |
| **External API**       | TMDB API                 | 3       | Movie, TV show, and people data              |
| **Testing Framework**  | Jest                     | 30+     | Unit testing framework                       |
| **Code Linting**       | ESLint                   | 8       | Code quality and style enforcement           |
| **Code Formatting**    | Prettier                 | 3       | Automatic code formatting                    |
| **CI/CD Platform**     | GitHub Actions           | -       | Automated workflows and deployments          |
| **Deployment**         | Azure Web App            | -       | Application hosting (frontend + backend)     |
| **Container Registry** | Azure Container Registry | -       | Docker image storage                         |
| **Containerization**   | Docker                   | -       | Application containerization                 |

### System Architecture

The application follows a client-server architecture with two separately deployed services:

1. **Presentation Layer**: Next.js 13 frontend with React components, Tailwind CSS styling, and MUI
2. **API Layer**: Express.js REST API running on port 3001, providing endpoints for movies, playlists, reviews, and users
3. **Business Logic Layer**: Server controllers handling authentication, movie bookmarking, playlist management, and review CRUD
4. **Data Access Layer**: Mongoose ODM for type-safe MongoDB interactions
5. **Real-time Layer**: Pusher triggers server-side events when MongoDB collections change; frontend subscribes via Pusher JS
6. **External Data Layer**: TMDB API provides all movie, TV show, and people data directly to the frontend

```
Browser (Next.js)
     │
     ├── TMDB API         (movie data, images, trailers)
     ├── NextAuth.js      (Google OAuth session)
     ├── Pusher JS        (real-time subscription)
     └── Express API :3001
              │
              ├── MongoDB (playlists, reviews, users, favorites)
              └── Pusher  (triggers on DB change streams)
```

## Installation and Setup

### System Requirements

- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher
- Git version control system
- MongoDB Atlas account
- TMDB API key
- Google Cloud OAuth credentials
- Pusher account

### Installation Procedure

#### Step 1: Repository Cloning

```bash
git clone https://github.com/SashenJayathilaka/Full-Stack-Movie-Application.git
cd Full-Stack-Movie-Application
```

#### Step 2: Install Frontend Dependencies

```bash
npm install
```

#### Step 3: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

#### Step 4: Environment Configuration

Create a `.env.local` file in the project root with the following configuration:

```env
# TMDB API
NEXT_PUBLIC_API_KEY=<your-tmdb-api-key>

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>

# Backend
NEXT_PUBLIC_SERVER_URL=http://localhost:3001

# MongoDB
MONGODB_URL=<your-mongodb-atlas-connection-string>

# Pusher
PUSHER_APPID=<your-pusher-app-id>
PUSHER_KEY=<your-pusher-key>
PUSHER_SECRET=<your-pusher-secret>
```

#### Step 5: Run Development Server

```bash
npm run dev
```

This starts both the Next.js frontend (port 3000) and the Express backend (port 3001) concurrently.

## Authentication System

### Google OAuth 2.0 Implementation

#### Google OAuth Configuration

To configure Google OAuth authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Click `Create Credentials > OAuth 2.0 Client ID`
3. Configure the OAuth client:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID and Client Secret
5. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=<your-client-id>
   GOOGLE_CLIENT_SECRET=<your-client-secret>
   ```

#### OAuth 2.0 Flow

```
User
  ↓
Click "Sign In with Google"
  ↓
Redirect to Google Authorization
  ↓
User grants permission
  ↓
Google redirects to /api/auth/callback/google with authorization code
  ↓
NextAuth.js exchanges code for access token
  ↓
NextAuth.js retrieves user profile from Google
  ↓
Application creates or updates user record in MongoDB
  ↓
JWT session token generated
  ↓
Redirect to application with session
```

### Session Management

- **Session Strategy**: JWT tokens (stateless)
- **Token Expiration**: Managed by NextAuth.js defaults
- **Storage**: Secure HTTP-only cookies
- **CSRF Protection**: Enabled by default in NextAuth.js
- **Session Access**: Available in both server and client components via `useSession()` / `getServerSession()`

## Development Workflow

### Project Structure

```
DevOps-Movie-App/
├── app/                              # Next.js App Router
│   ├── details/[id]/                 # Movie/TV detail page
│   ├── people/                       # People/actors page
│   ├── playlist/                     # Playlist page (auth required)
│   │   └── page.tsx
│   ├── profile/                      # User profile page
│   ├── search/                       # Search & filter page
│   ├── tv/                           # TV shows page
│   └── page.tsx                      # Home page
├── components/                       # Reusable React components
│   ├── AddToPlaylistButton.tsx       # Add movie to playlist
│   ├── DetailsBanner.tsx             # Movie/TV detail banner
│   ├── DividerMovieLine.tsx          # Horizontal movie divider
│   ├── Footer.tsx
│   ├── GlobalLoading.tsx             # Full-page loading overlay
│   ├── HomeBanner.tsx                # Hero banner on home page
│   ├── MovieReview.tsx               # TMDB reviews component
│   ├── Navbar.tsx                    # Navigation bar
│   ├── PlaylistSection.tsx           # Playlist management UI
│   ├── Row.tsx                       # Horizontal movie row
│   ├── ToastContainer.tsx
│   └── UserReview.tsx                # User review form and list
├── context/
│   └── ThemeContext.tsx              # Dark/light mode context
├── lib/                              # Utility functions (tested)
│   ├── auth.utils.js                 # Session & auth helpers
│   ├── movie.utils.js                # Movie save/favorite helpers
│   ├── rating.utils.js               # Rating format helpers
│   ├── requests.utils.js             # TMDB URL builders
│   ├── search.utils.js               # Search & filter helpers
│   └── user.utils.js                 # User payload helpers
├── server/                           # Express.js backend
│   ├── controllers/
│   │   ├── findMovie.js
│   │   ├── findPerson.js
│   │   ├── getMovie.js
│   │   ├── getPerson.js
│   │   ├── getPlaylists.js           # Fetch user playlists
│   │   ├── getReviews.js             # Fetch movie reviews
│   │   ├── getUserData.js
│   │   ├── managePlaylist.js         # Create/update/delete playlist
│   │   ├── saveMovie.js
│   │   ├── savePerson.js
│   │   ├── saveReview.js             # Create/update user review
│   │   ├── suggestionUser.js
│   │   └── user.js
│   ├── model/
│   │   ├── movie.model.js
│   │   ├── person.model.js
│   │   ├── playlist.model.js         # Playlist MongoDB schema
│   │   ├── review.model.js           # Review MongoDB schema
│   │   └── user.model.js
│   ├── Dockerfile                    # Backend Docker image
│   ├── index.js                      # Express app entry point
│   └── package.json
├── utils/
│   └── requests.ts                   # TMDB API endpoint constants
├── __tests__/                        # Jest test files
│   ├── auth.test.js
│   ├── movie.test.js
│   ├── rating.test.js
│   ├── requests.test.js
│   ├── search.test.js
│   └── user.test.js
├── .github/
│   └── workflows/
│       ├── ci-dev.yml                # CI pipeline
│       ├── cd-frontend-azure.yml     # Frontend CD to Azure
│       └── cd-backend-azure.yml      # Backend CD to Azure
├── Dockerfile                        # Frontend Docker image
├── jest.config.js
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### Command Reference

#### Development Commands

```bash
# Start frontend and backend concurrently
npm run dev

# Start frontend only (Next.js on port 3000)
npm run dev:frontend

# Start backend only (Express on port 3001)
npm run dev:backend

# Build production bundle
npm run build

# Start production server
npm start
```

#### Testing Commands

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- auth.test.js
```

#### Code Quality Commands

```bash
# Run ESLint
npm run lint

# Check formatting with Prettier
npx prettier --check .

# Format all files with Prettier
npx prettier --write .

# Run full quality check
npm run lint && npx prettier --check . && npm test -- --coverage --watchAll=false
```

## Testing Strategy

### Test Coverage

The application maintains comprehensive test coverage on utility functions:

- **Total Tests**: 181 test cases
- **Test Coverage**: 99%+ on all lib utility files
- **Coverage Threshold**: 80% enforced for statements, branches, functions, and lines
- **Test Execution**: Runs in CI pipeline before every build

### Test Organization

#### Auth Utility Tests (`__tests__/auth.test.js`)

Tests session and authentication helper functions:

- Google session building from NextAuth token
- Username generation from email/name
- Session validation and user extraction

#### Search Utility Tests (`__tests__/search.test.js`)

Tests search and filter helper functions:

- TMDB search URL building with query parameters
- Genre name lookup and filter application
- Navigation path generation for search results

#### Rating Utility Tests (`__tests__/rating.test.js`)

Tests rating display and formatting functions:

- Star rating value formatting
- Rating color coding by score range
- Progress bar value calculation from TMDB vote average

#### Requests Utility Tests (`__tests__/requests.test.js`)

Tests TMDB API URL builder functions:

- Image URL construction with size variants
- Trailer URL building
- Detail, video, and review endpoint URL builders

#### Movie Utility Tests (`__tests__/movie.test.js`)

Tests movie save and favorite helper functions:

- Movie payload building for MongoDB storage
- Save action determination (add/remove favorite)
- Response formatting for save operations

#### User Utility Tests (`__tests__/user.test.js`)

Tests user data validation and formatting functions:

- User input validation (email, required fields)
- User payload building from session data
- New vs existing user response formatting

### Running Tests

```bash
# Run complete test suite
npm test

# Run with coverage report
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- search.test.js

# Run tests matching a specific name
npm test -- --testNamePattern="buildSearchUrl"
```

## API Documentation

### REST API Endpoints

All endpoints are served by the Express.js server on port 3001.

#### User Endpoints

**Get or create user**

```
GET|POST /user
Body: { uid, name, email, image }

Response: 200 OK
{ _id, uid, name, email, image, ... }
```

**Get user data with favorites**

```
GET /user/:id

Response: 200 OK
{ user, favoriteMovies, favoritePeople }
```

#### Movie Endpoints

**Get movie by ID**

```
GET /movie/:id

Response: 200 OK
{ ...movieData }
```

**Save / toggle favorite movie**

```
GET|POST /save/movie
Body: { userId, movieId, mediaType, ... }

Response: 200 OK
{ status: "added" | "removed", movie }
```

**Find saved movies**

```
GET|POST /find/movie
Body: { userId }

Response: 200 OK
[{ ...movieData }, ...]
```

#### Review Endpoints

**Get reviews for a movie**

```
GET /reviews/:movieId

Response: 200 OK
[
  {
    "_id": "...",
    "userId": "...",
    "movieId": 12345,
    "mediaType": "movie",
    "rating": 8,
    "content": "Great movie!",
    "userName": "...",
    "userPhoto": "...",
    "time": "2025-06-18T..."
  },
  ...
]
```

**Create or update a review**

```
POST /save/review
Body:
{
  "userId": "...",
  "movieId": 12345,
  "mediaType": "movie",
  "rating": 8,
  "content": "Great movie!",
  "userName": "...",
  "userPhoto": "...",
  "movieTitle": "...",
  "poster_path": "..."
}

Response: 200 OK
{ status: "created" | "updated", review }
```

#### Playlist Endpoints

**Get all playlists for a user**

```
GET /playlists/user/:userId

Response: 200 OK
[
  {
    "_id": "...",
    "name": "My Playlist",
    "userId": "...",
    "movies": [{ movieId, title, poster_path, ... }]
  },
  ...
]
```

**Create a playlist**

```
POST /playlist
Body: { userId, name }

Response: 201 Created
{ _id, name, userId, movies: [] }
```

**Rename a playlist**

```
PUT /playlist/:id
Body: { name }

Response: 200 OK
{ ...updatedPlaylist }
```

**Delete a playlist**

```
DELETE /playlist/:id

Response: 200 OK
{ message: "Deleted" }
```

**Add movie to playlist**

```
POST /playlist/:id/movie
Body: { movieId, title, poster_path, mediaType }

Response: 200 OK
{ ...updatedPlaylist }
```

**Remove movie from playlist**

```
DELETE /playlist/:id/movie/:movieId

Response: 200 OK
{ ...updatedPlaylist }
```

## Continuous Integration and Deployment

### CI/CD Pipeline Overview

The application implements automated CI/CD using GitHub Actions. CI runs on every push to `dev` and `master`; CD runs automatically only after CI passes on `master`.

### GitHub Actions Workflows

#### Continuous Integration (`.github/workflows/ci-dev.yml`)

Triggers on push and pull request to `dev` and `master`.

```
CI Pipeline
├── Job 1: Code Quality Check
│   ├── ESLint (npm run lint)
│   ├── Prettier format check
│   └── npm audit
│
├── Job 2: Unit Testing  (needs: quality)
│   ├── Run Jest with coverage
│   └── Upload coverage report as artifact (5-day retention)
│
└── Job 3: Build Application  (needs: quality + test)
    ├── Next.js build (npm run build)
    └── Docker image build verification
```

#### Continuous Deployment — Frontend (`.github/workflows/cd-frontend-azure.yml`)

Triggers via `workflow_run` on CI completion with `conclusion == 'success'` on `master`.

```
CD Frontend Pipeline
├── Job 1: Validate Prerequisites
│   └── Check secrets and Dockerfile existence
│
├── Job 2: Build, Push & Deploy
│   ├── Login to Azure Container Registry
│   ├── Docker build (env vars injected as build-args)
│   ├── Push image tagged with commit SHA
│   └── Deploy to Azure Web App (pso-fp-movieapp12)
│
├── Job 3: Health Check
│   └── HTTP status check with 5 retries
│
├── Job 4: Rollback (if health check fails)
│   └── Redeploy :latest image from ACR
│
└── Job 5: Deployment Summary
    └── Log status, URL, image tag, and timestamp
```

#### Continuous Deployment — Backend (`.github/workflows/cd-backend-azure.yml`)

Same trigger as frontend; deploys `./server` as a separate Azure Web App.

```
CD Backend Pipeline
├── Job 1: Validate Prerequisites
│   └── Check secrets and server/Dockerfile existence
│
├── Job 2: Build, Push & Deploy
│   ├── Login to Azure Container Registry
│   ├── Docker build from ./server
│   ├── Push image tagged with commit SHA
│   └── Deploy to Azure Web App (movie-app-backend-pso)
│
├── Job 3: Health Check
│   └── HTTP status check with 5 retries
│
├── Job 4: Rollback (if health check fails)
│   └── Redeploy :latest image from ACR
│
└── Job 5: Deployment Summary
    └── Log status, URL, image tag, and timestamp
```

**CD is gated by CI** — deployment never runs on a failing build.

### Code Quality Checks

#### ESLint Configuration

- Enforces Next.js code style and best practices
- Configuration: `.eslintrc.json`
- Runs in CI on every push

#### Prettier Formatting

- Ensures consistent code formatting across the codebase
- Runs as `npx prettier --check .` in CI
- Configuration: `.prettierrc`

### Deployment Environments

#### Azure Web App Deployment

Both frontend and backend are deployed as containerized apps on Azure Web App via ACR.

**Architecture**:

- Docker images built in GitHub Actions
- Images pushed to Azure Container Registry (ACR) tagged by commit SHA + branch
- Azure Web App pulls and runs the image from ACR
- Health check verifies HTTP 2xx response after deployment
- Automatic rollback to `:latest` if health check fails

**Environment variables** are injected at Docker build time as `--build-arg` for the frontend, and configured as Azure App Settings for the backend.

| Service  | Azure App Name        | URL                                                                                |
| -------- | --------------------- | ---------------------------------------------------------------------------------- |
| Frontend | pso-fp-movieapp12     | https://pso-fp-movieapp12-ecbzfqf9d9bmf2dq.southeastasia-01.azurewebsites.net/     |
| Backend  | movie-app-backend-pso | https://movie-app-backend-pso-hkhufqd7a0bcasds.southeastasia-01.azurewebsites.net/ |

## Branch Strategy

The project uses a structured branching model to keep production code stable:

| Branch     | Purpose                                               |
| ---------- | ----------------------------------------------------- |
| `master`   | Production-ready code. CI/CD deploys from this branch |
| `feature`  | Active development: playlist + user review features   |
| `baseline` | Snapshot backup of clean master before feature merge  |
| `dev`      | General development and experimentation               |

**Development Flow**:

```
dev → feature → master (via PR or manual merge)
                  ↓
             CI runs (lint, format, test, build)
                  ↓
             CD deploys to Azure (only if CI passes)
```

- All new features are developed in `feature` branch
- `master` is always deployable
- `baseline` exists as a safety net to restore clean master if needed

## Security Considerations

### Authentication Security

- Google OAuth tokens validated by NextAuth.js
- JWT tokens signed with `NEXTAUTH_SECRET`
- HTTP-only cookies prevent XSS token theft
- CSRF protection enabled by default in NextAuth.js

### Data Security

- All communications over HTTPS/TLS in production
- Database credentials managed via environment variables
- Sensitive secrets never committed to version control
- MongoDB query injection prevention via Mongoose schema validation

### API Security

- Authentication required for playlist and review write operations
- CORS configured on Express server
- Pusher uses TLS for WebSocket connections

## Performance Optimization

### Frontend Optimization

- Code splitting via Next.js automatic bundling
- Lazy loading of movie rows with React state
- Framer Motion animations scoped to viewport (`viewport: { once: true }`)
- Tailwind CSS purging for minimal CSS bundle

### Backend Optimization

- MongoDB indexes on frequently queried fields (userId, movieId)
- Pusher change streams only watch relevant collections
- Express JSON body parsing limited to necessary routes

### Deployment Optimization

- Docker multi-stage builds for minimal image size
- Azure Web App auto-scaling based on load
- ACR image retention using SHA tags + `:latest` for rollback

## Troubleshooting Guide

### Database Connection Issues

**Problem**: `MongooseServerSelectionError: connection refused`

**Solution**:

1. Verify `MONGODB_URL` in `.env.local` is correct
2. Check MongoDB Atlas cluster is running and not paused
3. Verify IP whitelist in Atlas allows your IP or `0.0.0.0/0` for development
4. Ensure `MONGODB_URL` uses the correct database name in the connection string

### Authentication Failures

**Problem**: `OAuthCallbackError` or redirect loop on sign-in

**Solution**:

1. Verify `NEXTAUTH_URL` matches the running app URL exactly
2. Check that Google OAuth redirect URI matches: `{NEXTAUTH_URL}/api/auth/callback/google`
3. Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
4. Clear browser cookies and try again

### Pusher Real-time Not Working

**Problem**: Changes not reflecting in real-time

**Solution**:

1. Verify `PUSHER_APPID`, `PUSHER_KEY`, `PUSHER_SECRET` are set in `.env.local`
2. Check that MongoDB Atlas supports change streams (requires a replica set — Atlas free tier supports this)
3. Verify the Pusher channel names match between server and frontend subscription

### Build Failures

**Problem**: `Module not found` or TypeScript errors

**Solution**:

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check that all environment variables required by `next.config.js` are set
3. Verify TypeScript errors: `npx tsc --noEmit`

## Contributing Guidelines

### Branch Strategy

- `master`: Production-ready code
- `feature`: Feature development
- `dev`: Integration and experimentation

### Development Process

1. Create or switch to feature branch:

   ```bash
   git checkout feature
   ```

2. Make changes and commit:

   ```bash
   git add <files>
   git commit -m "feat: add new feature"
   ```

3. Run quality checks before push:

   ```bash
   npm run lint && npx prettier --check . && npm test
   ```

4. Push changes:

   ```bash
   git push origin feature
   ```

5. Open Pull Request to `master` when ready

### Code Quality Standards

- Test coverage minimum 80% for new utility functions
- ESLint errors must be resolved before push
- Prettier formatting required (checked in CI)
- Commit messages should be descriptive

## References and Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Guide](https://next-auth.js.org)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [Pusher Channels](https://pusher.com/docs/channels/)
- [Azure Web App Deploy Action](https://github.com/Azure/webapps-deploy)

### Course Materials

- ES234632 Course Syllabus
- System Development Best Practices
- Cloud Architecture Patterns
- CI/CD Implementation Guide

## Project Status

**Current Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: June 2026

## Contact and Support

For questions or issues regarding this project:

- Create a GitHub Issue: [Issues](https://github.com/SashenJayathilaka/Full-Stack-Movie-Application/issues)

---

**Disclaimer**: This project is created as a final assignment for ES234632 — Pengembangan Sistem dan Operasi. All external libraries and APIs are used in accordance with their respective licenses.

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| **Frontend**     | Next.js 13, TypeScript, React, Tailwind CSS, MUI |
| **Backend**      | Express.js, Node.js                              |
| **Database**     | MongoDB (Mongoose)                               |
| **Auth**         | NextAuth.js v4 (Google OAuth)                    |
| **Real-time**    | Pusher                                           |
| **External API** | TMDB                                             |
| **Deployment**   | Azure Web App, Azure Container Registry          |
| **Testing**      | Jest (181 tests, 99%+ coverage)                  |
| **Quality**      | ESLint, Prettier                                 |
| **CI/CD**        | GitHub Actions                                   |

## Prerequisites

- Node.js 18+ and npm 9+
- Git
- MongoDB Atlas account
- TMDB API key
- Google Cloud OAuth credentials
- Pusher account

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/SashenJayathilaka/Full-Stack-Movie-Application.git
cd Full-Stack-Movie-Application
```

### 2. Install Dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 3. Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_KEY=<tmdb-api-key>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
MONGODB_URL=<mongodb-atlas-url>
PUSHER_APPID=<pusher-app-id>
PUSHER_KEY=<pusher-key>
PUSHER_SECRET=<pusher-secret>
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure (Summary)

```
├── app/                    # Next.js App Router pages
├── components/             # React components
├── context/                # Theme context
├── lib/                    # Utility functions (tested)
├── server/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   ├── model/              # Mongoose schemas
│   └── index.js            # Express entry point
├── utils/                  # TMDB API constants
├── __tests__/              # Jest test files
├── .github/workflows/      # CI/CD pipelines
└── Dockerfile              # Frontend container
```

## Testing & Quality

```bash
npm test                                         # Run all tests
npm test -- --coverage --watchAll=false          # With coverage
npm run lint                                     # ESLint
npx prettier --check .                           # Prettier check
```

**Coverage**: 99%+ on lib utilities  
**Tests**: 181 passing

## Deployment

**Deployment is fully automated** — push to `master` → CI runs → if passing, CD deploys both frontend and backend to Azure Web App.

| Service  | URL                                                                                |
| -------- | ---------------------------------------------------------------------------------- |
| Frontend | https://pso-fp-movieapp12-ecbzfqf9d9bmf2dq.southeastasia-01.azurewebsites.net/     |
| Backend  | https://movie-app-backend-pso-hkhufqd7a0bcasds.southeastasia-01.azurewebsites.net/ |

## CI/CD Overview

```
Push to master
  ↓
CI: lint → test (181 tests) → build → docker build
  ↓ (only if CI passes)
CD Frontend: build image → push to ACR → deploy to Azure → health check
CD Backend:  build image → push to ACR → deploy to Azure → health check
```

## Notes

- TMDB API key required for all movie data (images, titles, trailers)
- MongoDB Atlas must have a replica set enabled for Pusher change streams (Atlas free tier supports this)
- Google OAuth redirect URIs must match `NEXTAUTH_URL` exactly
- Frontend and backend are deployed as separate Docker containers on Azure

---

**Last Updated**: June 2026
