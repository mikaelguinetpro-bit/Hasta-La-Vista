-- Hasta La Vista — traducciones de las chispas
-- À lancer une seule fois dans Supabase → SQL Editor → Run (après chispas.sql).
-- Ajoute une colonne où la fonction « traducir-chispa » range les traductions d'une chispa
-- dans les 9 langues du site. Le site la lit seulement (comme le reste de la chispa).

alter table public.chispas add column if not exists traducciones jsonb;
