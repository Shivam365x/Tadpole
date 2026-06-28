# tadpole — Backend API Specification

This document lists every API the tadpole frontend expects from the backend. It
is derived directly from the frontend service layer (`services/api/*.ts`) plus
the new **SSO (Google + GitHub)** and **OTP login/signup** flows requested.

---

## 1. Conventions

| Item | Value |
|------|-------|
| Base URL | `https://api.tadpole.com/api/v1` (configurable via `NEXT_PUBLIC_API_URL`) |
| Format | JSON (`Content-Type: application/json`) |
| Auth | `Authorization: Bearer <accessToken>` on all protected routes |
| Dates | ISO 8601 UTC strings (e.g. `2026-06-20T10:30:00Z`) |
| IDs | Opaque strings |

### Standard success envelope
The frontend services currently return the resource directly, so the backend
should respond with the resource as the top-level JSON body (no wrapper), e.g.:

```json
{ "user": { "...": "..." }, "token": "..." }
```

### Standard error envelope
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "details": {}
  }
}
```
Use appropriate HTTP status codes: `400, 401, 403, 404, 409, 422, 429, 500`.

### Tokens
- `accessToken` — short-lived JWT (e.g. 15 min), sent as Bearer.
- `refreshToken` — long-lived, returned in body or set as `HttpOnly` secure
  cookie. `POST /auth/refresh` issues a new access token.

---

## 2. Authentication & Identity

### 2.1 Core data models

```ts
User {
  id: string
  email: string
  name: string
  avatar?: string          // URL; if absent the UI renders an identicon
  role: 'admin' | 'developer' | 'viewer'
  workspaceId: string
  emailVerified?: boolean
  authProviders?: ('password' | 'google' | 'github')[]
  mfaEnabled?: boolean
}

