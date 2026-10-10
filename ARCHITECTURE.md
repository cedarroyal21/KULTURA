# KULTURA — Architecture technique

> Plateforme culturelle et créative par abonnement (« Pass »), conçue pour l'Afrique francophone, à partir de la maquette `index.html` fournie par le client.
> Objectif : tout construire avec des outils **gratuits et sans carte bancaire**, puis pouvoir monter en charge sans tout réécrire.

---

## 1. Vision produit

KULTURA réunit en un seul endroit : lire, apprendre, sortir, créer, échanger et cultiver. L'accès se fait par un **Pass membre** (niveaux : Reader, Creator…) qui donne droit à des avantages (billetterie prioritaire, tarifs membres, accès aux Relais).

### Modules (issus de la maquette)

| Module | Contenu |
|---|---|
| **Landing** | Présentation, « Explorer KULTURA », « Devenir membre » |
| **Home (tableau de bord)** | Salutation, progression, recommandations, aperçu du Pass, événements à venir |
| **Explore** | Hub de navigation vers tous les modules |
| **Médiathèque** | Livres, audio, vidéo, magazines ; « Continuer la lecture » ; filtres par format |
| **Apprendre** | Cours et masterclasses, progression par module, certificats, catalogue gratuit/payant |
| **Communauté** | Fil de publications, likes, commentaires, clubs, discussions tendances, cagnotte |
| **Événements** | Concerts, expositions, ateliers, festivals ; réservation ; gratuit pour membres Pass |
| **MicroFarm Agri** | Projets d'agriculture urbaine, phases, indicateurs, rejoindre le hub |
| **Services créatifs** | Annuaire de talents évalués, tarif membre en FCFA, réservation |
| **Relais** | Lieux physiques (bibliothèque, coworking, ateliers), horaires, carte |
| **Carte membre (Pass)** | Identifiant, niveau, avantages exclusifs, parcours (relais visités, livres, événements) |
| **Transverse** | Recherche globale, centre de notifications, profil |

---

## 2. Stack technique

| Couche | Choix | Remarque |
|---|---|---|
| Langage | **TypeScript** partout | Moins de bugs, meilleur pour l'agent IA |
| Front | **Next.js** (App Router) | Pages publiques rendues côté serveur (SEO), reste interactif |
| Style | **Tailwind CSS** + **shadcn/ui** | Reprendre les tokens de la maquette (voir `AGENTS.md`) |
| Mobile | **PWA** (`next-pwa` ou Serwist) | Installable, cache hors-ligne des pages clés |
| Base de données | **PostgreSQL** via **Supabase** | Sécurité par ligne (RLS) |
| Auth | Supabase Auth | Email + mot de passe, Google, lien magique |
| Fichiers | Supabase Storage | Couvertures, PDF/EPUB, avatars. Vidéos : YouTube non répertorié au départ |
| Temps réel | Supabase Realtime | Fil communautaire, notifications |
| Paiement | **Mobile Money** : CinetPay, Notch Pay ou Flutterwave | Choisir selon frais et couverture MTN/Orange |
| Carte | Leaflet + OpenStreetMap | Aucune clé d'API |
| Emails | Resend | Reçus, confirmations |
| QR code | `qrcode` (génération) + `html5-qrcode` (scan) | Pass et billets |
| Validation | **Zod** | Mêmes schémas côté formulaire et serveur |
| Formulaires | React Hook Form | |
| Données client | TanStack Query | Cache et rechargement |
| i18n | `next-intl` | Français d'abord, anglais prévu |
| Tests | Vitest + Playwright (parcours clés) | |
| Hébergement | **Cloudflare Pages** (production), Vercel gratuit pour les démos | Vérifier les conditions d'usage commercial de chaque plan |
| Code / CI | GitHub + GitHub Actions | Lint, types et tests à chaque push |

---

## 3. Vue d'ensemble

