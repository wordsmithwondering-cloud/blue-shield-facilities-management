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

create sequence if not exists public.facility_ticket_number_seq;

do $$
declare current_max bigint;
begin
 select coalesce(max((regexp_match(ticket_no, '-([0-9]+)$'))[1]::bigint), 0)
 into current_max from public.facility_tickets;
 if current_max = 0 then
   perform setval('public.facility_ticket_number_seq', 1, false);
 else
   perform setval('public.facility_ticket_number_seq', current_max, true);
 end if;
end $$;

create or replace function public.create_facility_ticket(
 p_location text,p_category text,p_priority text,p_description text,
 p_reporter_name text,p_company text,p_phone text
) returns text language plpgsql security definer as $$
declare n bigint; ticket text;
begin
 n := nextval('public.facility_ticket_number_seq');
 ticket := 'BST-FM-' || to_char(now(),'YYYY') || '-' || lpad(n::text,5,'0');
 insert into public.facility_tickets(ticket_no,location,category,priority,description,reporter_name,company,phone)
 values(ticket,p_location,p_category,p_priority,p_description,p_reporter_name,p_company,p_phone);
 return ticket;
end $$;

alter function public.create_facility_ticket(text,text,text,text,text,text,text) set search_path = public;

insert into storage.buckets (id, name, public)
values ('facility-photos', 'facility-photos', false)
on conflict (id) do update set public = false;

alter table public.facility_tickets enable row level security;

create policy "public can create tickets"
on public.facility_tickets for insert to anon with check (true);

create policy "authenticated staff can read tickets"
on public.facility_tickets for select to authenticated using (true);
