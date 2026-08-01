# Uni Vibe Frontend

React + Vite app — deploy to **Vercel**.

## Local Development

```bash
npm install
npm run dev
```

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
| `VITE_API_URL` | Backend API base URL (Render) |