AuthResult {
  user: User
  accessToken: string
  refreshToken?: string
  expiresIn?: number       // seconds
}
```

### 2.2 Email + Password

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 1 | POST | `/auth/login` | No | Login with email + password |
| 2 | POST | `/auth/signup` | No | Register; triggers OTP email |
| 3 | POST | `/auth/logout` | Yes | Invalidate current session/refresh token |
| 4 | POST | `/auth/refresh` | Refresh | Issue a new access token |
| 5 | GET  | `/auth/me` | Yes | Current authenticated user |
| 6 | POST | `/auth/forgot-password` | No | Send password reset link |
| 7 | POST | `/auth/reset-password` | No | Reset password with token |

**POST `/auth/login`**
```json
// request
{ "email": "user@company.com", "password": "secret", "rememberMe": true }
// 200
{ "user": { "...": "..." }, "token": "<accessToken>", "refreshToken": "..." }
// If the account has MFA/OTP enabled, return 200 with:
{ "requiresOTP": true, "email": "user@company.com", "otpChannel": "email" }
```

**POST `/auth/signup`**
```json
// request
{ "name": "Jane Doe", "email": "jane@company.com", "password": "secret" }
// 201 — account created in "pending" state, OTP emailed
{ "user": { "...": "..." }, "requiresOTP": true }
```

**POST `/auth/forgot-password`**
```json
{ "email": "user@company.com" }            // 200 -> { "success": true, "message": "..." }
```

**POST `/auth/reset-password`**
```json
{ "token": "<reset-token>", "newPassword": "newSecret" }  // 200 -> { "success": true }
```

**POST `/auth/refresh`** → `{ "token": "<newAccessToken>" }`
**GET `/auth/me`** → `User`
**POST `/auth/logout`** → `204 No Content`

### 2.3 OTP — Signup verification & Passwordless / 2FA login

OTP is a 6-digit code delivered by email (extendable to SMS). The same verify
endpoint serves multiple purposes via the `purpose` field.

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 1 | POST | `/auth/otp/request` | No | Send an OTP for `login` or `signup` |
| 2 | POST | `/auth/otp/resend` | No | Resend the current OTP (rate-limited) |
| 3 | POST | `/auth/otp/verify` | No | Verify the OTP and complete the flow |

**POST `/auth/otp/request`** (passwordless login or re-trigger)
```json
{ "email": "user@company.com", "purpose": "login" }   // purpose: "login" | "signup"
// 200
{ "success": true, "otpChannel": "email", "expiresIn": 300, "resendAfter": 30 }
```

**POST `/auth/otp/resend`**
```json
{ "email": "user@company.com", "purpose": "signup" }  // 200 -> { "success": true, "resendAfter": 30 }
```

**POST `/auth/otp/verify`**
```json
// request
{ "email": "user@company.com", "otp": "123456", "purpose": "signup" }
// 200 — on success a session is established
{ "success": true, "user": { "...": "..." }, "token": "<accessToken>", "refreshToken": "..." }
// errors: 422 invalid code, 410 expired, 429 too many attempts
```

> Recommended rules: 6 digits, 5-minute TTL, max 5 attempts, 30s resend
> cooldown, single-use, invalidate on success.

### 2.4 SSO — Google & GitHub (OAuth 2.0 Authorization Code + PKCE)

`:provider` ∈ `google` | `github`. Two supported integration styles — implement
**either** the redirect style (A) or the token-exchange style (B); the frontend
can call both.

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 1 | GET  | `/auth/oauth/:provider/start` | No | Begin OAuth; returns provider auth URL |
| 2 | GET  | `/auth/oauth/:provider/callback` | No | OAuth redirect target; exchanges code |
| 3 | POST | `/auth/oauth/:provider/exchange` | No | SPA-style: exchange `code` for tokens |
| 4 | POST | `/auth/oauth/:provider/link` | Yes | Link provider to the logged-in account |
| 5 | DELETE | `/auth/oauth/:provider/unlink` | Yes | Unlink a provider |

**Style A — server-driven redirect**

`GET /auth/oauth/google/start?redirectUri=<frontend-cb>`
```json
// 200
{ "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&state=..." }
```
The frontend sends the browser to `authUrl`. The provider redirects back to
`GET /auth/oauth/google/callback?code=...&state=...`. The backend validates
`state`, exchanges the code, creates/links the user, then **redirects to the
frontend** with a short-lived handoff (e.g. `?token=...` or sets an `HttpOnly`
cookie):
```
302 Location: https://app.tadpole.com/auth/callback?token=<accessToken>
```

**Style B — SPA exchange (PKCE)**

`POST /auth/oauth/github/exchange`
```json
// request
{ "code": "<oauth-code>", "state": "<state>", "codeVerifier": "<pkce-verifier>", "redirectUri": "https://app.tadpole.com/auth/callback" }
// 200
{ "user": { "...": "..." }, "token": "<accessToken>", "refreshToken": "...", "isNewUser": false }
```

Backend responsibilities for SSO:
- Verify `state` (CSRF) and PKCE `codeVerifier`.
- Fetch profile (`email`, `name`, `avatar`, provider id).
- **Account linking**: if a user with the verified email exists, link the
  provider to that account; otherwise create a new user (`emailVerified: true`).
- Return the same `AuthResult` shape as password login.

Required provider scopes:
- **Google**: `openid email profile`
- **GitHub**: `read:user user:email`

Backend config (env): `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`,
`OAUTH_REDIRECT_URI`, `OAUTH_STATE_SECRET`.

---

## 3. Pull Requests  (`/pull-requests`)

| Method | Path | Query / Body | Returns |
|--------|------|--------------|---------|
| GET | `/pull-requests` | `?status&repository&author` | `PullRequest[]` |
| GET | `/pull-requests/:id` | — | `PullRequest` |
| GET | `/pull-requests/open` | — | `PullRequest[]` |
| GET | `/pull-requests/blocked` | open + `ciStatus=failed` | `PullRequest[]` |
| GET | `/pull-requests/awaiting-review` | open + `approvals=0` | `PullRequest[]` |
| GET | `/pull-requests/recently-merged` | last 10 merged | `PullRequest[]` |
| POST | `/pull-requests/:id/approve` | — | `{ success: boolean }` |
| POST | `/pull-requests/:id/request-changes` | `{ comment }` | `{ success: boolean }` |
| POST | `/pull-requests/:id/merge` | — | `{ success: boolean }` |
| POST | `/pull-requests/:id/comment` | `{ comment }` | `{ success: boolean }` |
| GET | `/pull-requests/:id/ai-suggestions` | — | `AISuggestion[]` |

```ts
PullRequest {
  id, title, description, author, repository,
  sourceBranch, targetBranch,
  status: 'open'|'merged'|'closed'|'draft',
  createdAt, updatedAt,
  reviewers: string[], approvals: number, comments: number,
  changedFiles: number, additions: number, deletions: number,
  aiSuggestions?: AISuggestion[], labels: string[],
  ciStatus: 'success'|'failed'|'pending'|'cancelled'
}
AISuggestion {
  id, type: 'security'|'performance'|'best-practice'|'bug',
  severity: 'critical'|'high'|'medium'|'low',
  title, description, file, line: number, suggestion
}
```

---

## 4. Incidents  (`/incidents`)

| Method | Path | Query / Body | Returns |
|--------|------|--------------|---------|
| GET | `/incidents` | `?severity&status&service` | `Incident[]` |
| GET | `/incidents/:id` | — | `Incident` |
| GET | `/incidents/active` | open/investigating | `Incident[]` |
| GET | `/incidents/critical` | — | `Incident[]` |
| POST | `/incidents` | `Incident` (no id/createdAt/timeline) | `Incident` |
| PATCH | `/incidents/:id` | `Partial<Incident>` | `Incident` |
| POST | `/incidents/:id/resolve` | `{ rootCause, notes }` | `Incident` |
| POST | `/incidents/:id/comments` | `{ comment }` | `IncidentEvent` |
| POST | `/incidents/:id/assign` | `{ assignee }` | `Incident` |
| GET | `/incidents/metrics` | — | `{ total, active, critical, avgMTTR }` |

```ts
Incident {
  id, title, description,
  severity: 'critical'|'high'|'medium'|'low',
  status: 'open'|'investigating'|'resolved'|'closed',
  service, createdAt, resolvedAt?, assignee?,
  timeline: IncidentEvent[], aiAnalysis?, rootCause?, impact,
  mttr?: number  // minutes
}
IncidentEvent { id, timestamp, type: 'created'|'assigned'|'updated'|'resolved'|'comment', user, description }
```

---

## 5. Deployments  (`/deployments`)

| Method | Path | Query / Body | Returns |
|--------|------|--------------|---------|
| GET | `/deployments` | `?environment&status&service` | `Deployment[]` |
| GET | `/deployments/:id` | — | `Deployment` |
| GET | `/deployments/recent` | `?limit=20` | `Deployment[]` |
| GET | `/deployments/in-progress` | — | `Deployment[]` |
| GET | `/deployments/failed` | — | `Deployment[]` |
| POST | `/deployments` | `Deployment` (no id/deployedAt/status) | `Deployment` |
| POST | `/deployments/:id/cancel` | — | `{ success: boolean }` |
| POST | `/deployments/:id/rollback` | — | `Deployment` |
| GET | `/deployments/metrics` | — | `{ total, successRate, avgDuration, deploymentsToday }` |
| GET | `/deployments/frequency` | `?days=30` | `{ date, count }[]` |

```ts
Deployment {
  id, service, environment: 'development'|'staging'|'production',
  version, status: 'success'|'failed'|'in_progress'|'cancelled',
  deployedBy, deployedAt, duration: number /*sec*/,
  commitSha, commitMessage, pr?, rollback: boolean,
  healthChecks: { passed, failed, total }
}
```

---

## 6. Alerts & Alert Rules  (`/alerts`)

| Method | Path | Query / Body | Returns |
|--------|------|--------------|---------|
| GET | `/alerts` | `?severity&status&service` | `Alert[]` |
| GET | `/alerts/:id` | — | `Alert` |
| GET | `/alerts/firing` | — | `Alert[]` |
| GET | `/alerts/critical` | — | `Alert[]` |
| POST | `/alerts/:id/acknowledge` | — | `{ success: boolean }` |
| POST | `/alerts/:id/resolve` | — | `{ success: boolean }` |
| GET | `/alerts/metrics` | — | `{ total, firing, critical, acknowledged }` |
| GET | `/alert-rules` | — | `AlertRule[]` |
| GET | `/alert-rules/:id` | — | `AlertRule` |
| POST | `/alert-rules` | `AlertRule` (no id) | `AlertRule` |
| PATCH | `/alert-rules/:id` | `Partial<AlertRule>` | `AlertRule` |
| DELETE | `/alert-rules/:id` | — | `{ success: boolean }` |
| POST | `/alert-rules/:id/toggle` | `{ enabled }` | `{ success: boolean }` |

```ts
Alert {
  id, name, severity, status: 'firing'|'resolved'|'acknowledged',
  service, message, triggeredAt, resolvedAt?, acknowledgedBy?,
  rule, tags: string[], notificationChannels: string[]
}
AlertRule {
  id, name, condition, threshold: number, duration: number,
  severity, enabled: boolean, notificationChannels: string[], services: string[]
}
```

---

## 7. Cost Monitoring  (`/cost`)

| Method | Path | Query / Body | Returns |
|--------|------|--------------|---------|
| GET | `/cost` | `?provider=aws|azure|gcp` | `CostData[]` |
| GET | `/cost/period/:period` | `period=YYYY-MM` | `CostData` |
| GET | `/cost/current-month` | — | `CostData` |
| GET | `/cost/breakdown/:period` | — | `CostBreakdown[]` |
| GET | `/cost/anomalies` | — | `CostAnomaly[]` |
| GET | `/cost/forecast` | — | `{ period, amount }[]` |
| GET | `/cost/by-department/:period` | — | `{ department, cost }[]` |
| GET | `/cost/total-spend` | — | `number` |
| GET | `/cost/savings-recommendations` | — | `{ id, title, description, potentialSavings, effort }[]` |

```ts
CostData { period, provider:'aws'|'azure'|'gcp', total:number, breakdown:CostBreakdown[], forecast?:number, anomalies:CostAnomaly[] }
CostBreakdown { service, cost:number, change:number /*%*/, department? }
CostAnomaly { id, service, date, expected:number, actual:number, deviation:number, severity:'high'|'medium'|'low' }
```

---

## 8. Databases / PostgreSQL  (`/databases`)

| Method | Path | Query / Body | Returns |
|--------|------|--------------|---------|
| GET | `/databases/queries` | `?database&slow&limit` | `PostgresQuery[]` |
| GET | `/databases/queries/slow` | `?threshold=1000` | `PostgresQuery[]` |
| GET | `/databases/queries/:id` | — | `PostgresQuery` |
| POST | `/databases/explain` | `{ query }` | `{ plan, estimatedCost }` |
| GET | `/databases/metrics` | `?database` | `DatabaseMetrics[]` |
| GET | `/databases/:database/health` | — | `DatabaseMetrics` |
| GET | `/databases/:database/connections` | — | `{ active, idle, total, max, utilization }` |
| GET | `/databases/:database/index-usage` | — | `{ table, index, scans, tuplesRead, tuplesReturned }[]` |
| GET | `/databases/:database/deadlocks` | — | `{ id, timestamp, query1, query2, resolved }[]` |
| GET | `/databases/:database/table-sizes` | — | `{ table, size, rows }[]` |

```ts
PostgresQuery { id, query, database, executionTime:number /*ms*/, timestamp, user, rows:number, cached:boolean, plan? }
DatabaseMetrics {
  database,
  connections: { active, idle, total, max },
  performance: { qps, avgLatency, slowQueries },
  storage: { used, total, percentage },
  health: 'healthy'|'warning'|'critical'
}
```

---

## 9. Team Analytics  (`/team`)

| Method | Path | Query / Body | Returns |
|--------|------|--------------|---------|
| GET | `/team/developer-metrics` | `?period` | `DeveloperMetrics[]` |
| GET | `/team/developer-metrics/:userId` | `?period` | `DeveloperMetrics` |
| GET | `/team/velocity` | — | `TeamVelocity[]` |
| GET | `/team/workload` | — | `{ developer, openPRs, reviewsPending, tickets }[]` |
| GET | `/team/review-turnaround` | — | `{ developer, avgTime, reviewsCompleted }[]` |
| GET | `/team/sprint/:sprint` | — | `{ planned, completed, carryover, velocity }` |
| GET | `/team/top-contributors` | `?period&metric=commits|prs|reviews` | `{ name, value, avatar? }[]` |

```ts
DeveloperMetrics {
  userId, name, avatar?,
  metrics: { prsOpened, prsReviewed, prsMerged, avgReviewTime, linesAdded, linesDeleted, commitsCount },
  period
}
TeamVelocity { sprint, planned:number, completed:number, velocity:number, completionRate:number }
```

---

## 10. AI Copilot  (`/ai`)

| Method | Path | Query / Body | Returns |
|--------|------|--------------|---------|
| GET | `/ai/suggestions` | `?type&severity` | `AISuggestion[]` |
| GET | `/ai/suggestions/:id` | — | `AISuggestion` |
| GET | `/ai/security-findings` | — | `AISuggestion[]` |
| GET | `/ai/performance-recommendations` | — | `AISuggestion[]` |
| POST | `/ai/analyze/pr/:prId` | — | `{ riskScore, issues, recommendation }` |
| POST | `/ai/analyze/incident/:incidentId` | — | `{ rootCause, affectedServices, recommendations, similarIncidents }` |
| POST | `/ai/analyze/deployment/:deploymentId` | — | `{ riskLevel, checks[], recommendation }` |
| POST | `/ai/query` | `{ query }` | `{ answer, sources, relatedData }` |
| GET | `/ai/optimization-recommendations` | — | `{ category, title, impact, effort, description }[]` |

---

## 11. Users / Team Management  (`/users`)

Backing the Users page. Not yet wired to a service file — implement to match the
`User` model.

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/users` | `?role&status&search` | `User[]` |
| GET | `/users/:id` | — | `User` |
| POST | `/users/invite` | `{ email, role }` | `{ success, invitationId }` |
| PATCH | `/users/:id` | `{ name?, role?, status? }` | `User` |
| DELETE | `/users/:id` | — | `{ success: boolean }` |

