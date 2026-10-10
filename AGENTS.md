# AGENTS.md — Consignes pour l'agent IA (projet KULTURA)

Tu es l'agent de développement du projet **KULTURA**, une plateforme culturelle et créative par abonnement pour l'Afrique francophone (Cameroun en premier).
Lis ce fichier en entier avant d'écrire du code. Lis aussi `ARCHITECTURE.md` (schéma de base, flux, sécurité).

La maquette de référence est `reference/index.html` (prototype statique). **Inspire-toi de sa structure, de ses textes et de ses écrans, mais ne copie pas son code** : il contient des données en dur, des `alert()` et du HTML injecté sans protection.

---

## 1. Règles absolues

1. **Langue de l'interface : français.** Code, noms de variables et commentaires techniques : anglais ou français, mais cohérent.
2. **Mobile d'abord.** Chaque écran doit être conçu pour 360 px de large avant le bureau.
3. **Aucune donnée en dur** dans les composants : tout vient de Supabase (ou de `seed.sql` pour la démo).
4. **Sécurité** : jamais de clé secrète côté navigateur ; RLS sur chaque table ; validation Zod de chaque entrée serveur ; jamais de `dangerouslySetInnerHTML` avec du contenu utilisateur.
5. **Argent** : entiers en FCFA (XAF), jamais de décimales. Un paiement n'est validé que par le serveur (webhook vérifié), jamais par le navigateur.
6. **Légèreté** : pas de bibliothèque lourde sans raison. Images en WebP/AVIF et chargement différé.
7. **Ne casse rien** : avant de modifier un fichier existant, lis-le. Fais des changements petits et ciblés.
8. **Ne jamais inventer** un nom de table, de colonne ou de variable : vérifie dans `ARCHITECTURE.md` et `supabase/migrations/`.
9. Si une consigne manque ou est ambiguë, **pose une question** au lieu de deviner.

---

## 2. Stack

- **Next.js** (App Router) + **TypeScript** (mode strict)
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Auth, Postgres + RLS, Storage, Realtime)
- **Zod** + React Hook Form · **TanStack Query**
- **next-intl** (français par défaut)
- **Leaflet + OpenStreetMap** pour la carte des Relais
- **PWA** (Serwist ou next-pwa)
- Paiement **Mobile Money** (CinetPay / Notch Pay / Flutterwave) derrière une interface unique `PaymentProvider`
- Tests : Vitest, Playwright · Lint : ESLint + Prettier

### Commandes
```bash
npm install
npm run dev          # développement
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest
npm run build        # build de production
```
Avant de dire qu'une tâche est terminée : `lint`, `typecheck` et `test` doivent passer.

---

## 3. Structure et conventions

```
src/app/(public)  (auth)  (membre)  admin  api
src/modules/<module>/{components,queries.ts,actions.ts,schemas.ts}
src/components/ui        # shadcn
src/components/kultura   # composants de marque
src/lib/{supabase,format.ts,auth.ts}
supabase/{migrations,seed.sql}
```

- Un **module = un dossier** (`pass`, `mediatheque`, `apprendre`, `communaute`, `evenements`, `microfarm`, `services`, `relais`, `paiement`).
- Lectures dans `queries.ts`, écritures dans `actions.ts` (Server Actions), schémas Zod dans `schemas.ts`.
- Composants serveur par défaut ; `"use client"` seulement si nécessaire (interactivité).
- Un composant = un fichier, nommé en `PascalCase`. Fonctions courtes. Pas de `any`.
- Chaque écran gère **trois états** : chargement (squelette), vide (message utile) et erreur (message clair en français).
- Accessibilité : contraste suffisant, libellés sur les champs, focus visible, cibles tactiles ≥ 44 px, texte alternatif sur les images.
- Messages d'erreur utilisateur : simples, en français, sans jargon technique.

### Formats
```ts
// lib/format.ts
export const fcfa = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';          // 75 000 FCFA
export const dateFr = (d: Date | string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Africa/Douala' }).format(new Date(d));
```

---

## 4. Direction artistique : « style africain »

