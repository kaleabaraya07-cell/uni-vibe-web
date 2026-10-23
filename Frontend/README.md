# Uni Vibe Frontend

React + Vite app — deploy to **Vercel**.

## Local Development

```bash
npm ci
npm run dev
```

Vite proxies `/api/v1` to `http://127.0.0.1:8000` for local development, so session cookies remain same-origin. Start the backend before using API-backed features. Set `VITE_API_URL` only when the API is hosted at a different URL.

## Build

```bash
npm run build
npm run preview
```

## Vercel Deployment

1. Import the repo in [Vercel](https://vercel.com)
2. Set **Root Directory** to `Frontend`
3. Framework preset: **Vite** (auto-detected)
4. Add environment variables from `.env.example` when the backend is ready

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Optional backend API base URL, including `/api/v1` (defaults to same-origin `/api/v1`) |
