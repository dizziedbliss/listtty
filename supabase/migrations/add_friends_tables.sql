-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create friends table (relationship between two users)
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 VARCHAR(255) NOT NULL,
  user_id_2 VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2),
  FOREIGN KEY (user_id_1) REFERENCES public.users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_2) REFERENCES public.users(user_id) ON DELETE CASCADE,
  CHECK (user_id_1 < user_id_2) -- Ensure consistent ordering
);

-- Create friend requests table (easier to query pending requests)
CREATE TABLE IF NOT EXISTS public.friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id VARCHAR(255) NOT NULL,
  to_user_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  UNIQUE(from_user_id, to_user_id),
  FOREIGN KEY (from_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  theme VARCHAR(20) DEFAULT 'dark',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  public_profile BOOLEAN DEFAULT TRUE,
  show_watch_history BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

-- Create user watchlist sharing table (for sharing lists with friends)
CREATE TABLE IF NOT EXISTS public.shared_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  list_type VARCHAR(50) NOT NULL, -- watchlist, watching, completed, dropped
  shared_with_user_id VARCHAR(255) NOT NULL,
  permission VARCHAR(20) DEFAULT 'view', -- view, comment
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
  UNIQUE(user_id, list_type, shared_with_user_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_friends_user_id_1 ON public.friends(user_id_1);
CREATE INDEX idx_friends_user_id_2 ON public.friends(user_id_2);
CREATE INDEX idx_friend_requests_to_user ON public.friend_requests(to_user_id);
CREATE INDEX idx_friend_requests_from_user ON public.friend_requests(from_user_id);
CREATE INDEX idx_shared_lists_user ON public.shared_lists(user_id);
CREATE INDEX idx_shared_lists_shared_with ON public.shared_lists(shared_with_user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_lists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table (users can see public profiles, own profile is always visible)
CREATE POLICY "Users can view public profiles"
  ON public.users FOR SELECT
  USING (public_profile = TRUE OR auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = user_id);

-- RLS Policies for friend requests
CREATE POLICY "Users can view their own friend requests"
  ON public.friend_requests FOR SELECT
  USING (
    auth.uid()::text = from_user_id OR 
    auth.uid()::text = to_user_id
  );

CREATE POLICY "Users can create friend requests"
  ON public.friend_requests FOR INSERT
  WITH CHECK (auth.uid()::text = from_user_id);

-- RLS Policies for friends table
CREATE POLICY "Users can view their friends"
  ON public.friends FOR SELECT
  USING (
    auth.uid()::text = user_id_1 OR 
    auth.uid()::text = user_id_2
  );

-- RLS Policies for user preferences
CREATE POLICY "Users can view and update own preferences"
  ON public.user_preferences FOR ALL
  USING (auth.uid()::text = user_id);
