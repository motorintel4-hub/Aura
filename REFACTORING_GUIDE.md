# Aura Refactoring Guide: Firebase → Supabase + Genkit → Grok

## 📋 Table of Contents

1. [New Project Structure](#new-project-structure)
2. [Phase 1: Setup](#phase-1-setup)
3. [Phase 2: Database Schema](#phase-2-database-schema)
4. [Phase 3: Authentication](#phase-3-authentication)
5. [Phase 4: AI Integration (Grok)](#phase-4-ai-integration-grok)
6. [Phase 5: Data Layer](#phase-5-data-layer)
7. [Phase 6: Deployment](#phase-6-deployment)

---

## New Project Structure

```
src/
├── ai/
│   ├── client.ts                    # NEW: Grok API client
│   ├── flows/
│   │   ├── generate-buyer-persona-briefing.ts
│   │   ├── generate-objection-strategy.ts
│   │   ├── generate-sales-pitch-levels.ts
│   │   ├── provide-contextual-copilot-insights.ts
│   │   └── summarize-customer-notes.ts
│   └── utils.ts                     # NEW: AI helpers
├── db/
│   ├── schema.ts                    # NEW: Drizzle schema
│   ├── migrations/                  # NEW: SQL migrations
│   └── client.ts                    # NEW: Drizzle client setup
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── use-db.ts                    # NEW: Drizzle queries hook
├── lib/
│   ├── supabase-client.ts           # NEW: Supabase browser client
│   ├── supabase-server.ts           # NEW: Supabase server client
│   └── utils.ts
├── actions/                         # NEW: Server actions for API calls
│   ├── customers.ts
│   ├── battles.ts
│   ├── notes.ts
│   └── ai-flows.ts
└── app/
    ├── api/
    │   ├── auth/                    # NEW: Auth API routes (Supabase)
    │   └── ai/                      # NEW: AI endpoint for Grok
    └── ...rest unchanged
```

---

## Phase 1: Setup

### Step 1.1: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs drizzle-orm drizzle-kit pg dotenv-cli openai
npm install -D drizzle-kit
```

### Step 1.2: Create `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxxxxx

# Grok API (xAI)
XAI_API_KEY=xai-xxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

### Step 1.3: Create `.env.example` for version control

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
XAI_API_KEY=your_xai_api_key_here
DATABASE_URL=your_database_url_here
```

### Step 1.4: Update `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:drop": "drizzle-kit drop"
  }
}
```

---

## Phase 2: Database Schema

### Step 2.1: Create `src/db/schema.ts`

```typescript
import {
  pgTable,
  text,
  integer,
  varchar,
  timestamp,
  boolean,
  json,
  uuid,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (synced from Supabase Auth)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }),
  avatar: text("avatar"),
  companyName: varchar("company_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customers table
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),

  // 6P Discovery
  p1Purpose: text("p1_purpose"), // Purpose for buying
  p2People: text("p2_people"), // People influencing decision
  p3Pattern: text("p3_pattern"), // Usage patterns
  p4Preferences: text("p4_preferences"), // Vehicle preferences
  p5Price: text("p5_price"), // Budget
  p6PurchaseContext: text("p6_purchase_context"), // Purchase timing

  buyerPersona: json("buyer_persona"), // Generated persona
  stage: varchar("stage", { length: 50 }).default("discovery"), // discovery, qualified, engaged, won, lost

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Battle Cards
export const battleCards = pgTable("battle_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "cascade",
  }),

  title: varchar("title", { length: 255 }).notNull(),
  competitor: varchar("competitor", { length: 255 }),
  objectionContent: text("objection_content"),
  strategy: text("strategy"), // Generated objection strategy

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Notes
export const customerNotes = pgTable("customer_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "cascade",
  }),

  content: text("content").notNull(),
  summary: text("summary"), // Generated summary
  keywords: json("keywords"), // Extracted keywords

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sales Pitches (generated variations)
export const salesPitches = pgTable("sales_pitches", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "cascade",
  }),

  level: integer("level"), // 1-5 complexity levels
  pitch: text("pitch").notNull(),
  keyPoints: json("key_points"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  customers: many(customers),
  battleCards: many(battleCards),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, { fields: [customers.userId], references: [users.id] }),
  battleCards: many(battleCards),
  notes: many(customerNotes),
  pitches: many(salesPitches),
}));

export const battleCardsRelations = relations(battleCards, ({ one }) => ({
  user: one(users, { fields: [battleCards.userId], references: [users.id] }),
  customer: one(customers, {
    fields: [battleCards.customerId],
    references: [customers.id],
  }),
}));

export const customerNotesRelations = relations(customerNotes, ({ one }) => ({
  customer: one(customers, {
    fields: [customerNotes.customerId],
    references: [customers.id],
  }),
}));

export const salesPitchesRelations = relations(salesPitches, ({ one }) => ({
  customer: one(customers, {
    fields: [salesPitches.customerId],
    references: [customers.id],
  }),
}));
```

### Step 2.2: Create `src/db/client.ts`

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

export type Database = typeof db;
```

### Step 2.3: Setup Drizzle Config

Create `drizzle.config.ts` in root:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    schema: "drizzle",
    table: "__drizzle_migrations__",
    prefix: "drizzle",
  },
});
```

---

## Phase 3: Authentication

### Step 3.1: Create `src/lib/supabase-client.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

### Step 3.2: Create `src/lib/supabase-server.ts`

```typescript
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Handle errors
          }
        },
      },
    },
  );
}
```

### Step 3.3: Update Provider Components

Replace Firebase provider in `src/firebase/provider.tsx` with:

```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Phase 4: AI Integration (Grok)

### Step 4.1: Create `src/ai/client.ts`

```typescript
import OpenAI from "openai";

