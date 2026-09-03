-- ================================================================
-- CMS Tables  (run in Supabase SQL editor)
-- ================================================================

create table if not exists cms_profile (
  id          text primary key default 'main',
  name        text not null default 'Joanne Wu',
  name_zh     text default '吳蕎安',
  title       text default 'AI Engineer @ Heph.AI',
  bio         text default 'Building LLM & Agent Platforms · MS InfoMgmt GPA 3.98 · Prev. TSMC · ITRI',
  email       text default 'joannewu0314@gmail.com',
  phone       text default '+886 988 984 614',
  linkedin_url text default 'https://www.linkedin.com/in/joannewu-ca/',
  github_url  text default 'https://github.com/ocaaaaii',
  cv_path     text default '/CA.CV.pdf',
  status_text text default 'AI Engineer · Open to collaboration',
  updated_at  bigint default extract(epoch from now())::bigint * 1000
);

create table if not exists cms_skill_groups (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  color      text default '#6A9896',
  skills     jsonb default '[]'::jsonb,
  sort_order int default 0
);

create table if not exists cms_work (
  id          uuid primary key default gen_random_uuid(),
  company     text not null,
  role        text not null,
  period      text not null,
  description text default '',
  logo_path   text default '',
  fallback_bg text default '#849C92',
  is_current  boolean default false,
  sort_order  int default 0
);

create table if not exists cms_education (
  id          uuid primary key default gen_random_uuid(),
  school      text not null,
  degree      text not null,
  period      text not null,
  gpa         text default '',
  logo_path   text default '',
  fallback_bg text default '#9B84C4',
  sort_order  int default 0
);

create table if not exists cms_projects (
  id         text primary key,
  label      text not null,
  emoji      text default '✦',
  bg         text default '#8AAEAB',
  img_src    text default '',
  iframe_url text default '',
  icon_scale real default 1.0,
  sort_order int default 0
);

-- RLS (admin auth is client-side password-hash, so allow all)
alter table cms_profile      enable row level security;
alter table cms_skill_groups enable row level security;
alter table cms_work         enable row level security;
alter table cms_education    enable row level security;
alter table cms_projects     enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='cms_profile'      and policyname='allow all') then create policy "allow all" on cms_profile      for all using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='cms_skill_groups' and policyname='allow all') then create policy "allow all" on cms_skill_groups for all using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='cms_work'         and policyname='allow all') then create policy "allow all" on cms_work         for all using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='cms_education'    and policyname='allow all') then create policy "allow all" on cms_education    for all using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='cms_projects'     and policyname='allow all') then create policy "allow all" on cms_projects     for all using (true) with check (true); end if;
end $$;

-- ================================================================
-- Seed Data
-- ================================================================

insert into cms_profile (id, name, name_zh, title, bio, email, phone, linkedin_url, github_url, cv_path, status_text)
values ('main','Joanne Wu','吳蕎安','AI Engineer @ Heph.AI',
  'Building LLM & Agent Platforms · MS InfoMgmt GPA 3.98 · Prev. TSMC · ITRI',
  'joannewu0314@gmail.com','+886 988 984 614',
  'https://www.linkedin.com/in/joannewu-ca/','https://github.com/ocaaaaii',
  '/CA.CV.pdf','AI Engineer · Open to collaboration')
on conflict (id) do nothing;

insert into cms_skill_groups (label, color, skills, sort_order) values
  ('Languages',      '#6A9896', '["Python","JavaScript","TypeScript","SQL","HTML / CSS"]', 0),
  ('AI & LLM',       '#818CF8', '["LLM Architecture","RAG","LangChain","Agentic Workflows","OpenAI API","LLM Fine-tuning","PyTorch"]', 1),
  ('Full-Stack',     '#4A7070', '["React","Next.js","Flask","Supabase","API Integration"]', 2),
  ('Methods & Tools','#C4845A', '["Agile","Rapid Prototyping","Database Design","System Architecture","Vibe Coding"]', 3)
on conflict do nothing;

insert into cms_work (company, role, period, description, logo_path, fallback_bg, is_current, sort_order) values
  ('Heph.AI','AI Engineer','2026.08 – Present','Building LLM & Agentic platforms; RAG pipelines, GenAI product development','/Heph.png','#4F46E5',true,0),
  ('ITRI','Full-Stack Dev & Lead UI/UX','2026.04 – 2026.07','AI Parenting Navigator Platform — Led full-stack development & end-to-end UI/UX design','/itri.png','#3A7CA5',false,1),
  ('TSMC','Summer Intern','2024.07 – 2024.08','Full-stack Daily-Change Platform (Python + React); reduced RCA triage time','/tsmc.png','#C4845A',false,2),
  ('WINBOND','Summer Intern','2023.07 – 2023.08','Enterprise Data Dictionary UI — 3rd Place at symposium','/Winbond.png','#849C92',false,3);

insert into cms_education (school, degree, period, gpa, logo_path, fallback_bg, sort_order) values
  ('NSYSU','MS Information Management','2023.09 – 2025.12','GPA 3.98','/NSYSU.png','#9B84C4',0),
  ('NSYSU','BS Information Management','2019.09 – 2023.06','GPA 3.82','/NSYSU.png','#9B84C4',1);

insert into cms_projects (id, label, emoji, bg, img_src, iframe_url, icon_scale, sort_order) values
  ('project-moon-tarot',  'AI Moon Tarot',          '🌙','#1A1330','/AI-Moon-Tarot.png',     'https://ai-moon-tarot.vercel.app/',                                    1.0, 0),
  ('project-parenting',   'AI Parenting Navigator', '🍼','#F0E8DC','/AI-Parenting-Platform.png','https://parent-navigator.vercel.app/',                              1.0, 1),
  ('project-mochi',       'Mochi Habit',            'M', '#8AAEAB','/Mochi.png',              'https://mochiselfgrowingapp.vercel.app/home',                         1.0, 2),
  ('project-stock',       'StockPlatform',          'S', '#A8C49A','/Stock.png',              'https://stockplatform-rp6tf42ln2k8qfcztevgvy.streamlit.app/',         1.0, 3),
  ('project-tip',         'Tip Split',              'T', '#4A7070','/Tipsplit.png',           'https://tip-split-usa.vercel.app/',                                   1.0, 4)
on conflict (id) do nothing;
