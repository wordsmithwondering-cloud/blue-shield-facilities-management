# Deployment checklist

- [ ] Create Supabase project
- [ ] Run `schema.sql` (including the private `facility-photos` bucket)
- [ ] Create Resend account and verify propertylegend.com sending domain
- [ ] Set RESEND_API_KEY
- [ ] Set NEXT_PUBLIC_SUPABASE_URL
- [ ] Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- [ ] Set SUPABASE_SERVICE_ROLE_KEY (server-side only)
- [ ] Create Supabase Auth staff users and set STAFF_EMAILS
- [ ] Set NEXT_PUBLIC_APP_URL to the final Vercel domain
- [ ] Deploy to Vercel
- [ ] Confirm `/api/health` returns `ok: true`
- [ ] Test tenant submission from a phone
- [ ] Confirm email arrives at brian@propertylegend.com
- [ ] Confirm unauthenticated `/dashboard` redirects to `/login`
- [ ] Confirm staff can assign, update, and close a ticket
- [ ] Confirm an uploaded photo opens from the staff dashboard
- [ ] Generate final QR codes
- [ ] Print and install QR signs
