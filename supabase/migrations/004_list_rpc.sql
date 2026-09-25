-- Run fourth. This is the authenticated shared-draft read path.
create or replace function public.list_playground_instruments()
returns setof jsonb
language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not private.is_approved_tester() then
    raise exception 'Approved tester access is required' using errcode='42501';
  end if;
  return query
    select private.playground_record(c.id)
    from public.instrument_concepts c
    join public.instrument_draft_submissions ds on ds.instrument_concept_id=c.id
    order by ds.created_at desc;
end;
$$;
