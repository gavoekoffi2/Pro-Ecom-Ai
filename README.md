# Pro WhatsApp PDB

> **La plateforme CRM WhatsApp pour l'Afrique.** Messagerie partagée,
> contacts, pipelines de vente, diffusions et automatisations sans code —
> sur l'API officielle WhatsApp Business de Meta.

Pensé d'abord pour le **Togo** et l'Afrique francophone : interface en
français, **Franc CFA (F CFA)** par défaut, numéros de téléphone complétés
automatiquement avec l'indicatif **+228**.

## Fonctionnalités

- **Boîte de réception partagée** sur l'API WhatsApp Business officielle —
  plusieurs agents sur un même numéro, attribution des conversations,
  statuts et notes.
- **Contacts + étiquettes + champs personnalisés**, import CSV, déduplication.
- **Pipelines de vente** (Kanban) avec des affaires liées aux conversations.
- **Diffusions** avec modèles approuvés par Meta, suivi de livraison/lecture,
  variables personnalisées par destinataire.
- **Automatisations sans code** — déclencheurs sur messages entrants,
  nouveaux contacts, mots-clés ou planning ; branches conditionnelles,
  attentes, étiquettes, webhooks. Constructeur visuel.
- **Tableau de bord temps réel** — temps de réponse, volume quotidien,
  valeur du pipeline, fil d'activité.
- **Gestion de compte** — e-mail, mot de passe, avatar, déconnexion globale.

## Stack technique

- **App** — Next.js 16 (App Router), React 19, TypeScript, Tailwind v4.
- **Données** — Supabase (Postgres + Auth + Storage + RLS).
- **WhatsApp** — API Meta Cloud (API WhatsApp Business officielle).
- **Sécurité** — chiffrement des jetons (AES-256-GCM), RLS sur chaque table,
  webhooks vérifiés par HMAC, en-têtes CSP, limitation de débit.

## Démarrage local

```bash
npm install
cp .env.local.example .env.local   # renseignez Supabase + Meta
npm run dev
```

Ouvrez <http://localhost:3000>. Vous serez redirigé vers `/login`.

## Mise en ligne (Netlify)

Le guide complet pas-à-pas — création du projet Supabase, configuration de
l'API WhatsApp Business, variables d'environnement et déploiement Netlify —
se trouve dans **[`DEPLOIEMENT.md`](./DEPLOIEMENT.md)**.

## Scripts

| Commande            | Rôle                        |
| ------------------- | --------------------------- |
| `npm run dev`       | Serveur de développement    |
| `npm run build`     | Build de production         |
| `npm start`         | Lance le build de production|
| `npm run lint`      | ESLint                      |
| `npm run typecheck` | Vérification TypeScript     |
| `npm test`          | Tests (Vitest)              |

## Licence & origine

Distribué sous licence [MIT](./LICENSE). Ce produit est une personnalisation
du modèle open-source **wacrm** (© Arnas Donauskas), adapté et rebaptisé
**Pro WhatsApp PDB** pour le marché africain.
