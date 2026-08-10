import { AgentInfo, AgentType } from '../types';

export const AGENT_DEFINITIONS: Record<AgentType, AgentInfo> = {
  property_intelligence: {
    id: 'property_intelligence',
    name: 'Property Intelligence Agent',
    role: 'Listing Optimization & Record Hygiene',
    description: 'Analyzes property data, detects missing info, scores listing quality, and generates compelling structured property dossiers.',
    iconName: 'Building2',
    badge: 'Hygiene & Scoring',
    capabilities: [
      'Extract property highlights and key selling points',
      'Identify missing or inconsistent attributes in database',
      'Generate professional architectural descriptions',
      'Score overall property listing quality (0 - 100)',
      'Clean raw database records without fabricating facts'
    ],
    suggestedActions: [
      'Analyze property quality for active listings',
      'Generate professional marketing description for a property',
      'Identify missing fields across inventory'
    ]
  },

  lead_qualification: {
    id: 'lead_qualification',
    name: 'Lead Qualification Agent',
    role: 'CRM Lead Scoring & Buyer Intent Analysis',
    description: 'Evaluates buyer budget, location, timeline, and communication activity to classify leads as HOT, WARM, or COLD with transparent rationale.',
    iconName: 'UserCheck',
    badge: 'Intent Scoring',
    capabilities: [
      'Analyze buyer budget vs market price realities',
      'Classify leads into HOT, WARM, or COLD priority tiers',
      'Calculate qualification score (0 - 100) stored in database',
      'Provide structured reasoning and recommended agent follow-up',
      'Detect urgent buyer intent signals'
    ],
    suggestedActions: [
      'Qualify all new incoming leads in CRM',
      'Identify HOT leads requiring immediate phone contact',
      'Review lead qualification reasoning'
    ]
  },

  property_matching: {
    id: 'property_matching',
    name: 'Property Matching Agent',
    role: 'Precision Matching Engine',
    description: 'Scans the actual database to match client budget, location, and amenity preferences against verified property listings.',
    iconName: 'Sparkles',
    badge: 'Match Engine',
    capabilities: [
      'Cross-reference buyer preferences against live inventory',
      'Calculate match confidence percentage per property',
      'Identify potential buyer concerns (budget fit, location variance)',
      'Filter exclusively by actual database records',
      'Generate client recommendations list'
    ],
    suggestedActions: [
      'Find best property matches for a selected lead',
      'Compare top 3 properties for client preferences',
      'Identify inventory matching $2M+ budget'
    ]
  },

  customer_service: {
    id: 'customer_service',
    name: 'Customer Service Agent',
    role: '24/7 Client Assistant',
    description: 'Responds to client and lead inquiries strictly using verified agency database information, with seamless escalation to human brokers.',
    iconName: 'Headphones',
    badge: 'Support & Escalation',
    capabilities: [
      'Answer questions regarding property pricing, bedrooms & availability',
      'Verify factual amenities from database records',
      'Escalate complex pricing/contract negotiations to human brokers',
      'Log customer interactions into CRM conversation threads',
      'Maintain strict anti-hallucination factual guardrails'
    ],
    suggestedActions: [
      'Answer property availability inquiry',
      'Check amenity details for client query',
      'Escalate lead inquiry to human agent'
    ]
  },

  follow_up: {
    id: 'follow_up',
    name: 'Follow-Up & Lead Recovery Agent',
    role: 'Lead Retention & Re-engagement',
    description: 'Monitors CRM activity timestamps to detect cold or forgotten leads and drafts hyper-personalized follow-up communications.',
    iconName: 'Clock',
    badge: 'Retention Engine',
    capabilities: [
      'Scan CRM for leads with >3 days inactivity',
      'Identify leads following missed or completed viewings',
      'Draft contextual re-engagement messages tailored to past properties',
      'Schedule follow-up reminders in notifications',
      'Human approval safeguards before sending external messages'
    ],
    suggestedActions: [
      'Scan CRM for forgotten or inactive leads',
      'Draft follow-up message for lead after viewing',
      'Review leads needing urgent contact'
    ]
  },

  appointment: {
    id: 'appointment',
    name: 'Appointment & Viewing Agent',
    role: 'Viewing Dispatch & Calendar Coordinator',
    description: 'Manages viewing requests, verifies calendar availability, schedules viewings, and links clients, properties, and brokers.',
    iconName: 'Calendar',
    badge: 'Workflow Scheduler',
    capabilities: [
      'Check viewing calendar for schedule conflicts',
      'Create and update appointment records in Supabase',
      'Link property, lead, client, and assigned broker in schedule',
      'Send automated viewing confirmations to notifications',
      'Reschedule or cancel viewings with status logging'
    ],
    suggestedActions: [
      'Schedule new property viewing appointment',
      'Check upcoming viewings for tomorrow',
      'Reschedule existing viewing appointment'
    ]
  },

  market_research: {
    id: 'market_research',
    name: 'Market Research Agent',
    role: 'Market Intelligence & Comparative Pricing',
    description: 'Analyzes internal database inventory metrics (price/sqft, location averages) and distinguishes internal data from market trends.',
    iconName: 'TrendingUp',
    badge: 'Comparative Analysis',
    capabilities: [
      'Calculate average price per sq ft across database properties',
      'Compare listing price against city/neighborhood database averages',
      'Identify pricing outliers (overpriced or under-priced units)',
      'Provide clear distinction between internal facts and AI insights',
      'Analyze demand patterns by property type'
    ],
    suggestedActions: [
      'Run comparative market pricing analysis on active inventory',
      'Evaluate price/sq ft across city locations',
      'Identify overpriced properties in portfolio'
    ]
  },

  marketing: {
    id: 'marketing',
    name: 'Marketing Agent',
    role: 'Multi-Channel Campaign Generator',
    description: 'Transforms database property records into tailored social media posts, email newsletters, headlines, and ad copy.',
    iconName: 'Megaphone',
    badge: 'Copy & Content',
    capabilities: [
      'Generate Instagram, LinkedIn, and Facebook listing posts',
      'Draft email marketing campaigns for newly listed properties',
      'Create high-converting listing headlines and bullet points',
      'Enforce 100% factual accuracy for price, specs, and location',
      'Tailor copy tone for luxury vs investment audiences'
    ],
    suggestedActions: [
      'Generate social media campaign for luxury penthouse',
      'Draft email newsletter announcing new waterfront listing',
      'Create advertising headlines for property'
    ]
  },

  document: {
    id: 'document',
    name: 'Document & PDF Agent',
    role: 'Automated Document Synthesis',
    description: 'Compiles live database records into official, styled PDF property dossiers, executive summaries, and client brochures.',
    iconName: 'FileText',
    badge: 'PDF Synthesis',
    capabilities: [
      'Generate downloadable PDF Property Dossiers',
      'Synthesize Executive Analytics Reports into formatted PDF',
      'Store document metadata records in Supabase database',
      'Include official agency branding, tables, and AI insights',
      'Provide 1-click preview and download links'
    ],
    suggestedActions: [
      'Generate PDF Property Report for top listing',
      'Create Executive Analytics PDF Report',
      'Download synthesized property dossier'
    ]
  },

  excel: {
    id: 'excel',
    name: 'Excel / Spreadsheet Agent',
    role: 'Data Export & Financial Spreadsheets',
    description: 'Converts CRM leads, active property inventory, closed deals, and commission logs into formatted downloadable .xlsx spreadsheets.',
    iconName: 'FileSpreadsheet',
    badge: 'Excel Generation',
    capabilities: [
      'Export active properties into structured Excel workbook',
      'Generate CRM Leads summary spreadsheet',
      'Create Financial Deals and Commission tracking spreadsheet',
      'Ensure zero fake row fabrication - 100% database driven',
      'Provide immediate client-side .xlsx file downloads'
    ],
    suggestedActions: [
      'Export all active property listings to Excel',
      'Export CRM leads database to Excel',
      'Generate closed deals and commission spreadsheet'
    ]
  },

  revenue_analytics: {
    id: 'revenue_analytics',
    name: 'Revenue, Deal & Analytics Agent',
    role: 'Financial Intelligence & Forecasts',
    description: 'Calculates business revenue, earned commissions, conversion rates, and deal pipelines directly from database deal records.',
    iconName: 'DollarSign',
    badge: 'Financial Intelligence',
    capabilities: [
      'Calculate total revenue and commissions from closed_won deals',
      'Analyze deal pipeline velocity (New -> Negotiation -> Closed)',
      'Detect at-risk deals with pending status or past closing dates',
      'Compute CRM lead-to-deal conversion percentages',
      'Provide actionable financial growth recommendations'
    ],
    suggestedActions: [
      'Analyze business revenue performance this quarter',
      'Identify at-risk deals in negotiation stage',
      'Calculate broker commission totals'
    ]
  },

  command: {
    id: 'command',
    name: 'Realty Pulse Command Agent',
    role: 'Central AI System Orchestrator',
    description: 'The master intelligent command center that interprets multi-step complex requests and coordinates specialized AI sub-agents.',
    iconName: 'Cpu',
    badge: 'Master Orchestrator',
    capabilities: [
      'Deconstruct complex requests into sequential multi-agent plans',
      'Delegate tasks across Property, Lead, Matching, PDF, and Excel agents',
      'Display real-time step-by-step execution checklists',
      'Consolidate multi-agent outputs into unified executive responses',
      'Ensure full data governance and logging across all actions'
    ],
    suggestedActions: [
      'Orchestrate full buyer journey: Match properties, generate PDF, and schedule viewing',
      'Audit CRM: Qualify new leads, draft follow-ups, and export hot leads to Excel',
      'Perform full business health audit and generate executive report'
    ]
  }
};
