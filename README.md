# Paycheck Planner MVP

AI-powered paycheck allocation for gig workers. Smart allocation + bill tracking + analytics.

## Features

✅ User auth (signup/login)  
✅ Paystub upload & tracking  
✅ Bill management (fixed/flexible)  
✅ AI allocation engine (date-based)  
✅ Allocation breakdown  
✅ Dark mode UI  

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Git

### Local Setup

1. **Clone repo**
```bash
git clone <repo-url>
cd paycheck-planner-mvp
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/paycheck_planner"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-min-32-chars"
OPENAI_API_KEY="sk-your-key"
```

4. **Setup database**
```bash
npx prisma migrate dev
```

5. **Run dev server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### With Docker

```bash
# Start PostgreSQL
docker-compose up -d

# Edit .env.local with:
DATABASE_URL="postgresql://paycheck_user:paycheck_password@localhost:5432/paycheck_planner"

# Setup database
npx prisma migrate dev

# Run dev
npm run dev
```

## Project Structure

```
app/
  ├── api/              # API routes
  │   ├── auth/         # Authentication
  │   ├── paystubs/     # Paystub CRUD
  │   ├── bills/        # Bill CRUD
  │   └── allocations/  # AI allocation
  ├── auth/             # Login/signup
  ├── (auth)/           # Protected routes
  │   ├── dashboard/    # Main dashboard
  │   └── allocations/  # View allocations
  └── layout.tsx        # Root layout

lib/
  ├── auth.ts           # NextAuth config
  ├── prisma.ts         # Prisma client
  └── allocator.ts      # Allocation logic

prisma/
  └── schema.prisma     # Database schema
```

## API Endpoints

**Auth**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/[...nextauth]` - NextAuth routes

**Paystubs**
- `POST /api/paystubs` - Create paystub
- `GET /api/paystubs` - List paystubs

**Bills**
- `POST /api/bills` - Create bill
- `GET /api/bills` - List bills

**Allocations**
- `POST /api/allocations` - Generate allocation
- `GET /api/allocations` - List allocations

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Deployment**: Vercel

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production
npm run type-check   # TypeScript check
npm run lint         # ESLint
```

## Deployment (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Set env variables
4. Deploy

## Next Steps

- [ ] Mobile app (React Native)
- [ ] Bank sync (Plaid)
- [ ] Email notifications
- [ ] Goal tracking
- [ ] Analytics dashboard

## License

MIT
