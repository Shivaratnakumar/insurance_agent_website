# Shivaratnakumar Patil — Health Insurance Consultant

Bilingual (English/Kannada) Next.js + Tailwind website with Supabase lead capture and a protected admin lead dashboard.

## Features added

- Public enquiry form saves leads into Supabase.
- Consent is required before submitting.
- Enquiry form also opens WhatsApp after the lead is saved.
- Admin sign-in at `/admin` using Supabase Auth email/password.
- Admin-only lead list, search, status updates, WhatsApp/call links and CSV export.
- Public visitors can INSERT enquiries only; they cannot read or update leads.
- Admin API checks the signed-in user's email against `ADMIN_EMAIL`.
- Supabase service-role key is used only on the server and must never be exposed in browser code.

## 1. Install dependencies

```bash
npm install
```

This project uses Next.js 15, React 19, Tailwind CSS, `@supabase/ssr`, `@supabase/supabase-js`, and `lucide-react`.

## 2. Create a Supabase project

1. Open https://supabase.com/dashboard and create a project.
2. Open **Project Settings → API** (or **API Keys**).
3. Copy the Project URL.
4. Copy the publishable/anon key for the public browser client.
5. Copy the service-role key for server-side admin operations only. Treat this key like a password.

## 3. Configure environment variables

Create `.env.local` in the project root (same level as `package.json`) using `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_EMAIL=your-admin-email@example.com
```

Important:
- Do not commit `.env.local` to Git.
- Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`.
- `ADMIN_EMAIL` must exactly match the email you use for the admin login.

Restart `npm run dev` after changing environment variables.

## 4. Create the leads table and security policies

1. In Supabase, open **SQL Editor → New query**.
2. Copy all contents from `supabase/schema.sql`.
3. Run the script.
4. Confirm that `public.insurance_leads` exists under **Table Editor**.

The SQL enables Row Level Security. Anonymous visitors can insert a consented website enquiry only. There are deliberately no public read, update or delete policies. The admin API uses the server-only service-role key only after checking the signed-in user's email against `ADMIN_EMAIL`.

## 5. Create your admin login

1. In Supabase, open **Authentication → Users**.
2. Choose **Add user** and create a user with the exact email in `ADMIN_EMAIL`.
3. Set a strong password and complete any email confirmation step if enabled.
4. Do not create a public sign-up page for this site. Create the single admin user yourself from the Supabase dashboard.

Then open:

```text
http://localhost:3000/admin
```

Sign in with that email and password.

## 6. Run the app

```bash
npm run dev
```

Open:
- Public website: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## 7. Test the complete flow

1. Open the public website.
2. Submit a test enquiry with a valid name, mobile number, coverage choice and consent.
3. Confirm the form reports success and opens WhatsApp.
4. In Supabase **Table Editor → insurance_leads**, confirm the test lead is present.
5. Open `/admin`, sign in and confirm the lead appears.
6. Change its status, refresh the page and confirm the status persists.
7. Test CSV export.

## Lead fields

- `name`
- `phone`
- `coverage_need`
- `message`
- `language`
- `status` (`new`, `contacted`, `follow_up`, `converted`, `not_interested`)
- `consent`
- `source`
- `created_at`, `updated_at`

## Important production hardening

Before publishing:
- Add CAPTCHA (for example Cloudflare Turnstile) and server-side rate limiting to reduce spam. The included hidden honeypot is only basic filtering, not a full anti-bot solution.
- Configure Supabase Auth site URL and allowed redirect URLs for your production domain.
- Enable MFA for the admin account and use a strong unique password.
- Review privacy notice, data retention, consent language and applicable Indian privacy requirements. Collect only the minimum details needed; do not collect medical records or sensitive health details in this lead form.
- Restrict access to CSV exports and store downloaded files securely.
- Confirm all TATA AIG brand, product and consultant/agent wording with the insurer before publishing. This is an independent enquiry website, not the official insurer website.
- Replace `https://example.com` in `app/layout.tsx` with your production domain.

## Troubleshooting

### "Supabase environment variables are missing"
Check `.env.local` is in the project root and restart the dev server.

### "Unable to save your enquiry"
Check that `supabase/schema.sql` ran successfully and that the URL and anon/publishable key are correct. Review the browser Network tab and Supabase logs.

### Admin login works but dashboard says unauthorised
Ensure the signed-in Supabase user's email exactly matches `ADMIN_EMAIL`. The API uses the server session and checks this email on every admin request.

### Admin dashboard says "Please sign in"
Sign out, sign in again, and ensure your local app URL is included in Supabase Auth allowed URLs if you have customised auth URL settings.

## Project structure (new files)

```text
app/
  api/
    leads/route.ts
    admin/leads/route.ts
  admin/page.tsx
lib/
  admin-auth.ts
  supabase/
    admin.ts
    browser.ts
    server.ts
supabase/
  schema.sql
.env.example
```
"# insurance_agent_website" 
