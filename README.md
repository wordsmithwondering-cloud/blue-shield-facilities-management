# Blue Shield Towers Facilities Management System

Production-ready starter for a QR-based facilities management workflow.

## Core workflow
Tenant scans a location QR -> mobile reporting page -> ticket created -> management dashboard -> assignment/status updates -> email notification -> resolution/closure.

## Notification email
Configured recipient: brian@propertylegend.com

## Stack
Next.js + TypeScript + Supabase/PostgreSQL + Supabase Storage + Resend (email) + QR codes.

## Important
This package contains the application source, database schema, QR generator and deployment configuration. It cannot be made publicly reachable from this chat alone because hosting/database/email credentials are required.

## Setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Create a Next.js app using these files.
4. Add environment variables shown in `.env.example`.
5. Deploy to Vercel.
6. Configure Resend with a verified sending domain.
7. Run `npm install`, then `npm run dev`.
8. Generate location QR codes using `scripts/generate_qr.py` after the public URL is known.

## QR URL format
https://YOUR-DOMAIN/report?location=5F-RT

The app maps location codes to readable locations in `lib/locations.ts`.
