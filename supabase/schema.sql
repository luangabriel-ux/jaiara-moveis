create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.environments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  environment_id uuid not null references public.environments(id) on delete restrict,
  name text not null,
  description text not null default '',
  price text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  image_url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.environments enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "Public read environments" on public.environments for select to anon, authenticated using (true);
create policy "Admins manage environments" on public.environments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public read products" on public.products for select to anon, authenticated using (true);
create policy "Admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public read variants" on public.product_variants for select to anon, authenticated using (true);
create policy "Admins manage variants" on public.product_variants for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin reads own permission" on public.admin_users for select to authenticated using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

grant usage on schema public to anon, authenticated;
grant select on public.environments, public.products, public.product_variants to anon, authenticated;
grant insert, update, delete on public.environments, public.products, public.product_variants to authenticated;
grant select on public.admin_users to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read product images" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
create policy "Admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admins update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admins delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- Ambiente automático usado pelo painel para produtos sem seleção de ambiente.
insert into public.environments (id, name, image_url, position)
values ('00000000-0000-4000-8000-000000000001', 'Outros', '', 2147483647)
on conflict (id) do nothing;
