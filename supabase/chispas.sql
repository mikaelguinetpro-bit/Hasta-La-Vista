-- Hasta La Vista — las chispas del cielo (las primeras estrellas reales)
-- À lancer une seule fois dans Supabase → SQL Editor → Run.
--
-- Ce que ça garantit :
--   • le site peut seulement AJOUTER une chispa, toujours « pendiente » (en attente) ;
--   • le site peut seulement LIRE les chispas « aceptada » (accueillies par la Tríada) ;
--   • personne ne peut modifier ni effacer quoi que ce soit depuis le site ;
--   • c'est Ritukah qui accueille une chispa : Table Editor → chispas → colonne « estado » → aceptada.

create table public.chispas (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 1 and 30),
  idea text not null check (char_length(idea) between 1 and 140),
  porque text check (char_length(porque) <= 140),
  necesita text check (char_length(necesita) <= 80),
  idioma text check (char_length(idioma) <= 8),
  consentimiento boolean not null check (consentimiento = true),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aceptada', 'archivada'))
);

alter table public.chispas enable row level security;

create policy "on peut seulement allumer une chispa en attente"
  on public.chispas for insert
  to anon
  with check (estado = 'pendiente');

create policy "on ne voit que les chispas accueillies"
  on public.chispas for select
  to anon
  using (estado = 'aceptada');
