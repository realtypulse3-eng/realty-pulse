import { supabase, isSupabaseConfigured } from './supabase';
import {
  Property,
  Lead,
  Client,
  Deal,
  Appointment,
  DocumentRecord,
  AgentTask,
  AgentActivity,
  NotificationItem,
  DashboardMetrics,
  Organization,
  User
} from '../types';

const STORAGE_KEYS = {
  PROPERTIES: 'realtypulse_properties',
  LEADS: 'realtypulse_leads',
  CLIENTS: 'realtypulse_clients',
  DEALS: 'realtypulse_deals',
  APPOINTMENTS: 'realtypulse_appointments',
  DOCUMENTS: 'realtypulse_documents',
  AGENT_TASKS: 'realtypulse_agent_tasks',
  AGENT_ACTIVITY: 'realtypulse_agent_activity',
  NOTIFICATIONS: 'realtypulse_notifications',
  ORGANIZATION: 'realtypulse_org',
  USER: 'realtypulse_user',
};

const defaultOrg: Organization = {
  id: 'org_default',
  name: 'Apex Horizon Real Estate',
  created_at: new Date().toISOString(),
};

const defaultUser: User = {
  id: 'usr_default',
  organization_id: 'org_default',
  name: 'Alex Vance',
  email: 'alex.vance@realtypulse.io',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  created_at: new Date().toISOString(),
};

// Helper for local storage read/write
function getLocal<T>(key: string, defaultValue: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('realtypulse_db_change'));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