---

## 12. Integrations  (`/integrations`)

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/integrations` | — | `Integration[]` |
| POST | `/integrations/:type/connect` | provider-specific `config` | `Integration` |
| POST | `/integrations/:id/disconnect` | — | `{ success: boolean }` |
| PATCH | `/integrations/:id` | `{ config }` | `Integration` |

```ts
Integration {
  id, name,
  type: 'github'|'gitlab'|'slack'|'pagerduty'|'datadog'|'aws'|'azure'|'gcp',
  status: 'connected'|'disconnected'|'error',
  connectedAt?, config: Record<string, any>
}
```

---

## 13. Settings & Workspace

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/settings/notifications` | — | `NotificationPreferences` |
| PUT | `/settings/notifications` | `NotificationPreferences` | `NotificationPreferences` |
| GET | `/workspace` | — | `Workspace` |
| PATCH | `/workspace` | `{ name?, slug? }` | `Workspace` |

```ts
NotificationPreferences { email, slack, sms, incidents, deployments, pullRequests, alerts } // all boolean
Workspace { id, name, slug, plan: 'free'|'pro'|'enterprise', memberCount: number }
```

---

## 14. Implementation priority for your current goal

To deliver the **SSO + OTP auth** you asked for, implement in this order:

1. `POST /auth/signup` → creates pending user + sends OTP.
2. `POST /auth/otp/request`, `/auth/otp/resend`, `/auth/otp/verify`.
3. `POST /auth/login` (return `requiresOTP` when MFA is on).
4. `GET /auth/oauth/:provider/start` + `/callback` (or `/exchange`) for Google & GitHub.
5. `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`.
6. `POST /auth/forgot-password`, `POST /auth/reset-password`.

Security checklist: hash passwords (argon2/bcrypt), rate-limit OTP + login,
sign JWTs with rotation, store refresh tokens hashed, validate OAuth `state` +
PKCE, enforce email verification before issuing full sessions, and use
`HttpOnly`/`Secure`/`SameSite` cookies if you choose cookie-based sessions.

> Frontend wiring note: the auth calls live in `services/api/auth.api.ts`
> (currently mocked). `googleLogin()` already exists — add `githubLogin()`,
> `requestOtp()`, `resendOtp()`, and generalize OAuth to `oauthExchange(provider, ...)`
> when you connect these to the real backend.
