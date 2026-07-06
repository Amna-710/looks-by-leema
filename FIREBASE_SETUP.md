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

Your database URL is already in `.env`:
`https://looksbyleema-47c1e-default-rtdb.firebaseio.com`

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
