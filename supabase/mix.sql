-- Hasta La Vista — The Mix : comment une idée devient possible.
-- À lancer UNE SEULE FOIS, après cuentas.sql et espacio.sql : SQL Editor → Run.
--
-- Les cinq temps :
--   1. « Il manque… »  → table necesidades  (les besoins d'une chispa, visibles quand la Tríada l'a accueillie)
--   2. « J'apporte… »  → table aportes      (une personne connectée propose son aide)
--   3. L'IA rapproche  → table sugerencias  (écrite seulement par la fonction mix-ia, avec Claude)
--   4. Le créateur accepte, 5. « C'est fait » → fonction cambiar_aporte
-- Plus : ofertas (ce que chacun peut apporter), mensajes (conversation privée entre le créateur et celui qui aide).
--
-- Ce que ça garantit :
--   • personne ne voit l'e-mail ni le numéro de compte de personne ;
--   • une proposition d'aide n'est vue que par celui qui la fait et par le créateur, jusqu'à ce qu'elle soit acceptée ;
--   • les messages ne sont lus que par les deux personnes concernées ;
--   • une absence signalée reste privée, et la personne peut s'expliquer ;
--   • le site ne peut pas écrire les suggestions de l'IA : seule la fonction mix-ia le peut.

-- ───────── Petites fonctions d'aide (elles regardent qui est propriétaire sans rien montrer)
create or replace function public.hlv_mi_chispa(cid bigint) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.chispas c where c.id = cid and c.user_id = auth.uid());
$$;
create or replace function public.hlv_chispa_acogida(cid bigint) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.chispas c where c.id = cid and c.estado = 'aceptada');
$$;

-- ───────── La ville (facultative, jamais l'adresse)
alter table public.chispas add column if not exists lugar text check (char_length(lugar) <= 40);
grant select (lugar) on public.chispas to anon, authenticated;
grant insert (lugar) on public.chispas to authenticated;

-- ───────── 1. Il manque…
create table if not exists public.necesidades (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  chispa_id bigint not null references public.chispas (id) on delete cascade,
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  texto text not null check (char_length(texto) between 1 and 80),
  tipo text not null default 'otro' check (tipo in ('manos', 'objeto', 'saber', 'dinero', 'otro')),
  estado text not null default 'abierta' check (estado in ('abierta', 'cubierta')),
  traducciones jsonb
);
create index if not exists necesidades_chispa_idx on public.necesidades (chispa_id);
alter table public.necesidades enable row level security;
revoke all on public.necesidades from anon, authenticated;
grant select (id, creado, chispa_id, texto, tipo, estado, traducciones) on public.necesidades to anon, authenticated;
grant insert (chispa_id, texto, tipo) on public.necesidades to authenticated;
grant delete on public.necesidades to authenticated;

create or replace function public.hlv_necesidad_de(nid bigint, cid bigint) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.necesidades n where n.id = nid and n.chispa_id = cid);
$$;
drop policy if exists "on voit les besoins des chispas accueillies, et les siens" on public.necesidades;
create policy "on voit les besoins des chispas accueillies, et les siens"
  on public.necesidades for select to anon, authenticated
  using (public.hlv_chispa_acogida(chispa_id) or user_id = (select auth.uid()));
drop policy if exists "on ajoute des besoins seulement à ses propres chispas" on public.necesidades;
create policy "on ajoute des besoins seulement à ses propres chispas"
  on public.necesidades for insert to authenticated
  with check (user_id = (select auth.uid()) and public.hlv_mi_chispa(chispa_id));
drop policy if exists "on retire ses propres besoins" on public.necesidades;
create policy "on retire ses propres besoins"
  on public.necesidades for delete to authenticated
  using (user_id = (select auth.uid()));

-- ───────── Ce que je peux apporter (privé : seuls la personne et l'IA le voient)
create table if not exists public.ofertas (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 30),
  texto text not null check (char_length(texto) between 1 and 140),
  tipo text not null default 'otro' check (tipo in ('manos', 'objeto', 'saber', 'dinero', 'otro')),
  lugar text check (char_length(lugar) <= 40)
);
alter table public.ofertas enable row level security;
revoke all on public.ofertas from anon, authenticated;
grant select (id, creado, nombre, texto, tipo, lugar) on public.ofertas to authenticated;
grant insert (nombre, texto, tipo, lugar) on public.ofertas to authenticated;
grant delete on public.ofertas to authenticated;

drop policy if exists "on voit seulement ses propres offres" on public.ofertas;
create policy "on voit seulement ses propres offres"
  on public.ofertas for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "on ajoute ses propres offres" on public.ofertas;
create policy "on ajoute ses propres offres"
  on public.ofertas for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "on retire ses propres offres" on public.ofertas;
create policy "on retire ses propres offres"
  on public.ofertas for delete to authenticated using (user_id = (select auth.uid()));

