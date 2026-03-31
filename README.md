# SmartCard Front

Frontend V1 de SmartCard construit avec React et Vite.

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts utiles

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:watch
```

## Docker

Image de production frontend :

```bash
docker build --build-arg VITE_API_URL=http://localhost:4000/api -t smartcard-front .
docker run -p 3000:80 smartcard-front
```

Points importants :

- le frontend est servi par `nginx`
- l URL backend est injectee au build via `VITE_API_URL`
- la configuration SPA redirige toutes les routes vers `index.html`

## VPS

Fichiers utiles pour le deploiement :

- `deploy/docker-compose.frontend.yml`
- `deploy/frontend.env.example`
- `nginx.conf`

Exemple de lancement sur le serveur :

```bash
cd deploy
cp frontend.env.example .env
# adapter VITE_API_URL
docker compose --env-file .env -f deploy/docker-compose.frontend.yml up -d --build
```

Le conteneur frontend est expose localement sur `127.0.0.1:4173` et doit ensuite etre servi par un reverse proxy public.

## CI

Une GitHub Action `Frontend CI` verifie automatiquement :

- l installation des dependances
- les tests Vitest
- le build de production

Le workflow est lance sur `main`, sur les branches `feature/*` et sur les pull requests.

## Deploy

Une GitHub Action `Frontend Deploy` peut deployer automatiquement sur le VPS a chaque push sur `main` ou manuellement.

Secrets attendus :

- `VPS_HOST`
- `VPS_USERNAME`
- `VPS_SSH_PRIVATE_KEY`
- `VPS_SSH_PASSPHRASE`
- `VPS_SUDO_PASSWORD`
- `FRONTEND_ENV_FILE_BASE64`
- `DEPLOY_PATH` optionnel, sinon `/home/tanga/apps/smartcard/frontend`
