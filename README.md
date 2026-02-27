# Paragonpass - Beauty Clinic Value Simulator & Cart System

## Quick Setup

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema to database (SQLite for development)
npm run db:push

# 4. Seed the database with clinic data
npm run db:seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with clinic data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:reset` | Reset database and re-seed |

### Project Structure

```
paragonpass/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script with clinic data
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles (Tailwind)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── catalog/           # Customer-facing catalog (Phase 4)
│   │   ├── admin/             # Admin dashboard (Phase 2)
│   │   └── api/               # API routes (Phase 2)
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── constants.ts       # App constants & helpers
│   │   └── cart-engine.ts     # Cart calculation engine (Phase 3)
│   ├── store/                 # Zustand state management (Phase 4)
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

### Database Schema (ERD)

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    passes    │     │ product_pass_    │     │   products   │
├──────────────┤     │    pricing       │     ├──────────────┤
│ id           │◄────┤ passId           │────►│ id           │
│ name         │     │ productId        │     │ categoryId   │──┐
│ slug         │     │ specialPrice     │     │ name         │  │
│ upfrontFee   │     │ isAccessible     │     │ normalPrice  │  │
│ maxItems     │     │ usesBestPrice    │     │ promoPrice   │  │
│ validityDays │     └──────────────────┘     │ isActive     │  │
└──────────────┘                              └──────────────┘  │
                                              ┌──────────────┐  │
                                              │  categories  │  │
                                              ├──────────────┤  │
                                              │ id           │◄─┘
                                              │ name         │
                                              │ slug         │
                                              └──────────────┘
```

### Pricing Rules

| Symbol | Meaning | DB Representation |
|--------|---------|-------------------|
| Price value | Specific tier price | `specialPrice = value, isAccessible = true` |
| `-` | Not available for this pass | `isAccessible = false` |
| `/` or `0` | Uses best available price | `usesBestPrice = true` |

### Pass Conditions

| Pass | Fee | Rules |
|------|-----|-------|
| Silver (299฿) | Unlimited items, Silver-tier only |
| Gold (999฿) | Silver items unlimited + max 4 Gold-tier items |
| Paragon (2,999฿) | All items unlimited, valid 3 months |
