# Environment Variables Strategy

## Overview
This monorepo uses a shared environment variable strategy where both frontend and backend can access the same `.env` file from the root directory.

## File Structure
```
wag-wise-mentor/
├── .env                    # Main environment file (gitignored)
├── .env.example          # Template with all required variables
├── apps/
│   ├── frontend/
│   │   └── .env          # Symlink to root .env (for Vite)
│   └── backend/
│       └── .env          # Symlink to root .env (for NestJS)
└── packages/
```

## Environment Variable Naming Convention

### Frontend Variables (Vite)
- **Prefix:** `VITE_`
- **Examples:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Access:** Available in browser via `import.meta.env.VITE_*`

### Backend Variables (NestJS)
- **Prefix:** None (or service-specific prefixes)
- **Examples:** `DATABASE_URL`, `JWT_SECRET`, `PORT`
- **Access:** Available via `process.env.*`

### Shared Variables
- **Supabase:** Both FE and BE need Supabase config
- **API Keys:** Backend uses AI provider keys, frontend uses public keys only

## Setup Instructions

### 1. Copy Environment Template
```bash
cp .env.example .env
```

### 2. Create Symlinks for Apps
```bash
# For frontend (Vite needs .env in app directory)
ln -sf ../../.env apps/frontend/.env

# For backend (NestJS can read from root, but symlink for consistency)
ln -sf ../../.env apps/backend/.env
```

### 3. Fill in Your Values
Edit `.env` with your actual API keys and configuration values.

## Security Considerations

### ✅ Safe for Frontend (VITE_ prefix)
- `VITE_SUPABASE_URL` - Public URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public anon key
- `VITE_API_BASE_URL` - Public API endpoint

### ❌ Backend Only (No VITE_ prefix)
- `SUPABASE_SERVICE_ROLE_KEY` - Secret service key
- `JWT_SECRET` - Secret signing key
- `DATABASE_URL` - Database credentials
- All AI provider API keys

## Development vs Production

### Development
- Use `.env` file with development values
- Enable debug logging
- Use local database URLs

### Production
- Use environment variables from hosting platform
- Never commit `.env` files
- Use production database URLs
- Enable proper logging levels

## Troubleshooting

### Frontend Can't Access Variables
1. Ensure variable has `VITE_` prefix
2. Check that `.env` file exists in `apps/frontend/`
3. Restart Vite dev server after adding new variables

### Backend Can't Access Variables
1. Ensure variable doesn't have `VITE_` prefix
2. Check that `.env` file exists in `apps/backend/`
3. Restart NestJS server after adding new variables

### Variable Not Loading
1. Check `.env` file syntax (no spaces around `=`)
2. Ensure no quotes around values unless needed
3. Restart both frontend and backend servers
