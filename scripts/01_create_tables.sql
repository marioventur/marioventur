-- Create users profile table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  theme VARCHAR(50) DEFAULT 'dark',
  default_risk DECIMAL(5,2) DEFAULT 2.0,
  default_timeframe VARCHAR(10) DEFAULT 'H1',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create analysis history table
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pair_name VARCHAR(50) NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  signal VARCHAR(20) NOT NULL,
  confidence INTEGER,
  entry_price DECIMAL(12,5),
  stop_loss DECIMAL(12,5),
  take_profit DECIMAL(12,5),
  risk_percentage DECIMAL(5,2),
  reward_percentage DECIMAL(5,2),
  analysis_text TEXT,
  indicators JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create broker connections table
CREATE TABLE IF NOT EXISTS broker_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  broker_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(255),
  account_type VARCHAR(50),
  api_key VARCHAR(500),
  api_secret VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create trades simulation table
CREATE TABLE IF NOT EXISTS trade_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analysis_history(id) ON DELETE CASCADE,
  account_balance DECIMAL(12,2),
  position_size DECIMAL(12,2),
  entry_price DECIMAL(12,5),
  stop_loss DECIMAL(12,5),
  take_profit DECIMAL(12,5),
  potential_profit DECIMAL(12,2),
  potential_loss DECIMAL(12,2),
  risk_reward_ratio DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create market news table
CREATE TABLE IF NOT EXISTS market_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500),
  description TEXT,
  impact VARCHAR(50),
  sentiment VARCHAR(50),
  affected_assets VARCHAR(500),
  source VARCHAR(255),
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_news ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Allow users to view their own profile" ON profiles;
CREATE POLICY "Allow users to view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Allow users to insert their profile" ON profiles;
CREATE POLICY "Allow users to insert their profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Allow users to delete their own profile" ON profiles;
CREATE POLICY "Allow users to delete their own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for analysis_history
DROP POLICY IF EXISTS "Allow users to view their own analysis" ON analysis_history;
CREATE POLICY "Allow users to view their own analysis" ON analysis_history FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to insert their own analysis" ON analysis_history;
CREATE POLICY "Allow users to insert their own analysis" ON analysis_history FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to update their own analysis" ON analysis_history;
CREATE POLICY "Allow users to update their own analysis" ON analysis_history FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to delete their own analysis" ON analysis_history;
CREATE POLICY "Allow users to delete their own analysis" ON analysis_history FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for broker_connections
DROP POLICY IF EXISTS "Allow users to view their own broker connections" ON broker_connections;
CREATE POLICY "Allow users to view their own broker connections" ON broker_connections FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to insert broker connections" ON broker_connections;
CREATE POLICY "Allow users to insert broker connections" ON broker_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to update their own broker connections" ON broker_connections;
CREATE POLICY "Allow users to update their own broker connections" ON broker_connections FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to delete their own broker connections" ON broker_connections;
CREATE POLICY "Allow users to delete their own broker connections" ON broker_connections FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for trade_simulations
DROP POLICY IF EXISTS "Allow users to view their own trades" ON trade_simulations;
CREATE POLICY "Allow users to view their own trades" ON trade_simulations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to insert their own trades" ON trade_simulations;
CREATE POLICY "Allow users to insert their own trades" ON trade_simulations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to update their own trades" ON trade_simulations;
CREATE POLICY "Allow users to update their own trades" ON trade_simulations FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to delete their own trades" ON trade_simulations;
CREATE POLICY "Allow users to delete their own trades" ON trade_simulations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for market_news (public read, no writes)
DROP POLICY IF EXISTS "Allow anyone to view market news" ON market_news;
CREATE POLICY "Allow anyone to view market news" ON market_news FOR SELECT USING (true);
