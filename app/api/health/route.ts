import { NextResponse } from 'next/server';

export async function GET() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STAFF_EMAILS',
  ];
  const missing = required.filter((name) => !process.env[name]);

  return NextResponse.json(
    { ok: missing.length === 0, missing },
    { status: missing.length === 0 ? 200 : 503 },
  );
}
