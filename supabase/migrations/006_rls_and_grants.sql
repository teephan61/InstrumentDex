-- Run last. RLS is already enabled in 001; now remove direct grants and expose
-- only the approved-tester RPCs.
revoke all on table public.tester_profiles, public.instrument_concepts,
  public.specialty_terms, public.instrument_specialties,
  public.facility_instrument_contexts, public.facility_tray_memberships,
  public.instrument_product_candidates, public.instrument_draft_submissions
from anon, authenticated;
revoke all on schema private from public;
revoke all on function private.is_approved_tester() from public;
revoke all on function private.playground_record(uuid) from public;
revoke all on function public.list_playground_instruments() from public;
revoke all on function public.create_playground_instrument_draft(jsonb) from public;
grant usage on schema public to authenticated;
grant execute on function public.list_playground_instruments() to authenticated;
grant execute on function public.create_playground_instrument_draft(jsonb) to authenticated;
