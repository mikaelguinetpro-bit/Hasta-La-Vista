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

## 3. Les comptes (pour participer ; regarder reste libre)
Tout est gratuit. Fais les étapes dans l'ordre ; tu peux t'arrêter après l'étape 3 (le lien magique par e-mail suffit pour commencer), Google et Facebook peuvent venir plus tard.

1. **SQL Editor** → colle `cuentas.sql` → **Run**.
2. **Authentication → URL Configuration** :
   - **Site URL** : `https://hasta-la-vista.org`
   - **Redirect URLs** → **Add URL** : `https://hasta-la-vista.org/**`
3. **L'e-mail qui envoie les liens magiques** (sans ça, Supabase n'envoie qu'aux membres de ton équipe Supabase) :
   **Authentication → Emails → SMTP Settings** → active **Enable Custom SMTP** :
   - Sender email : `connecto@hasta-la-vista.org` ; Sender name : `Hasta La Vista`
   - Host : `ssl0.ovh.net` ; Port : `465`
   - Username : `connecto@hasta-la-vista.org` ; Password : le mot de passe de cette boîte (tu le tapes toi-même, ne me l'envoie jamais).
   - Puis **Authentication → Rate Limits** : « emails sent per hour » à 30 par exemple.
   - (Facultatif) **Authentication → Emails → Templates** : tu peux traduire le texte de « Magic Link » et « Confirm signup ».
4. **Google** (gratuit) :
   1. https://console.cloud.google.com → crée un projet « Hasta La Vista ».
   2. **APIs & Services → OAuth consent screen** (Google Auth Platform) : type **External** ; nom « Hasta La Vista » ; e-mail d'assistance `connecto@hasta-la-vista.org` ; domaine autorisé `hasta-la-vista.org` ; politique de confidentialité `https://hasta-la-vista.org/hasta-la-vista/privacidad.html`. Puis **Publish app** (pas besoin de vérification : on ne demande que le nom et l'e-mail).
   3. **Clients → Create client** : type **Web application** ; **Authorized redirect URIs** : `https://cwcolflstshiptghldtq.supabase.co/auth/v1/callback`.
   4. Copie le **Client ID** et le **Client secret** dans Supabase : **Authentication → Sign In / Providers → Google** → active → colle → **Save**.
5. **Facebook** (gratuit) :
   1. https://developers.facebook.com → **My Apps → Create App** ; cas d'usage : **Authenticate and request data from users with Facebook Login** ; nom « Hasta La Vista ».
   2. Dans le cas d'usage Facebook Login → **Permissions** : ajoute `email` (et `public_profile`).
   3. **Facebook Login → Settings** → **Valid OAuth Redirect URIs** : `https://cwcolflstshiptghldtq.supabase.co/auth/v1/callback`.
   4. **App settings → Basic** : App domain `hasta-la-vista.org` ; Privacy Policy URL et User data deletion (instructions URL) : `https://hasta-la-vista.org/hasta-la-vista/privacidad.html` ; catégorie ; icône (le logo HLV). **Save**.
   5. Passe l'app en mode **Live** (en haut de la page).
   6. Copie l'**App ID** et l'**App Secret** dans Supabase : **Authentication → Sign In / Providers → Facebook** → active → colle → **Save**.

6. **Mon espace** : **SQL Editor** → colle `espacio.sql` → **Run**. Ainsi, chacun retrouve aussi ses chispas **accueillies** dans « ✳ Mon espace », sur n'importe quel appareil.

Pour essayer : ouvre la vitrina, écris une chispa, clique « Encender mi estrella » → la fenêtre propose Google, Facebook ou le lien magique. Après la connexion, ta chispa revient toute seule dans le formulaire.

Tant que l'étape 1 n'est pas faite, les chispas des personnes connectées ne peuvent pas s'enregistrer (le site affichera « No se ha podido guardar »).

## 4. The Mix (« Il manque… », « J'apporte… », l'IA qui rapproche)
**Ordre important : fais l'étape 1 AVANT de fusionner la pull request de The Mix.**

1. **SQL Editor** → colle `mix.sql` → **Run**. Il doit afficher « Success ».
2. **La clé Claude (payante, mais très peu chère)** :
   1. Va sur https://console.anthropic.com et crée un compte (avec connecto@ si tu veux).
   2. **Settings → Billing** : achète des crédits (5 $ suffisent pour commencer ; l'IA utilise le plus petit modèle, Claude Haiku).
   3. **Settings → API Keys → Create Key** : nom `hasta-la-vista`. Copie la clé (elle commence par `sk-ant-`). Garde-la pour toi, ne me l'envoie jamais.
3. **Edge Functions → Secrets** : ajoute `ANTHROPIC_API_KEY` = ta clé Claude. (`WEBHOOK_SECRET` existe déjà depuis les traductions : on réutilise le même.)
4. **Edge Functions → Deploy a new function → Via Editor** : nom `mix-ia`, colle le contenu de `functions/mix-ia/index.ts`, désactive « Verify JWT », puis **Deploy**.
5. **Database → Webhooks → Create a new hook** :
   - nom : `mix-ia` ; table : `mix_eventos` ; événement : **Insert** ;
   - type : **Supabase Edge Functions**, fonction `mix-ia`, méthode POST ;
   - **HTTP Headers** → ajoute `x-webhook-secret` = le même mot de passe que `WEBHOOK_SECRET`.

Ensuite, tout seul :
- quand tu accueilles une chispa (`aceptada`), Claude traduit ses besoins dans les 9 langues et cherche qui peut aider ;
- quand quelqu'un écrit ce qu'il peut apporter, Claude cherche les projets qui en ont besoin ;
- quand quelqu'un clique « Je ne pourrai pas venir », le besoin se rouvre et Claude cherche quelqu'un d'autre.
Les propositions de l'IA apparaissent dans le journal de l'IA et dans « ✳ Mon espace » de la personne concernée. **L'IA propose, elle ne décide jamais.**

Pour voir ce que fait l'IA : **Edge Functions → mix-ia → Logs**. Pour voir ses propositions : **Table Editor → sugerencias**.

Aucune clé secrète ne va dans GitHub : elles restent dans les « Secrets » de Supabase.
