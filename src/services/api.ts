import { ScanResult, SmsScanResult, CommunityReport, SystemStatus } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_API_URL as string) || '/api';

export const api = {
  // URL Scanning
  async scanUrl(url: string, scanSource: 'web' | 'qr' = 'web'): Promise<ScanResult> {
    const res = await fetch(`${API_BASE}/url/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, scan_source: scanSource })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Scan request failed' }));
      throw new Error(err.detail || `Error ${res.status}: Failed to analyze URL`);
    }
    return res.json();
  },

  // SMS & Screenshot OCR Scanning
  async scanSms(message: string, scanSource: 'sms' | 'screenshot' = 'sms'): Promise<SmsScanResult> {
    const res = await fetch(`${API_BASE}/sms/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, scan_source: scanSource })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Scan request failed' }));
      throw new Error(err.detail || `Error ${res.status}: Failed to analyze message`);
    }
    return res.json();
  },

  // Scam DNA Threat Graph
  async getScamDnaGraph(brand?: string): Promise<{
    nodes: any[];
    edges: any[];
    total_indicators: number;
    total_correlations: number;
    disclaimer: string;
  }> {
    const params = new URLSearchParams();
    if (brand && brand !== 'all') params.append('brand', brand);
    const res = await fetch(`${API_BASE}/scam-dna/graph?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to retrieve Scam DNA graph telemetry');
    return res.json();
  },

  async correlateThreat(targetValue: string): Promise<any> {
    const res = await fetch(`${API_BASE}/scam-dna/correlate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_value: targetValue })
    });
    if (!res.ok) throw new Error('Failed to correlate indicator');
    return res.json();
  },

  // AI Investigator
  async chatInvestigator(message: string, scanContext?: any): Promise<{
    reply: string;
    engine: string;
    is_live_ai: boolean;
  }> {
    const res = await fetch(`${API_BASE}/investigator/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, scan_context: scanContext })
    });
    if (!res.ok) throw new Error('Failed to communicate with AI investigator');
    return res.json();
  },

  // Scan History
  async getScanHistory(scanType?: string, search?: string): Promise<{ total: number; scans: ScanResult[] }> {
    const params = new URLSearchParams();
    if (scanType && scanType !== 'all') params.append('scan_type', scanType);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/history?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch scan history');
    return res.json();
  },

  async getScanDetails(scanId: string): Promise<ScanResult> {
    const res = await fetch(`${API_BASE}/history/${scanId}`);
    if (!res.ok) throw new Error('Failed to load scan record');
    return res.json();
  },

  // Community Threat Reports
  async getCommunityReports(threatType?: string): Promise<{ total: number; reports: CommunityReport[] }> {
    const params = new URLSearchParams();
    if (threatType && threatType !== 'all') params.append('threat_type', threatType);
    const res = await fetch(`${API_BASE}/community?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch community reports');
    return res.json();
  },

  async submitCommunityReport(report: {
    target_value: string;
    report_type: string;
    threat_category: string;
    targeted_brand?: string;
    description: string;
    evidence_text?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/community`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    if (!res.ok) throw new Error('Failed to submit threat report');
    return res.json();
  },

  async upvoteReport(reportId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/community/${reportId}/upvote`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to upvote report');
    return res.json();
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return res.json();
  },

  // System Health & Integrations
  async getSystemStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE}/system/status`);
    if (!res.ok) throw new Error('Failed to load system status');
    return res.json();
  }
};