```
┌──────────────────────────── Utilisateur ────────────────────────────┐
│               PWA (mobile d'abord) · navigateur web                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │ HTTPS
                        ┌─────────▼─────────┐
                        │     Next.js       │  pages SSR, composants,
                        │  (Cloudflare)     │  routes API / actions serveur
                        └───┬─────────┬─────┘
                            │         │
              ┌─────────────▼──┐   ┌──▼───────────────────┐
              │   Supabase     │   │ Services externes     │
              │ ─ Auth         │   │ ─ Mobile Money (webhook)
              │ ─ Postgres+RLS │   │ ─ Resend (emails)     │
              │ ─ Storage      │   │ ─ OpenStreetMap       │
              │ ─ Realtime     │   └──────────────────────┘
              └────────────────┘
```

**Principe** : un **monolithe modulaire**. Un seul dépôt, un seul déploiement, un dossier par module métier. On découpera en services uniquement si la charge l'exige un jour.

---

## 4. Structure du projet

```
kultura/
├─ AGENTS.md                  # consignes pour l'agent IA
├─ ARCHITECTURE.md
├─ .env.example
├─ supabase/
│  ├─ migrations/             # fichiers SQL versionnés
│  └─ seed.sql                # données de démo (Cameroun)
├─ public/
│  ├─ manifest.webmanifest
│  └─ patterns/               # motifs SVG africains
├─ src/
│  ├─ app/
│  │  ├─ (public)/            # landing, événements publics, à propos
│  │  ├─ (auth)/              # connexion, inscription
│  │  ├─ (membre)/            # home, explore, mediatheque, apprendre,
│  │  │                       # communaute, evenements, microfarm,
│  │  │                       # services, relais, pass
│  │  ├─ admin/               # back-office
│  │  └─ api/
│  │     ├─ webhooks/payments/
│  │     └─ tickets/verify/
│  ├─ modules/                # logique métier, un dossier par module
│  │  ├─ pass/  mediatheque/  apprendre/  communaute/
│  │  ├─ evenements/  microfarm/  services/  relais/  paiement/
│  │  └─ (chaque module : components/, queries.ts, actions.ts, schemas.ts)
│  ├─ components/
│  │  ├─ ui/                  # shadcn/ui
│  │  └─ kultura/             # PassCard, WovenProgress, PatternDivider…
│  ├─ lib/
│  │  ├─ supabase/            # clients navigateur et serveur
│  │  ├─ format.ts            # FCFA, dates en français
│  │  └─ auth.ts              # garde par rôle
│  └─ styles/globals.css
└─ tests/
```

---

## 5. Rôles et droits

| Rôle | Peut |
|---|---|
| `visitor` | Voir la landing, les événements publics, le catalogue |
| `member` | Tout le contenu selon son Pass, réserver, publier, s'inscrire aux cours |
| `creator` | Comme membre + profil dans l'annuaire, recevoir des réservations |
| `relais_staff` | Scanner les Pass et billets, enregistrer les visites |
| `admin` | Gérer tout le contenu, les utilisateurs, les paiements |

Les droits sont **appliqués dans la base** (RLS), pas seulement dans l'interface.

---

## 6. Schéma de base de données (PostgreSQL / Supabase)

> Les montants sont stockés en **entiers FCFA (XAF)**, sans décimales.
> À placer dans `supabase/migrations/0001_init.sql` puis découper par module si besoin.

