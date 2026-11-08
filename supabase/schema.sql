-- Lernito Kids – vorbereitetes Supabase-Schema (NICHT aktiv im MVP)
-- Ziel: Elternkonten, Synchronisierung, Content-Management mit Rollen.
-- Prinzipien: Datensparsamkeit, Row Level Security überall, keine Kinderkonten mit Login.

create extension if not exists "pgcrypto";

-- Rollen: 'parent' (Standard), 'editor' (Inhalte), 'admin' (alles)
create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'parent' check (role in ('parent', 'editor', 'admin'))
);
alter table public.user_roles enable row level security;
create policy "eigene Rolle lesen" on public.user_roles for select using (auth.uid() = user_id);

create or replace function public.has_role(r text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and (role = r or role = 'admin'));
$$;

-- Kinderprofile gehören immer einem Elternkonto. Kein Klarname nötig.
create table public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) <= 20),
  age_group text not null check (age_group in ('kita', '1', '2', '3', '4')),
  avatar jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.child_profiles enable row level security;
create policy "Eltern verwalten eigene Kinder" on public.child_profiles
  for all using (auth.uid() = parent_id) with check (auth.uid() = parent_id);

-- Lernfortschritt als kompakter JSON-Stand pro Kind (Last-Write-Wins mit Zeitstempel)
create table public.child_progress (
  child_id uuid primary key references public.child_profiles(id) on delete cascade,
  progress jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.child_progress enable row level security;
create policy "Eltern lesen/schreiben Fortschritt ihrer Kinder" on public.child_progress
  for all using (exists (select 1 from public.child_profiles c where c.id = child_id and c.parent_id = auth.uid()))
  with check (exists (select 1 from public.child_profiles c where c.id = child_id and c.parent_id = auth.uid()));

-- Einwilligungen (Nachweis nach Art. 7 Abs. 1 DSGVO)
create table public.consents (
  id bigserial primary key,
  parent_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('online_sync', 'ai_helper')),
  granted boolean not null,
  policy_version text not null,
  created_at timestamptz not null default now()
);
alter table public.consents enable row level security;
create policy "eigene Einwilligungen" on public.consents for all using (auth.uid() = parent_id) with check (auth.uid() = parent_id);

-- Content-Management
create table public.subjects (
  id text primary key,
  name text not null,
  emoji text not null default '📘',
  enabled boolean not null default true
);
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  emoji text,
  target text not null check (target in ('kita', '1', '2', '3', '4')),
  subject_id text references public.subjects(id),
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  federal_state text, -- optional: Anpassung an Bundesland-Lehrpläne (z. B. 'BY', 'NW')
  questions jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.subjects enable row level security;
alter table public.modules enable row level security;
create policy "alle lesen Fächer" on public.subjects for select using (true);
create policy "Redaktion verwaltet Fächer" on public.subjects for all using (public.has_role('editor')) with check (public.has_role('editor'));
create policy "alle lesen veröffentlichte Module" on public.modules for select using (published or public.has_role('editor'));
create policy "Redaktion verwaltet Module" on public.modules for all using (public.has_role('editor')) with check (public.has_role('editor'));

-- Medien: Storage-Bucket 'lernmedien' (öffentlich lesbar nur für veröffentlichte Inhalte, Upload nur Redaktion)
-- insert into storage.buckets (id, name, public) values ('lernmedien', 'lernmedien', false);
-- create policy "Redaktion lädt hoch" on storage.objects for insert with check (bucket_id = 'lernmedien' and public.has_role('editor'));
-- create policy "angemeldete lesen" on storage.objects for select using (bucket_id = 'lernmedien' and auth.role() = 'authenticated');
