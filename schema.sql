-- ==========================================
-- REALTY PULSE OS: SUPABASE POSTGRESQL SCHEMA
-- Full relational structure, indexes, & RLS
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'broker', 'agent', 'manager')) DEFAULT 'agent',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'United States',
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  bedrooms INTEGER DEFAULT 0,
  bathrooms NUMERIC(3,1) DEFAULT 0,
  area NUMERIC(10,2) DEFAULT 0,
  furnishing TEXT DEFAULT 'unfurnished',
  amenities TEXT[] DEFAULT '{}',
  listing_date TIMESTAMPTZ DEFAULT NOW(),
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROPERTY IMAGES TABLE
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  storage_path TEXT,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  budget_min NUMERIC(12,2) DEFAULT 0,
  budget_max NUMERIC(12,2) DEFAULT 0,
  preferred_location TEXT,
  preferred_property_type TEXT,
  bedrooms INTEGER DEFAULT 0,
  requirements TEXT,
  source TEXT DEFAULT 'Inbound Website',
  status TEXT DEFAULT 'new',
  qualification_score INTEGER DEFAULT 0,
  qualification_reasoning TEXT,
  assigned_agent UUID REFERENCES users(id) ON DELETE SET NULL,
  last_contact_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  preferences TEXT,
  budget NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  channel TEXT DEFAULT 'chat',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('client', 'agent', 'ai')) DEFAULT 'client',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DEALS TABLE
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  deal_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  commission NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'new',
  closing_date TIMESTAMPTZ,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  assigned_agent UUID REFERENCES users(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  storage_path TEXT,
  url TEXT,
  related_property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  related_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  related_deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AGENT TASKS TABLE
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  task_type TEXT NOT NULL,
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 13. AGENT ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS agent_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  status TEXT DEFAULT 'info',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_properties_org ON properties(organization_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_leads_org ON leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_deals_org ON deals(organization_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_appointments_property ON appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_agent_activity_org ON agent_activity(organization_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE POLICIES FOR INITIAL SETUP & APP ACCESS
CREATE POLICY "Allow operations on organizations" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow operations on properties" ON properties FOR ALL USING (true);
CREATE POLICY "Allow operations on property_images" ON property_images FOR ALL USING (true);
CREATE POLICY "Allow operations on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow operations on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow operations on conversations" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow operations on messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow operations on deals" ON deals FOR ALL USING (true);
CREATE POLICY "Allow operations on appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Allow operations on documents" ON documents FOR ALL USING (true);
CREATE POLICY "Allow operations on agent_tasks" ON agent_tasks FOR ALL USING (true);
CREATE POLICY "Allow operations on agent_activity" ON agent_activity FOR ALL USING (true);
CREATE POLICY "Allow operations on notifications" ON notifications FOR ALL USING (true);
