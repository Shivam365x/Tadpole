# Tedpole - AI-Augmented DevOps Platform

A production-quality frontend application for a comprehensive DevOps operations platform that combines PR management, incident tracking, deployment monitoring, cost analytics, and AI-powered insights.

## 🚀 Features

- **Pull Request Management** - Manage GitHub/GitLab PRs with AI-suggested fixes
- **Incident Management** - Track and resolve incidents with AI root cause analysis
- **Deployment Tracking** - Monitor deployments across environments
- **Cost Monitoring** - Track cloud costs with anomaly detection
- **PostgreSQL Insights** - Query performance and database health monitoring
- **Team Analytics** - Developer velocity and productivity metrics
- **Alert Management** - Configure and manage infrastructure alerts
- **AI Copilot** - Natural language queries and intelligent recommendations

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Server State**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide Icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
tedpole-frontend/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard
│   ├── login/               # Auth pages
│   ├── pull-requests/       # PR management
│   └── ...
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── layout/              # Layout components
│   └── dashboard/           # Dashboard components
├── services/
│   ├── api/                 # API service layer
│   ├── mock/                # Mock data
│   └── types/               # TypeScript types
├── stores/                  # Zustand stores
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities
└── constants/               # App constants
```

## 🎨 Design System

- **Theme**: Dark-first with enterprise aesthetics
- **Colors**: Slate-based palette with accent colors
- **Typography**: Inter font family
- **Layout**: High information density with bento-card layouts
- **Animations**: Subtle, purposeful animations

## 🔌 API Integration

Currently using mock data. To integrate with real APIs:

1. Update service implementations in `services/api/`
2. Replace mock data returns with actual API calls
3. No other changes needed - the rest of the app is already wired up

Example:
```typescript
// services/api/pr.api.ts

// Current (Mock):
export const prApi = {
  getAll: async () => {
    await delay(500);
    return mockPullRequests;
  },
};

// Replace with:
export const prApi = {
  getAll: async () => {
    const response = await fetch('/api/pull-requests');
    return response.json();
  },
};
```

## 🔐 Authentication

Mock authentication is implemented. Features include:

- Email/Password login
- Google SSO (mocked)
- OTP verification flow
- Forgot/Reset password
- Remember me functionality
- Protected routes

## 📊 Mock Data

The application includes realistic mock data:

- 50+ Pull Requests
- 20 Incidents
- 100 Deployments
- 200 Alerts
- 6 months of cost data
- 100 PostgreSQL queries
- 50 AI recommendations
- Developer metrics
- Team velocity data

## 🎯 Key Pages

### Dashboard
- Executive summary with key metrics
- Recent PRs, incidents, deployments
- AI suggestions overview

### Pull Requests
- Filterable PR list
- Status indicators
- CI/CD status
- AI review suggestions
- Approve/Merge actions

### Incidents (To be completed)
- Active incident tracking
- Timeline view
- Severity filtering
- AI root cause analysis

### Deployments (To be completed)
- Deployment history
- Environment tracking
- Health checks
- Rollback functionality

### Cost Monitoring (To be completed)
- Multi-cloud cost tracking
- Forecasting
- Anomaly detection
- Savings recommendations

### AI Copilot (To be completed)
- Natural language queries
- Security findings
- Performance recommendations
- Deployment risk analysis

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test

# E2E tests (to be implemented)
npm run test:e2e
```

## 📝 Development

### Adding a New Page

1. Create page in `app/[route]/page.tsx`
2. Wrap content in `DashboardLayout`
3. Use relevant API hooks
4. Follow existing patterns

Example:
```typescript
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function NewPage() {
  return (
    <DashboardLayout>
      <div>Your content</div>
    </DashboardLayout>
  );
}
```

### Creating API Services

1. Define types in `services/types/`
2. Create mock data in `services/mock/data.ts`
3. Implement API in `services/api/[feature].api.ts`
4. Create React Query hooks in `hooks/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

## 🆘 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using modern web technologies
