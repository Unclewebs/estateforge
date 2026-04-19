# 🏠 EstateForge - Real Estate Marketplace

A production-ready real estate marketplace built with Next.js 15, supporting Buyers, Sellers, and Agents.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI
- **Database:** Prisma + PostgreSQL
- **Auth:** Clerk
- **File Uploads:** Cloudinary
- **Maps:** Mapbox GL JS
- **Real-time:** Pusher
- **Forms:** React Hook Form + Zod
- **State:** Zustand

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (for PostgreSQL)
- Clerk account (https://clerk.com)
- Cloudinary account (https://cloudinary.com)
- Mapbox account (https://mapbox.com)
- Pusher account (https://pusher.com)

### 1. Clone & Install

```bash
cd estateforge
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure Environment

Copy `.env.local` and fill in your API keys:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL="postgresql://estateforge:estateforge_pass@localhost:5432/estateforge?schema=public"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=us2
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

Also update the `.env` file `DATABASE_URL` with the same connection string.

### 4. Setup Database

```bash
npm run db:push       # Push schema to database
npm run db:seed       # Seed with sample data
```

### 5. Configure Clerk

1. Create a Clerk application at https://dashboard.clerk.com
2. Add your keys to `.env.local`
3. Set up a webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
4. Enable "user.created", "user.updated", "user.deleted" events

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── api/webhooks/clerk/    # Clerk webhook handler
│   ├── dashboard/             # User dashboards
│   │   ├── favorites/         # Saved properties
│   │   └── messages/          # Messaging system
│   ├── onboarding/            # Role selection
│   ├── properties/
│   │   ├── [slug]/            # Property detail (SEO-friendly)
│   │   ├── map/               # Map-based search
│   │   └── new/               # Create listing
│   ├── sign-in/               # Auth pages
│   ├── sign-up/
│   ├── layout.tsx             # Root layout with Clerk + Theme
│   └── page.tsx               # Homepage
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── navbar.tsx             # Main navigation
│   ├── footer.tsx             # Site footer
│   ├── property-card.tsx      # Property listing card
│   ├── property-form.tsx      # Create/edit form
│   ├── property-map.tsx       # Mapbox integration
│   ├── search-filters.tsx     # Advanced search
│   ├── role-switcher.tsx      # Role switching
│   ├── inquiry-form.tsx       # Contact form
│   ├── message-input.tsx      # Chat input
│   ├── favorite-button.tsx    # Save property
│   └── theme-provider.tsx     # Dark/light mode
├── lib/
│   ├── actions/
│   │   ├── property.ts        # Property CRUD
│   │   ├── user.ts            # User/role management
│   │   └── messaging.ts       # Messages & inquiries
│   ├── stores/
│   │   └── compare-store.ts   # Property comparison
│   ├── db.ts                  # Prisma client
│   ├── auth.ts                # Auth helpers
│   ├── pusher.ts              # Pusher client
│   ├── utils.ts               # Utilities
│   └── validations.ts         # Zod schemas
└── middleware.ts               # Clerk auth middleware
```

## User Roles

| Feature | Buyer | Seller | Agent |
|---------|-------|--------|-------|
| Browse properties | ✅ | ✅ | ✅ |
| Save favorites | ✅ | ✅ | ✅ |
| Send inquiries | ✅ | ✅ | ✅ |
| Create listings | ❌ | ✅ | ✅ |
| Manage listings | ❌ | ✅ | ✅ |
| View analytics | ❌ | ✅ | ✅ |
| Lead management | ❌ | ❌ | ✅ |

## Deployment

### Vercel + Neon/Railway

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Use Neon or Railway for managed PostgreSQL
5. Run `npx prisma db push` against production DB
6. Deploy!

### Docker

```bash
docker build -t estateforge .
docker run -p 3000:3000 --env-file .env.local estateforge
```

## Future Enhancements

- **Payments:** Stripe integration for premium listings
- **AI Recommendations:** ML-based property suggestions
- **Advanced Analytics:** Chart.js dashboards
- **Push Notifications:** Service workers + web push
- **Reviews & Ratings:** Agent/property review system
- **Mortgage Calculator:** Built-in financial tools
- **Virtual Staging:** AI-powered room visualization
