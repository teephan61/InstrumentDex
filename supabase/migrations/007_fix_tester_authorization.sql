-- Run after 006. The helper must execute as the owner of tester_profiles so
-- its security-definer lookup is not filtered by the table's deny-by-default RLS.
-- This leaves direct table access and all existing RLS protections unchanged.
begin;

create or replace function private.is_approved_tester()
returns boolean
language plpgsql
stable
security definer
set search_path = pg_catalog
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    return false;
  end if;

  return exists (
    select 1
    from public.tester_profiles as profile
    where profile.user_id = caller_id
      and profile.enabled is true
      and profile.role in ('tester', 'admin')
  );
end;
$$;

-- Match the function owner to the table owner rather than relying on the role
-- that happened to run an earlier migration. Table owners bypass non-FORCE RLS.
do $$
declare
  tester_profiles_owner text;
begin
  select relation.relowner::regrole::text
    into tester_profiles_owner
  from pg_class as relation
  where relation.oid = 'public.tester_profiles'::regclass;

  if tester_profiles_owner is null then
    raise exception 'Could not determine owner of public.tester_profiles';
  end if;

  execute format('alter function private.is_approved_tester() owner to %I', tester_profiles_owner);
end;
$$;

-- Keep the helper private. Public RPC grants remain limited to authenticated
-- callers as established in 006_rls_and_grants.sql.
revoke all on function private.is_approved_tester() from public;

commit;
