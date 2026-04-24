# 🎱 Loto Vision — Back-end

> Serveur WebSocket + API REST du projet Loto Vision.  
> Gère les sessions de partie, synchronise les numéros tirés en temps réel entre l'animateur et tous les joueurs connectés.

---

## 📖 Présentation

**Loto Vision Back** est le cœur temps réel de l'application Loto Vision. Il est responsable de :

- La création et la gestion des **sessions de partie**
- Le **broadcast en temps réel** des numéros tirés à tous les clients connectés via Socket.io
- L'état de la partie géré **en mémoire** (pas de base de données — légèreté maximale)
- L'exposition d'une API REST complémentaire pour la configuration

Le serveur NestJS intègre nativement les **WebSockets** via `@nestjs/websockets` et `@nestjs/platform-socket.io`.

---

## 🔄 Flux temps réel

```
Animateur
  └── émet "draw_number"
        └── Gateway Socket.io (NestJS)
              └── broadcast "number_drawn" → tous les joueurs de la session
```

Chaque session est identifiée par un **code de room** Socket.io. Les joueurs rejoignent la room correspondante à leur partie — ils ne reçoivent que les événements de leur session.

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|---|---|
| Framework | NestJS 11 |
| Langage | TypeScript 5.7 |
| WebSockets | `@nestjs/websockets` + `@nestjs/platform-socket.io` |
| Configuration | `@nestjs/config` (variables d'env) |
| Validation | class-validator |
| Tests | Jest 29 + Supertest |
| Linting / Format | ESLint 9 + Prettier |
| Déploiement | Docker |

> ℹ️ Pas de base de données — l'état des sessions est géré en mémoire. Simple, rapide, sans dépendance externe.

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js ≥ 20
- npm ≥ 9

### Installation

```bash
git clone https://github.com/Gael-Mousset/loto_vision-back.git
cd loto_vision-back
npm install
```

### Variables d'environnement

Crée un fichier `.env` à la racine :

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Ne commit jamais ton `.env` — il est dans le `.gitignore`.

### Lancement en développement

```bash
npm run start:dev
```

Le serveur sera disponible sur [http://localhost:3000](http://localhost:3000).  
Le gateway Socket.io écoute sur le même port.

---

## 📦 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run start` | Lance le serveur en mode normal |
| `npm run start:dev` | Lance en mode watch (hot reload) |
| `npm run start:prod` | Lance le build de production |
| `npm run build` | Compile le projet |
| `npm run test` | Lance les tests unitaires |
| `npm run test:e2e` | Lance les tests end-to-end |
| `npm run test:cov` | Lance les tests avec rapport de couverture |
| `npm run lint` | Analyse et corrige le code avec ESLint |
| `npm run format` | Formate le code avec Prettier |

---

## 🗂️ Structure du projet

```
loto_vision-back/
├── src/
│   ├── game/                  # Module principal (session, tirage, état)
│   │   ├── game.gateway.ts    # Gateway Socket.io — gestion des événements WS
│   │   ├── game.service.ts    # Logique métier (sessions, numéros tirés)
│   │   └── game.module.ts
│   └── main.ts                # Point d'entrée NestJS + config CORS
├── test/                      # Tests e2e
├── dockerfile
└── package.json
```

---

## 🔌 Événements WebSocket

Le gateway Socket.io expose les événements suivants :

### Émis par le client → serveur

| Événement | Rôle | Description |
|---|---|---|
| `join_session` | Joueur / Animateur | Rejoint une session de partie |
| `draw_number` | Animateur | Tire le prochain numéro |
| `reset_game` | Animateur | Réinitialise la partie |
| `leave_session` | Tous | Quitte la session |

### Émis par le serveur → clients

| Événement | Destinataires | Description |
|---|---|---|
| `number_drawn` | Tous les joueurs de la session | Diffuse le numéro tiré |
| `game_state` | Nouveau connecté | Envoie l'état courant de la partie |
| `session_reset` | Tous les joueurs de la session | Notifie la réinitialisation |
| `error` | Client concerné | Erreur de validation ou de session |

> ⚠️ Les noms d'événements exacts dépendent de l'implémentation dans `game.gateway.ts`. Ajuster si besoin.

---

## 🔐 CORS

Le serveur est configuré pour n'accepter les connexions WebSocket et HTTP que depuis l'URL du front-end définie dans `FRONTEND_URL`. Pense à bien renseigner cette variable en production.

---

## 🐳 Déploiement avec Docker

```bash
# Build de l'image
docker build -t loto-vision-back .

# Lancer le conteneur
docker run -p 3000:3000 --env-file .env loto-vision-back
```

---

## 🔗 Lien avec le front-end

Ce back-end est conçu pour fonctionner avec le front-end Loto Vision :  
👉 [github.com/Gael-Mousset/loto_vision-front](https://github.com/Gael-Mousset/loto_vision-front)

---

## 🗺️ Roadmap

- [x] Sessions de partie en temps réel (Socket.io)
- [x] Broadcast des numéros tirés à tous les joueurs
- [x] Gestion multi-sessions (rooms)
- [ ] Persistance optionnelle des parties (base de données)
- [ ] Authentification de l'animateur
- [ ] Validation automatique du carton gagnant côté serveur
- [ ] Gestion des déconnexions / reconnexions

---

## 👤 Auteur

**Gaël Mousset** — [github.com/Gael-Mousset](https://github.com/Gael-Mousset)
