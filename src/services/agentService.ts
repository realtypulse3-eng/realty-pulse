import { AgentType, AgentTask, AgentActivity } from '../types';
import { db } from '../lib/db';
import { generatePropertyPDF, generateExecutiveReportPDF } from '../lib/pdf';
import { generatePropertiesExcel, generateLeadsExcel, generateDealsExcel } from '../lib/excel';

export interface AgentExecutionParams {
  agentType: AgentType;
  prompt: string;
  entityId?: string;
  customContext?: any;
}

export interface AgentExecutionResult {
  taskId: string;
  responseText: string;
  requiresApproval?: boolean;
  approvalDetails?: any;
  actionPerformed?: string;
}

export const executeAgentTask = async (params: AgentExecutionParams): Promise<AgentExecutionResult> => {
  const { agentType, prompt, entityId, customContext } = params;

  // 1. Gather database context based on agent requirements
  let contextData: any = {};
  const [properties, leads, clients, deals, appointments, metrics] = await Promise.all([
    db.getProperties(),
    db.getLeads(),
    db.getClients(),
    db.getDeals(),
    db.getAppointments(),
    db.getDashboardMetrics(),
  ]);

  if (entityId) {
    contextData.targetProperty = properties.find(p => p.id === entityId);
    contextData.targetLead = leads.find(l => l.id === entityId);
    contextData.targetClient = clients.find(c => c.id === entityId);
    contextData.targetDeal = deals.find(d => d.id === entityId);
  }

  contextData.summaryMetrics = metrics;
  contextData.propertiesCount = properties.length;
  contextData.leadsCount = leads.length;
  contextData.dealsCount = deals.length;
  contextData.appointmentsCount = appointments.length;

  if (agentType === 'property_intelligence' || agentType === 'property_matching') {
    contextData.properties = properties.slice(0, 10);
    contextData.leads = leads.slice(0, 5);
  } else if (agentType === 'lead_qualification' || agentType === 'follow_up') {
    contextData.leads = leads;
  } else if (agentType === 'revenue_analytics' || agentType === 'excel') {
    contextData.deals = deals;
    contextData.metrics = metrics;
    contextData.properties = properties;
  } else if (agentType === 'appointment') {
    contextData.appointments = appointments;
    contextData.properties = properties;
    contextData.leads = leads;
  } else if (agentType === 'market_research') {
    contextData.properties = properties;
  } else {
    contextData.allProperties = properties;
    contextData.allLeads = leads;
    contextData.allDeals = deals;
  }

  if (customContext) {
    contextData = { ...contextData, ...customContext };
  }

  // 2. Log initial pending task in DB
  const task = await db.addAgentTask({
    organization_id: 'org_default',
    agent_type: agentType,
    task_type: prompt.substring(0, 50),
    input_data: { prompt, entityId },
    status: 'running',
  });

  await db.logActivity({
    agent_type: agentType,
    action: `Started agent task: "${prompt.substring(0, 45)}..."`,
    status: 'info',
  });

  let responseText = '';
  let requiresApproval = false;
  let actionPerformed = '';

  // Handle specialized offline actions first if applicable
  if (agentType === 'document' && (prompt.toLowerCase().includes('pdf') || prompt.toLowerCase().includes('report'))) {
    if (contextData.targetProperty) {
      generatePropertyPDF(contextData.targetProperty);
      responseText = `[DATABASE FACT] Property Dossier PDF generated for "${contextData.targetProperty.title}".
[AI RECOMMENDATION] The PDF includes full listing attributes, current price ($${contextData.targetProperty.price.toLocaleString()}), and amenities. File downloaded successfully to client browser.`;
      actionPerformed = 'Generated Property PDF Report';
    } else {
      generateExecutiveReportPDF(metrics, deals, leads);
      responseText = `[DATABASE FACT] Executive Analytics PDF generated successfully based on current database state.
- Total Closed Revenue: $${metrics.totalRevenue.toLocaleString()}
- Total Active Properties: ${metrics.totalProperties}
- Total CRM Leads: ${metrics.totalLeads}
[AI RECOMMENDATION] Document downloaded to client.`;
      actionPerformed = 'Generated Executive Report PDF';
    }
  } else if (agentType === 'excel' && (prompt.toLowerCase().includes('export') || prompt.toLowerCase().includes('excel') || prompt.toLowerCase().includes('spreadsheet'))) {
    if (prompt.toLowerCase().includes('lead')) {
      generateLeadsExcel(leads);
      actionPerformed = 'Exported Leads Excel Spreadsheet';
      responseText = `[DATABASE FACT] Exported ${leads.length} CRM Lead records into Excel (.xlsx) file. File downloaded automatically.`;
    } else if (prompt.toLowerCase().includes('deal')) {
      generateDealsExcel(deals);
      actionPerformed = 'Exported Deals Excel Spreadsheet';
      responseText = `[DATABASE FACT] Exported ${deals.length} Deal records ($${metrics.totalRevenue.toLocaleString()} closed revenue) into Excel (.xlsx).`;
    } else {
      generatePropertiesExcel(properties);
      actionPerformed = 'Exported Properties Excel Spreadsheet';
      responseText = `[DATABASE FACT] Exported ${properties.length} Active Property inventory records into Excel (.xlsx) file.`;
    }
  } else {
    // 3. Call backend Gemini Agent
    try {
      const res = await fetch('/api/gemini/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType,
          prompt,
          context: contextData,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      responseText = data.responseText;
      requiresApproval = Boolean(data.requiresApproval);
    } catch (err: any) {
      console.warn('API Agent call fallback to local analysis:', err);
      responseText = generateLocalAgentFallback(agentType, prompt, contextData);
    }
  }

  // Update DB task state
  await db.updateAgentTask(task.id, {
    status: requiresApproval ? 'awaiting_approval' : 'completed',
    output_data: { responseText },
    completed_at: new Date().toISOString(),
    requires_approval: requiresApproval,
  });

  await db.logActivity({
    agent_type: agentType,
    action: actionPerformed || `Completed task for ${agentType}`,
    status: 'success',
  });

  return {
    taskId: task.id,
    responseText,
    requiresApproval,
    actionPerformed,
  };
};

function generateLocalAgentFallback(agentType: AgentType, prompt: string, ctx: any): string {
  const m = ctx.summaryMetrics || {};
  switch (agentType) {
    case 'property_intelligence':
      return `[DATABASE FACT] Database currently contains ${ctx.propertiesCount || 0} active property records.
[CALCULATED METRIC] Average listing price: $${ctx.allProperties?.length ? Math.round(ctx.allProperties.reduce((s: number, p: any) => s + p.price, 0) / ctx.allProperties.length).toLocaleString() : 0}.
[AI RECOMMENDATION] Ensure high-resolution imagery and explicit amenity tags for all active properties to maximize buyer engagement.`;
    case 'lead_qualification':
      return `[DATABASE FACT] Analyzed ${ctx.leadsCount || 0} CRM leads.
[CALCULATED METRIC] ${ctx.summaryMetrics?.qualifiedLeads || 0} leads classified as HOT (Qualification Score >= 70).
[AI RECOMMENDATION] Prioritize direct phone follow-up for leads with budget >= $2M and active timeline.`;
    case 'revenue_analytics':
      return `[DATABASE FACT] Total Closed Revenue: $${m.totalRevenue?.toLocaleString() || '0'}. Total Commission: $${m.totalCommission?.toLocaleString() || '0'}.
[CALCULATED METRIC] Closed Deals: ${m.closedDeals || 0}. Conversion Rate: ${m.conversionRate?.toFixed(1) || 0}%.
[AI RECOMMENDATION] Focus on advancing pending deal stages to close before month-end.`;
    default:
      return `[DATABASE FACT] Processed request across ${ctx.propertiesCount || 0} properties and ${ctx.leadsCount || 0} leads in RealtyPulse database.
[AI RECOMMENDATION] All records operate on live database synchronization.`;
  }
}