```sql
-- ============ Extensions & types ============
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

create type user_role      as enum ('member','creator','relais_staff','admin');
create type media_kind     as enum ('book','audio','video','magazine');
create type pay_status     as enum ('pending','succeeded','failed','refunded');
create type pay_purpose    as enum ('membership','course','ticket','booking','fundraiser');
create type ticket_status  as enum ('reserved','paid','checked_in','cancelled');
create type booking_status as enum ('requested','confirmed','done','cancelled');

-- ============ Profils & Pass ============
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text not null,
  avatar_url  text,
  city        text,
  bio         text,
  role        user_role not null default 'member',
  member_code text unique,                 -- ex. KLT-8472-X9
  level       int  not null default 1,     -- Explorer, etc.
  xp          int  not null default 0,
  created_at  timestamptz not null default now()
);

create table pass_plans (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,      -- 'reader','creator'
  name          text not null,
  price_xaf     int  not null default 0,
  duration_days int  not null default 30,
  perks         jsonb not null default '[]'
);

create table memberships (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles on delete cascade,
  plan_id    uuid not null references pass_plans,
  status     text not null default 'active',  -- active | expired | cancelled
  started_at timestamptz not null default now(),
  renews_at  timestamptz
);

create table perks (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  min_plan_code   text references pass_plans(code),
  price_xaf       int,
  promo_price_xaf int,
  kind            text                      -- 'service' | 'vip_access' ...
);

-- ============ Médiathèque ============
create table media_items (
  id            uuid primary key default gen_random_uuid(),
  kind          media_kind not null,
  title         text not null,
  author        text,
  description   text,
  cover_url     text,
  file_path     text,                       -- chemin dans Supabase Storage
  language      text default 'fr',
  min_plan_code text references pass_plans(code),
  published     boolean not null default false,
  created_at    timestamptz not null default now()
);
create index on media_items using gin (title gin_trgm_ops);

create table media_progress (
  user_id       uuid references profiles on delete cascade,
  media_id      uuid references media_items on delete cascade,
  progress_pct  int  not null default 0 check (progress_pct between 0 and 100),
  last_position text,
  updated_at    timestamptz not null default now(),
  primary key (user_id, media_id)
);

-- ============ Apprendre ============
create table courses (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  category      text,                       -- Architecture, Musique, Art culinaire…
  description   text,
  cover_url     text,
  price_xaf     int  not null default 0,    -- 0 = gratuit
  is_masterclass boolean not null default false,
  instructor_id uuid references profiles,
  published     boolean not null default false
);
create table course_modules (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references courses on delete cascade,
  position     int  not null,
  title        text not null,
  content_url  text,
  duration_min int,
  unique (course_id, position)
);
create table enrollments (
  user_id      uuid references profiles on delete cascade,
  course_id    uuid references courses  on delete cascade,
  progress_pct int not null default 0,
  completed_at timestamptz,
  primary key (user_id, course_id)
);
create table certificates (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references profiles,
  course_id uuid not null references courses,
  code      text unique not null,
  issued_at timestamptz not null default now()
);

-- ============ Événements & billets ============
create table events (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text,
  city        text,
  venue       text,
  starts_at   timestamptz not null,
  price_xaf   int not null default 0,
  free_for_members boolean not null default false,
  capacity    int,
  cover_url   text,
  published   boolean not null default false
);
create table tickets (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references events,
  user_id       uuid not null references profiles,
  code          text unique not null,        -- encodé dans le QR
  status        ticket_status not null default 'reserved',
  payment_id    uuid,                        -- référencé après création de payments
  checked_in_at timestamptz,
  created_at    timestamptz not null default now(),
  unique (event_id, user_id)
);

-- ============ Communauté ============
create table clubs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text
);
create table club_members (
  club_id uuid references clubs on delete cascade,
  user_id uuid references profiles on delete cascade,
  primary key (club_id, user_id)
);
create table posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references profiles on delete cascade,
  club_id    uuid references clubs,
  body       text not null check (char_length(body) <= 2000),
  media_url  text,
  created_at timestamptz not null default now()
);
create table comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts on delete cascade,
  author_id  uuid not null references profiles on delete cascade,
  body       text not null check (char_length(body) <= 1000),
  created_at timestamptz not null default now()
);
create table post_likes (
  post_id uuid references posts on delete cascade,
  user_id uuid references profiles on delete cascade,
  primary key (post_id, user_id)
);

-- ============ Cagnotte ============
create table fundraisers (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,              -- ex. Restauration du Palais de Foumban
  description text,
  goal_xaf    int  not null,
  raised_xaf  int  not null default 0,
  ends_at     timestamptz,
  active      boolean not null default true
);
create table contributions (
  id            uuid primary key default gen_random_uuid(),
  fundraiser_id uuid not null references fundraisers,
  user_id       uuid references profiles,
  amount_xaf    int  not null check (amount_xaf > 0),
  payment_id    uuid,
  created_at    timestamptz not null default now()
);

-- ============ Services créatifs ============
create table creators (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid unique not null references profiles,
  discipline text not null,                 -- Photographie, UI Design…
  headline   text,
  bio        text,
  rate_xaf   int  not null,
  rate_unit  text not null default 'hour',  -- hour | project
  rating     numeric(2,1),
  verified   boolean not null default false
);
create table bookings (
  id         uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators,
  user_id    uuid not null references profiles,
  starts_at  timestamptz not null,
  hours      int  not null default 1,
  total_xaf  int  not null,
  status     booking_status not null default 'requested',
  payment_id uuid
);

-- ============ Relais ============
create table relais (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,                   -- Espace Culturel KULTURA Bastos
  city     text not null,
  address  text,
  lat      double precision,
  lng      double precision,
  hours    jsonb,                           -- {"tue-sat":"09:00-19:00"}
  services text[]
);
create table relais_visits (
  id         uuid primary key default gen_random_uuid(),
  relais_id  uuid not null references relais,
  user_id    uuid not null references profiles,
  visited_at timestamptz not null default now()
);

-- ============ MicroFarm ============
create table microfarm_projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,               -- Système Racines Libres
  category     text,                        -- Hydroponie, Mycologie…
  description  text,
  phase        text,
  progress_pct int not null default 0,
  cover_url    text,
  active       boolean not null default true
);

-- ============ Paiements ============
create table payments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references profiles,
  provider     text not null,               -- cinetpay | notchpay | flutterwave
  provider_ref text unique,                 -- idempotence des webhooks
  amount_xaf   int  not null check (amount_xaf >= 0),
  status       pay_status not null default 'pending',
  purpose      pay_purpose not null,
  purpose_id   uuid,
  raw          jsonb,
  created_at   timestamptz not null default now()
);

-- ============ Notifications ============
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles on delete cascade,
  title      text not null,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index on notifications (user_id, created_at desc);

-- ============ Création automatique du profil ============
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, member_code)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
          'KLT-' || upper(substr(encode(gen_random_bytes(4),'hex'),1,4)) || '-' ||
                    upper(substr(encode(gen_random_bytes(2),'hex'),1,2)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function handle_new_user();

-- ============ Aide RLS ============
create function is_admin() returns boolean language sql stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;
```

