-- Run third. These private helpers are used by the authenticated RPCs.
create or replace function private.is_approved_tester()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.tester_profiles p
    where p.user_id = auth.uid() and p.enabled
  );
$$;

create or replace function private.playground_record(p_concept_id uuid)
returns jsonb
language sql stable security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', c.id,
    'common_name', c.common_name,
    'family', c.family,
    'aliases', to_jsonb(c.aliases),
    'recognition_cue', c.recognition_cue,
    'distinguishing_features', to_jsonb(c.distinguishing_features),
    'confusables', to_jsonb(c.confusables),
    'specialty_ids', coalesce((select jsonb_agg(s.specialty_term_id order by s.specialty_term_id)
      from public.instrument_specialties s where s.instrument_concept_id=c.id),'[]'::jsonb),
    'facility_context', jsonb_build_object(
      'local_name', fc.local_name,
      'note', fc.note,
      'trays', coalesce((select jsonb_agg(jsonb_build_object('name',tm.tray_name,'quantity',tm.quantity) order by tm.tray_name)
        from public.facility_tray_memberships tm where tm.facility_context_id=fc.id),'[]'::jsonb)),
    'product_candidate', coalesce(pc.payload,'{}'::jsonb),
    'processing_draft', ds.processing_draft,
    'source_grounding_state', ds.source_grounding_state,
    'publication_state', ds.publication_state,
    'submitted_by', u.email,
    'created_at', ds.created_at
  )
  from public.instrument_concepts c
  join public.instrument_draft_submissions ds on ds.instrument_concept_id=c.id
  join auth.users u on u.id=ds.submitted_by
  left join lateral (
    select x.id,x.local_name,x.note from public.facility_instrument_contexts x
    where x.instrument_concept_id=c.id order by x.created_at desc limit 1
  ) fc on true
  left join lateral (
    select jsonb_build_object('manufacturer',p.manufacturer,'catalog',p.catalog,
      'variant',p.variant,'reuse',p.reuse,'identity_state',p.identity_state) as payload
    from public.instrument_product_candidates p
    where p.instrument_concept_id=c.id order by p.created_at desc limit 1
  ) pc on true
  where c.id=p_concept_id;
$$;
