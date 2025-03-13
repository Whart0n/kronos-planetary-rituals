-- Verify tables exist and have correct columns
select 
    table_name,
    string_agg(column_name || ' (' || data_type || ')', ', ') as columns
from information_schema.columns
where table_schema = 'public'
    and table_name in ('profiles', 'ritual_logs', 'settings')
group by table_name;

-- Verify RLS is enabled
select 
    tablename,
    rowsecurity
from pg_tables
where schemaname = 'public'
    and tablename in ('profiles', 'ritual_logs', 'settings');

-- Verify policies
select 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- Verify triggers
select 
    trigger_name,
    event_manipulation,
    event_object_schema,
    event_object_table,
    action_statement
from information_schema.triggers
where trigger_name = 'on_auth_user_created';

-- Verify indexes
select 
    schemaname,
    tablename,
    indexname,
    indexdef
from pg_indexes
where schemaname = 'public'
    and tablename in ('profiles', 'ritual_logs', 'settings');

-- Test trigger function with mock user (will rollback)
begin;
    -- Insert a test user
    insert into auth.users (id, email)
    values ('00000000-0000-0000-0000-000000000000', 'test@example.com');
    
    -- Verify profile was created
    select * from profiles where id = '00000000-0000-0000-0000-000000000000';
    
    -- Verify settings were created
    select * from settings where user_id = '00000000-0000-0000-0000-000000000000';
rollback;
