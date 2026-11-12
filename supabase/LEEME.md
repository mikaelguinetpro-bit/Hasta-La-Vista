# Supabase — ce qu'il faut lancer, une seule fois

Projet Supabase de Ritukah, serveur dans l'Union européenne (Irlanda). Toutes ces étapes se font sur supabase.com, dans le projet.

## 1. Les chispas (les vraies étoiles)
**SQL Editor** → colle le contenu de `chispas.sql` → **Run**.

Pour accueillir une chispa (la Tríada) : **Table Editor → chispas** → dans la colonne `estado`, remplace `pendiente` par `aceptada`.

## 2. Les traductions automatiques
1. **SQL Editor** → colle `traducciones.sql` → **Run**.
2. **Une clé Gemini gratuite** : sur https://aistudio.google.com, clique sur « Get API key », puis « Create API key ». Garde-la pour toi.
3. **Edge Functions → Secrets** : ajoute
   - `GEMINI_API_KEY` = ta clé Gemini ;
   - `WEBHOOK_SECRET` = un mot de passe que tu inventes (long, sans espace).
4. **Edge Functions → Deploy a new function → Via Editor** : nom `traducir-chispa`, colle le contenu de `functions/traducir-chispa/index.ts`, désactive « Verify JWT », puis **Deploy**.
5. **Database → Webhooks → Create a new hook** :
   - nom : `traducir-chispa` ; table : `chispas` ; événement : **Update** ;
   - type : **Supabase Edge Functions**, fonction `traducir-chispa`, méthode POST ;
   - **HTTP Headers** → ajoute `x-webhook-secret` = le même mot de passe qu'à l'étape 3.

Ensuite, chaque fois que tu passes une chispa en `aceptada`, la colonne `traducciones` se remplit toute seule en quelques secondes. Le ciel l'affiche alors dans la langue de chaque visiteur, avec la mention « Traduite par l'IA ».

Aucune clé secrète ne va dans GitHub : elles restent dans les « Secrets » de Supabase.
