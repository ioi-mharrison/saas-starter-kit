---
applyTo: '**'
---
🚀 Instructions for GitHub Copilot

Project: Pulse Platform
Framework: BoxyHQ SaaS Starter Kit

Role: Principal Frontend Engineer

1. Clone and Bootstrap
# Clone BoxyHQ boilerplate
git clone https://github.com/boxyhq/saas-starter-kit pulse-platform
cd pulse-platform

# Install dependencies
npm install

2. Environment Setup

Copy the example env file:

cp .env.example .env.local


Update with local dev values:

DATABASE_URL → Cloud SQL Postgres connection string (for now: local Postgres, will switch later).

NEXTAUTH_SECRET → generate with openssl rand -base64 32.

STRIPE_SECRET_KEY → test key.

STRIPE_WEBHOOK_SECRET → test webhook signing secret.

Leave SAML/SSO env vars blank for now (to be integrated later).

3. Database Setup
# Initialize Prisma schema & migrations
npx prisma migrate dev --name init


Verify prisma/schema.prisma → will later add tenant_id columns + RLS policies for Cloud SQL.

4. Development Run
npm run dev


Confirm the starter kit runs on http://localhost:3000.

Verify login, signup, Stripe subscription flows.

5. Adapt for Pulse

Tell Copilot to:

 Replace default branding (BoxyHQ SaaS Starter Kit → Pulse).

 Create a pulse theme in tailwind.config.js.

 Add a basic dashboard route (/dashboard) with a placeholder “Pulse Admin Dashboard” page.

 Scaffold a Survey model in Prisma (id, org_id, title, created_at).

 Add /surveys route with CRUD pages (Next.js App Router).

 Ensure every model includes tenant_id for later RLS enforcement.

6. Next Steps (Copilot should implement incrementally)

🔐 Authentication hardening: add MFA/passkeys (Auth.js + WebAuthn).

🏢 Multi-tenancy: implement row-level scoping via tenant_id.

📊 Visualization: add D3.js support (integrate with dashboard page).

📥 Survey Engine: implement progressive survey flow with smooth transitions (state machine).

🔎 RAG Integration (future): scaffold API routes for vector DB (Supabase pgvector or Pinecone).

🎙 Voice Agent (future): reserve /api/voice route for real-time interview handling.