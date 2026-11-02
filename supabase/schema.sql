-- Run this entire script in Supabase → SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.insurance_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (phone ~ '^[0-9+() .-]{10,18}$'),
  coverage_need text not null check (
    coverage_need in ('Myself', 'My family', 'My parents', 'Myself + family + parents')
  ),
  message text not null default '' check (char_length(message) <= 1500),
  language text not null default 'en' check (language in ('en', 'kn')),
  status text not null default 'new' check (
    status in ('new', 'contacted', 'follow_up', 'converted', 'not_interested')
  ),
  consent boolean not null default false check (consent = true),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists insurance_leads_created_at_idx
  on public.insurance_leads (created_at desc);
create index if not exists insurance_leads_status_idx
  on public.insurance_leads (status);

alter table public.insurance_leads enable row level security;

-- Public visitors can submit enquiries, but cannot read or update any lead.
drop policy if exists "Anyone can submit a lead" on public.insurance_leads;
create policy "Anyone can submit a lead"
  on public.insurance_leads
  for insert
  to anon, authenticated
  with check (
    consent = true
    and status = 'new'
    and source = 'website'
  );

-- No public SELECT / UPDATE / DELETE policies are intentionally created.
-- Admin reads and updates are performed only by server routes after checking
-- the signed-in user's email against ADMIN_EMAIL, using the server-only service key.

create or replace function public.set_insurance_lead_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_insurance_lead_updated_at on public.insurance_leads;
create trigger set_insurance_lead_updated_at
before update on public.insurance_leads
for each row execute procedure public.set_insurance_lead_updated_at();

-- Optional: tighten default privileges for the table.
revoke all on public.insurance_leads from anon, authenticated;
grant insert (name, phone, coverage_need, message, language, consent, source)
  on public.insurance_leads to anon, authenticated;