Le rendu doit sembler **enraciné, chaleureux et contemporain**, pas un modèle SaaS générique ni un cliché folklorique.

### 4.1 Couleurs (tokens Tailwind)

À mettre dans `tailwind.config.ts` (`theme.extend.colors`) :

```ts
colors: {
  terracotta: { DEFAULT: '#943d1e', light: '#b35433', soft: '#ffdbd0', dark: '#7d2c0e' },
  ocre:       { DEFAULT: '#cca730', soft: '#ffe088', dark: '#735c00' },
  indigo:     { DEFAULT: '#1E2A78', light: '#3A4BB3', soft: '#E2E5FF' },   // inspiré du Ndop
  forest:     { DEFAULT: '#2F5D3A', soft: '#DCEBDD' },                     // MicroFarm
  creme:      '#faf9f5',
  sable:      { DEFAULT: '#efeeea', dark: '#dcc1b8' },
  encre:      '#1b1c1a',
}
```
- Fond principal : `creme`. Texte : `encre`.
- Action principale (boutons, liens forts) : `terracotta`.
- Accent secondaire (savoir, apprentissage) : `indigo`.
- Distinctions, badges, Pass : `ocre`.
- MicroFarm : `forest`.
- Mode sombre : fond `#14110f`, mêmes accents éclaircis. Vérifier le contraste (≥ 4,5:1 pour le texte).

### 4.2 Typographie
- Titres : **Playfair Display** (ou **Fraunces**), graisse 600–700.
- Texte et interface : **Inter**.
- Étiquettes en capitales espacées (`tracking-wider`, `text-xs`) pour les catégories.
- Charger les polices avec `next/font` (hébergement local, pas de requête externe).

### 4.3 Motifs
Créer des SVG légers dans `public/patterns/` et un composant `PatternDivider` :
- **Bande Ndop** : petits losanges et croix répétés, indigo sur crème, en séparateur de sections.
- **Zigzag / chevrons** inspirés du Kente et du bogolan, en bordure de cartes.
- **Fond de Pass** : trame géométrique à 8–10 % d'opacité sur dégradé terracotta → `#7d2c0e`.
- Chaque motif : **moins de 3 Ko**, répété en CSS (`background-repeat`), jamais en grande image.
- Utiliser les motifs avec **parcimonie** : un séparateur par page, une bordure sur les cartes importantes. Le contenu reste lisible.
- Certains motifs traditionnels ont un sens culturel : ne pas les mélanger au hasard ; documenter l'origine choisie dans un commentaire.

### 4.4 Composants de marque (`src/components/kultura/`)
| Composant | Description |
|---|---|
| `PassCard` | Carte membre : motif tissé, niveau, ID `KLT-XXXX-XX`, QR code, bordure ocre |
| `WovenProgress` | Barre de progression en bande tissée (rayures alternées) |
| `PatternDivider` | Séparateur de section à motif |
| `SectionTitle` | Titre en Playfair + petit filet ocre |
| `AdinkraIcon` | Icône de catégorie (symboles simples, SVG) |
| `FcfaPrice` | Prix formaté + variante « tarif membre » barré |
| `EventCard`, `CourseCard`, `MediaCard`, `CreatorCard`, `RelaisCard` | Cartes de contenu au style commun |

### 4.5 Formes et mouvement
- Coins arrondis généreux (`rounded-2xl`), ombres douces et chaudes (teinte terracotta à faible opacité).
- Mouvements courts et sobres (150–250 ms) ; respecter `prefers-reduced-motion`.
- Photographies de vraies scènes locales (artisans, marchés, festivals) ; prévoir un fond de repli en dégradé de marque tant que les images ne sont pas fournies. **Ne pas utiliser les liens d'images de la maquette** (temporaires).

---

## 5. Comment travailler (méthode)

Travaille **par petites étapes** et **un module à la fois**.

1. Reformule la tâche en 2–3 lignes et liste les fichiers que tu vas créer ou modifier.
2. Si la base change : écris d'abord une **migration SQL** (`supabase/migrations/`), avec RLS.
3. Écris le code (schéma Zod → requêtes/actions → composants → page).
4. Ajoute les trois états (chargement, vide, erreur) et vérifie le rendu à 360 px.
5. Lance `lint`, `typecheck`, `test`.
6. Résume ce que tu as fait et ce qui reste, puis propose un message de commit court.

