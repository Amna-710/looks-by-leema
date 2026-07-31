import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function bookingEmailDevApi(env) {
  return {
    name: 'booking-email-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== '/api/booking-email' || req.method !== 'POST') {
          next();
          return;
        }

        Object.assign(process.env, {
          FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
          VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
          FIREBASE_DATABASE_URL: env.VITE_FIREBASE_DATABASE_URL,
          VITE_FIREBASE_DATABASE_URL: env.VITE_FIREBASE_DATABASE_URL,
          SMTP_USER: env.SMTP_USER,
          SMTP_PASS: env.SMTP_PASS,
          SMTP_HOST: env.SMTP_HOST,
          SMTP_PORT: env.SMTP_PORT,
          EMAIL_FROM: env.EMAIL_FROM,
        });

        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
          try {
            req.body = Buffer.concat(chunks).toString();
            const { handleBookingEmailRequest } = await import('./lib/bookingEmail/processBookingEmail.js');
            await handleBookingEmailRequest(req, res);
          } catch (err) {
            console.error('[booking-email dev api]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), bookingEmailDevApi(env)],
  };
});
