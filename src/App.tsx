import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { PropertiesList } from './components/properties/PropertiesList';
import { LeadsList } from './components/leads/LeadsList';
import { ClientsList } from './components/clients/ClientsList';
import { DealsPipeline } from './components/deals/DealsPipeline';
import { AppointmentsCalendar } from './components/appointments/AppointmentsCalendar';
import { CommunicationsView } from './components/communications/CommunicationsView';
import { AgentsDashboard } from './components/agents/AgentsDashboard';
import { AgentWorkspace } from './components/agents/AgentWorkspace';
import { ReportsView } from './components/reports/ReportsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { MarketingView } from './components/marketing/MarketingView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthPage } from './components/auth/AuthPage';
import { getCurrentUser, logoutUser } from './lib/auth';
import { AgentType, User } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'properties'
    | 'leads'
    | 'clients'
    | 'deals'
    | 'appointments'
    | 'communications'
    | 'agents'
    | 'reports'
    | 'documents'
    | 'marketing'
    | 'settings'
  >('dashboard');

  const [selectedAgentType, setSelectedAgentType] = useState<AgentType | null>(null);
  const [agentInitialPrompt, setAgentInitialPrompt] = useState<string | undefined>(undefined);
  const [agentInitialEntityId, setAgentInitialEntityId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('realtypulse_auth_change', handleAuthChange);
    return () => window.removeEventListener('realtypulse_auth_change', handleAuthChange);
  }, []);

  const handleOpenAgentWorkspace = (
    agentType: string = 'command',
    prompt?: string,
    entityId?: string
  ) => {
    setSelectedAgentType(agentType as AgentType);
    setAgentInitialPrompt(prompt);
    setAgentInitialEntityId(entityId);
  };

  const handleLogout = () => {
    logoutUser();
  };

  if (!currentUser) {
    return <AuthPage onSuccess={() => setCurrentUser(getCurrentUser())} />;
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-base text-[#EDEDF0] font-sans antialiased selection:bg-[#8B5CF6] selection:text-white">
      {/* Liquid morphism ambient field */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="liquid-orb animate-drift left-[-8%] top-[-10%] h-[520px] w-[520px] bg-[#7C3AED]/25" />
        <div className="liquid-orb animate-drift-slow right-[-6%] top-[18%] h-[460px] w-[460px] bg-[#4338CA]/20" />
        <div className="liquid-orb animate-drift bottom-[-14%] left-[38%] h-[600px] w-[600px] bg-[#312E81]/25" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Primary Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedAgentType(null); // Clear agent workspace view when navigating main tabs
        }}
        onOpenAgent={handleOpenAgentWorkspace}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Top Header Bar */}
        <Header
          onOpenAgent={handleOpenAgentWorkspace}
          onNavigateToRecord={(type) => {
            if (type === 'property') setActiveTab('properties');
            if (type === 'lead') setActiveTab('leads');
            if (type === 'deal') setActiveTab('deals');
            setSelectedAgentType(null);
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto">
          {selectedAgentType ? (
            <AgentWorkspace
              agentType={selectedAgentType}
              onBack={() => setSelectedAgentType(null)}
              initialPrompt={agentInitialPrompt}
              initialEntityId={agentInitialEntityId}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  onOpenAgent={handleOpenAgentWorkspace}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'properties' && (
                <PropertiesList onRunAgent={handleOpenAgentWorkspace} />
              )}
              {activeTab === 'leads' && (
                <LeadsList onRunAgent={handleOpenAgentWorkspace} />
              )}
              {activeTab === 'clients' && <ClientsList />}
              {activeTab === 'deals' && (
                <DealsPipeline onRunAgent={handleOpenAgentWorkspace} />
              )}
              {activeTab === 'appointments' && (
                <AppointmentsCalendar onRunAgent={handleOpenAgentWorkspace} />
              )}
              {activeTab === 'communications' && <CommunicationsView />}
              {activeTab === 'agents' && (
                <AgentsDashboard
                  onSelectAgent={(agent) => handleOpenAgentWorkspace(agent)}
                />
              )}
              {activeTab === 'reports' && <ReportsView />}
              {activeTab === 'documents' && <DocumentsView />}
              {activeTab === 'marketing' && <MarketingView />}
              {activeTab === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
