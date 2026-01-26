create table if not exists recurring_transactions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    amount numeric not null,
    category text not null,
    description text,
    type text check (type in ('income', 'expense')) not null,
    frequency text check (frequency in ('daily', 'weekly', 'monthly', 'yearly')) not null,
    start_date date not null,
    last_processed date,
    next_run date not null,
    active boolean default true,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Enable RLS
alter table recurring_transactions enable row level security;

-- Policies
create policy "Users can view their own recurring transactions"
    on recurring_transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own recurring transactions"
    on recurring_transactions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own recurring transactions"
    on recurring_transactions for update
    using (auth.uid() = user_id);

create policy "Users can delete their own recurring transactions"
    on recurring_transactions for delete
    using (auth.uid() = user_id);