export const grokClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export const MODEL = "grok-2";
```

### Step 4.2: Migrate `src/ai/flows/generate-buyer-persona-briefing.ts`

```typescript
"use server";

import { grokClient, MODEL } from "@/ai/client";
import { z } from "zod";

const GenerateBuyerPersonaBriefingInputSchema = z.object({
  p1Purpose: z.string(),
  p2People: z.string(),
  p3Pattern: z.string(),
  p4Preferences: z.string(),
  p5Price: z.string(),
  p6PurchaseContext: z.string(),
});

export type GenerateBuyerPersonaBriefingInput = z.infer<
  typeof GenerateBuyerPersonaBriefingInputSchema
>;

export interface GenerateBuyerPersonaBriefingOutput {
  buyerPersona: string;
  briefing: string;
  recommendations: string[];
}

export async function generateBuyerPersonaBriefing(
  input: GenerateBuyerPersonaBriefingInput,
): Promise<GenerateBuyerPersonaBriefingOutput> {
  const prompt = `Based on the following 6P customer discovery data, generate:
1. A detailed buyer persona
2. A concise advisor briefing
3. Top 3 vehicle recommendations

**Discovery Data:**
- Purpose: ${input.p1Purpose}
- People: ${input.p2People}
- Pattern: ${input.p3Pattern}
- Preferences: ${input.p4Preferences}
- Price: ${input.p5Price}
- Purchase Context: ${input.p6PurchaseContext}

Format your response as JSON with keys: buyerPersona, briefing, recommendations (array)`;

  const response = await grokClient.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  return {
    buyerPersona: parsed.buyerPersona || "",
    briefing: parsed.briefing || "",
    recommendations: parsed.recommendations || [],
  };
}
```

### Step 4.3: Similarly migrate other flows

Apply the same pattern to:

- `generate-objection-strategy.ts`
- `generate-sales-pitch-levels.ts`
- `provide-contextual-copilot-insights.ts`
- `summarize-customer-notes.ts`

Replace Genkit AI calls with `grokClient.chat.completions.create()`.

---

## Phase 5: Data Layer

### Step 5.1: Create `src/actions/customers.ts`

```typescript
"use server";

import { db } from "@/db/client";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase-server";

export async function getCustomers(userId: string) {
  return db.query.customers.findMany({
    where: eq(customers.userId, userId),
  });
}

export async function getCustomer(customerId: string) {
  return db.query.customers.findFirst({
    where: eq(customers.id, customerId),
    with: {
      battleCards: true,
      notes: true,
      pitches: true,
    },
  });
}

export async function createCustomer(userId: string, data: any) {
  const [result] = await db
    .insert(customers)
    .values({ userId, ...data })
    .returning();
  return result;
}

export async function updateCustomer(customerId: string, data: any) {
  const [result] = await db
    .update(customers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(customers.id, customerId))
    .returning();
  return result;
}

export async function deleteCustomer(customerId: string) {
  await db.delete(customers).where(eq(customers.id, customerId));
}
```

### Step 5.2: Create `src/actions/ai-flows.ts`

```typescript
"use server";

import { db } from "@/db/client";
import { customers, customerNotes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateBuyerPersonaBriefing } from "@/ai/flows/generate-buyer-persona-briefing";
import { generateObjectionStrategy } from "@/ai/flows/generate-objection-strategy";

export async function generatePersonaAndSave(customerId: string, inputs: any) {
  const result = await generateBuyerPersonaBriefing(inputs);

  await db
    .update(customers)
    .set({ buyerPersona: result as any })
    .where(eq(customers.id, customerId));

  return result;
}

export async function summarizeAndSave(customerId: string, notes: string) {
  // Call AI flow to summarize
  const summary = await summarizeNotes(notes);

  const [result] = await db
    .insert(customerNotes)
    .values({ customerId, content: notes, summary })
    .returning();

  return result;
}

// Helper function
async function summarizeNotes(content: string) {
  // Implement similar to generateBuyerPersonaBriefing
  return content.substring(0, 200) + "...";
}
```

---

## Phase 6: Deployment

### Step 6.1: Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Get `SUPABASE_SERVICE_ROLE_KEY` from Settings → API

### Step 6.2: Vercel Integration

1. **In Supabase Dashboard:**
   - Go to Integrations → Vercel Integration
   - Connect your GitHub + Vercel account
   - Select your Vercel project

2. **In Vercel Dashboard:**
   - Environment variables are auto-populated
   - Add `XAI_API_KEY` manually
   - Add `DATABASE_URL` manually

### Step 6.3: Database Setup

```bash
# Generate Drizzle migrations
npm run db:generate

# Apply migrations (runs in Vercel build)
npm run db:push
```

Add to `next.config.ts`:

```typescript
export default {
  // ... other config
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};
```

### Step 6.4: Deploy to Vercel

```bash
git add .
git commit -m "refactor: migrate to Supabase + Grok"
git push
```

Vercel will:

1. Run `npm run db:push` in build step (applies migrations)
2. Deploy your Next.js app
3. All env vars from Supabase integration are available

---

## ✅ Quick Verification Checklist

- [ ] `.env.local` has all Supabase + Grok keys
- [ ] `npm run db:generate` completes without errors
- [ ] `npm run db:push` syncs schema to Supabase
- [ ] `npm run dev` starts without errors
- [ ] Auth flow works (login/signup)
- [ ] Can create a customer in dashboard
- [ ] AI flows (Grok) generate responses
- [ ] Data persists in Supabase
- [ ] Vercel deployment successful
- [ ] Supabase integration connected

---

## 🔗 Useful Resources

- [Supabase Docs](https://supabase.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Grok API Docs](https://docs.x.ai/api/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Vercel Integrations](https://vercel.com/integrations)