Ne lance pas plusieurs modules dans la même demande.

---

## 6. Ordre de réalisation

**Phase 1 — Fondations** : design system (tokens, polices, `PatternDivider`, `WovenProgress`), authentification, profil, **Pass avec QR**, base + RLS, déploiement.
**Phase 2 — Contenu** : médiathèque (catalogue, lecture, progression), apprendre (cours, modules, certificats), événements (réservation, billets).
**Phase 3 — Social et revenus** : communauté (fil, clubs, commentaires), paiement Mobile Money, cagnotte, annuaire de talents et réservations.
**Phase 4 — Terrain et extension** : Relais (carte, scan, visites), MicroFarm, notifications temps réel, back-office, PWA hors-ligne, anglais.

---

## 7. Écrans à construire (d'après la maquette)

| Route | Écran |
|---|---|
| `/` | Landing : « Divertir. Découvrir. Apprendre. Créer. Évoluer. », 4 cartes « Votre univers », boutons Explorer / Devenir membre |
| `/home` | Tableau de bord : « Bonjour, {prénom} », ma progression, recommandé pour vous, aperçu du Pass, événements à venir, communauté |
| `/explore` | Grille des 8 modules : Médiathèque, Apprendre, Communauté, Événements, MicroFarm, Services créatifs, Relais, Carte & avantages |
| `/mediatheque` | « Continuer la lecture », exploration par format, détail d'un contenu |
| `/apprendre` | Masterclass en cours, ma progression, certificats, catalogue (gratuit / FCFA) |
| `/communaute` | Fil (publier, aimer, commenter), discussions tendances, clubs, cagnotte |
| `/evenements` | Liste, détail, réservation, « Mes billets » avec QR |
| `/microfarm` | Concept, indicateurs (projets actifs, contributeurs), expérimentations avec progression |
| `/services` | Annuaire de talents : discipline, note, tarif membre, réserver |
| `/relais` | Liste des Relais, horaires, services, carte |
| `/pass` | Carte membre, avantages exclusifs, parcours (relais visités, livres, événements) |
| Modales | Recherche globale, centre de notifications, détail d'un contenu |

---

## 8. Ce qu'il ne faut PAS faire

- Ne pas copier le HTML de la maquette tel quel.
- Ne pas stocker de montants en décimales.
- Ne pas faire confiance au navigateur pour valider un paiement, un prix ou un rôle.
- Ne pas désactiver la RLS « pour tester ».
- Ne pas ajouter de dépendance sans en expliquer l'utilité et le poids.
- Ne pas mettre de secrets, clés ou mots de passe dans le code, les commits ou ce fichier.
- Ne pas supprimer ou réécrire des fichiers qui n'ont pas de rapport avec la tâche.

---

## 9. Modèles de demandes (à coller dans l'agent)

**Démarrage**
> Lis `AGENTS.md` et `ARCHITECTURE.md`. Initialise le projet Next.js + TypeScript + Tailwind + shadcn/ui, configure les tokens de couleurs et les polices de la section 4, puis crée `PatternDivider`, `WovenProgress` et une page `/design` qui les montre. Ne fais rien d'autre.

**Base et Pass**
> Crée la migration SQL des tables `profiles`, `pass_plans`, `memberships` avec leurs politiques RLS, puis la page `/pass` avec `PassCard` (QR code du `member_code`). Ajoute un `seed.sql` avec deux plans (Reader, Creator).

**Un module**
> Construis le module `evenements` (liste, détail, réservation gratuite pour les membres Pass) en suivant la méthode de la section 5. Le paiement viendra plus tard : prépare seulement l'interface `PaymentProvider`.

**Relecture**
> Relis le code du module `{nom}` : cherche failles de sécurité (RLS, validation, secrets), problèmes d'accessibilité et de performance mobile. Liste les problèmes par gravité, puis propose les corrections sans les appliquer.
