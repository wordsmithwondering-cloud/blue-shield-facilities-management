create extension if not exists pgcrypto;

create table if not exists public.facility_tickets (
 id uuid primary key default gen_random_uuid(),
 ticket_no text unique not null,
 location text not null,
 category text not null,
 priority text not null default 'Normal',
 description text not null,
 reporter_name text not null,
 company text,
 phone text,
 photo_url text,
 status text not null default 'NEW',
 assigned_to text,
 created_at timestamptz not null default now(),
 acknowledged_at timestamptz,
 assigned_at timestamptz,
 started_at timestamptz,
 resolved_at timestamptz,
 closed_at timestamptz
);

create or replace function public.create_facility_ticket(
 p_location text,p_category text,p_priority text,p_description text,
 p_reporter_name text,p_company text,p_phone text
) returns text language plpgsql security definer as $$
declare n integer; ticket text;
begin
 select count(*)+1 into n from public.facility_tickets;
 ticket := 'BST-FM-' || to_char(now(),'YYYY') || '-' || lpad(n::text,5,'0');
 insert into public.facility_tickets(ticket_no,location,category,priority,description,reporter_name,company,phone)
 values(ticket,p_location,p_category,p_priority,p_description,p_reporter_name,p_company,p_phone);
 return ticket;
end $$;

alter table public.facility_tickets enable row level security;

create policy "public can create tickets"
on public.facility_tickets for insert to anon with check (true);

create policy "authenticated staff can read tickets"
on public.facility_tickets for select to authenticated using (true);
