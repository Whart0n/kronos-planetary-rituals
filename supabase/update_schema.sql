-- Drop existing policies
drop policy if exists "Users can view their own settings" on public.settings;
drop policy if exists "Users can insert their own settings" on public.settings;
drop policy if exists "Users can update their own settings" on public.settings;

-- Create updated settings policies
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

-- Update handle_new_user trigger to ensure proper initialization
create or replace function public.handle_new_user()
returns trigger as $$
begin
    -- Create empty profile with name from metadata or email
    insert into public.profiles (id, name)
    values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email));

    -- Create default settings
    insert into public.settings (user_id)
    values (new.id);

    return new;
end;
$$ language plpgsql security definer;

-- Ensure trigger exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();