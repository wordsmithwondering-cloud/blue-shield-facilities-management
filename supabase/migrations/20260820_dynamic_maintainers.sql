create table if not exists public.facility_maintainers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  trade text not null check (char_length(trim(trade)) between 2 and 100),
  phone text,
  email text,
  colour text not null default 'blue',
  icon text not null default 'wrench',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, trade)
);

alter table public.facility_tickets
  add column if not exists assigned_maintainer_id uuid
  references public.facility_maintainers(id) on delete set null;

create index if not exists facility_tickets_assigned_maintainer_idx
  on public.facility_tickets(assigned_maintainer_id);

alter table public.facility_maintainers enable row level security;

insert into public.facility_maintainers (name, trade, colour, icon)
values
  ('Mary Doe', 'Plumber', 'cyan', 'droplets'),
  ('John Mwangi', 'Electrician', 'amber', 'zap'),
  ('Peter Otieno', 'HVAC Technician', 'sky', 'wind'),
  ('Grace Wanjiku', 'Cleaning Supervisor', 'violet', 'sparkles'),
  ('David Kamau', 'Lift Technician', 'indigo', 'settings'),
  ('Sarah Achieng', 'Security Officer', 'emerald', 'shield'),
  ('Samuel Njoroge', 'General Maintenance', 'slate', 'wrench')
on conflict (name, trade) do nothing;

update public.facility_tickets as ticket
set assigned_maintainer_id = maintainer.id
from public.facility_maintainers as maintainer
where ticket.assigned_maintainer_id is null
  and ticket.assigned_to = maintainer.name || ' — ' || maintainer.trade;
