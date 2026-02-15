# CyberLearn

Production-quality MVP training platform for administrators pursuing **Associate Google Workspace Administrator** and **Okta Certified Professional** certifications. Learners complete tasks with evidence (what you did, how you verified, rollback plan) and receive AI-powered grading and hints.

## Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui, dark theme
- **Auth:** Okta OIDC via NextAuth.js (no Firebase Auth)
- **Database:** Google Cloud Firestore (application data only)
- **AI:** Google Gemini API (gemini-1.5-flash) for grading
- **Hosting:** Vercel-compatible

## Prerequisites

- Node.js 18+
- Okta developer account
- Google Cloud project with Firestore and a service account
- Gemini API key

## Setup

### 1. Clone and install

```bash
cd cyberlearn
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required:

- `NEXTAUTH_URL` – e.g. `http://localhost:3000` (use your production URL when deploying)
- `NEXTAUTH_SECRET` – generate with `openssl rand -base64 32`
- `OKTA_ISSUER`, `OKTA_CLIENT_ID`, `OKTA_CLIENT_SECRET` – from Okta (see below)
- `GOOGLE_CLOUD_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` – from Firebase/Google Cloud service account
- `GEMINI_API_KEY` – from Google AI Studio

### 3. Okta OIDC app

1. In **Okta Admin Console**, go to **Applications** → **Applications** → **Create App Integration**.
2. Choose **OIDC** and **Web Application**.
3. **Sign-in redirect URIs:**  
   - Local: `http://localhost:3000/api/auth/callback/okta`  
   - Production: `https://your-domain.com/api/auth/callback/okta`
4. **Sign-out redirect URIs (optional):**  
   - Local: `http://localhost:3000/login`  
   - Production: `https://your-domain.com/login`
5. Under **Assignments**, assign the app to the users or groups who should access CyberLearn (manual assignment).
6. Use the **Authorization Server** that matches your issuer (usually **default** → issuer is `https://{yourOktaDomain}/oauth2/default`).
7. Copy **Client ID** and **Client secret** into `.env` as `OKTA_CLIENT_ID` and `OKTA_CLIENT_SECRET`.
8. Set `OKTA_ISSUER` to your Authorization Server issuer URL (e.g. `https://dev-12345.okta.com/oauth2/default`).

### 4. Firestore

- Create a Google Cloud project (or use existing) and enable **Firestore (Native mode)**.
- Create a **service account**, download its JSON key.
- In `.env`:
  - `GOOGLE_CLOUD_PROJECT_ID` = project ID
  - `FIREBASE_CLIENT_EMAIL` = service account `client_email`
  - `FIREBASE_PRIVATE_KEY` = private key from the JSON (keep the `\n` for newlines or use real newlines in quotes)

Optional: create composite indexes in Firestore if you add queries that need them (e.g. `attempts`: `userId` + `createdAt` descending). The app will work without them for the default queries; Firestore will prompt you with a link if an index is required.

### 5. Seed tasks

Populate Firestore with the initial task set (8 tasks: 4 Google Workspace, 4 Okta):

```bash
npm run seed
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to login; use **Sign in with Okta** (after assigning yourself to the Okta app).

## Routes

- `/` – redirects to `/dashboard` (if logged in) or `/login`
- `/login` – Okta sign-in; redirects to dashboard when already authenticated
- `/dashboard` – welcome, tier, progress %, recommended tasks
- `/tasks` – list tasks with filters (platform, tier)
- `/tasks/[id]` – task detail, hints (1–3), attempt form, Gemini grading, feedback
- `/progress` – completed tasks, average score, performance by platform

## User experience

- **Tasks** require three fields: **What did you do?**, **How did you verify?**, **Rollback plan.**
- **Hints** are revealed one at a time (no Gemini for hints in MVP; stored hints only).
- **Grading** is done by Gemini against a rubric; score 0–10 and coaching feedback (no full answer revealed). Score ≥ 7 counts as completed.

## Security

- Firestore Admin SDK is used **server-side only** (API routes and server components). Never expose service account keys to the browser.
- All authenticated pages use `requireAuth()` and redirect to `/login` if not signed in.
- Users are created/updated in Firestore on first Okta login; access is controlled by Okta app assignment.

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Set all environment variables in the Vercel project.
3. Update Okta redirect URIs to use your Vercel URL (e.g. `https://cyberlearn.vercel.app/api/auth/callback/okta`).
4. Set `NEXTAUTH_URL` to your production URL.

Build command: `npm run build`. No placeholder code; full MVP is implemented and runs locally with the above setup.
