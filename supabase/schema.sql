create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  role text not null default 'student',
  full_name text not null,
  whatsapp text not null,
  academic_level text,
  package_name text,
  payment_method text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  full_name text not null,
  email text unique,
  whatsapp text,
  academic_level text,
  group_name text,
  created_at timestamptz not null default now()
);

create table if not exists attendance_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  meeting_id text not null,
  joined_at timestamptz,
  left_at timestamptz,
  duration_seconds integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  duration_minutes integer default 15,
  created_at timestamptz not null default now()
);

create table if not exists quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  score numeric,
  warnings integer default 0,
  submitted_at timestamptz default now()
);

create table if not exists parent_tokens (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists leads_created_at_idx on leads(created_at desc);
create index if not exists attendance_student_idx on attendance_logs(student_id);
create index if not exists submissions_student_idx on quiz_submissions(student_id);

alter table leads enable row level security;
alter table students enable row level security;
alter table attendance_logs enable row level security;
alter table quizzes enable row level security;
alter table quiz_submissions enable row level security;
alter table parent_tokens enable row level security;

revoke all on leads from anon, authenticated;
revoke all on students from anon, authenticated;
revoke all on attendance_logs from anon, authenticated;
revoke all on parent_tokens from anon, authenticated;