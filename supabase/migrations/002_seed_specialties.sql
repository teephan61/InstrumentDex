-- Run second. Keep these ids aligned with domain.js specialtyTerms.
insert into public.specialty_terms (id,name) values
  ('general-surgery','General Surgery'),('gynecology','Gynecology'),
  ('ent','ENT'),('orthopedics','Orthopedics'),('urology','Urology'),
  ('dental-oral','Dental / Oral Surgery'),('endoscopy','Endoscopy'),
  ('laparoscopic','Laparoscopic Surgery')
on conflict (id) do update set name=excluded.name;
