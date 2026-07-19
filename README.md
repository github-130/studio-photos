# Studio Photo — Guide de mise en ligne (100% gratuit)

Tout se fait depuis ton navigateur. Pas besoin d'installer quoi que ce soit
sur ton ordinateur. Compte environ 20-30 minutes.

## Étape 1 — Créer le compte Supabase (stockage des photos + données)

1. Va sur https://supabase.com et clique sur "Start your project"
2. Connecte-toi avec GitHub ou ton email
3. Clique sur "New project"
   - Choisis un nom (ex: "studio-photo")
   - Choisis un mot de passe pour la base de données (note-le quelque part)
   - Choisis la région la plus proche (ex: Europe)
4. Attends 1-2 minutes que le projet se crée

## Étape 2 — Créer les tables

1. Dans le menu de gauche, clique sur "SQL Editor"
2. Clique sur "New query"
3. Ouvre le fichier `supabase.sql` (fourni avec ce projet), copie tout son contenu
4. Colle-le dans l'éditeur, puis clique sur "Run" (en bas à droite)
5. Tu dois voir "Success. No rows returned"

## Étape 3 — Créer l'espace de stockage des photos

1. Dans le menu de gauche, clique sur "Storage"
2. Clique sur "New bucket"
3. Nom du bucket : `photos` (exactement ce nom, en minuscules)
4. Active l'option "Public bucket" (pour que les photos s'affichent)
5. Clique sur "Create bucket"

## Étape 4 — Récupérer tes clés

1. Dans le menu de gauche, clique sur l'icône ⚙️ "Project Settings"
2. Clique sur "API"
3. Note quelque part (Bloc-notes) :
   - **Project URL** (ressemble à `https://xxxxx.supabase.co`)
   - **anon public** key (une longue chaîne de caractères)

Tu en auras besoin à l'étape 6.

## Étape 5 — Mettre le code sur GitHub

1. Va sur https://github.com et crée un compte gratuit si besoin
2. Clique sur le "+" en haut à droite → "New repository"
3. Donne-lui un nom (ex: "studio-photo"), laisse-le "Public", clique "Create repository"
4. Sur la page du repo vide, clique sur "uploading an existing file"
5. Glisse-dépose TOUS les fichiers et dossiers de ce projet (garde la même
   structure de dossiers : `pages/`, `lib/`, `styles/`, etc.)
6. En bas, clique sur "Commit changes"

## Étape 6 — Déployer sur Vercel (hébergement gratuit)

1. Va sur https://vercel.com et clique sur "Sign Up" → connecte-toi avec ton
   compte GitHub (le même qu'à l'étape 5)
2. Clique sur "Add New" → "Project"
3. Trouve ton repo "studio-photo" dans la liste, clique "Import"
4. Avant de cliquer "Deploy", ouvre la section "Environment Variables" et
   ajoute ces 3 lignes (une par une, avec "Add") :

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | (le Project URL noté à l'étape 4) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (la clé anon public notée à l'étape 4) |
   | `PHOTOGRAPHER_PASSWORD` | (choisis un mot de passe pour le photographe) |

5. Clique sur "Deploy"
6. Attends 1-2 minutes → Vercel te donne une adresse du type
   `https://studio-photo-xxxx.vercel.app`

**C'est en ligne !** Cette adresse est gratuite et fonctionne partout,
sur téléphone comme sur ordinateur.

## Étape 7 — Tester

1. Ouvre `https://ton-adresse.vercel.app/photographe`
2. Connecte-toi avec le mot de passe choisi à l'étape 6
3. Crée un client, ajoute des photos
4. Copie le lien généré et ouvre-le dans une fenêtre privée (ou envoie-le
   toi-même par message) pour voir ce que voit le client

## Et après ?

- **Nom de domaine personnalisé** (ex: `www.studio-marie.fr` au lieu de
  `.vercel.app`) : environ 10-15€/an chez un registrar comme OVH ou Namecheap,
  puis à connecter dans Vercel > Settings > Domains. Facultatif, l'adresse
  gratuite fonctionne très bien pour démarrer.
- **Sécurité** : dans cette V1, le mot de passe photographe protège l'accès
  à l'espace de gestion, mais les liens clients ne sont pas chiffrés à
  l'infini — quelqu'un qui devine un code à 6 caractères pourrait tomber sur
  une galerie. C'est peu probable (36^6 combinaisons) mais si le photographe
  gère des photos très sensibles, on pourra renforcer ça plus tard (codes
  plus longs, expiration des liens, etc.)
- Si tu bloques sur une étape, reviens me voir avec le message d'erreur
  exact (capture d'écran si possible) et je t'aide à débloquer.
