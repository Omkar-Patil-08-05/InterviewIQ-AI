# Setup & Deployment

## Local Development
1. `npm install`
2. Create `.env` file containing:
   - `DATABASE_URL`
   - `GOOGLE_GEMINI_API_KEY`
3. `npx prisma db push`
4. `npm run dev`

## Docker Compose
You can run the entire stack locally using the included Docker configuration:
```bash
docker-compose up -d --build
```

## Vercel Deployment
This repository is pre-configured for zero-config deployment on Vercel.
1. Connect this GitHub repository to Vercel.
2. Under "Environment Variables", ensure `DATABASE_URL` (Supabase) and `GOOGLE_GEMINI_API_KEY` are provided.
3. Vercel will automatically run `npm run build` which includes the `npx prisma generate` step from our custom Next.js build pipeline.
