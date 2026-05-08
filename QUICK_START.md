# Aura Refactoring: Quick Start Checklist

Complete these steps in order. Each phase is independent but must follow the sequence.

---

## 🚀 PRE-FLIGHT CHECK (5 min)

Before starting, gather your credentials:

- [ ] Supabase project created at https://supabase.com
  - [ ] Copy `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] Copy `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Copy `SUPABASE_SERVICE_ROLE_KEY` (from Settings → API)
- [ ] xAI API key obtained from https://console.x.ai
  - [ ] Copy `XAI_API_KEY`

- [ ] Vercel project linked to your Git repo
  - [ ] Note: We'll connect Supabase integration later

---

## 📦 PHASE 1: Dependencies & Setup (15 min)

### 1.1 Install new dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs drizzle-orm drizzle-kit pg dotenv-cli openai
npm install -D drizzle-kit
```

- [ ] All packages installed successfully

### 1.2 Create `.env.local` in project root

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
XAI_API_KEY=your_xai_key_here
DATABASE_URL=postgresql://user:password@host:5432/database
```

- [ ] File created with all credentials filled in
- [ ] ✅ **IMPORTANT:** `.env.local` is already in `.gitignore`

### 1.3 Create `.env.example` (for version control)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
XAI_API_KEY=your_xai_key_here
DATABASE_URL=your_database_url_here
```

- [ ] File created in root directory
- [ ] File committed to git

### 1.4 Update `package.json` scripts

Replace the scripts section with:

```json
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
```

- [ ] Scripts updated
- [ ] Tested: `npm run db:generate` (should not error)

### 1.5 Create `drizzle.config.ts` in root

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

- [ ] File created
- [ ] Verified file exists at root

**Status: Phase 1 Complete ✅**

---

## 🗄️ PHASE 2: Database Schema (20 min)

### 2.1 Create `src/db/` directory

```bash
mkdir -p src/db/migrations
```

- [ ] Directories created

### 2.2 Create `src/db/schema.ts`

Copy the full schema from `REFACTORING_GUIDE.md` → Phase 2 → Step 2.1

- [ ] File created with all tables and relations

### 2.3 Create `src/db/client.ts`

Copy the client setup from `REFACTORING_GUIDE.md` → Phase 2 → Step 2.2

- [ ] File created

### 2.4 Generate migrations

```bash
npm run db:generate
```

- [ ] Command runs without errors
- [ ] New migration files appear in `src/db/migrations/`
- [ ] Files are named like `0000_<timestamp>_<name>.sql`

### 2.5 Apply migrations to Supabase

```bash
npm run db:push
```

- [ ] Tables created in Supabase successfully
- [ ] Go to Supabase Dashboard → SQL Editor → verify tables exist

**Status: Phase 2 Complete ✅**

---

## 🔐 PHASE 3: Authentication (25 min)

### 3.1 Create Supabase Auth provider files

**File: `src/lib/supabase-client.ts`**
Copy from `REFACTORING_GUIDE.md` → Phase 3 → Step 3.1

- [ ] File created

**File: `src/lib/supabase-server.ts`**
Copy from `REFACTORING_GUIDE.md` → Phase 3 → Step 3.2

- [ ] File created

### 3.2 Create new auth context + hook

Create or replace: `src/providers/auth-provider.tsx`
Copy from `REFACTORING_GUIDE.md` → Phase 3 → Step 3.3

- [ ] File created
- [ ] Exports `AuthProvider` and `useAuth`

### 3.3 Update `src/app/layout.tsx`

Wrap app with `AuthProvider`:

```typescript
import { AuthProvider } from '@/providers/auth-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] AuthProvider wrapping updated
- [ ] Import statement added

### 3.4 Test auth flow

```bash
npm run dev
```

Go to `/login` page:

- [ ] Can see login form
- [ ] Can click "Sign Up"
- [ ] No console errors

**Status: Phase 3 Complete ✅**

---

## 🤖 PHASE 4: AI Integration - Grok (30 min)

### 4.1 Create Grok client

**File: `src/ai/client.ts`**

```typescript
import OpenAI from "openai";

export const grokClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export const MODEL = "grok-2";
```

- [ ] File created in `src/ai/`

### 4.2 Migrate AI flows one by one

For **each file** in `src/ai/flows/`:

**Example: `generate-buyer-persona-briefing.ts`**

Replace the entire file content with:

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

Repeat for each flow:

- [ ] `generate-buyer-persona-briefing.ts` ✅
- [ ] `generate-objection-strategy.ts`
- [ ] `generate-sales-pitch-levels.ts`
- [ ] `provide-contextual-copilot-insights.ts`
- [ ] `summarize-customer-notes.ts`

