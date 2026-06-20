# Tedpole - Quick Start Guide

Get up and running with the Tedpole frontend in 5 minutes!

## Prerequisites

- Node.js v22.x or higher
- npm v10.x or higher

## Setup Instructions

### 1. Install Dependencies

```bash
cd tedpole-frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Explore the Application

#### Login
Navigate to `http://localhost:3000/login`

- **Email**: any@email.com
- **Password**: any password (mocked authentication)

Or click "Sign in with Google" (mocked)

#### Dashboard
After login, you'll see:
- Key metrics (Open PRs, Incidents, etc.)
- Recent pull requests
- Active incidents
- Recent deployments
- AI suggestions

#### Pull Requests
Navigate to `/pull-requests` to see:
- Complete list of PRs
- Filter by status (All, Open, Merged, Closed)
- Search functionality
- CI/CD status indicators
- Approve and review actions

## Current Pages

| Route | Status | Description |
|-------|--------|-------------|
| `/` | ✅ Complete | Dashboard with overview |
| `/login` | ✅ Complete | Login page with Google SSO |
| `/pull-requests` | ✅ Complete | PR management interface |
| `/deployments` | ⏳ To Build | Deployment tracking |
| `/incidents` | ⏳ To Build | Incident management |
| `/alerts` | ⏳ To Build | Alert configuration |
| `/databases` | ⏳ To Build | PostgreSQL insights |
| `/cost-monitoring` | ⏳ To Build | Cost analytics |
| `/ai-copilot` | ⏳ To Build | AI-powered insights |
| `/analytics` | ⏳ To Build | Team analytics |

## Features to Try

### 1. Dashboard Overview
- View aggregated metrics
- Click on pull request cards
- See recent activity

### 2. Pull Requests
- Search for PRs
- Filter by status tabs
- Check CI/CD status
- View AI suggestions indicator (sparkle icon)
- Try approve button

### 3. Navigation
- Toggle sidebar (chevron button)
- Switch environments (Development/Staging/Production)
- Check notifications (bell icon)
- Switch workspaces (dropdown)

### 4. Theme
- Currently dark mode only
- Light mode toggle visible but not fully implemented

## Mock Data Overview

The app is pre-loaded with realistic mock data:

### Pull Requests (50+)
- Various repositories
- Multiple statuses (open, merged, closed)
- Different authors
- CI/CD statuses
- AI suggestions on some PRs

### Incidents (20)
- Different severity levels
- Multiple services
- Various statuses
- Timelines and resolutions

### Deployments (100)
- Multiple environments
- Success/failure tracking
- Health check data
- Rollback information

### More...
- 200 alerts
- 6 months cost data
- 100 database queries
- 50 AI recommendations
- Developer metrics

## Customization

### Change Mock Data

Edit `services/mock/data.ts`:

```typescript
// Add more pull requests
export const mockPullRequests: PullRequest[] = [
  // ... your data
];
```

### Add New Page

1. Create `app/your-route/page.tsx`
2. Use the layout wrapper:

```typescript
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function YourPage() {
  return (
    <DashboardLayout>
      <h1>Your Page</h1>
    </DashboardLayout>
  );
}
```

3. Add to sidebar in `components/layout/Sidebar.tsx`

### Update Styles

The app uses Tailwind CSS. Edit:
- `app/globals.css` for global styles
- Component files for component-specific styles

## Build for Production

```bash
npm run build
npm start
```

## Development Tips

### Hot Reload
Changes to code will auto-refresh the browser

### TypeScript Errors
Check terminal for type errors during development

### React Query DevTools
React Query DevTools can be added for debugging:

```bash
npm install @tanstack/react-query-devtools
```

Then add to `lib/providers.tsx`:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// In the return:
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools />
</QueryClientProvider>
```

## Common Issues

### Port Already in Use
If port 3000 is occupied:
```bash
# Use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Build Errors
```bash
# Check TypeScript
npm run type-check
```

## Next Steps

1. Explore the code structure
2. Check `PROJECT_STATUS.md` for what's completed
3. Read `README.md` for detailed documentation
4. Start building remaining pages
5. Replace mock APIs with real endpoints

## Getting Help

- Check TypeScript types in `services/types/`
- Review existing pages for patterns
- Look at API services in `services/api/`
- Examine mock data in `services/mock/data.ts`

## API Integration

When ready to connect to real APIs:

1. Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

2. Update service files in `services/api/`
3. Replace mock delays with actual fetch calls
4. Keep the same return types

Example:
```typescript
// Before (mock)
getAll: async () => {
  await delay(500);
  return mockPullRequests;
}

// After (real API)
getAll: async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prs`);
  return response.json();
}
```

That's it! You're ready to explore and extend the Tedpole frontend. Happy coding! 🚀
