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
