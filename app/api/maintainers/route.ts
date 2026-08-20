import { NextResponse } from 'next/server';
import { createAdminSupabaseClient, getStaffUser } from '@/lib/supabase/server';
import { tradePresentation } from '@/lib/maintainers';

async function requireStaff() {
  return Boolean(await getStaffUser());
}

function cleanOptional(value: unknown) {
  return typeof value === 'string' ? value.trim() || null : null;
}

export async function GET() {
  if (!await requireStaff()) return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  const { data, error } = await createAdminSupabaseClient()
    .from('facility_maintainers')
    .select('id, name, trade, phone, email, colour, icon, active, created_at')
    .order('active', { ascending: false })
    .order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  if (!await requireStaff()) return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  const body = await request.json();
  const name = cleanOptional(body.name);
  const trade = cleanOptional(body.trade);
  if (!name || !trade) return NextResponse.json({ error: 'Name and trade are required.' }, { status: 400 });
  const presentation = tradePresentation(trade);

  const { data, error } = await createAdminSupabaseClient()
    .from('facility_maintainers')
    .insert({ name, trade, phone: cleanOptional(body.phone), email: cleanOptional(body.email), ...presentation })
    .select('id, name, trade, phone, email, colour, icon, active, created_at')
    .single();
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'That worker and trade already exist.' : error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!await requireStaff()) return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  const body = await request.json();
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Maintainer ID is required.' }, { status: 400 });
  const updates: Record<string, string | boolean | null> = { updated_at: new Date().toISOString() };
  if ('name' in body) updates.name = cleanOptional(body.name);
  if ('trade' in body) {
    updates.trade = cleanOptional(body.trade);
    if (updates.trade) Object.assign(updates, tradePresentation(String(updates.trade)));
  }
  if ('phone' in body) updates.phone = cleanOptional(body.phone);
  if ('email' in body) updates.email = cleanOptional(body.email);
  if ('active' in body && typeof body.active === 'boolean') updates.active = body.active;
  if (updates.name === null || updates.trade === null) return NextResponse.json({ error: 'Name and trade cannot be empty.' }, { status: 400 });

  const { data, error } = await createAdminSupabaseClient()
    .from('facility_maintainers')
    .update(updates)
    .eq('id', body.id)
    .select('id, name, trade, phone, email, colour, icon, active, created_at')
    .single();
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'That worker and trade already exist.' : error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  if (!await requireStaff()) return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Maintainer ID is required.' }, { status: 400 });
  const admin = createAdminSupabaseClient();
  const { count, error: countError } = await admin.from('facility_tickets').select('id', { count: 'exact', head: true }).eq('assigned_maintainer_id', id);
  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });
  if ((count || 0) > 0) {
    const { data, error } = await admin.from('facility_maintainers').update({ active: false, updated_at: new Date().toISOString() }).eq('id', id).select('id, name, trade, phone, email, colour, icon, active, created_at').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ maintainer: data, deactivated: true, message: 'Worker has ticket history and was deactivated instead of deleted.' });
  }
  const { error } = await admin.from('facility_maintainers').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
