import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getStaffUser } from '../../../lib/supabase/server';
import { createAdminSupabaseClient } from '../../../lib/supabase/server';

const STATUSES = ['NEW', 'ACKNOWLEDGED', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'] as const;
type TicketStatus = (typeof STATUSES)[number];

async function addPhotoLinks<T extends { photo_url?: string | null }>(tickets: T[]) {
  const admin = createAdminSupabaseClient();
  return Promise.all(tickets.map(async (ticket) => {
    if (!ticket.photo_url) return ticket;
    const { data } = await admin.storage.from('facility-photos').createSignedUrl(ticket.photo_url, 60 * 60);
    return { ...ticket, photo_url: data?.signedUrl ?? null };
  }));
}

export async function GET() {
  try {
    if (!await getStaffUser()) return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
    const { data, error } = await createAdminSupabaseClient()
      .from('facility_tickets')
      .select('id, ticket_no, location, category, priority, status, assigned_to, photo_url, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(await addPhotoLinks(data || []));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Tickets could not be loaded.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!await getStaffUser()) return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id : '';
    const status = typeof body.status === 'string' ? body.status : '';
    const assignedTo = typeof body.assignedTo === 'string' ? body.assignedTo.trim() : undefined;

    if (!id || !STATUSES.includes(status as TicketStatus)) {
      return NextResponse.json({ error: 'A ticket ID and valid status are required.' }, { status: 400 });
    }

    const updates: Record<string, string | null> = { status };
    if (assignedTo !== undefined) updates.assigned_to = assignedTo || null;

    const timestampFields: Partial<Record<TicketStatus, string>> = {
      ACKNOWLEDGED: 'acknowledged_at',
      ASSIGNED: 'assigned_at',
      'IN PROGRESS': 'started_at',
      RESOLVED: 'resolved_at',
      CLOSED: 'closed_at',
    };
    const timestampField = timestampFields[status as TicketStatus];
    if (timestampField) updates[timestampField] = new Date().toISOString();

    const { data, error } = await createAdminSupabaseClient()
      .from('facility_tickets')
      .update(updates)
      .eq('id', id)
      .select('id, ticket_no, location, category, priority, status, assigned_to, photo_url, created_at')
      .single();

    if (error) throw error;
    return NextResponse.json((await addPhotoLinks([data]))[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ticket could not be updated.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const category = String(form.get('category') || '');
    const priority = String(form.get('priority') || 'Normal');
    const description = String(form.get('description') || '');
    const name = String(form.get('name') || '');
    const company = String(form.get('company') || '');
    const phone = String(form.get('phone') || '');
    const location = String(form.get('location') || 'Blue Shield Towers');
    const photo = form.get('photo');

    if (!description || !name) return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 });
    if (photo instanceof File && photo.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Photo must be 5 MB or smaller.' }, { status: 400 });
    if (photo instanceof File && photo.size > 0 && !photo.type.startsWith('image/')) return NextResponse.json({ error: 'Photo must be an image.' }, { status: 400 });

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data, error } = await supabase.rpc('create_facility_ticket', { p_location: location, p_category: category, p_priority: priority, p_description: description, p_reporter_name: name, p_company: company, p_phone: phone });
    if (error) throw error;

    const ticket = data as string;
    if (photo instanceof File && photo.size > 0) {
      try {
        const admin = createAdminSupabaseClient();
        const extension = photo.name.includes('.') ? photo.name.split('.').pop()?.toLowerCase() : 'jpg';
        const path = `${ticket}/${crypto.randomUUID()}.${extension}`;
        const upload = await admin.storage.from('facility-photos').upload(path, await photo.arrayBuffer(), { contentType: photo.type, upsert: false });
        if (upload.error) throw upload.error;
        const update = await admin.from('facility_tickets').update({ photo_url: path }).eq('ticket_no', ticket);
        if (update.error) throw update.error;
      } catch (photoError) {
        console.error('Photo upload failed:', photoError);
      }
    }
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({ from: 'Blue Shield Towers <noreply@propertylegend.com>', to: process.env.NOTIFICATION_EMAIL || 'brian@propertylegend.com', subject: `New Facilities Ticket ${ticket}`, html: `<h2>New Facility Issue</h2><p><b>Ticket:</b> ${ticket}</p><p><b>Location:</b> ${location}</p><p><b>Category:</b> ${category}</p><p><b>Priority:</b> ${priority}</p><p><b>Reported by:</b> ${name}</p><p>${description}</p>` });
      } catch (emailError) {
        console.error('Notification email failed:', emailError);
      }
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ticket could not be created.' }, { status: 500 });
  }
}
