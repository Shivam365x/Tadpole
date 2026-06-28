# tadpole Pages Overview

A visual guide to all implemented pages and their features.

---

## 🏠 Dashboard (`/`)

**Purpose**: Executive overview of the entire platform

**Features**:
- 6 metric cards (PRs, Incidents, Deployments, Infrastructure, Cost, AI)
- Recent Pull Requests section
- Active Incidents list
- Recent Deployments
- AI Suggestions feed

**Key Stats Displayed**:
- Open PRs count with trend
- Critical incidents count
- Deployment health percentage
- Monthly cloud cost
- AI suggestions count

---

## 🔐 Login (`/login`)

**Purpose**: User authentication

**Features**:
- Email/password login
- Password visibility toggle
- Remember me checkbox
- Google SSO button (mocked)
- Forgot password link
- Link to signup page
- Form validation with Zod

---

## 🔀 Pull Requests (`/pull-requests`)

**Purpose**: Manage code reviews and merges

**Features**:
- Stats: Open PRs, Blocked, Awaiting Review, AI Suggestions
- Search bar
- 4 status tabs: All, Open, Merged, Closed
- Data table with:
  - PR title and ID
  - Repository
  - Author
  - Status badge
  - CI/CD status icon
  - Review count
  - Last updated time
  - Approve/Review buttons
  - AI suggestion indicators (sparkle icons)

---

## 🚀 Deployments (`/deployments`)

**Purpose**: Track deployment history and status

**Features**:
- Stats: Total, Success Rate, In Progress, Avg Duration
- Recent deployments list
- Service name and environment
- Status badges (success/failed/in_progress)
- Time ago display
- Status icons (checkmark/x/spinner)
- View details button

---

## 🚨 Incidents (`/incidents`)

**Purpose**: Incident tracking and resolution

**Features**:
- Stats: Total, Active, Critical, Avg MTTR
- Search functionality
- 4 tabs: All, Active, Resolved, Critical
- Data table with:
  - Incident title and ID
  - Service badge
  - Severity badge
  - Status badge
  - Assignee
  - Impact description
  - Created time
  - MTTR (Mean Time To Resolution)
  - Investigate/Resolve buttons
- Recent activity timeline
- Severity distribution chart

---

## 🔔 Alerts (`/alerts`)

**Purpose**: Configure and manage infrastructure alerts

**Features**:
- Stats: Active Alerts, Critical, High Priority, Alert Rules
- Active alerts list with:
  - Alert name
  - Service
  - Severity badge
  - Status badge (firing/acknowledged/resolved)
  - Acknowledge button
- Color-coded by severity

---

## 🖥️ Infrastructure (`/infrastructure`)

**Purpose**: Monitor infrastructure health

**Features**:
- Stats: Total Services, Healthy Count, Avg CPU, Avg Memory
- Services overview with:
  - Service name
  - Instance count
  - Health badge
  - CPU usage bar
  - Memory usage bar
- Real-time metrics simulation

---

## 🗄️ Databases (`/databases`)

**Purpose**: PostgreSQL performance monitoring

**Features**:
- Stats: Total DBs, Connections, QPS, Avg Storage
- Database overview cards with:
  - Connection count
  - Queries per second
  - Storage percentage
  - Health status
- Slow queries list (last 24h)
- Connection pool status bars
- Per-database metrics

---

## 💰 Cost Monitoring (`/cost-monitoring`)

**Purpose**: Track and optimize cloud spending

**Features**:
- Stats: This Month, Change %, Forecast, Anomalies
- Provider breakdown (AWS, Azure, GCP)
- Cost by provider with:
  - Total amount
  - Change percentage
  - Service breakdown
- Top cost drivers with progress bars
- Cost savings recommendations with:
  - Potential savings amount
  - Implementation effort level

---

## ✨ AI Copilot (`/ai-copilot`)

**Purpose**: AI-powered insights and recommendations

**Features**:
- Stats: AI Suggestions, Security Issues, Performance Tips, Potential Savings
- Natural language query input
- Example queries
- Security findings with severity
- Performance recommendations
- Cost optimization suggestions
- Deployment risk analysis
- Categorized by type (security, performance, cost)

---

## 📊 Analytics (`/analytics`)

**Purpose**: Team productivity and velocity metrics

**Features**:
- Stats: PRs This Week, Avg Review Time, Total Commits, Active Developers
- Developer metrics cards with:
  - Avatar
  - Name
  - PRs opened
  - Reviews completed
  - Commits count
- Sprint velocity chart with completion rates
- Code review stats
- Top contributors leaderboard

---

## 🔌 Integrations (`/integrations`)

**Purpose**: Connect third-party tools

**Features**:
- Stats: Available, Connected, Available to Connect
- Integration cards for:
  - GitHub, GitLab
  - Slack, PagerDuty
  - Datadog
  - AWS, Azure, GCP
- Connection status indicators
- Connect/Configure buttons
- Service descriptions

---

## ⚙️ Settings (`/settings`)

**Purpose**: Account configuration

**Tabs**:
1. **Profile**: Name, Email, Role
2. **Notifications**: Email, Slack, Incidents, Deployments, PRs
3. **Security**: Password change, 2FA toggle
4. **API Keys**: View, revoke, generate keys

**Features**:
- Toggle switches for preferences
- Form inputs with validation
- API key management
- Security settings

---

## 💳 Billing (`/billing`)

**Purpose**: Subscription and payment management

**Features**:
- Current plan card (Enterprise)
- Plan features checklist
- Next invoice details
- Payment method display
- Invoice history with:
  - Invoice number
  - Date
  - Amount
  - Status badge
  - Download button
- Change plan button

---

## 👥 Users (`/users`)

**Purpose**: Team member management

**Features**:
- Stats: Total Users, Active, Pending Invites, Admins
- User list with:
  - Avatar
  - Name and email
  - Last active time
  - Role badge (Admin/Developer/Viewer)
  - Status badge (Active/Invited)
  - More actions button
- Roles & Permissions breakdown
- Recent activity feed
- Invite user button

---

## 🎨 Common UI Elements

**Present on all dashboard pages**:
- Collapsible sidebar with active state
- Header with:
  - Global search
  - Environment selector
  - Theme toggle
  - Notifications bell
  - Workspace switcher
  - User profile menu
- Consistent dark theme
- Responsive layouts
- Loading states (simulated)

---

## 🎯 Navigation Flow

```
Login → Dashboard → Any Page via Sidebar
```

All pages use the same layout wrapper (`DashboardLayout`) which provides:
- Consistent header
- Sidebar navigation
- Main content area
- Responsive behavior

---

## 💡 Design Patterns Used

1. **Stats Cards**: Quick metrics at page top
2. **Data Tables**: Searchable, filterable lists
3. **Tab Navigation**: Organize related views
4. **Status Badges**: Visual state indicators
5. **Action Buttons**: Clear CTAs
6. **Empty States**: Placeholder content
7. **Color Coding**: Severity/priority indication
8. **Progress Bars**: Visual progress indicators

---

## 🔄 Data Flow

```
User Action → React Query Hook → API Service → Mock Data → UI Update
```

All pages follow this pattern, making backend integration straightforward.

---

## ✅ Quality Checklist

- ✅ TypeScript types for all data
- ✅ Responsive on all screen sizes
- ✅ Dark theme throughout
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling structure
- ✅ Form validation
- ✅ Accessible markup
- ✅ Consistent spacing
- ✅ Professional aesthetics

---

**Total Pages**: 15
**Total Features**: 100+
**Build Status**: ✅ Success
**Ready for**: Demo, Development, Integration

Navigate to any page from the sidebar - they all work! 🎉
