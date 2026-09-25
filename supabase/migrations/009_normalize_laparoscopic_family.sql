-- Run after 008. Normalize the known legacy family synonym without touching
-- specialty context (for example, Laparoscopic Surgery remains a specialty).
begin;

update public.instrument_concepts
set family = 'Laparoscopic'
where lower(btrim(family)) in (
  'laparoscopic instruments',
  'laparoscopic instrument',
  'laparoscopy'
);

commit;
