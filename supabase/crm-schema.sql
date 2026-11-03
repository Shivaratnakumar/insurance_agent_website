create extension if not exists pgcrypto;

-- One customer can originate from an existing website lead.
create table if not exists public.insurance_customers (
  id uuid primary key default gen_random_uuid(),
  source_lead_id uuid unique references public.insurance_leads(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  date_of_birth date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.insurance_followups (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.insurance_customers(id) on delete cascade,
  due_at timestamptz not null,
  note text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.insurance_policies (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.insurance_customers(id) on delete cascade,
  insurer text not null,
  policy_number text,
  premium numeric(12,2) not null default 0 check (premium >= 0),
  start_date date,
  expiry_date date not null,
  status text not null default 'active'
    check (status in ('active', 'expired', 'renewed', 'cancelled')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists insurance_customers_name_idx
  on public.insurance_customers (name);
create index if not exists insurance_customers_dob_idx
  on public.insurance_customers (date_of_birth);
create index if not exists insurance_followups_due_idx
  on public.insurance_followups (due_at)
  where status = 'pending';
create index if not exists insurance_policies_expiry_idx
  on public.insurance_policies (expiry_date)
  where status = 'active';

-- All CRM reads and writes go through authenticated server routes
-- using the service-role key. No public access policies are created.
alter table public.insurance_customers enable row level security;
alter table public.insurance_followups enable row level security;
alter table public.insurance_policies enable row level security;

revoke all on public.insurance_customers from anon, authenticated;
revoke all on public.insurance_followups from anon, authenticated;
revoke all on public.insurance_policies from anon, authenticated;

-- Keep updated_at accurate on edits.
create or replace function public.set_crm_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists insurance_customers_updated_at on public.insurance_customers;
create trigger insurance_customers_updated_at
before update on public.insurance_customers
for each row execute procedure public.set_crm_updated_at();

drop trigger if exists insurance_followups_updated_at on public.insurance_followups;
create trigger insurance_followups_updated_at
before update on public.insurance_followups
for each row execute procedure public.set_crm_updated_at();

drop trigger if exists insurance_policies_updated_at on public.insurance_policies;
create trigger insurance_policies_updated_at
before update on public.insurance_policies
for each row execute procedure public.set_crm_updated_at();