-- ───────── 3. Les rapprochements de l'IA (publics : Visibilité)
create table if not exists public.sugerencias (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  necesidad_id bigint not null references public.necesidades (id) on delete cascade,
  oferta_id bigint not null references public.ofertas (id) on delete cascade,
  nombre text not null,
  texto text not null,
  porque jsonb,
  unique (necesidad_id, oferta_id)
);
alter table public.sugerencias enable row level security;
revoke all on public.sugerencias from anon, authenticated;
grant select (id, creado, necesidad_id, oferta_id, nombre, texto, porque) on public.sugerencias to anon, authenticated;

create or replace function public.hlv_necesidad_publica(nid bigint) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.necesidades n join public.chispas c on c.id = n.chispa_id
                 where n.id = nid and c.estado = 'aceptada');
$$;
drop policy if exists "tout le monde voit les rapprochements de l'IA" on public.sugerencias;
create policy "tout le monde voit les rapprochements de l'IA"
  on public.sugerencias for select to anon, authenticated
  using (public.hlv_necesidad_publica(necesidad_id));

-- ───────── 2. J'apporte…
create table if not exists public.aportes (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now(),
  chispa_id bigint not null references public.chispas (id) on delete cascade,
  necesidad_id bigint references public.necesidades (id) on delete set null,
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 30),
  texto text not null check (char_length(texto) between 1 and 200),
  estado text not null default 'propuesto'
    check (estado in ('propuesto', 'aceptado', 'rechazado', 'hecho', 'retirado', 'ausente')),
  explicado boolean not null default false
);
create index if not exists aportes_chispa_idx on public.aportes (chispa_id);
alter table public.aportes enable row level security;
revoke all on public.aportes from anon, authenticated;
grant select (id, creado, actualizado, chispa_id, necesidad_id, nombre, texto, estado, explicado) on public.aportes to anon, authenticated;
grant insert (chispa_id, necesidad_id, nombre, texto) on public.aportes to authenticated;

drop policy if exists "aide acceptée visible par tous, le reste par les deux" on public.aportes;
create policy "aide acceptée visible par tous, le reste par les deux"
  on public.aportes for select to anon, authenticated
  using ((estado in ('aceptado', 'hecho') and public.hlv_chispa_acogida(chispa_id))
         or user_id = (select auth.uid()) or public.hlv_mi_chispa(chispa_id));
drop policy if exists "on propose son aide à la chispa accueillie d'un autre" on public.aportes;
create policy "on propose son aide à la chispa accueillie d'un autre"
  on public.aportes for insert to authenticated
  with check (user_id = (select auth.uid()) and estado = 'propuesto'
              and public.hlv_chispa_acogida(chispa_id) and not public.hlv_mi_chispa(chispa_id)
              and (necesidad_id is null or public.hlv_necesidad_de(necesidad_id, chispa_id)));

create or replace function public.hlv_mi_aporte_o_chispa(aid bigint) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.aportes a join public.chispas c on c.id = a.chispa_id
                 where a.id = aid and (a.user_id = auth.uid() or c.user_id = auth.uid()));
$$;

-- ───────── La conversation privée
create table if not exists public.mensajes (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  aporte_id bigint not null references public.aportes (id) on delete cascade,
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  del_creador boolean not null default false,
  texto text not null check (char_length(texto) between 1 and 1000)
);
create index if not exists mensajes_aporte_idx on public.mensajes (aporte_id);
alter table public.mensajes enable row level security;
revoke all on public.mensajes from anon, authenticated;
grant select (id, creado, aporte_id, del_creador, texto) on public.mensajes to authenticated;
grant insert (aporte_id, texto) on public.mensajes to authenticated;

drop policy if exists "seules les deux personnes concernées lisent la conversation" on public.mensajes;
create policy "seules les deux personnes concernées lisent la conversation"
  on public.mensajes for select to authenticated using (public.hlv_mi_aporte_o_chispa(aporte_id));
drop policy if exists "seules les deux personnes concernées écrivent" on public.mensajes;
create policy "seules les deux personnes concernées écrivent"
  on public.mensajes for insert to authenticated
  with check (user_id = (select auth.uid()) and public.hlv_mi_aporte_o_chispa(aporte_id));

-- Qui parle (le créateur ou celui qui aide), et l'explication après une absence
create or replace function public.hlv_mensaje_antes() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.del_creador := exists (select 1 from public.aportes a join public.chispas c on c.id = a.chispa_id
                             where a.id = new.aporte_id and c.user_id = new.user_id);
  if not new.del_creador then
    update public.aportes set explicado = true where id = new.aporte_id and estado = 'ausente';
  end if;
  return new;
end;
$$;
drop trigger if exists mensajes_antes on public.mensajes;
create trigger mensajes_antes before insert on public.mensajes for each row execute function public.hlv_mensaje_antes();

-- ───────── 4 et 5. Changer l'état d'une aide (seulement par les bonnes personnes)
create or replace function public.cambiar_aporte(p_id bigint, p_estado text) returns void
language plpgsql security definer set search_path = '' as $$
declare a public.aportes; yo boolean; creador boolean;
begin
  select * into a from public.aportes where id = p_id;
  if a.id is null or auth.uid() is null then raise exception 'introuvable'; end if;
  yo := a.user_id = auth.uid();
  creador := exists (select 1 from public.chispas c where c.id = a.chispa_id and c.user_id = auth.uid());
  if (yo and p_estado = 'retirado' and a.estado in ('propuesto', 'aceptado'))
     or (creador and a.estado = 'propuesto' and p_estado in ('aceptado', 'rechazado'))
     or (creador and a.estado = 'aceptado' and p_estado in ('hecho', 'ausente'))
     or (creador and a.estado = 'ausente' and p_estado = 'hecho') then
    update public.aportes set estado = p_estado, actualizado = now() where id = p_id;
  else
    raise exception 'pas permis';
  end if;
