# Firebase Setup — LooksByLeema Beauty Studio

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it `looksbyleema` (or your choice)
3. Disable Google Analytics (optional) → **Create project**

## 2. Register a Web App

1. Project Overview → **Web** (`</>`)
2. App nickname: `LooksByLeema Website`
3. Copy the `firebaseConfig` values

## 3. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Restart the dev server after changing `.env`.

## 4. Enable Authentication

1. Firebase Console → **Authentication** → **Get started**
2. **Sign-in method** → Enable **Email/Password** (do **not** enable public sign-up in the app)
3. **Users** → **Add user** → create your admin account:
   - Email: `looksbyleema@gmail.com`
   - Password: (strong password — only you should know this)
4. **Authentication → Settings → Authorized domains** — add your live domain:
   - `www.looksbyleema.com`
   - `looksbyleema.com`
   - `localhost` (for local development)

Only `looksbyleema@gmail.com` can access the admin panel. Remove any test users from **Authentication → Users** in Firebase Console.

Deploy updated security rules (see sections 5–7) so Firestore, Storage, and RTDB only allow writes from this verified admin email.

## 5. Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose a region (e.g. `us-east1`)

Deploy security rules from this project:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

Or paste `firestore.rules` manually in **Firestore → Rules** tab.

## 6. Enable Realtime Database

1. Firebase Console → **Realtime Database** → **Create Database**
2. Start in **locked mode**, then deploy rules from `database.rules.json`:

```bash
firebase init database
firebase deploy --only database
```

Or paste `database.rules.json` in the **Realtime Database → Rules** tab.

Your database URL for `looksbyleema-52909`:
`https://looksbyleema-52909-default-rtdb.firebaseio.com`

## 7. Enable Storage

1. Firebase Console → **Storage** → **Get started**
2. Deploy storage rules:

```bash
firebase init storage
firebase deploy --only storage
```

Or paste `storage.rules` in **Storage → Rules** tab.

## 8. Seed Initial Data

1. Run `npm run dev`
2. **Log in at `/admin/login`** — this seeds Firestore and syncs to Realtime Database
3. All website content becomes live and editable from the admin panel

## 9. Admin Panel Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin sign-in |
| `/admin/dashboard` | Protected dashboard |

## Firestore Collections

| Collection | Purpose |
|------------|---------|
| `serviceCategories` | Hair, Makeup, Facials, etc. with prices |
| `policies/main` | Studio policy document |
| `bookings` | Customer booking requests |
| `settings/site` | Hero, contact, about content |
| `testimonials` | Client reviews |
| `gallery` | Uploaded salon images |
| `meta/app` | Seed tracking |

**Realtime Database** (`/site/settings`, `/site/testimonials`) mirrors site content for instant live updates on the public website.

## Security Notes

- Only `looksbyleema@gmail.com` (verified) can access the admin panel and write data
- Remove any test/demo users from Firebase Authentication → Users
- Anyone can submit bookings (create only) on the public site
- Public site reads services and policies without auth
- Never commit `.env` to version control

## 10. Booking Confirmation Emails

Customer booking emails are sent automatically when:

1. A customer submits a booking → **“In Process”** email
2. Admin sets status to **Confirmed** → confirmation email
3. Admin sets status to **Cancelled** → cancellation email

Emails use **Gmail SMTP** via a **Vercel serverless API** (`/api/booking-email`). Bookings are always saved first — email failures never block the booking.

### Required Vercel environment variables

Add these in **Vercel → Project → Settings → Environment Variables** (never use `VITE_` for secrets):

| Variable | Example |
|----------|---------|
| `FIREBASE_PROJECT_ID` | `looksbyleema-52909` |
| `SMTP_USER` | `looksbyleema@gmail.com` |
| `SMTP_PASS` | Gmail app password |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `EMAIL_FROM` | `Looks By Leema <looksbyleema@gmail.com>` |

For local dev, add the same vars to `.env` (see `.env.example`).

### Deploy Firestore rules (required for admin to see bookings)

```bash
npm run deploy:rules
```

Without this, bookings may save but the admin panel cannot read them (permission denied).

## 11. Firebase Deployment (`looksbyleema-52909`)

Project ID is configured in `.firebaserc` as **`looksbyleema-52909`**.

### Verify login

```bash
npx firebase-tools login:list
# Must show: 221370016@gift.edu.pk (or your deploy account)

npx firebase-tools projects:list
# Must include: looksbyleema-52909
```

### Deploy by service (recommended)

| Command | What it deploys | Prerequisite |
|---------|-----------------|--------------|
| `npm run deploy:rules` | `firestore.rules` | Firestore enabled ✅ |
| `npm run deploy:storage` | `storage.rules` | [Enable Storage](https://console.firebase.google.com/project/looksbyleema-52909/storage) |
| `npm run deploy:database` | `database.rules.json` | [Create Realtime Database](https://console.firebase.google.com/project/looksbyleema-52909/database) |
| `npm run deploy:functions` | Booking email triggers | **Blaze plan** + `firebase functions:secrets:set SMTP_PASS` |

Functions use **Node.js 22** (`functions/package.json` → `engines.node`). Local Node v22 matches the cloud runtime; the `EBADENGINE` warning is resolved.

**Actual Functions deploy blocker:** `looksbyleema-52909` must be on the **Blaze (pay-as-you-go) plan**. Spark/free projects cannot deploy Cloud Functions. Error:
`Your project looksbyleema-52909 must be on the Blaze (pay-as-you-go) plan...`

### Why full `npm run deploy:firebase` may fail

1. **Realtime Database not created** on `52909` → run `npm run deploy:database` after creating RTDB in Console
2. **Storage not enabled** on `52909` → enable Storage in Console, then `npm run deploy:storage`
3. **Cloud Functions require Blaze** → upgrade at [Usage & billing](https://console.firebase.google.com/project/looksbyleema-52909/usage/details), set SMTP secret, then `npm run deploy:functions`

### Email on Vercel (no Blaze required)

Booking emails also work via `/api/booking-email` on Vercel using `SMTP_*` env vars — see section 10 above.

### Optional: Firebase Cloud Functions

The `functions/` folder also contains Firestore email triggers as a backup. Deploy with:

```bash
firebase functions:secrets:set SMTP_PASS
npm run deploy:functions
```
