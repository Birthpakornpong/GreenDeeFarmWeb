# Green Dee Farm Web - AI Coding Agent Instructions

## Project Overview

Next.js 12 delivery/logistics web application for Green Dee Farm (organic vegetables delivery service in Phuket, Phang Nga, Krabi). Uses custom Node.js server (`server.js`) instead of standard Next.js server. Configured for **static export** (`output: 'export'`) with Plesk deployment.

## Architecture & Key Patterns

### Database Layer - Dual System

- **Primary**: Supabase (PostgreSQL) via `lib/supabase.js` - handles user authentication
- **Legacy**: MySQL via `lib/mysql.js` - for orders/business logic
- **Critical**: Authentication uses Supabase `users` table, NOT MySQL
- Connection pattern: Check `lib/mysql.js` for UNIX socket support (`socketPath`) for Plesk deployments

### Authentication System

- **Custom JWT-based** (NOT NextAuth) - see `lib/auth.js`
- Login flow: `pages/api/auth/login.js` → Supabase user lookup → bcrypt password verification → JWT token in httpOnly cookie
- Token verification: `verifyToken()` from `lib/auth.js` (7-day expiry)
- Component pattern: `components/Header.js` has custom `useAuth()` hook (lines 23-48)
- **Never** use NextAuth methods in new auth code despite imports existing

### State Management

- Redux with redux-persist configured in `store.js`
- Store shape: `{ user: {}, appointData: {}, isCustomerCenter: false }`
- Actions: `'set'` for updates, `'clear_all'` for logout
- Persist key: `"root_fuze"` in localStorage

### API Communication Pattern

```javascript
// API classes in /api folder use this pattern:
static method = async (data) => {
    await setHeaderAuth(); // Sets Bearer token from localStorage
    const result = await axios({
        url: ISSERVER ? `${process.env.API_INTERNAL_URL}endpoint` : `endpoint`,
        method: "post",
        data: data,
    });
    return result;
}
```

- `ISSERVER` constant: `typeof window === "undefined"` - critical for SSR vs client detection
- See `api/ApiOrders.js` for reference implementation

### Server-Side Rendering

- Uses `getServerSideProps` extensively (NOT `getStaticProps` despite static export config)
- **Common pattern**: Fetch data server-side, pass as props to pages
- Check `pages/profile/[id].js`, `pages/tracking/[id].js` for examples
- Thai locale formatting: Use `ConvertDateShortThai()` from `utils/index.js` (adds 543 years to convert to Thai Buddhist calendar)

### Styling & UI Components

- **Tailwind CSS** with custom color palette (see `tailwind.config.js`):
  - Primary: `blue-primary` (#002169)
  - Brand blues: `blue-secondary` (#3BBDFE), `blue-sky`, `blue-neon`
- **Headless UI** for modals/dropdowns (`@headlessui/react`)
- Custom modal pattern: All modals use `useState(false)` for `showModal` - see `components/CustomModal/` directory
- **Mobile responsiveness**: Check `pages/useIsMobile.js` hook

### Thai Language & Localization

- All user-facing text in Thai (ไทย)
- Error messages in Thai (e.g., "กรุณากรอก username และ password")
- Moment.js with Thai locale (`moment/locale/th`)
- Date format: Use `ConvertDateShortThai()` which adds 543 years for Buddhist calendar

## Development Workflow

### Environment Setup

```bash
# Node.js version specified in package.json
"volta": { "node": "24.8.0" }
"engines": { "node": ">=18.0.0" }

# Development
npm run dev  # Standard Next.js dev server

# Production (uses custom server.js)
npm run build
npm start    # Runs node server.js (NOT next start)
```

### Custom Server Behavior

- `server.js` adds `/health` endpoint: Returns `{ status: 'OK', service: 'Green Dee Farm', ... }`
- Handles static assets manually
- Runs on port from `process.env.PORT` or 3000
- See `ecosystem.config.js` for PM2 configuration (app name: `greendeefarm`)

### Deployment - Plesk Specific

- **Critical**: Upload to `/greendeefarm/` directory
- Node.js version: 24.8.0
- Startup file: `server.js` (NOT index.js or next start)
- Build command: `npm run build` → creates `.next/` directory
- Environment variables from `deploy-env-variables.txt` (includes DB credentials)
- Health check: `http://greendeefarm.com/health`
- See `PLESK_DEPLOYMENT.md` for full checklist

### Database Operations

```javascript
// Supabase pattern (for auth):
import { userOperations } from "@/lib/supabase";
const result = await userOperations.findUserByUsername(username);
// Returns: { success: true, data: {...} } or { success: false, error: "..." }

// MySQL pattern (for legacy):
import { executeQuery } from "@/lib/mysql";
const result = await executeQuery("SELECT * FROM orders WHERE id = ?", [id]);
```

## Common Gotchas

1. **Static Export Paradox**: Config has `output: 'export'` but code uses `getServerSideProps` - this appears to be deployment-specific (Plesk runs as Node.js app, not static site)

2. **API Base URL**: Set in `pages/_app.js` line 22: `axios.defaults.baseURL = process.env.API_URL` - ensure this is set correctly for environment

3. **401 Handling**: `_app.js` interceptor redirects to `/login` on 401 and clears Redux store - don't add duplicate logic

4. **Password Hashing**: Always use `hashPassword()` from `lib/auth.js` (bcrypt with 12 salt rounds) - never store plain text

5. **Redux Persist**: State survives page refresh - use `'clear_all'` action on logout, not just `setUser(null)`

6. **ISSERVER Check**: Always check `ISSERVER` constant before accessing `window`, `localStorage`, or `document`

7. **Thai Dates**: Use `ConvertDateShortThai()` not `ConvertDateShort()` for user-facing dates (Buddhist calendar)

## Key Files Reference

- `server.js` - Custom Next.js server with health check
- `lib/auth.js` - JWT generation, password hashing, validation
- `lib/supabase.js` - User CRUD operations (auth database)
- `lib/mysql.js` - Legacy database with connection pooling
- `store.js` - Redux store configuration (3 keys: user, appointData, isCustomerCenter)
- `utils/index.js` - Thai date formatting, localStorage helpers, auth header setter
- `components/Header.js` - Custom useAuth hook, navigation
- `pages/_app.js` - Global axios config, 401 interceptor, Redux provider

## Testing & Debugging

- **Connection tests**: `pages/api/test-connection.js`, `pages/api/test-supabase.js`, `pages/api/plesk-connection-test.js`
- **Debug mode**: Set `DB_DEBUG=true` in env for query logging (see `lib/mysql.js` line 88)
- **Error suggestions**: MySQL connection errors include Thai-language troubleshooting (lines 56-78 in `lib/mysql.js`)

## Code Style Conventions

- No semicolons in React components (inconsistent, follow file's existing style)
- Use `async/await` over `.then()` chains
- API response pattern: `{ success: boolean, data?: any, error?: string }`
- Thai comments for user-facing messages, English for technical
- Redux dispatch: `store.dispatch({ type: 'set', ...data })`
