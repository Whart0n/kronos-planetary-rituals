-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    bio text,
    avatar_url text,
    level integer default 1,
    experience integer default 0,
    streak_days integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security) on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Ritual logs table
create table if not exists public.ritual_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    ritual_id text not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    notes text,
    rating integer check (rating >= 1 and rating <= 5),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on ritual_logs
alter table public.ritual_logs enable row level security;

-- Ritual logs policies
create policy "Users can view their own ritual logs"
    on public.ritual_logs for select
    using (auth.uid() = user_id);

create policy "Users can insert their own ritual logs"
    on public.ritual_logs for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own ritual logs"
    on public.ritual_logs for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Settings table
create table if not exists public.settings (
    user_id uuid references auth.users on delete cascade primary key,
    dark_mode boolean default true,
    notifications boolean default true,
    auto_detect_location boolean default true,
    location jsonb,
    sound_enabled boolean default true,
    haptic_feedback_enabled boolean default true,
    language text default 'en',
    units text default 'metric',
    theme text default 'dark',
    font_size text default 'medium',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on settings
alter table public.settings enable row level security;

-- Settings policies
create policy "Users can view their own settings"
    on public.settings for select
    using (auth.uid() = user_id);

create policy "Users can insert their own settings"
    on public.settings for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own settings"
    on public.settings for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    -- Create empty profile
    insert into public.profiles (id, name)
    values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email));

    -- Create default settings
    insert into public.settings (user_id)
    values (new.id);

    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create indexes for better performance
create index if not exists ritual_logs_user_id_idx on public.ritual_logs(user_id);
create index if not exists ritual_logs_completed_at_idx on public.ritual_logs(completed_at);
create index if not exists profiles_updated_at_idx on public.profiles(updated_at);
