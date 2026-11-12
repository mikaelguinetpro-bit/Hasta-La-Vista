-- Hasta La Vista — « Mon espace » : retrouver ses chispas accueillies sur n'importe quel appareil.
-- À lancer UNE SEULE FOIS, après cuentas.sql : SQL Editor → Run.
-- Cette fonction rend seulement les numéros des chispas de la personne connectée, jamais celles des autres.

create or replace function public.mis_chispas()
returns table (id bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id from public.chispas c where c.user_id = auth.uid();
$$;

revoke execute on function public.mis_chispas() from public, anon;
grant execute on function public.mis_chispas() to authenticated;
