-- À copier-coller dans Supabase > SQL Editor > New query, puis cliquer "Run"

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  created_at timestamptz default now()
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  path text not null,
  created_at timestamptz default now()
);

-- Sécurité : active la RLS puis autorise l'accès public en lecture/écriture.
-- NOTE : pour une V1 simple, l'accès est ouvert (pas de vraie authentification
-- fine par utilisateur). C'est suffisant pour démarrer, mais à durcir plus
-- tard si l'app grandit (voir le README).

alter table clients enable row level security;
alter table photos enable row level security;

create policy "public read clients" on clients for select using (true);
create policy "public write clients" on clients for insert with check (true);
create policy "public delete clients" on clients for delete using (true);

create policy "public read photos" on photos for select using (true);
create policy "public write photos" on photos for insert with check (true);
create policy "public delete photos" on photos for delete using (true);
