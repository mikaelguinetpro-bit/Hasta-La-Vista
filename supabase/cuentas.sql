-- Hasta La Vista — les comptes : regarder reste libre, participer demande un compte.
-- À lancer UNE SEULE FOIS, APRÈS chispas.sql et traducciones.sql : SQL Editor → Run.
--
-- Ce que ça garantit :
--   • sans compte, on peut seulement LIRE les chispas « aceptada » ;
--   • avec un compte, on peut AJOUTER une chispa (toujours « pendiente », à son nom),
--     voir SES chispas en attente, et EFFACER les siennes ;
--   • personne ne peut toucher aux chispas des autres, ni voir à qui appartient une chispa ;
--   • « Supprimer mon compte » efface vraiment le compte et toutes ses chispas.

alter table public.chispas
  add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;

create index if not exists chispas_user_id_idx on public.chispas (user_id);

-- Anciennes règles (du temps sans compte)
drop policy if exists "on peut seulement allumer une chispa en attente" on public.chispas;
drop policy if exists "on ne voit que les chispas accueillies" on public.chispas;

-- Colonnes : personne ne voit user_id ; on ne peut écrire que le contenu de la chispa
revoke all on public.chispas from anon, authenticated;
grant select (id, creado, nombre, idea, porque, necesita, idioma, estado, traducciones) on public.chispas to anon, authenticated;
grant insert (nombre, idea, porque, necesita, idioma, consentimiento) on public.chispas to authenticated;
grant delete on public.chispas to authenticated;

create policy "tout le monde voit les chispas accueillies"
  on public.chispas for select
  to anon, authenticated
  using (estado = 'aceptada');

create policy "chacun voit aussi ses propres chispas"
  on public.chispas for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "avec un compte, on allume une chispa en attente, à son nom"
  on public.chispas for insert
  to authenticated
  with check (estado = 'pendiente' and user_id = (select auth.uid()));

create policy "chacun peut effacer ses propres chispas"
  on public.chispas for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Supprimer mon compte : efface le compte, et ses chispas avec (on delete cascade)
create or replace function public.borrar_mi_cuenta()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'pas connecté';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.borrar_mi_cuenta() from public, anon;
grant execute on function public.borrar_mi_cuenta() to authenticated;
