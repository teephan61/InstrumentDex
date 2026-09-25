# Shared tester playground setup

Run these files separately, in this exact order, in the Supabase SQL editor:

1. [`migrations/001_schema.sql`](migrations/001_schema.sql)
2. [`migrations/002_seed_specialties.sql`](migrations/002_seed_specialties.sql)
3. [`migrations/003_helper_functions.sql`](migrations/003_helper_functions.sql)
4. [`migrations/004_list_rpc.sql`](migrations/004_list_rpc.sql)
5. [`migrations/005_create_draft_rpc.sql`](migrations/005_create_draft_rpc.sql)
6. [`migrations/006_rls_and_grants.sql`](migrations/006_rls_and_grants.sql)
7. [`migrations/007_fix_tester_authorization.sql`](migrations/007_fix_tester_authorization.sql)
8. [`migrations/008_return_draft_source_note.sql`](migrations/008_return_draft_source_note.sql)
9. [`migrations/009_normalize_laparoscopic_family.sql`](migrations/009_normalize_laparoscopic_family.sql)

Each file is independently runnable and contains only complete SQL statements. The old combined migration was replaced by this ordered set, so there is only one migration source of truth. The scripts create a deliberately small, draft-only data model and two authenticated RPCs:

- `list_playground_instruments()` for approved testers to load shared drafts.
- `create_playground_instrument_draft(payload)` for an idempotent draft submission.

The first script enables RLS on every table before RPCs are created; with no policies, direct API access is denied. The grants and later authorization fix keep browser access limited to the authenticated RPCs. The later source-note and family-normalization migrations preserve shared-draft hydration and canonical family browsing. The migrations never create or change authoritative source revisions, knowledge representations, grounding assessments, applicability, or publication decisions.

## One-time shared tester provisioning

The playground accepts the frontend username `tester` only. It maps that name internally to `tester@instrumentdex.demo`; the email is not displayed in the tester UI.

1. In **Authentication → Users**, use **Add user** to create `tester@instrumentdex.demo` with email/password authentication. Set the intended shared playground password directly in the Dashboard; do not use an email invitation or add the password to this repository. Ensure the user is email-confirmed so no confirmation email is required.
2. In the SQL Editor, obtain and confirm the Auth UUID:

```sql
select id, email, email_confirmed_at
from auth.users
where email = 'tester@instrumentdex.demo';
```

3. Insert that UUID into `public.tester_profiles` (the query below uses the email lookup so no manual copying is necessary):

```sql
insert into public.tester_profiles (user_id, role)
select id, 'tester'
from auth.users
where email = 'tester@instrumentdex.demo'
on conflict (user_id) do update set enabled = true, role = excluded.role;
```

4. Confirm **Email** is enabled as an Auth provider. Do not add a sign-up screen or invite flow to the site; the frontend has only a password sign-in form for the pre-provisioned account.

The committed [`../supabase-config.js`](../supabase-config.js) holds only the provided browser-safe URL and publishable key. Do not add a service-role key, database password, or a private environment file to this static repository.