end;
$$;
create or replace function public.cambiar_necesidad(p_id bigint, p_estado text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_estado not in ('abierta', 'cubierta') then raise exception 'pas permis'; end if;
  update public.necesidades set estado = p_estado where id = p_id and user_id = auth.uid();
end;
$$;
-- Les numéros de mes propres aides (le numéro de compte reste caché)
create or replace function public.mis_aportes() returns table (id bigint)
language sql stable security definer set search_path = '' as $$
  select a.id from public.aportes a where a.user_id = auth.uid();
$$;

-- ───────── Limites douces contre les abus
create or replace function public.hlv_limites() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'necesidades' then
    if (select count(*) from public.necesidades where chispa_id = new.chispa_id) >= 8 then raise exception 'trop de besoins'; end if;
  elsif tg_table_name = 'ofertas' then
    if (select count(*) from public.ofertas where user_id = new.user_id) >= 10 then raise exception 'trop d''offres'; end if;
  elsif tg_table_name = 'aportes' then
    if (select count(*) from public.aportes where user_id = new.user_id and estado = 'propuesto') >= 20 then raise exception 'trop de propositions en attente'; end if;
  elsif tg_table_name = 'mensajes' then
    if (select count(*) from public.mensajes where user_id = new.user_id and creado > now() - interval '1 hour') > 60 then raise exception 'trop de messages'; end if;
  end if;
  return new;
end;
$$;
drop trigger if exists necesidades_limites on public.necesidades;
create trigger necesidades_limites before insert on public.necesidades for each row execute function public.hlv_limites();
drop trigger if exists ofertas_limites on public.ofertas;
create trigger ofertas_limites before insert on public.ofertas for each row execute function public.hlv_limites();
drop trigger if exists aportes_limites on public.aportes;
create trigger aportes_limites before insert on public.aportes for each row execute function public.hlv_limites();
drop trigger if exists mensajes_limites on public.mensajes;
create trigger mensajes_limites after insert on public.mensajes for each row execute function public.hlv_limites();

-- ───────── Le fil des événements pour l'IA (un seul webhook : mix_eventos → mix-ia)
create table if not exists public.mix_eventos (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  tipo text not null check (tipo in ('chispa', 'necesidad', 'oferta')),
  ref bigint not null
);
alter table public.mix_eventos enable row level security;
revoke all on public.mix_eventos from anon, authenticated;

create or replace function public.hlv_evento() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'chispas' then
    if new.estado = 'aceptada' and old.estado is distinct from 'aceptada' then
      insert into public.mix_eventos (tipo, ref) values ('chispa', new.id);
    end if;
  elsif tg_table_name = 'necesidades' then
    if public.hlv_chispa_acogida(new.chispa_id) then
      insert into public.mix_eventos (tipo, ref) values ('necesidad', new.id);
    end if;
  elsif tg_table_name = 'ofertas' then
    insert into public.mix_eventos (tipo, ref) values ('oferta', new.id);
  elsif tg_table_name = 'aportes' then
    -- « Je ne pourrai pas venir » : le besoin se rouvre et l'IA cherche aussitôt quelqu'un d'autre
    if new.estado = 'retirado' and old.estado is distinct from 'retirado' and new.necesidad_id is not null then
      update public.necesidades set estado = 'abierta' where id = new.necesidad_id;
      insert into public.mix_eventos (tipo, ref) values ('necesidad', new.necesidad_id);
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists chispas_evento on public.chispas;
create trigger chispas_evento after update on public.chispas for each row execute function public.hlv_evento();
drop trigger if exists necesidades_evento on public.necesidades;
create trigger necesidades_evento after insert on public.necesidades for each row execute function public.hlv_evento();
drop trigger if exists ofertas_evento on public.ofertas;
create trigger ofertas_evento after insert on public.ofertas for each row execute function public.hlv_evento();
drop trigger if exists aportes_evento on public.aportes;
create trigger aportes_evento after update on public.aportes for each row execute function public.hlv_evento();

-- ───────── Droits sur les fonctions
revoke execute on function public.cambiar_aporte(bigint, text) from public, anon;
grant execute on function public.cambiar_aporte(bigint, text) to authenticated;
revoke execute on function public.cambiar_necesidad(bigint, text) from public, anon;
grant execute on function public.cambiar_necesidad(bigint, text) to authenticated;
revoke execute on function public.mis_aportes() from public, anon;
grant execute on function public.mis_aportes() to authenticated;
revoke execute on function public.hlv_evento() from public, anon, authenticated;
revoke execute on function public.hlv_limites() from public, anon, authenticated;
revoke execute on function public.hlv_mensaje_antes() from public, anon, authenticated;
