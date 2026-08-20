# Blue Shield Towers Facilities Management System

Production-ready starter for a QR-based facilities management workflow.

## Core workflow
Tenant scans a location QR -> mobile reporting page -> ticket created -> management dashboard -> assignment/status updates -> email notification -> resolution/closure.

Browser authentication uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The management API requires `SUPABASE_SERVICE_ROLE_KEY`, which must remain server-side. Staff sign-in is restricted to emails listed in `STAFF_EMAILS` (comma-separated); create those users in Supabase Authentication first.

## Notification email
Configured recipient: brian@propertylegend.com

## Stack
Next.js + TypeScript + Supabase/PostgreSQL + Supabase Storage + Resend (email) + QR codes + Tailwind CSS + shadcn/ui conventions + Lucide icons.

## Design system

See [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) for the required colours, typography, spacing, components, icons, dashboard patterns, and accessibility standards.

## Important
This package contains the application source, database schema, QR generator and deployment configuration. It cannot be made publicly reachable from this chat alone because hosting/database/email credentials are required.

## Setup
1. Create a Supabase project.
2. Run `schema.sql` in Supabase SQL Editor.
3. Create staff users in Supabase Authentication and list their emails in `STAFF_EMAILS`.
4. Add the environment variables shown in `.env.example`.
5. Deploy to Vercel.
6. Configure Resend with a verified sending domain.
7. Run `npm install`, then `npm run dev`.
8. Generate location QR codes using `generate_qr.py` after the public URL is known.

## QR URL format
https://YOUR-DOMAIN/report?location=5F-RT

The app maps location codes to readable locations in `lib/locations.ts`.

Use `/api/health` after deployment to verify the required server configuration. A missing Resend key disables notification email but does not prevent ticket creation.
