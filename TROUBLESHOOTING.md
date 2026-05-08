# Aura Refactoring: Troubleshooting Guide

## 🔴 Common Issues & Solutions

---

## Database Issues

### Issue: "connect ECONNREFUSED 127.0.0.1:5432"

**Cause:** PostgreSQL connection failed (wrong DATABASE_URL or Supabase down)

**Solution:**

1. Verify your `DATABASE_URL` in `.env.local`
2. Copy exact connection string from Supabase:
   - Dashboard → Settings → Database → Connection Pooling → URI
   - Use "Connection Pooling" not "Direct"
3. Test connection:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```
4. If still failing, recreate Supabase project with fresh credentials

---

### Issue: "relation 'customers' does not exist"

**Cause:** Migrations haven't been applied to your database

**Solution:**

```bash
# Generate migrations
npm run db:generate

# Apply to database
npm run db:push

# Verify tables exist
psql $DATABASE_URL -c "\dt"  # Should list tables
```

If migrations fail:

1. Check for SQL syntax errors: `npm run db:generate` output
2. Drop all tables and retry:
   ```bash
   npm run db:drop  # ⚠️ WARNING: Deletes all data
   npm run db:push
   ```
3. Verify schema in `src/db/schema.ts` has no errors

---

### Issue: "DATABASE_URL is not set"

**Cause:** Environment variable not loaded

**Solution:**

1. Verify `.env.local` exists in project root (not in `src/` folder)
2. Content should be:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/db
   ```
3. Restart dev server: `npm run dev`
4. If running in terminal, try:
   ```bash
   source .env.local  # macOS/Linux
   set -a; source .env.local; set +a  # Bash
   ```

---

### Issue: Type errors in Drizzle queries

**Cause:** Schema types don't match query structure

**Example Error:**

```
Type 'string | null' is not assignable to type 'string'
```

**Solution:**

```typescript
// ❌ WRONG: Nullable field without null handling
const customer = await db.query.customers.findFirst({
  where: eq(customers.email, input.email), // email might be null
});

// ✅ CORRECT: Handle nullable fields
const customer = await db.query.customers.findFirst({
  where: input.email ? eq(customers.email, input.email) : undefined,
});

// Or make fields NOT NULL in schema:
export const customers = pgTable("customers", {
  email: varchar("email", { length: 255 }).notNull(), // Add .notNull()
});
```

---

## Authentication Issues

### Issue: "Auth session not persisting"

**Cause:** Supabase cookies not set up correctly

**Solution:**

Verify your auth provider in `src/providers/auth-provider.tsx`:

```typescript
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return children; // Render component
}
```

---

### Issue: "CORS error when calling Supabase from client"

**Cause:** Supabase project not configured for your domain

**Solution:**

1. Go to Supabase Dashboard → Settings → API
2. Ensure your domain is in "Additional Redirect URLs":
   ```
   http://localhost:3000
   https://yourdomain.com
   ```
3. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
4. If localhost, try:
   ```bash
   npm run dev -- --host 0.0.0.0  # Open binding
   ```

---

### Issue: "User not found" after signup

**Cause:** Supabase Auth email confirmation required

**Solution:**

Supabase Auth requires email verification by default. Either:

**Option 1: Disable email confirmation (development only)**

- Dashboard → Authentication → Providers → Email → Turn OFF "Confirm email"

**Option 2: Implement email confirmation flow**

```typescript
// After signup
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
});

// User will receive confirmation email
// After clicking link, they can login
```

---

## AI / Grok Issues

### Issue: "XAI_API_KEY is missing"

**Cause:** Environment variable not set

**Solution:**

1. Get key from https://console.x.ai → API Keys
2. Add to `.env.local`:
   ```env
   XAI_API_KEY=xai-xxxxxxxxxxxxxxxx
   ```
3. Restart dev server: `npm run dev`
4. Verify:
   ```typescript
   console.log(process.env.XAI_API_KEY); // Should print key
   ```

---

### Issue: "401 Unauthorized - Invalid API key"

**Cause:** Wrong or expired API key

**Solution:**

1. Go to https://console.x.ai → API Keys
2. Create new key (old ones might be expired)
3. Copy exact string (no extra spaces)
4. Update `.env.local`:
   ```env
   XAI_API_KEY=xai-<new-key>
   ```
5. Restart server: `npm run dev`

---

### Issue: "400 Bad Request - Invalid model"

**Cause:** Model name is incorrect or unavailable

**Solution:**

Check that `MODEL` in `src/ai/client.ts` matches available model:

```typescript
export const MODEL = "grok-2"; // ✅ Correct

// ❌ These will fail:
export const MODEL = "grok-2.0";
export const MODEL = "grok-beta";
export const MODEL = "gemini-2.5"; // Wrong provider
```

Available models (as of May 2026):

- `grok-2` (recommended)
- `grok-1` (older, but working)

Check current models at: https://docs.x.ai/api/

---

### Issue: "timeout waiting for AI response"

**Cause:** Grok API taking too long or request too complex

**Solution:**

1. Add timeout to Grok client:

   ```typescript
   export const grokClient = new OpenAI({
     apiKey: process.env.XAI_API_KEY,
     baseURL: "https://api.x.ai/v1",
     timeout: 30_000, // 30 seconds
   });
   ```

2. Simplify prompt (shorter context):

   ```typescript
   // ❌ Too complex
   const prompt = `Analyze this entire customer file and...`;

   // ✅ Focused
   const prompt = `Based on: ${input.purpose}, generate 3 suggestions`;
   ```

