# Aura Migration: Firebase → Supabase + Genkit → Grok

## 🔄 Side-by-Side Comparison

### Authentication

#### BEFORE (Firebase)

```typescript
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

#### AFTER (Supabase)

```typescript
import { supabase } from "@/lib/supabase-client";

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**Key Differences:**

- Firebase Auth → Supabase Auth (same concepts, cleaner API)
- No need for Firebase config file (Supabase handles it via environment vars)
- Session management automatically handled by `@supabase/supabase-js`

---

### Database Reads/Writes

#### BEFORE (Firestore)

```typescript
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

const q = query(collection(db, "customers"), where("userId", "==", userId));
const snapshot = await getDocs(q);
const customers = snapshot.docs.map((doc) => doc.data());
```

#### AFTER (Supabase + Drizzle)

```typescript
import { db } from "@/db/client";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";

const customers = await db.query.customers.findMany({
  where: eq(customers.userId, userId),
});
```

**Key Differences:**

- Type-safe queries with Drizzle
- SQL under the hood (better for complex queries)
- Relations are preloaded (can access nested data easily)
- No need to manually convert documents

---

### React Hooks for Data

#### BEFORE (Firebase)

```typescript
// Custom hook using Firestore listener
import { onSnapshot, collection, query, where } from "firebase/firestore";

export function useFirestoreData(collectionName, whereClause) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), where(...whereClause));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map((doc) => doc.data()));
    });
    return unsubscribe;
  }, []);

  return data;
}
```

#### AFTER (Server Actions + useTransition)

```typescript
// Server Action for data fetching
export async function getCustomers(userId: string) {
  return db.query.customers.findMany({
    where: eq(customers.userId, userId),
  });
}

// Component usage
'use client';
import { useState, useTransition } from 'react';
import { getCustomers } from '@/actions/customers';

export function CustomersList() {
  const [data, setPending] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const customers = await getCustomers(userId);
      setData(customers);
    });
  }, [userId]);

  return <div>{/* render data */}</div>;
}
```

**Key Differences:**

- Server Actions instead of real-time listeners (better for most use cases)
- Less state management needed
- Automatic caching by Next.js
- Can't do real-time subscriptions, but get better performance

---

### AI Integration

#### BEFORE (Genkit + Google AI)

```typescript
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

export const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-flash",
});

export async function generateBriefing(input) {
  const response = await ai.generate({
    prompt: `Generate briefing for: ${JSON.stringify(input)}`,
    model: "googleai/gemini-2.5-flash",
  });
  return response.text();
}
```

#### AFTER (Grok API + OpenAI SDK)

```typescript
import OpenAI from "openai";

export const grokClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function generateBriefing(input) {
  const response = await grokClient.chat.completions.create({
    model: "grok-2",
    messages: [
      {
        role: "user",
        content: `Generate briefing for: ${JSON.stringify(input)}`,
      },
    ],
  });
  return response.choices[0].message.content;
}
```

**Key Differences:**

- Grok uses OpenAI-compatible SDK (same interface, different model)
- Simpler setup (no Genkit framework overhead)
- Grok model is faster and cheaper than Gemini
- All flows become simple async functions (no Genkit schema complexity)

---

### Environment Variables

