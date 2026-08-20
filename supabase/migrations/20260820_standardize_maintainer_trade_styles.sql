create or replace function public.set_maintainer_trade_style()
returns trigger
language plpgsql
set search_path = public
as $$
declare normalized_trade text := lower(trim(new.trade));
begin
  if normalized_trade like '%plumb%' then
    new.colour := 'cyan'; new.icon := 'droplets';
  elsif normalized_trade like '%electric%' then
    new.colour := 'amber'; new.icon := 'zap';
  elsif normalized_trade like '%hvac%' or normalized_trade like '%air condition%' then
    new.colour := 'sky'; new.icon := 'wind';
  elsif normalized_trade like '%clean%' then
    new.colour := 'violet'; new.icon := 'sparkles';
  elsif normalized_trade like '%lift%' or normalized_trade like '%elevator%' then
    new.colour := 'indigo'; new.icon := 'settings';
  elsif normalized_trade like '%security%' then
    new.colour := 'emerald'; new.icon := 'shield';
  else
    new.colour := 'slate'; new.icon := 'wrench';
  end if;
  return new;
end;
$$;

drop trigger if exists facility_maintainer_trade_style on public.facility_maintainers;
create trigger facility_maintainer_trade_style
before insert or update of trade on public.facility_maintainers
for each row execute function public.set_maintainer_trade_style();

update public.facility_maintainers set trade = trade;