3. Use streaming for long responses:

   ```typescript
   const stream = await grokClient.chat.completions.create({
     model: MODEL,
     messages: [...],
     stream: true, // Enable streaming
   });

   for await (const chunk of stream) {
     process.stdout.write(chunk.choices[0]?.delta?.content || '');
   }
   ```

---

## Deployment / Vercel Issues

### Issue: "Vercel build fails with 'DATABASE_URL not set'"

**Cause:** Environment variables not synced from Supabase

**Solution:**

1. **Supabase Integration:**
   - Go to Supabase Dashboard → Integrations → Vercel
   - Click "Install Integration"
   - Select your GitHub repo + Vercel project
   - Authorize

2. **Manual Env Vars:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add missing variables:
     ```
     SUPABASE_URL=https://...
     SUPABASE_ANON_KEY=eyJ...
     SUPABASE_SERVICE_ROLE_KEY=eyJ... (server-only)
     XAI_API_KEY=xai-...
     DATABASE_URL=postgresql://...
     ```

3. **Rebuild:**
   - In Vercel, go to Deployments → Click latest deploy → Redeploy

---

### Issue: "Migrations don't run on Vercel"

**Cause:** `npm run db:push` not called during build

**Solution:**

Create `vercel.json` in root:

```json
{
  "buildCommand": "npm run db:push && npm run build",
  "outputDirectory": ".next"
}
```

Or update `package.json` build script:

```json
{
  "scripts": {
    "build": "npm run db:push && next build"
  }
}
```

---

### Issue: "Vercel preview: 'Cannot find module @supabase/supabase-js'"

**Cause:** Dependencies not installed in Vercel

**Solution:**

1. Verify `package.json` has all dependencies:

   ```bash
   npm ls @supabase/supabase-js
   ```

2. If missing:

   ```bash
   npm install @supabase/supabase-js
   git add package-lock.json
   git commit -m "Add missing dependencies"
   git push
   ```

3. Redeploy from Vercel dashboard

---

## Development Environment Issues

### Issue: "npm run dev fails - Port already in use"

**Cause:** Another process using port 9002

**Solution:**

```bash
# Find process using port 9002 (macOS/Linux)
lsof -i :9002

# Kill it
kill -9 <PID>

# Or use different port
npm run dev -- -p 3000
```

---

### Issue: "Next.js build takes forever"

**Cause:** Large dependencies or slow machine

**Solution:**

1. Check what's slow:

   ```bash
   npm run build -- --experimental-app-dir-tests
   ```

2. Disable Turbopack (if causing issues):

   ```json
   {
     "scripts": {
       "dev": "next dev -p 9002" // Remove --turbopack
     }
   }
   ```

3. Clear cache:
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run dev
   ```

---

### Issue: "TypeScript errors but code works"

**Cause:** Type definitions mismatch or cache

**Solution:**

```bash
# Clear TypeScript cache
npm run typecheck -- --noEmit

# Or regenerate types
npm run build -- --skipLinting

# Update type definitions
npm install --save-dev @types/node@latest
```

---

## Network / API Issues

### Issue: "429 Too Many Requests (Grok)"

**Cause:** Rate limit exceeded on Grok API

**Solution:**

1. Add retry logic with backoff:

   ```typescript
   async function callGrokWithRetry(prompt, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await grokClient.chat.completions.create({
           model: MODEL,
           messages: [{ role: "user", content: prompt }],
         });
       } catch (error) {
         if (error.status === 429 && i < maxRetries - 1) {
           const delayMs = Math.pow(2, i) * 1000; // Exponential backoff
           await new Promise((r) => setTimeout(r, delayMs));
         } else {
           throw error;
         }
       }
     }
   }
   ```

2. Reduce request frequency (cache results)

3. Contact xAI for higher rate limit

---

### Issue: "Supabase connection timeout"

**Cause:** Poor network or Supabase under heavy load

**Solution:**

1. Check Supabase status: https://status.supabase.com/
2. Try connection pooling (already recommended):
   - Settings → Database → Connection Pooling → Use this URL
3. Add retry logic in database calls
4. Use Vercel Edge Functions for better latency:
   ```bash
   npm install @vercel/postgres
   ```

---

## 🆘 Emergency Troubleshooting

If everything is broken, follow this sequence:

1. **Check logs:**

   ```bash
   npm run dev  # See full output
   ```

2. **Verify all env vars:**

   ```bash
   echo $DATABASE_URL
   echo $XAI_API_KEY
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

3. **Test each component independently:**

   ```typescript
   // Test DB connection
   console.log(await db.query.users.findMany());

   // Test Grok connection
   const msg = await grokClient.chat.completions.create({...});

   // Test Supabase Auth
   const session = await supabase.auth.getSession();
   ```

4. **Clear everything and restart:**

   ```bash
   rm -rf node_modules .next .drizzle
   npm install
   npm run db:generate
   npm run db:push
   npm run dev
   ```

5. **Check GitHub issues:**
   - Supabase: https://github.com/supabase/supabase/issues
   - Drizzle: https://github.com/drizzle-team/drizzle-orm/issues
   - Grok: https://github.com/x-ai-org/community/issues

---

## 📞 Getting Help

1. **Supabase Community:** https://discord.supabase.io/
2. **Drizzle Discord:** https://discord.gg/jvBQ2QCWJq
3. **xAI Community:** https://discord.gg/x-ai
4. **Next.js Discord:** https://discord.gg/nextjs

Include in your question:

- Full error message + stack trace
- Steps to reproduce
- `package.json` (dependencies)
- `.env.local` (without secrets)
- Vercel build logs (if deployment issue)

---

**Last Updated:** May 6, 2026