### 4.3 Test AI integration

```bash
npm run dev
```

In browser console, try calling the flow:

```javascript
const result = await generateBuyerPersonaBriefing({
  p1Purpose: "Daily commute",
  p2People: "Family of 2",
  p3Pattern: "Highway 80%",
  p4Preferences: "Electric",
  p5Price: "$40k-$60k",
  p6PurchaseContext: "Within 2 months",
});
console.log(result);
```

- [ ] No errors in console
- [ ] Response contains JSON with briefing, persona, recommendations

**Status: Phase 4 Complete ✅**

---

## 💾 PHASE 5: Data Layer - Server Actions (25 min)

### 5.1 Create `src/actions/` directory

```bash
mkdir -p src/actions
```

- [ ] Directory created

### 5.2 Create `src/actions/customers.ts`

Copy from `REFACTORING_GUIDE.md` → Phase 5 → Step 5.1

- [ ] File created with CRUD functions

### 5.3 Create `src/actions/ai-flows.ts`

Copy from `REFACTORING_GUIDE.md` → Phase 5 → Step 5.2

- [ ] File created

### 5.4 Update components to use Server Actions

In dashboard/customers page, replace Firebase calls with:

```typescript
import { getCustomers } from '@/actions/customers';
import { useAuth } from '@/providers/auth-provider';

export default async function CustomersPage() {
  const { session } = useAuth(); // Client-side
  const customers = await getCustomers(session.user.id); // Server-side
  return <CustomersList customers={customers} />;
}
```

- [ ] One page updated and tested
- [ ] Data loads from Supabase (not Firebase)

**Status: Phase 5 Complete ✅**

---

## 🌐 PHASE 6: Deployment to Vercel (15 min)

### 6.1 Supabase → Vercel Integration

1. Go to Supabase Dashboard
2. Navigate to **Integrations** → Find **Vercel**
3. Click **Install Integration**
4. Select your GitHub repo + Vercel project
5. Authorize access

- [ ] Integration completed
- [ ] Env vars sync to Vercel

### 6.2 Add remaining env vars in Vercel

In Vercel Dashboard → Settings → Environment Variables, add:

- `XAI_API_KEY=your_key_here`
- `DATABASE_URL=postgresql://...` (if not auto-synced)

- [ ] All env vars added to Vercel
- [ ] Verify with `vercel env list`

### 6.3 Commit & push to GitHub

```bash
git add .
git commit -m "refactor: migrate to Supabase + Grok"
git push origin main
```

- [ ] Push successful
- [ ] Vercel deployment triggered automatically

### 6.4 Verify Vercel build

In Vercel Dashboard:

- [ ] Build completes without errors
- [ ] Logs show: "✓ npm run db:push" (migrations applied)
- [ ] Preview URL works

### 6.5 Test production

Go to your production URL:

- [ ] Login works
- [ ] Can create a customer
- [ ] Can trigger AI flows
- [ ] Data persists

**Status: Phase 6 Complete ✅**

---

## 🎉 FINAL VERIFICATION

Run this checklist to confirm everything works:

- [ ] **Auth**: Can login/signup via Supabase
- [ ] **Database**: Can create/read/update customers in Supabase
- [ ] **AI**: Can call Grok API and get responses
- [ ] **Local Dev**: `npm run dev` works without errors
- [ ] **Production**: Vercel deployment is live and functional
- [ ] **Env Vars**: All keys are properly set in `.env.local` and Vercel
- [ ] **Migrations**: Drizzle schema synced to Supabase

---

## 🆘 Troubleshooting Quick Reference

| Issue                       | Solution                                                       |
| --------------------------- | -------------------------------------------------------------- |
| "DATABASE_URL is not set"   | Check `.env.local` has `DATABASE_URL`                          |
| Supabase schema not syncing | Run `npm run db:push` locally, then retry                      |
| Grok API errors             | Verify `XAI_API_KEY` is correct in `.env.local`                |
| Auth not working            | Ensure Supabase Auth enabled + `AuthProvider` wraps app        |
| Vercel build fails          | Check build logs for missing env vars                          |
| Migrations not running      | Add `npm run db:push` to Vercel build command in `vercel.json` |

---

## 📝 Next Steps After Completion

1. **Update all remaining components** to use Supabase + Server Actions (not Firebase)
2. **Remove Firebase dependencies** once all components migrated
3. **Add database backups** in Supabase settings
4. **Set up monitoring** (Vercel Analytics, Supabase Observability)
5. **Document your DB schema** in README

---

**Last Updated:** May 6, 2026
**Status:** Ready to implement
