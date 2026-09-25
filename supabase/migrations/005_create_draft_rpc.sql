-- Run fifth. One complete, idempotent shared-draft write RPC.
create or replace function public.create_playground_instrument_draft(payload jsonb)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  request_id uuid;
  concept_id uuid;
  context_id uuid;
  specialty_id text;
  tray jsonb;
  common_name_value text;
  family_value text;
  context jsonb := coalesce(payload->'facility_context','{}'::jsonb);
  product jsonb := coalesce(payload->'product_candidate','{}'::jsonb);
begin
  if auth.uid() is null or not private.is_approved_tester() then
    raise exception 'Approved tester access is required' using errcode='42501';
  end if;
  if coalesce(payload->>'client_request_id','') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    raise exception 'A valid client request id is required' using errcode='22023';
  end if;
  request_id := (payload->>'client_request_id')::uuid;
  perform pg_advisory_xact_lock(hashtextextended(request_id::text,0));
  select ds.instrument_concept_id into concept_id
    from public.instrument_draft_submissions ds where ds.client_request_id=request_id;
  if found then return private.playground_record(concept_id); end if;

  common_name_value := btrim(coalesce(payload->>'common_name',''));
  family_value := btrim(coalesce(payload->>'family',''));
  if length(common_name_value) < 2 or length(family_value) < 2 then
    raise exception 'Common name and family are required' using errcode='22023';
  end if;

  insert into public.instrument_concepts (
    common_name,family,aliases,recognition_cue,distinguishing_features,confusables,created_by
  ) values (
    common_name_value,family_value,
    coalesce(array(select jsonb_array_elements_text(coalesce(payload->'aliases','[]'::jsonb))),'{}'),
    left(btrim(coalesce(payload->>'recognition_cue','')),1000),
    coalesce(array(select jsonb_array_elements_text(coalesce(payload->'distinguishing_features','[]'::jsonb))),'{}'),
    coalesce(array(select jsonb_array_elements_text(coalesce(payload->'confusables','[]'::jsonb))),'{}'),auth.uid()
  ) returning id into concept_id;

  for specialty_id in select jsonb_array_elements_text(coalesce(payload->'specialty_ids','[]'::jsonb)) loop
    insert into public.instrument_specialties (instrument_concept_id,specialty_term_id)
      select concept_id,st.id from public.specialty_terms st where st.id=specialty_id
      on conflict do nothing;
  end loop;

  insert into public.facility_instrument_contexts (instrument_concept_id,local_name,note,created_by)
    values (concept_id,nullif(btrim(context->>'local_name'),''),nullif(btrim(context->>'note'),''),auth.uid())
    returning id into context_id;
  for tray in select jsonb_array_elements(coalesce(context->'trays','[]'::jsonb)) loop
    if length(btrim(coalesce(tray->>'name',''))) > 0 then
      insert into public.facility_tray_memberships (facility_context_id,tray_name,quantity)
        values (context_id,left(btrim(tray->>'name'),160),nullif(left(btrim(coalesce(tray->>'quantity','')),80),''));
    end if;
  end loop;

  if coalesce(nullif(btrim(product->>'manufacturer'),''),nullif(btrim(product->>'catalog'),''),nullif(btrim(product->>'variant'),'')) is not null then
    insert into public.instrument_product_candidates (instrument_concept_id,manufacturer,catalog,variant,reuse,created_by)
      values (concept_id,nullif(btrim(product->>'manufacturer'),''),nullif(btrim(product->>'catalog'),''),
        nullif(btrim(product->>'variant'),''),nullif(btrim(product->>'reuse'),''),auth.uid());
  end if;

  insert into public.instrument_draft_submissions (instrument_concept_id,client_request_id,processing_draft,source_note,submitted_by)
    values (concept_id,request_id,coalesce(payload->'processing_draft','{}'::jsonb),
      nullif(left(btrim(coalesce(payload->>'source_note','')),4000),''),auth.uid());
  return private.playground_record(concept_id);
end;
$$;
