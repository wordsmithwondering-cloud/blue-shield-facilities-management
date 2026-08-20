import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { createAdminSupabaseClient, createServerSupabaseClient, getStaffUser } from '../../../lib/supabase/server';

const STATUSES = ['NEW', 'ACKNOWLEDGED', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'] as const;
const PRIORITIES = ['Normal', 'Urgent', 'Emergency'] as const;
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
    if (!await getStaffUser()) return NextResponse.json({ error: 'This management dashboard is available only to approved facilities staff.' }, { status: 403 });
    const { data, error } = await createAdminSupabaseClient()
      .from('facility_tickets')
      .select('id, ticket_no, location, category, priority, description, reporter_name, company, phone, status, assigned_to, assigned_maintainer_id, photo_url, created_at')
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
    if (!await getStaffUser()) return NextResponse.json({ error: 'This management dashboard is available only to approved facilities staff.' }, { status: 403 });
    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id : '';
    const status = typeof body.status === 'string' ? body.status : undefined;
    const assignedTo = typeof body.assignedTo === 'string' ? body.assignedTo.trim() : undefined;
    const assignedMaintainerId = typeof body.assignedMaintainerId === 'string' ? body.assignedMaintainerId.trim() : undefined;

    if (!id || (status !== undefined && !STATUSES.includes(status as TicketStatus))) {
      return NextResponse.json({ error: 'A ticket ID and valid status are required.' }, { status: 400 });
    }

    const updates: Record<string, string | null> = {};
    if (status !== undefined) updates.status = status;
    if (assignedTo !== undefined) updates.assigned_to = assignedTo || null;
    if (assignedMaintainerId !== undefined) {
      updates.assigned_maintainer_id = assignedMaintainerId || null;
      if (!assignedMaintainerId) {
        updates.assigned_to = null;
      } else {
        const { data: maintainer, error: maintainerError } = await createAdminSupabaseClient()
          .from('facility_maintainers')
          .select('name, trade, active')
          .eq('id', assignedMaintainerId)
          .single();
        if (maintainerError || !maintainer?.active) return NextResponse.json({ error: 'Select an active maintainer.' }, { status: 400 });
        updates.assigned_to = `${maintainer.name} — ${maintainer.trade}`;
      }
    }

    const editableTextFields = {
      location: 'location', category: 'category', description: 'description',
      reporterName: 'reporter_name', company: 'company', phone: 'phone',
    } as const;
    for (const [input, column] of Object.entries(editableTextFields)) {
      if (typeof body[input] === 'string') updates[column] = body[input].trim() || null;
    }
    if (typeof body.priority === 'string') {
      if (!PRIORITIES.includes(body.priority)) return NextResponse.json({ error: 'Select a valid priority.' }, { status: 400 });
      updates.priority = body.priority;
    }
    if (updates.phone !== undefined && updates.phone !== null && !/^\d{10}$/.test(updates.phone)) {
      return NextResponse.json({ error: 'Phone number must contain exactly 10 digits.' }, { status: 400 });
    }
    for (const required of ['location', 'category', 'description', 'reporter_name']) {
      if (required in updates && !updates[required]) return NextResponse.json({ error: 'Location, category, description, and reporter name cannot be empty.' }, { status: 400 });
    }
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'No ticket changes were provided.' }, { status: 400 });

    const timestampFields: Partial<Record<TicketStatus, string>> = {
      ACKNOWLEDGED: 'acknowledged_at',
      ASSIGNED: 'assigned_at',
      'IN PROGRESS': 'started_at',
      RESOLVED: 'resolved_at',
      CLOSED: 'closed_at',
    };
    const timestampField = status ? timestampFields[status as TicketStatus] : undefined;
    if (timestampField) updates[timestampField] = new Date().toISOString();

    const { data, error } = await createAdminSupabaseClient()
      .from('facility_tickets')
      .update(updates)
      .eq('id', id)
      .select('id, ticket_no, location, category, priority, description, reporter_name, company, phone, status, assigned_to, assigned_maintainer_id, photo_url, created_at')
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
    const auth = await createServerSupabaseClient();
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const form = await request.formData();
    const category = String(form.get('category') || '');
    const priority = String(form.get('priority') || 'Normal');
    const description = String(form.get('description') || '');
    const firstName = String(form.get('firstName') || '').trim();
    const lastName = String(form.get('lastName') || '').trim();
    const name = `${firstName} ${lastName}`.trim();
    const company = String(form.get('company') || '');
    const phone = String(form.get('phone') || '').trim();
    const location = String(form.get('location') || 'Blue Shield Towers');
    const photo = form.get('photo');

    if (!description.trim() || !firstName || !lastName) return NextResponse.json({ error: 'First name, last name, and description are required.' }, { status: 400 });
    if (!/^\d{10}$/.test(phone)) return NextResponse.json({ error: 'Phone number must contain exactly 10 digits.' }, { status: 400 });
    if (photo instanceof File && photo.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Photo must be 5 MB or smaller.' }, { status: 400 });
    if (photo instanceof File && photo.size > 0 && !photo.type.startsWith('image/')) return NextResponse.json({ error: 'Photo must be an image.' }, { status: 400 });

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
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

    return NextResponse.json({ ticket, submittedTicket: { id: ticket, ticket_no: ticket, location, category, priority, description: description.trim(), reporter_name: name, company: company || null, phone, status: 'NEW', assigned_to: null, assigned_maintainer_id: null, photo_url: null, created_at: new Date().toISOString() } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ticket could not be created.' }, { status: 500 });
  }
}
