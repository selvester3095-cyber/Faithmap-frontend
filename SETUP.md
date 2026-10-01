# FaithMap Portal 1 - Setup Guide

Complete guide to set up and deploy Portal 1 (End User Frontend).

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
```bash
cp .env.example .env
```

Edit `.env` and update `VITE_API_URL` to your Railway backend URL:
```env
VITE_API_URL=https://your-faithmap-api.railway.app
```

### 3. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see the app!

---

## Detailed Setup Steps

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher (or yarn/pnpm)
- Git
- FaithMap Portal 2 (Backend) deployed on Railway

### Step 1: Clone the Repository

```bash
# If you have the repo cloned
cd faithmap-portal1

# If cloning fresh
git clone <your-repo-url>
cd faithmap-portal1
```

### Step 2: Install Dependencies

```bash
npm install

# Alternative package managers
yarn install      # if using Yarn
pnpm install      # if using pnpm
```

This will install:
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Zustand
- And more...

### Step 3: Environment Configuration

1. **Copy example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your API URL:**

   **For Development (local backend):**
   ```env
   VITE_API_URL=http://localhost:8000
   ```

   **For Production (Railway backend):**
   ```env
   VITE_API_URL=https://your-project.railway.app
   ```

   Find your Railway API URL:
   1. Go to Railway Dashboard
   2. Select your FaithMap project
   3. Go to the backend service
   4. Copy the public URL

### Step 4: Verify Backend Connection

Before starting the dev server, ensure your backend is running:

```bash
# Test API connection (if using development backend)
curl http://localhost:8000/events

# Should return a JSON response with events
```

### Step 5: Start Development Server

```bash
npm run dev
```

**Output should show:**
```
VITE v5.0.8  ready in 123 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

Open http://localhost:3000 in your browser!

---

## Project Structure Overview

```
faithmap-portal1/
├── src/
│   ├── api/              # API client & services
│   ├── components/       # Reusable React components
│   ├── pages/            # Page components (Home, Churches, etc.)
│   ├── store/            # Zustand state management
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies
├── .env.example          # Example environment variables
└── README.md             # Project documentation
```

---

## Available Scripts

### Development

```bash
npm run dev
```
Start development server on port 3000 with hot reload.

### Build

```bash
npm run build
```
Create optimized production build in `dist/` folder.

### Preview

```bash
npm run preview
```
Preview the production build locally.

### Type Check

```bash
npm run type-check
```
Check TypeScript types without building.

### Lint

```bash
npm run lint
```
Check code quality with ESLint.

---

## API Integration

### Events Endpoint

The app connects to these event endpoints:

```
GET /events
  Query params: skip, limit, category, start_date, end_date

GET /events/:id
  Returns single event details

GET /events/nearby?lat=<lat>&lng=<lng>&radius=<km>
  Returns events near coordinates

GET /events/upcoming?limit=10
  Returns upcoming events
```

### Churches Endpoint

```
GET /churches
  Query params: skip, limit, location

GET /churches/:id
  Returns single church details

GET /churches/nearby?lat=<lat>&lng=<lng>&radius=<km>
  Returns churches near coordinates

GET /churches/search?q=<query>
  Search churches by name
```

### Response Format

Expected response format:
```json
{
  "items": [...],
  "total": 100,
  "skip": 0,
  "limit": 20
}
```

---

## Deployment

### Deploy to Vercel (Recommended)

**Easiest deployment option:**

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - `VITE_API_URL`: Your production API URL
5. Click Deploy

That's it! Your app is live.

### Deploy to Railway

**If using Railway for both frontend and backend:**

1. Connect GitHub repository
2. Create new service
3. Select "Node.js"
4. Add environment variables
5. Deploy

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Drag `dist` folder to Netlify

Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Variables (Production)

Set these in your deployment platform:

**Vercel:** Settings → Environment Variables
**Railway:** Environment tabs
**Netlify:** Site settings → Build & deploy → Environment

```
VITE_API_URL=https://your-production-api.railway.app
```

---

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3001
```

### API Connection Error

**Issue:** "Failed to load events"

**Solutions:**
1. Verify `VITE_API_URL` in `.env`
2. Check if backend is running
3. Check CORS headers (backend should allow frontend origin)
4. Look at browser console for error details

```javascript
// Check in browser console
fetch('YOUR_API_URL/events')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Styling Issues

**Issue:** Tailwind styles not applied

**Solutions:**
1. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
2. Restart dev server
3. Check `tailwind.config.js` content paths

### Build Errors

**Issue:** `npm run build` fails

**Solutions:**
1. Clear node_modules:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf dist .vite
   npm run build
   ```

3. Check TypeScript errors:
   ```bash
   npm run type-check
   ```

---

## Development Tips

### Hot Module Replacement (HMR)
- Changes automatically refresh in browser
- State is preserved when possible
- No need to restart dev server

### TypeScript Benefits
- Full autocomplete in VS Code
- Catch errors before runtime
- Better refactoring support

### Component Development
1. Create component file in `src/components/`
2. Add to `src/components/index.ts`
3. Import and use

```tsx
import { EventCard } from '@/components'

export function MyPage() {
  return <EventCard event={event} />
}
```

### Adding API Endpoints
1. Add service in `src/api/`
2. Use in components with `useFetch` hook
3. Handle loading/error states

```tsx
const { data, isLoading, error } = useFetch(
  () => eventService.getEvents()
)
```

---

## Next Steps

1. ✅ Install and run locally
2. ✅ Connect to your backend API
3. ⏭️ Deploy to production
4. ⏭️ Add authentication (Portal 1 public phase)
5. ⏭️ Add more features (saved events, filters, etc.)

---

## Support

- Check README.md for detailed documentation
- Review API documentation
- Check browser console for errors
- Review backend logs if API issues

Good luck! 🚀