// Global Database API
export const db = {
  // --- PROPERTIES ---
  async getProperties(): Promise<Property[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('properties').select('*, images:property_images(*)').order('created_at', { ascending: false });
      if (!error && data) return data as Property[];
    }
    return getLocal<Property>(STORAGE_KEYS.PROPERTIES, []);
  },

  async addProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const now = new Date().toISOString();
    const newProperty: Property = {
      ...property,
      id: 'prop_' + Math.random().toString(36).substring(2, 9),
      created_at: now,
      updated_at: now,
      images: property.images || [],
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('properties').insert([newProperty]).select().single();
      if (!error && data) {
        await db.logActivity({
          agent_type: 'property_intelligence',
          action: `Added Property: ${newProperty.title}`,
          entity_type: 'property',
          entity_id: data.id,
          status: 'success',
        });
        return data as Property;
      }
    }

    const current = getLocal<Property>(STORAGE_KEYS.PROPERTIES, []);
    setLocal(STORAGE_KEYS.PROPERTIES, [newProperty, ...current]);
    await db.logActivity({
      agent_type: 'property_intelligence',
      action: `Created new property listing: ${newProperty.title}`,
      entity_type: 'property',
      entity_id: newProperty.id,
      status: 'success',
    });
    return newProperty;
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('properties').update({ ...updates, updated_at: now }).eq('id', id).select().single();
      if (!error && data) return data as Property;
    }

    const current = getLocal<Property>(STORAGE_KEYS.PROPERTIES, []);
    const index = current.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updated = { ...current[index], ...updates, updated_at: now };
    current[index] = updated;
    setLocal(STORAGE_KEYS.PROPERTIES, current);
    return updated;
  },

  async deleteProperty(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (!error) return true;
    }
    const current = getLocal<Property>(STORAGE_KEYS.PROPERTIES, []);
    setLocal(STORAGE_KEYS.PROPERTIES, current.filter(p => p.id !== id));
    return true;
  },

  // --- LEADS ---
  async getLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Lead[];
    }
    return getLocal<Lead>(STORAGE_KEYS.LEADS, []);
  },

  async addLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...lead,
      id: 'lead_' + Math.random().toString(36).substring(2, 9),
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('leads').insert([newLead]).select().single();
      if (!error && data) return data as Lead;
    }

    const current = getLocal<Lead>(STORAGE_KEYS.LEADS, []);
    setLocal(STORAGE_KEYS.LEADS, [newLead, ...current]);
    await db.logActivity({
      agent_type: 'lead_qualification',
      action: `New Lead registered: ${newLead.name}`,
      entity_type: 'lead',
      entity_id: newLead.id,
      status: 'info',
    });
    return newLead;
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('leads').update({ ...updates, updated_at: now }).eq('id', id).select().single();
      if (!error && data) return data as Lead;
    }
    const current = getLocal<Lead>(STORAGE_KEYS.LEADS, []);
    const idx = current.findIndex(l => l.id === id);
    if (idx === -1) return null;

    const updated = { ...current[idx], ...updates, updated_at: now };
    current[idx] = updated;
    setLocal(STORAGE_KEYS.LEADS, current);
    return updated;
  },

  // --- CLIENTS ---
  async getClients(): Promise<Client[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Client[];
    }
    return getLocal<Client>(STORAGE_KEYS.CLIENTS, []);
  },

  async addClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    const now = new Date().toISOString();
    const newClient: Client = {
      ...client,
      id: 'cli_' + Math.random().toString(36).substring(2, 9),
      created_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('clients').insert([newClient]).select().single();
      if (!error && data) return data as Client;
    }
    const current = getLocal<Client>(STORAGE_KEYS.CLIENTS, []);
    setLocal(STORAGE_KEYS.CLIENTS, [newClient, ...current]);
    return newClient;
  },

  // --- DEALS ---
  async getDeals(): Promise<Deal[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Deal[];
    }
    return getLocal<Deal>(STORAGE_KEYS.DEALS, []);
  },

  async addDeal(deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal> {
    const now = new Date().toISOString();
    const newDeal: Deal = {
      ...deal,
      id: 'deal_' + Math.random().toString(36).substring(2, 9),
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('deals').insert([newDeal]).select().single();
      if (!error && data) return data as Deal;
    }

    const current = getLocal<Deal>(STORAGE_KEYS.DEALS, []);
    setLocal(STORAGE_KEYS.DEALS, [newDeal, ...current]);
    await db.logActivity({
      agent_type: 'revenue_analytics',
      action: `Created Deal record: $${newDeal.deal_value.toLocaleString()} (${newDeal.status})`,
      entity_type: 'deal',
      entity_id: newDeal.id,
      status: 'info',
    });
    return newDeal;
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('deals').update({ ...updates, updated_at: now }).eq('id', id).select().single();
      if (!error && data) return data as Deal;
    }
    const current = getLocal<Deal>(STORAGE_KEYS.DEALS, []);
    const idx = current.findIndex(d => d.id === id);
    if (idx === -1) return null;

    const updated = { ...current[idx], ...updates, updated_at: now };
    current[idx] = updated;
    setLocal(STORAGE_KEYS.DEALS, current);

    if (updates.status === 'closed_won') {
      await db.logActivity({
        agent_type: 'revenue_analytics',
        action: `CLOSED DEAL: $${updated.deal_value.toLocaleString()} (Commission: $${updated.commission.toLocaleString()})`,
        entity_type: 'deal',
        entity_id: updated.id,
        status: 'success',
      });
      await db.addNotification({
        organization_id: defaultOrg.id,
        type: 'success',
        title: 'Deal Closed!',
        message: `Deal worth $${updated.deal_value.toLocaleString()} has successfully closed. Revenue updated.`,
        read: false,
      });
    }

    return updated;
  },

  // --- APPOINTMENTS ---
  async getAppointments(): Promise<Appointment[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('appointments').select('*').order('start_time', { ascending: true });
      if (!error && data) return data as Appointment[];
    }
    return getLocal<Appointment>(STORAGE_KEYS.APPOINTMENTS, []);
  },

  async addAppointment(appt: Omit<Appointment, 'id' | 'created_at'>): Promise<Appointment> {
    const now = new Date().toISOString();
    const newAppt: Appointment = {
      ...appt,
      id: 'appt_' + Math.random().toString(36).substring(2, 9),
      created_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('appointments').insert([newAppt]).select().single();
      if (!error && data) return data as Appointment;
    }

    const current = getLocal<Appointment>(STORAGE_KEYS.APPOINTMENTS, []);
    setLocal(STORAGE_KEYS.APPOINTMENTS, [newAppt, ...current]);
    await db.logActivity({
      agent_type: 'appointment',
      action: `Scheduled viewing for property: ${newAppt.property_title || newAppt.property_id}`,
      entity_type: 'appointment',
      entity_id: newAppt.id,
      status: 'info',
    });
    return newAppt;
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('appointments').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Appointment;
    }
    const current = getLocal<Appointment>(STORAGE_KEYS.APPOINTMENTS, []);
    const idx = current.findIndex(a => a.id === id);
    if (idx === -1) return null;

    const updated = { ...current[idx], ...updates };
    current[idx] = updated;
    setLocal(STORAGE_KEYS.APPOINTMENTS, current);
    return updated;
  },

  // --- DOCUMENTS ---
  async getDocuments(): Promise<DocumentRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as DocumentRecord[];
    }
    return getLocal<DocumentRecord>(STORAGE_KEYS.DOCUMENTS, []);
  },

  async addDocument(doc: Omit<DocumentRecord, 'id' | 'created_at'>): Promise<DocumentRecord> {
    const now = new Date().toISOString();
    const newDoc: DocumentRecord = {
      ...doc,
      id: 'doc_' + Math.random().toString(36).substring(2, 9),
      created_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('documents').insert([newDoc]).select().single();
      if (!error && data) return data as DocumentRecord;
    }

    const current = getLocal<DocumentRecord>(STORAGE_KEYS.DOCUMENTS, []);
    setLocal(STORAGE_KEYS.DOCUMENTS, [newDoc, ...current]);
    return newDoc;
  },

  // --- AGENT TASKS & ACTIVITIES ---
  async getAgentTasks(): Promise<AgentTask[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('agent_tasks').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as AgentTask[];
    }
    return getLocal<AgentTask>(STORAGE_KEYS.AGENT_TASKS, []);
  },

  async addAgentTask(task: Omit<AgentTask, 'id' | 'created_at'>): Promise<AgentTask> {
    const now = new Date().toISOString();
    const newTask: AgentTask = {
      ...task,
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      created_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('agent_tasks').insert([newTask]).select().single();
      if (!error && data) return data as AgentTask;
    }

    const current = getLocal<AgentTask>(STORAGE_KEYS.AGENT_TASKS, []);
    setLocal(STORAGE_KEYS.AGENT_TASKS, [newTask, ...current]);
    return newTask;
  },

  async updateAgentTask(id: string, updates: Partial<AgentTask>): Promise<AgentTask | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('agent_tasks').update(updates).eq('id', id).select().single();
      if (!error && data) return data as AgentTask;
    }
    const current = getLocal<AgentTask>(STORAGE_KEYS.AGENT_TASKS, []);
    const idx = current.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const updated = { ...current[idx], ...updates };
    current[idx] = updated;
    setLocal(STORAGE_KEYS.AGENT_TASKS, current);
    return updated;
  },

  async getAgentActivities(): Promise<AgentActivity[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('agent_activity').select('*').order('created_at', { ascending: false }).limit(50);
      if (!error && data) return data as AgentActivity[];
    }
    return getLocal<AgentActivity>(STORAGE_KEYS.AGENT_ACTIVITY, []);
  },

  async logActivity(act: Omit<AgentActivity, 'id' | 'organization_id' | 'created_at'>): Promise<AgentActivity> {
    const now = new Date().toISOString();
    const newAct: AgentActivity = {
      ...act,
      id: 'act_' + Math.random().toString(36).substring(2, 9),
      organization_id: defaultOrg.id,
      created_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('agent_activity').insert([newAct]).select().single();
      if (!error && data) return data as AgentActivity;
    }

    const current = getLocal<AgentActivity>(STORAGE_KEYS.AGENT_ACTIVITY, []);
    setLocal(STORAGE_KEYS.AGENT_ACTIVITY, [newAct, ...current].slice(0, 100));
    return newAct;
  },

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<NotificationItem[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as NotificationItem[];
    }
    return getLocal<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  async addNotification(notif: Omit<NotificationItem, 'id' | 'created_at'>): Promise<NotificationItem> {
    const now = new Date().toISOString();
    const newNotif: NotificationItem = {
      ...notif,
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      created_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('notifications').insert([newNotif]).select().single();
      if (!error && data) return data as NotificationItem;
    }

    const current = getLocal<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, []);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...current]);
    return newNotif;
  },

  async markNotificationRead(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      return;
    }
    const current = getLocal<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, []);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, current.map(n => n.id === id ? { ...n, read: true } : n));
  },

  // --- CALCULATED DASHBOARD METRICS (COMPUTED EXCLUSIVELY FROM ACTUAL RECORDS) ---
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [properties, leads, deals, appointments] = await Promise.all([
      db.getProperties(),
      db.getLeads(),
      db.getDeals(),
      db.getAppointments(),
    ]);

    const activeListings = properties.filter(p => p.status === 'active').length;
    const qualifiedLeads = leads.filter(l => l.status === 'hot' || l.status === 'qualifying' || (l.qualification_score && l.qualification_score >= 70)).length;
    
    const activeDeals = deals.filter(d => d.status !== 'closed_won' && d.status !== 'closed_lost').length;
    const closedWonDeals = deals.filter(d => d.status === 'closed_won');
    
    const totalRevenue = closedWonDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
    const totalCommission = closedWonDeals.reduce((sum, d) => sum + (d.commission || 0), 0);

    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 ? (closedWonDeals.length / totalLeads) * 100 : 0;

    const now = new Date().toISOString();
    const upcomingViewings = appointments.filter(a => a.start_time >= now && a.status === 'scheduled').length;

    // Followups due = leads that are new/contacted or have last_contact_at > 3 days ago
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const followupsDue = leads.filter(l => !l.last_contact_at || l.last_contact_at < threeDaysAgo).length;

    return {
      totalProperties: properties.length,
      activeListings,
      totalLeads,
      qualifiedLeads,
      activeDeals,
      closedDeals: closedWonDeals.length,
      totalRevenue,
      totalCommission,
      conversionRate,
      upcomingViewings,
      followupsDue,
    };
  },

  // --- SEED SAMPLE DATA (OPTIONALLY FOR TESTING / DEMONSTRATION) ---
  async seedSampleData(): Promise<void> {
    const now = new Date();
    const isoNow = now.toISOString();

    const sampleProperties: Property[] = [
      {
        id: 'prop_penthouse_01',
        organization_id: defaultOrg.id,
        title: 'The Skyview Horizon Penthouse',
        description: 'Ultra-luxurious duplex penthouse with 360-degree skyline views, private infinity splash pool, double-height ceiling, and Smart Home automation.',
        property_type: 'condo',
        status: 'active',
        price: 2850000,
        currency: 'USD',
        address: '108 Grand Boulevard, Suite 4801',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        bedrooms: 4,
        bathrooms: 5,
        area: 4200,
        furnishing: 'fully-furnished',
        amenities: ['Private Elevator', 'Infinity Pool', 'Concierge 24/7', 'Wine Cellar', 'EV Charger'],
        listing_date: new Date(now.getTime() - 14 * 86400000).toISOString(),
        agent_id: defaultUser.id,
        created_at: new Date(now.getTime() - 14 * 86400000).toISOString(),
        updated_at: isoNow,
        images: [{ id: 'img1', property_id: 'prop_penthouse_01', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200', sort_order: 1 }]
      },
      {
        id: 'prop_villa_02',
        organization_id: defaultOrg.id,
        title: 'Emerald Bay Coastal Villa',
        description: 'Modern minimalist waterfront sanctuary featuring floor-to-ceiling glass walls, expansive teak deck, and private boat dock.',
        property_type: 'villa',
        status: 'active',
        price: 4150000,
        currency: 'USD',
        address: '42 Oceanfront Drive',
        city: 'Malibu',
        state: 'CA',
        country: 'USA',
        bedrooms: 5,
        bathrooms: 6,
        area: 6100,
        furnishing: 'semi-furnished',
        amenities: ['Private Beach Access', 'Boat Dock', 'Solar Panels', 'Outdoor Kitchen', 'Spa'],
        listing_date: new Date(now.getTime() - 30 * 86400000).toISOString(),
        agent_id: defaultUser.id,
        created_at: new Date(now.getTime() - 30 * 86400000).toISOString(),
        updated_at: isoNow,
        images: [{ id: 'img2', property_id: 'prop_villa_02', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200', sort_order: 1 }]
      },
      {
        id: 'prop_loft_03',
        organization_id: defaultOrg.id,
        title: 'Tribeca Industrial Design Loft',
        description: 'Authentic historic brick loft featuring exposed timber beams, cast-iron columns, polished concrete floors, and custom chef kitchen.',
        property_type: 'apartment',
        status: 'active',
        price: 1650000,
        currency: 'USD',
        address: '77 Mercer Street, Apt 3B',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        bedrooms: 2,
        bathrooms: 2,
        area: 2100,
        furnishing: 'unfurnished',
        amenities: ['Doorman', 'Private Storage', 'Rooftop Terrace', 'Fitness Center'],
        listing_date: new Date(now.getTime() - 5 * 86400000).toISOString(),
        agent_id: defaultUser.id,
        created_at: new Date(now.getTime() - 5 * 86400000).toISOString(),
        updated_at: isoNow,
        images: [{ id: 'img3', property_id: 'prop_loft_03', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200', sort_order: 1 }]
      },
      {
        id: 'prop_estate_04',
        organization_id: defaultOrg.id,
        title: 'Silicon Valley Innovation Estate',
        description: 'High-tech architectural masterpiece with smart environmental controls, geothermal climate regulation, and Japanese zen courtyard.',
        property_type: 'house',
        status: 'pending',
        price: 5800000,
        currency: 'USD',
        address: '1420 Foothill Road',
        city: 'Palo Alto',
        state: 'CA',
        country: 'USA',
        bedrooms: 6,
        bathrooms: 7,
        area: 7800,
        furnishing: 'fully-furnished',
        amenities: ['Tesla Powerwall', 'Home Theater', 'Tennis Court', 'Wine Tasting Room'],
        listing_date: new Date(now.getTime() - 45 * 86400000).toISOString(),
        agent_id: defaultUser.id,
        created_at: new Date(now.getTime() - 45 * 86400000).toISOString(),
        updated_at: isoNow,
        images: [{ id: 'img4', property_id: 'prop_estate_04', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200', sort_order: 1 }]
      }
    ];

    const sampleLeads: Lead[] = [
      {
        id: 'lead_01',
        organization_id: defaultOrg.id,
        name: 'Dr. Evelyn Carter',
        email: 'evelyn.carter@neurotech.io',
        phone: '+1 (310) 555-0192',
        budget_min: 2500000,
        budget_max: 3500000,
        preferred_location: 'Miami / Fort Lauderdale',
        preferred_property_type: 'condo',
        bedrooms: 3,
        requirements: 'High-floor penthouse, EV charging, 24/7 security, ocean view',
        source: 'Website Inquiry',
        status: 'hot',
        qualification_score: 92,
        qualification_reasoning: 'Verified $3.5M cash buyer seeking immediate closing within 30 days for primary residence.',
        assigned_agent: defaultUser.id,
        last_contact_at: new Date(now.getTime() - 1 * 86400000).toISOString(),
        created_at: new Date(now.getTime() - 7 * 86400000).toISOString(),
        updated_at: isoNow
      },
      {
        id: 'lead_02',
        organization_id: defaultOrg.id,
        name: 'Marcus Sterling',
        email: 'm.sterling@capitalpartners.com',
        phone: '+1 (415) 555-8832',
        budget_min: 4000000,
        budget_max: 6000000,
        preferred_location: 'Palo Alto / Atherton',
        preferred_property_type: 'house',
        bedrooms: 5,
        requirements: 'Privacy gates, high-speed fiber infrastructure, guest house',
        source: 'Private Referral',
        status: 'qualifying',
        qualification_score: 85,
        qualification_reasoning: 'High net-worth Tech executive, relocates Q3.',
        assigned_agent: defaultUser.id,
        last_contact_at: new Date(now.getTime() - 2 * 86400000).toISOString(),
        created_at: new Date(now.getTime() - 12 * 86400000).toISOString(),
        updated_at: isoNow
      },
      {
        id: 'lead_03',
        organization_id: defaultOrg.id,
        name: 'Sophia Chen',
        email: 'sophia.chen@designstudio.org',
        phone: '+1 (212) 555-3411',
        budget_min: 1400000,
        budget_max: 1800000,
        preferred_location: 'New York Tribeca',
        preferred_property_type: 'apartment',
        bedrooms: 2,
        requirements: 'Exposed brick, natural light for art studio space',
        source: 'Instagram Ad',
        status: 'warm',
        qualification_score: 74,
        qualification_reasoning: 'Pre-approved mortgage ($1.6M) with Chase Bank.',
        assigned_agent: defaultUser.id,
        last_contact_at: new Date(now.getTime() - 4 * 86400000).toISOString(),
        created_at: new Date(now.getTime() - 15 * 86400000).toISOString(),
        updated_at: isoNow
      }
    ];

    const sampleClients: Client[] = [
      {
        id: 'cli_01',
        organization_id: defaultOrg.id,
        name: 'Jonathan & Clara Vance',
        email: 'j.vance@vanceholdings.com',
        phone: '+1 (305) 555-7700',
        preferences: 'Luxury Waterfront, Gated Security, Private Berth',
        budget: 4500000,
        notes: 'Long-term VIP client. Previously purchased 2 investment units.',
        created_at: new Date(now.getTime() - 60 * 86400000).toISOString()
      }
    ];

    const sampleDeals: Deal[] = [
      {
        id: 'deal_01',
        organization_id: defaultOrg.id,
        property_id: 'prop_estate_04',
        client_id: 'cli_01',
        lead_id: 'lead_02',
        agent_id: defaultUser.id,
        deal_value: 5800000,
        commission: 145000, // 2.5%
        status: 'pending',
        closing_date: new Date(now.getTime() + 14 * 86400000).toISOString(),
        payment_status: 'partial',
        property_title: 'Silicon Valley Innovation Estate',
        client_name: 'Marcus Sterling',
        created_at: new Date(now.getTime() - 20 * 86400000).toISOString(),
        updated_at: isoNow
      },
      {
        id: 'deal_closed_02',
        organization_id: defaultOrg.id,
        property_id: 'prop_penthouse_01',
        client_id: 'cli_01',
        lead_id: 'lead_01',
        agent_id: defaultUser.id,
        deal_value: 2750000,
        commission: 82500, // 3%
        status: 'closed_won',
        closing_date: new Date(now.getTime() - 10 * 86400000).toISOString(),
        payment_status: 'paid',
        property_title: 'Downtown Luxe Penthouse Unit 12',
        client_name: 'Jonathan & Clara Vance',
        created_at: new Date(now.getTime() - 40 * 86400000).toISOString(),
        updated_at: new Date(now.getTime() - 10 * 86400000).toISOString()
      }
    ];

    const sampleAppointments: Appointment[] = [
      {
        id: 'appt_01',
        organization_id: defaultOrg.id,
        property_id: 'prop_penthouse_01',
        lead_id: 'lead_01',
        assigned_agent: defaultUser.id,
        start_time: new Date(now.getTime() + 1 * 86400000).toISOString(), // Tomorrow
        end_time: new Date(now.getTime() + 1 * 86400000 + 3600000).toISOString(),
        status: 'scheduled',
        notes: 'VIP Private Viewing with Dr. Evelyn Carter. Focus on security and splash pool.',
        property_title: 'The Skyview Horizon Penthouse',
        client_name: 'Dr. Evelyn Carter',
        created_at: isoNow
      },
      {
        id: 'appt_02',
        organization_id: defaultOrg.id,
        property_id: 'prop_loft_03',
        lead_id: 'lead_03',
        assigned_agent: defaultUser.id,
        start_time: new Date(now.getTime() + 3 * 86400000).toISOString(),
        end_time: new Date(now.getTime() + 3 * 86400000 + 3600000).toISOString(),
        status: 'scheduled',
        notes: 'Architectural walkthrough with Sophia Chen.',
        property_title: 'Tribeca Industrial Design Loft',
        client_name: 'Sophia Chen',
        created_at: isoNow
      }
    ];

    setLocal(STORAGE_KEYS.PROPERTIES, sampleProperties);
    setLocal(STORAGE_KEYS.LEADS, sampleLeads);
    setLocal(STORAGE_KEYS.CLIENTS, sampleClients);
    setLocal(STORAGE_KEYS.DEALS, sampleDeals);
    setLocal(STORAGE_KEYS.APPOINTMENTS, sampleAppointments);

    await db.logActivity({
      agent_type: 'command',
      action: 'Initialized Development Seed Dataset into Database',
      status: 'info',
    });
  },

  async clearDatabase(): Promise<void> {
    setLocal(STORAGE_KEYS.PROPERTIES, []);
    setLocal(STORAGE_KEYS.LEADS, []);
    setLocal(STORAGE_KEYS.CLIENTS, []);
    setLocal(STORAGE_KEYS.DEALS, []);
    setLocal(STORAGE_KEYS.APPOINTMENTS, []);
    setLocal(STORAGE_KEYS.DOCUMENTS, []);
    setLocal(STORAGE_KEYS.AGENT_TASKS, []);
    setLocal(STORAGE_KEYS.AGENT_ACTIVITY, []);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  // SQL SCHEMA GENERATOR FOR USER SUPABASE SETUP
  getSqlSchema(): string {
    return `-- REALTY PULSE - SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Copy and run this script inside your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  country TEXT DEFAULT 'USA',
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  area NUMERIC(10,2) DEFAULT 0,
  furnishing TEXT DEFAULT 'unfurnished',
  amenities TEXT[] DEFAULT '{}',
  listing_date TIMESTAMPTZ DEFAULT NOW(),
  agent_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  storage_path TEXT,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

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
  bedrooms INT DEFAULT 0,
  requirements TEXT,
  source TEXT DEFAULT 'direct',
  status TEXT DEFAULT 'new',
  qualification_score INT DEFAULT 0,
  qualification_reasoning TEXT,
  assigned_agent UUID REFERENCES users(id),
  last_contact_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES users(id),
  deal_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  commission NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'new',
  closing_date TIMESTAMPTZ,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  assigned_agent UUID REFERENCES users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ & WRITE POLICIES FOR DEMONSTRATION & INTEGRATION
CREATE POLICY "Allow all operations for authenticated users" ON properties FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON deals FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON documents FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON agent_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON agent_activity FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON notifications FOR ALL USING (true);
`;
  }
};

export const SUPABASE_SCHEMA_SQL = db.getSqlSchema();
