# Guide de déploiement — Pro WhatsApp PDB

Ce guide explique, étape par étape, comment mettre la plateforme en ligne et
la rendre **100 % fonctionnelle pour le premier utilisateur** (y compris
l'envoi/réception de messages WhatsApp).

Il y a **trois ingrédients** à préparer. Aucun n'est inclus dans le code (ce
sont des comptes et des clés qui vous appartiennent) :

1. **Supabase** — la base de données + l'authentification (gratuit pour démarrer).
2. **Meta / WhatsApp Business** — l'API officielle pour envoyer/recevoir.
3. **Netlify** — l'hébergement de l'application.

---

## 1) Supabase (base de données + comptes)

1. Créez un compte sur <https://supabase.com> puis un nouveau projet
   (région la plus proche, ex. *West Europe*).
2. Dans **Project Settings → API**, notez :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`
3. **Créez les tables** : ouvrez **SQL Editor**, collez **tout** le contenu du
   fichier [`supabase/all-migrations.sql`](./supabase/all-migrations.sql) et
   cliquez sur **RUN** — il crée toutes les tables d'un seul coup.
   *(Alternative : exécuter chaque fichier de
   [`supabase/migrations/`](./supabase/migrations) dans l'ordre des numéros
   001 → 013.)*
4. **Stockage des avatars** : la migration `008` crée le bucket de stockage.
   Vérifiez dans **Storage** qu'un bucket `avatars` existe.
5. **Authentification** : dans **Authentication → URL Configuration**, mettez
   votre futur domaine Netlify dans *Site URL* et *Redirect URLs*
   (ex. `https://votre-site.netlify.app`). Pour démarrer vite, vous pouvez
   désactiver la confirmation par e-mail dans **Authentication → Providers →
   Email** (« Confirm email » OFF), puis la réactiver plus tard.

## 2) Meta / WhatsApp Business (envoi & réception)

> Il faut un compte **Meta Business** et un **numéro WhatsApp** dédié (un
> numéro qui n'est pas déjà utilisé dans l'app WhatsApp normale). Meta offre
> un **numéro de test** gratuit pour commencer immédiatement.

1. Allez sur <https://developers.facebook.com> → **My Apps** → **Create App**
   → type **Business**.
2. Ajoutez le produit **WhatsApp** à l'application.
3. Dans **WhatsApp → API Setup**, récupérez :
   - **Phone number ID** (identifiant du numéro)
   - un **Access Token**. Pour la production, créez un **jeton permanent** via
     un *System User* (Business Settings → Users → System Users → Generate
     token, permissions `whatsapp_business_messaging` +
     `whatsapp_business_management`).
4. Dans **App Settings → Basic**, copiez l'**App Secret** → `META_APP_SECRET`.
5. **Webhook** (à faire *après* le déploiement Netlify, une fois l'URL connue) :
   - **Callback URL** : `https://votre-site.netlify.app/api/whatsapp/webhook`
   - **Verify token** : une phrase secrète de votre choix (vous la
     ressaisirez à l'identique dans l'app, voir §4).
   - Abonnez-vous au champ **messages**.
6. **Modèles de messages** (*templates*) : pour écrire en premier à un client
   ou faire une diffusion, Meta exige des modèles approuvés. Créez-les dans
   **WhatsApp → Message Templates** (souvent en français, ex. un modèle
   `bienvenue`). L'app peut les synchroniser ensuite.

## 3) Clé de chiffrement

Générez la clé qui chiffre les jetons WhatsApp en base (à coller dans
`ENCRYPTION_KEY`) :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4) Netlify (hébergement)

1. Sur <https://app.netlify.com> → **Add new site → Import from Git** →
   choisissez ce dépôt GitHub.
2. Netlify détecte Next.js automatiquement (`netlify.toml` est déjà fourni).
3. Dans **Site settings → Environment variables**, ajoutez :

   | Variable                          | Valeur                                   |
   | --------------------------------- | ---------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`        | URL du projet Supabase                   |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | clé `anon`                               |
   | `SUPABASE_SERVICE_ROLE_KEY`       | clé `service_role` (secret)              |
   | `ENCRYPTION_KEY`                  | la clé hex de 64 caractères (§3)         |
   | `META_APP_SECRET`                 | l'App Secret Meta                        |
   | `NEXT_PUBLIC_SITE_URL`            | `https://votre-site.netlify.app`         |
   | `NEXT_PUBLIC_DEFAULT_COUNTRY_CODE`| `228` (Togo) — optionnel                 |

4. Lancez le déploiement. Une fois en ligne, **retournez à l'étape §2.5**
   pour configurer le webhook avec l'URL réelle.

## 5) Première connexion & branchement WhatsApp

1. Ouvrez votre site → **Créer un compte** → connectez-vous.
2. Allez dans **Paramètres → WhatsApp** et renseignez :
   - **Phone number ID** (de Meta, §2.3)
   - **Access Token** (de Meta, §2.3)
   - **Verify token** : exactement la même phrase secrète qu'à l'étape §2.5
3. L'app affiche l'**URL du webhook** à recopier dans Meta (§2.5).
4. Envoyez-vous un message test depuis la **boîte de réception**.

> ℹ️ **Fenêtre de 24 h** : WhatsApp n'autorise les messages libres que dans
> les 24 h suivant le dernier message du client. En dehors, il faut un
> **modèle approuvé** (les diffusions utilisent des modèles).

---

## Numéros de téléphone (Togo / Afrique)

Les contacts peuvent être saisis au format local togolais (8 chiffres,
ex. `90 12 34 56`) : l'app ajoute automatiquement l'indicatif **+228** avant
l'envoi à WhatsApp. Pour un autre pays, définissez
`NEXT_PUBLIC_DEFAULT_COUNTRY_CODE` (voir `.env.local.example`).

## Automatisations programmées (optionnel)

Les étapes « Attendre » des automatisations nécessitent un *cron* qui appelle
`/api/automations/cron` et `/api/flows/cron`. Sur Netlify, utilisez les
**Scheduled Functions** ou un service externe (cron-job.org) en protégeant
l'appel avec `AUTOMATION_CRON_SECRET`. Non requis pour démarrer.
