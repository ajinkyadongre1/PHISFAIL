import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { UrlScanner } from './pages/UrlScanner';
import { QrScanner } from './pages/QrScanner';
import { SmsScanner } from './pages/SmsScanner';
import { ScamDnaGraph } from './pages/ScamDnaGraph';
import { AiInvestigator } from './pages/AiInvestigator';
import { ScanHistory } from './pages/ScanHistory';
import { CommunityReports } from './pages/CommunityReports';
import { SecurityEducation } from './pages/SecurityEducation';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { ScanResult } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeScanContext, setActiveScanContext] = useState<ScanResult | null>(null);

  const handleQrRedirectToUrlScanner = (url: string) => {
    sessionStorage.setItem('phisfail_prefill_url', url);
    setCurrentTab('url-scanner');
  };

  const handleScanUrlDirect = (url: string) => {
    sessionStorage.setItem('phisfail_prefill_url', url);
    setCurrentTab('url-scanner');
  };

  if (currentTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col">
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <LandingPage onLaunchConsole={(tab) => setCurrentTab(tab || 'dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header matching Screenshots */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onQuickDetonate={() => setCurrentTab('url-scanner')}
      />

      {/* Main Workspace: Left Sidebar + Central Dynamic Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Operational Modules Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Central Stage */}
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 bg-[#06080f]">
          {currentTab === 'dashboard' && (
            <Dashboard
              onNavigate={(tab) => setCurrentTab(tab)}
              onInspectScan={(scan) => {
                setActiveScanContext(scan);
                setCurrentTab('url-scanner');
              }}
            />
          )}

          {currentTab === 'url-scanner' && (
            <UrlScanner
              onNavigate={(tab) => setCurrentTab(tab)}
              onSetInvestigatorContext={(scan) => setActiveScanContext(scan)}
            />
          )}

          {currentTab === 'qr-scanner' && (
            <QrScanner onScanRedirectToUrlScanner={handleQrRedirectToUrlScanner} />
          )}

          {currentTab === 'sms-scanner' && (
            <SmsScanner
              onNavigate={(tab) => setCurrentTab(tab)}
              onScanUrlDirect={handleScanUrlDirect}
              onSetInvestigatorContext={(scan) => setActiveScanContext(scan)}
            />
          )}

          {currentTab === 'scam-dna' && <ScamDnaGraph />}

          {currentTab === 'ai-investigator' && (
            <AiInvestigator
              activeScanContext={activeScanContext}
              onClearContext={() => setActiveScanContext(null)}
            />
          )}

          {currentTab === 'history' && <ScanHistory />}

          {currentTab === 'community' && <CommunityReports />}

          {currentTab === 'education' && <SecurityEducation />}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