### Règles de sécurité (RLS) à activer sur **chaque** table

```sql
alter table profiles enable row level security;
create policy "profil lisible par tous les connectés" on profiles
  for select using (auth.role() = 'authenticated');
create policy "je modifie mon profil" on profiles
  for update using (id = auth.uid());

alter table media_progress enable row level security;
create policy "ma progression" on media_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table posts enable row level security;
create policy "lecture des posts" on posts
  for select using (auth.role() = 'authenticated');
create policy "j'écris mes posts" on posts
  for insert with check (author_id = auth.uid());
create policy "je modifie/supprime les miens ou admin" on posts
  for all using (author_id = auth.uid() or is_admin());

alter table payments enable row level security;
create policy "je vois mes paiements" on payments
  for select using (user_id = auth.uid() or is_admin());
-- Aucune policy d'écriture : seuls les webhooks serveur (clé service) écrivent.
```

**Règle d'or** : une table sans RLS est une table ouverte. Contenu public (catalogue, événements) : lecture ouverte aux lignes `published = true`. Écritures : toujours restreintes.

---

## 7. Flux critiques

### 7.1 Inscription et Pass
1. Inscription (email ou Google) → trigger crée le `profile` avec un `member_code`.
2. Choix d'un plan → paiement Mobile Money → webhook → `memberships` activé.
3. La page **Pass** affiche la carte avec un **QR code** (contient `member_code` signé).

