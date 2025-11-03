# AA Educates - Frontend Client

Next.js frontend application for the AA Educates Digital Learning Platform.

## Tech Stack

- **Next.js 16.0.1** - React framework with Pages Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19.2.0** - UI library

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
client/
├── pages/
│   ├── _app.tsx           # App wrapper with global styles
│   ├── index.tsx          # Home page
│   ├── login.tsx          # Login page
│   ├── student/
│   │   └── dashboard.tsx  # Student dashboard
│   ├── parent/
│   │   └── dashboard.tsx  # Parent dashboard
│   ├── corporate/
│   │   └── dashboard.tsx  # Corporate partner dashboard
│   └── admin/
│       └── dashboard.tsx  # Admin dashboard
├── styles/
│   └── globals.css        # Global styles with Tailwind
├── public/                # Static assets
├── next.config.ts         # Next.js configuration
└── package.json           # Dependencies
```

## API Configuration

The Next.js app is configured to proxy API requests to the Django backend running on `http://127.0.0.1:8000`.

All API calls should use `/api/*` endpoints which will be automatically proxied to the Django backend.

Example:
- Frontend calls: `/api/users/users/`
- Proxied to: `http://127.0.0.1:8000/api/users/users/`

## Pages

### Home (`/`)
Landing page with links to login and dashboard previews.

### Login (`/login`)
Authentication page for all user types.

### Student Dashboard (`/student/dashboard`)
Student portal with access to:
- Projects
- Achievements
- Mentorship
- Learning materials
- Community
- Progress tracking

### Parent Dashboard (`/parent/dashboard`)
Parent portal to monitor:
- Children's progress
- Projects and achievements
- Mentorship sessions
- Communications

### Corporate Dashboard (`/corporate/dashboard`)
Corporate partner portal for:
- Sponsored projects
- Impact reports
- Student engagement metrics
- Partnership management
- Payments

### Admin Dashboard (`/admin/dashboard`)
Administrative portal for:
- User management
- Content management
- Platform analytics
- System settings

## Next Steps

- [ ] Set up authentication context/state management
- [ ] Create API client with axios/fetch
- [ ] Add form validation
- [ ] Implement protected routes
- [ ] Connect dashboards to actual API endpoints
- [ ] Add error handling and loading states
