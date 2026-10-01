# Faithmap Portal 1 - End User Frontend

A beautiful, responsive React + TypeScript + Tailwind CSS frontend for discovering churches, worship services, and Christian events near you.

## Features

- ✅ **Event Discovery**: Browse and filter worship services, prayer meetings, and Christian events
- ✅ **Church Directory**: Explore churches with detailed information and service schedules
- ✅ **Responsive Design**: Mobile-first design that works on all devices
- ✅ **Real-time Search**: Filter events by category, date, language, and location
- ✅ **Geolocation**: Find nearby churches and events using browser location
- ✅ **Beautiful UI**: Premium design system with FaithMap brand colors
- ✅ **Type Safe**: Full TypeScript support for better development experience

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing and navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client
- **Zustand** - State management
- **Lucide React** - Icons

## Project Structure

```
src/
├── api/                 # API client and services
│   ├── client.ts       # Axios configuration
│   ├── events.ts       # Event API endpoints
│   └── churches.ts     # Church API endpoints
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header
│   ├── EventCard.tsx   # Event card component
│   ├── ChurchCard.tsx  # Church card component
│   ├── Loading.tsx     # Loading states
│   └── Error.tsx       # Error handling
├── pages/              # Page components
│   ├── HomePage.tsx    # Main event discovery page
│   ├── ChurchesPage.tsx # Church directory
│   └── EventDetailPage.tsx # Event details
├── store/              # Zustand state management
│   ├── useEventStore.ts
│   └── useChurchStore.ts
├── hooks/              # Custom React hooks
│   ├── useGeolocation.ts
│   └── useFetch.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── formatters.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- Your FaithMap Portal 2 (Backend) API running on Railway

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd faithmap-portal1
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your API URL**
   ```env
   VITE_API_URL=https://your-faithmap-api.railway.app
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# API Base URL
VITE_API_URL=http://localhost:8000  # Development
# VITE_API_URL=https://your-api.railway.app  # Production
```

## API Integration

The frontend connects to the Portal 2 backend API. Make sure the backend is deployed and running.

### Available API Endpoints

**Events:**
- `GET /events` - Get all events
- `GET /events/:id` - Get event details
- `GET /events/nearby` - Get nearby events
- `POST /events/:id/interested` - Mark as interested

**Churches:**
- `GET /churches` - Get all churches
- `GET /churches/:id` - Get church details
- `GET /churches/nearby` - Get nearby churches

## Component Documentation

### EventCard
Displays event information in a card format with date, time, location, and category.

```tsx
<EventCard event={event} onClick={() => navigate(`/events/${event.id}`)} />
```

### ChurchCard
Shows church details including location, services, and action buttons.

```tsx
<ChurchCard church={church} />
```

### LoadingSpinner / LoadingSkeletons
Loading states for better UX:

```tsx
<LoadingSpinner />
<LoadingSkeletons count={3} />
```

## State Management

Using Zustand for lightweight state management:

```tsx
import { useEventStore } from '@/store/useEventStore'

const { events, filters, setEvents, setFilters } = useEventStore()
```

## Custom Hooks

### useGeolocation
Get user's location with permission handling:

```tsx
const { location, isLoading, error, requestLocation } = useGeolocation()
const userLocation = await requestLocation()
```

### useFetch
Fetch data with loading and error states:

```tsx
const { data, isLoading, error, refetch } = useFetch(
  () => eventService.getEvents()
)
```

## Styling

Uses Tailwind CSS with FaithMap custom theme colors:

- **Primary Green**: `#168F78` - Main actions
- **Primary Blue**: `#78BDE8` - Accents
- **Dark Navy**: `#17324D` - Text
- **Light Blue**: `#EAF6FF` - Background
- **Soft White**: `#E8F6F0` - Secondary background

## Responsive Design

The design adapts to all screen sizes:
- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Color contrast compliant
- ✅ Reduced motion support

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Performance

- Lazy loading for images
- Code splitting with React Router
- Optimized bundle size (~250KB gzipped)
- CSS-in-JS with Tailwind for minimal CSS

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Railway

```bash
npm install -g @railway/cli
railway link
railway deploy
```

### Environment Variables (Production)

Set the following in your deployment platform:
- `VITE_API_URL` - Your production API URL

## Troubleshooting

### API Connection Issues
- Verify `VITE_API_URL` is correct
- Ensure backend is running and accessible
- Check browser console for CORS errors

### Build Errors
- Clear `node_modules` and `dist` directories
- Run `npm install` again
- Check Node.js version (should be 16+)

### Styling Issues
- Ensure Tailwind CSS is properly compiled
- Clear browser cache
- Check for conflicting CSS classes

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

Proprietary - Faithmap.in

## Support

For issues or questions, contact the FaithMap team.