### 7.2 Paiement Mobile Money (le point le plus sensible)
1. Le serveur crée une ligne `payments` en `pending` et appelle le prestataire.
2. L'utilisateur valide sur son téléphone (USSD / popup MTN ou Orange).
3. Le prestataire appelle `POST /api/webhooks/payments`.
4. Le serveur **vérifie la signature**, puis **revérifie le statut auprès de l'API du prestataire** (ne jamais se fier au seul contenu du webhook).
5. Mise à jour **idempotente** (clé `provider_ref`) : `payments.status`, puis effet métier (billet payé, abonnement activé, cagnotte incrémentée).
6. Notification + email de reçu.

> Ne jamais valider un paiement depuis le navigateur. Seul le serveur décide.

### 7.3 Réservation d'un événement
`reserved` → paiement (ou gratuit si `free_for_members` et Pass actif) → `paid` → QR dans « Mes billets » → scan à l'entrée par `relais_staff` → `checked_in`.

### 7.4 Progression
Chaque lecture ou module terminé met à jour `media_progress` / `enrollments`. À 100 % d'un cours : création du `certificates` (code vérifiable publiquement).

### 7.5 Recherche globale
Recherche Postgres (`pg_trgm` + index GIN) sur médias, cours, événements, talents. Pas de service externe.

---

## 8. Performance et contexte local

- **Mobile d'abord**, tests sur petit écran et connexion 3G simulée.
- Images en **WebP/AVIF**, tailles multiples, chargement différé, `blur` de remplacement.
- Pages mises en cache par la PWA ; mode hors-ligne pour le Pass, les billets et les contenus téléchargés.
- Poids de page cible : **< 150 Ko** de JS initial sur la landing.
- Motifs africains en **SVG inline** (quelques Ko) plutôt qu'en images.
- Prix affichés en FCFA : `new Intl.NumberFormat('fr-FR')` + « FCFA ».
- Dates en français, fuseau `Africa/Douala`.

---

## 9. Sécurité

- RLS sur toutes les tables ; tests dédiés des politiques.
- Clé `service_role` **uniquement côté serveur**, jamais exposée au navigateur.
- Validation Zod de toutes les entrées serveur ; échapper le contenu utilisateur (le prototype injecte du HTML brut dans les réponses : à ne pas reproduire).
- Limitation du débit sur publication, commentaires, connexion.
- Webhooks : signature + revérification + idempotence.
- Fichiers : types et tailles limités, noms régénérés.
- Sauvegardes : export SQL régulier (le plan gratuit n'offre pas de sauvegarde garantie).
- Respect des règles de protection des données personnelles applicables (consentement, suppression de compte).

---

## 10. Variables d'environnement (`.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # serveur uniquement
PAYMENT_PROVIDER=cinetpay
PAYMENT_API_KEY=
PAYMENT_SECRET=                   # signature des webhooks
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 11. Feuille de route

**Phase 1 — Fondations**
Design system africain, authentification, profil, Pass avec QR, base Supabase + RLS, déploiement continu.

**Phase 2 — Contenu**
Médiathèque (catalogue, lecture, progression), Apprendre (cours, modules, certificats), Événements (réservation, billets).

**Phase 3 — Social et revenus**
Communauté (fil, clubs), paiement Mobile Money, cagnotte, annuaire de talents et réservations.

**Phase 4 — Terrain et extension**
Relais (carte, scan, visites), MicroFarm, notifications temps réel, back-office admin, PWA hors-ligne, anglais.

---

## 12. Limites des offres gratuites à connaître

| Service | Point d'attention |
|---|---|
| Supabase gratuit | Projet mis en pause après une semaine d'inactivité ; stockage limité ; pas de sauvegarde garantie |
| Hébergement gratuit | Vérifier l'usage commercial autorisé avant la mise en ligne client |
| Mobile Money | Frais par transaction ; compte marchand à ouvrir (documents de l'entreprise) |
| Resend gratuit | Volume mensuel limité |
| Vidéo | Pas d'hébergement vidéo gratuit illimité : commencer avec YouTube non répertorié |

Quand l'activité du client le justifie, la montée en charge se fait en passant les plans en payant, **sans changer le code**.