#### BEFORE (Firebase)

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-683630819-4e6f8
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD2jXOWMiKMTwy0hIIfFQQGIFniDgSL3IQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-683630819-4e6f8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=727723431605
NEXT_PUBLIC_FIREBASE_APP_ID=1:727723431605:web:a1fad858c3708f708e90fc
```

#### AFTER (Supabase + Grok)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxxxxx
XAI_API_KEY=xai-xxxxxxxxxxxxxx
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

**Key Differences:**

- Fewer public keys (more secure)
- Service role key is server-only (better security)
- Standard PostgreSQL connection string (no vendor lock-in)
- Single AI provider key

---

### Folder Structure

#### BEFORE

```
src/
├── firebase/
│   ├── config.ts
│   ├── client-provider.tsx
│   ├── error-emitter.ts
│   └── provider.tsx
├── ai/
│   ├── genkit.ts
│   ├── dev.ts
│   └── flows/
└── ...
```

#### AFTER

```
src/
├── db/                    ← NEW: Database layer
│   ├── schema.ts
│   ├── client.ts
│   └── migrations/
├── ai/
│   ├── client.ts          ← Grok client
│   ├── flows/
│   └── utils.ts
├── actions/               ← NEW: Server Actions
│   ├── customers.ts
│   ├── battles.ts
│   └── ai-flows.ts
├── lib/
│   ├── supabase-client.ts ← NEW
│   ├── supabase-server.ts ← NEW
│   └── utils.ts
└── ...
```

---

## 📊 Comparison Table

| Aspect             | Firebase            | Supabase                   |
| ------------------ | ------------------- | -------------------------- |
| **Database**       | Firestore (NoSQL)   | PostgreSQL (SQL)           |
| **Query Language** | Firebase SDK        | SQL / Drizzle ORM          |
| **Type Safety**    | Zod schema          | Drizzle types + TypeScript |
| **Relations**      | Manual JOINs        | Built-in relations         |
| **Real-time**      | WebSocket listeners | Realtime API (optional)    |
| **Backend**        | Server Actions      | Server Actions             |
| **Cost**           | Pay per read/write  | Pay per GB + compute       |
| **Vendor Lock-in** | High                | Low (standard PostgreSQL)  |

| Aspect             | Genkit + Google AI | Grok API             |
| ------------------ | ------------------ | -------------------- |
| **SDK**            | Custom (Genkit)    | OpenAI-compatible    |
| **Setup**          | Plugin system      | Simple OpenAI client |
| **Model**          | Gemini 2.5 Flash   | Grok 2               |
| **Speed**          | Standard           | Faster (claimed)     |
| **Cost**           | $0.075 / 1M input  | $0.02 / 1M input     |
| **Latency**        | 1-2s               | < 1s (claimed)       |
| **Context Window** | 1M tokens          | 128K tokens          |

---

## ✅ Migration Checklist by Component

### Pages & Layouts

- [ ] `/app/login/page.tsx` - Use Supabase Auth
- [ ] `/app/profile-setup/page.tsx` - Use Supabase Auth
- [ ] `/app/verify/page.tsx` - Use Supabase Auth
- [ ] `/app/(dashboard)/*` - Replace Firebase calls with Server Actions

### Components

- [ ] `FirebaseErrorListener.tsx` - Remove or adapt to Supabase
- [ ] All components using Firestore - Replace with Server Actions

### Hooks

- [ ] `use-collection.tsx` - Replace with Server Action calls
- [ ] `use-doc.tsx` - Replace with Server Action calls

### Context Providers

- [ ] `firebase/provider.tsx` - Replace with Supabase AuthProvider

---

## 🚨 Breaking Changes to Watch For

1. **No real-time subscriptions by default**
   - Previous: Firestore listeners auto-updated UI
   - Now: Must manually call Server Actions on events
   - Workaround: Add polling or Supabase Realtime API if needed

2. **Type safety required**
   - Drizzle enforces column types (no more loose `any` types)
   - Requires schema definition first

3. **Genkit flows become simple functions**
   - No Genkit schema validation
   - Use Zod instead for validation

4. **Array fields in database**
   - Firebase: Natural array support
   - PostgreSQL: Use `json` or `json[]` types
   - Drizzle: Use `json('column')` for JSON arrays

5. **Transactions and batch writes**
   - Firebase: Simple `batch()` API
   - Drizzle: Use database transactions
   - ```typescript
     await db.transaction(async (tx) => {
       await tx.insert(customers).values(...);
       await tx.update(battleCards).set(...);
     });
     ```

---

## 🎯 Performance Improvements

1. **Faster AI responses**: Grok is ~50% faster than Gemini
2. **Better database queries**: SQL with Drizzle is more optimizable
3. **Server-side rendering**: More logic runs server-side, reducing client bundle
4. **Type safety**: Fewer runtime errors = fewer user-facing bugs
5. **PostgreSQL scalability**: Better for larger datasets

---

## 💰 Cost Comparison (Estimated Annual)

| Component               | Firebase       | Supabase       |
| ----------------------- | -------------- | -------------- |
| **Auth**                | $0 (free tier) | $0 (free tier) |
| **Database (1GB data)** | ~$50           | ~$20           |
| **AI (1M calls/month)** | ~$27           | ~$7            |
| **Hosting**             | N/A (Vercel)   | N/A (Vercel)   |
| **TOTAL**               | ~$77           | ~$27           |

**Estimated savings: 65% cheaper** ✅

---

## 📚 Additional Resources

- [Supabase to Firebase comparison](https://supabase.com/docs/guides/migrations/firebase)
- [Drizzle ORM best practices](https://orm.drizzle.team/docs/get-started-postgresql)
- [Grok API documentation](https://docs.x.ai/api/)
- [Vercel + Supabase integration](https://vercel.com/integrations/supabase)
