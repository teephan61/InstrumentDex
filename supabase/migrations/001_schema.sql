-- Run first. Shared-playground tables only; no authoritative-source tables.
create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.tester_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'tester' check (role in ('tester','admin')),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.instrument_concepts (
  id uuid primary key default gen_random_uuid(),
  common_name text not null check (length(btrim(common_name)) between 2 and 200),
  family text not null check (length(btrim(family)) between 2 and 120),
  aliases text[] not null default '{}',
  recognition_cue text not null default '',
  distinguishing_features text[] not null default '{}',
  confusables text[] not null default '{}',
  draft_status text not null default 'draft' check (draft_status = 'draft'),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.specialty_terms (
  id text primary key,
  name text not null unique
);

create table if not exists public.instrument_specialties (
  instrument_concept_id uuid not null references public.instrument_concepts(id) on delete cascade,
  specialty_term_id text not null references public.specialty_terms(id),
  primary key (instrument_concept_id, specialty_term_id)
);

create table if not exists public.facility_instrument_contexts (
  id uuid primary key default gen_random_uuid(),
  instrument_concept_id uuid not null references public.instrument_concepts(id) on delete cascade,
  facility_key text not null default 'harbour-demo-hospital',
  local_name text,
  note text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.facility_tray_memberships (
  id uuid primary key default gen_random_uuid(),
  facility_context_id uuid not null references public.facility_instrument_contexts(id) on delete cascade,
  tray_name text not null check (length(btrim(tray_name)) between 1 and 160),
  quantity text,
  created_at timestamptz not null default now()
);

create table if not exists public.instrument_product_candidates (
  id uuid primary key default gen_random_uuid(),
  instrument_concept_id uuid not null references public.instrument_concepts(id) on delete cascade,
  manufacturer text,
  catalog text,
  variant text,
  reuse text,
  identity_state text not null default 'unresolved' check (identity_state = 'unresolved'),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.instrument_draft_submissions (
  id uuid primary key default gen_random_uuid(),
  instrument_concept_id uuid not null unique references public.instrument_concepts(id) on delete cascade,
  client_request_id uuid not null unique,
  processing_draft jsonb not null default '{}'::jsonb,
  source_note text,
  source_grounding_state text not null default 'not_source_grounded'
    check (source_grounding_state = 'not_source_grounded'),
  publication_state text not null default 'draft'
    check (publication_state = 'draft'),
  submitted_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- With no policies, these tables deny all direct API access immediately.
alter table public.tester_profiles enable row level security;
alter table public.instrument_concepts enable row level security;
alter table public.specialty_terms enable row level security;
alter table public.instrument_specialties enable row level security;
alter table public.facility_instrument_contexts enable row level security;
alter table public.facility_tray_memberships enable row level security;
alter table public.instrument_product_candidates enable row level security;
alter table public.instrument_draft_submissions enable row level security;
