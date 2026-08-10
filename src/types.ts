export type UserRole = 'admin' | 'broker' | 'agent' | 'manager';

export interface User {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  settings?: Record<string, any>;
  created_at: string;
}

export type PropertyType = 'apartment' | 'condo' | 'house' | 'villa' | 'commercial' | 'land' | 'industrial';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'off_market';

export interface Property {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  property_type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  area: number; // sq ft / sq m
  furnishing: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  amenities: string[];
  listing_date: string;
  agent_id?: string;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  storage_path?: string;
  url: string;
  sort_order: number;
}

export type LeadStatus = 'new' | 'contacted' | 'qualifying' | 'hot' | 'warm' | 'cold' | 'lost';

export interface Lead {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone: string;
  budget_min: number;
  budget_max: number;
  preferred_location: string;
  preferred_property_type: PropertyType;
  bedrooms: number;
  requirements: string;
  source: string;
  status: LeadStatus;
  qualification_score?: number; // 0 - 100
  qualification_reasoning?: string;
  assigned_agent?: string;
  last_contact_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone: string;
  preferences?: string;
  budget: number;
  notes?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  organization_id: string;
  lead_id?: string;
  client_id?: string;
  channel: 'chat' | 'email' | 'whatsapp' | 'sms';
  status: 'active' | 'closed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'client' | 'agent' | 'ai';
  content: string;
  created_at: string;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  organization_id: string;
  property_id: string;
  client_id?: string;
  lead_id?: string;
  assigned_agent: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  property_title?: string;
  client_name?: string;
}

export type DealStatus = 'new' | 'negotiation' | 'pending' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  organization_id: string;
  property_id: string;
  client_id?: string;
  lead_id?: string;
  agent_id: string;
  deal_value: number;
  commission: number;
  status: DealStatus;
  closing_date?: string;
  payment_status: 'pending' | 'partial' | 'paid';
  created_at: string;
  updated_at: string;
  property_title?: string;
  client_name?: string;
}

export interface DocumentRecord {
  id: string;
  organization_id: string;
  type: 'property_report' | 'brochure' | 'client_summary' | 'commission_statement' | 'spreadsheet' | 'contract';
  name: string;
  storage_path?: string;
  url?: string;
  related_property_id?: string;
  related_client_id?: string;
  related_deal_id?: string;
  created_by: string;
  created_at: string;
  file_size?: string;
}

export type AgentType =
  | 'property_intelligence'
  | 'lead_qualification'
  | 'property_matching'
  | 'customer_service'
  | 'follow_up'
  | 'appointment'
  | 'market_research'
  | 'marketing'
  | 'document'
  | 'excel'
  | 'revenue_analytics'
  | 'command';

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'awaiting_approval';

export interface AgentTask {
  id: string;
  organization_id: string;
  agent_type: AgentType;
  task_type: string;
  input_data: any;
  output_data?: any;
  status: TaskStatus;
  created_at: string;
  completed_at?: string;
  requires_approval?: boolean;
  approval_details?: {
    action_type: string;
    description: string;
    payload: any;
  };
}

export interface AgentActivity {
  id: string;
  organization_id: string;
  agent_type: AgentType;
  action: string;
  entity_type?: string;
  entity_id?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: any;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  organization_id: string;
  user_id?: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface AgentInfo {
  id: AgentType;
  name: string;
  role: string;
  description: string;
  iconName: string;
  badge: string;
  capabilities: string[];
  suggestedActions: string[];
}

export interface DashboardMetrics {
  totalProperties: number;
  activeListings: number;
  totalLeads: number;
  qualifiedLeads: number;
  activeDeals: number;
  closedDeals: number;
  totalRevenue: number;
  totalCommission: number;
  conversionRate: number;
  upcomingViewings: number;
  followupsDue: number;
}
