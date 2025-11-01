# AA Educates Frontend (Next.js)

## Prerequisites
- Node.js 18+ and npm 9+
- Backend API running at `http://127.0.0.1:8000`

## Installation

```bash
cd client
npm install
```

## Dependencies (pinned versions)

### Core
- **next**: 15.1.5
- **react**: 19.0.0
- **react-dom**: 19.0.0
- **typescript**: 5.7.2

### API & State
- **axios**: 1.7.9 - HTTP client
- **@tanstack/react-query**: 5.66.4 - Data fetching & caching
- **zustand**: 5.0.2 - State management

### Forms & Validation
- **react-hook-form**: 7.54.2 - Form handling
- **@hookform/resolvers**: 3.9.1 - Form validation resolvers
- **zod**: 3.24.1 - Schema validation

### UI & Styling
- **tailwindcss**: 3.4.17 - Utility-first CSS
- **autoprefixer**: 10.4.20
- **postcss**: 8.4.49
- **clsx**: 2.1.1 - Conditional classnames
- **tailwind-merge**: 2.5.5 - Merge Tailwind classes

### Development
- **eslint**: 9.18.0
- **eslint-config-next**: 15.1.5

## Development

```bash
# Start dev server (default: http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Project Structure

```
client/
  app/                  # Next.js App Router
    layout.tsx          # Root layout
    page.tsx            # Home page
    globals.css         # Global styles
  lib/                  # Utilities
    api.ts              # API client configuration
  components/           # React components (create as needed)
  public/               # Static assets
  package.json          # Dependencies (like requirements.txt)
```

## API Integration

The app is configured to proxy API requests. Update `NEXT_PUBLIC_API_URL` to point to your backend.

See `lib/api.ts` for the axios client setup with authentication interceptors.

