export type RiskCategory = 'SAFE' | 'LOW_RISK' | 'SUSPICIOUS' | 'MALICIOUS' | 'CRITICAL';

export type ScanType = 'url' | 'qr' | 'sms' | 'screenshot';

export interface DetectedSignal {
  name: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detail: string;
}

export interface TelemetryData {
  domain?: string;
  base_domain?: string;
  resolved_ip?: string;
  scheme?: string;
  tld?: string;
  path_entropy?: number;
  safe_browsing?: {
    source: string;
    is_active_api: boolean;
    is_flagged: boolean;
    threat_types: string[];
    details: string;
  };
  virustotal?: {
    source: string;
    is_active_api: boolean;
    is_flagged: boolean;
    positives: number;
    total_engines: number;
    detection_ratio: string;
    details: string;
  };
  category?: string;
  language?: string;
  extracted_urls?: string[];
  extracted_phones?: string[];
}

export interface ScanResult {
  scan_id?: string;
  id?: string;
  scan_type: ScanType;
  target_input: string;
  sanitized_input: string;
  risk_score: number;
  risk_category: RiskCategory;
  verdict: string;
  detected_signals: DetectedSignal[];
  recommendations: string[];
  telemetry: TelemetryData;
  is_demo?: boolean;
  created_at?: string;
  scam_dna_correlation?: {
    target: string;
    correlations_found: number;
    matches: Array<{
      matched_indicator: {
        indicator_value: string;
        indicator_type: string;
        targeted_brand?: string;
      };
      correlation_type: string;
      confidence_score: number;
      reason: string;
    }>;
    disclaimer: string;
  };
}

export interface SmsScanResult extends ScanResult {
  detected_category: string;
  detected_language: string;
  explanation: string;
  highlight_spans: Array<{
    phrase: string;
    category: string;
    severity: string;
  }>;
  extracted_urls: string[];
  extracted_phones: string[];
  url_breakdowns?: ScanResult[];
}

export interface ThreatIndicator {
  id: string;
  indicator_type: 'domain' | 'ip' | 'phone' | 'sender_id' | 'url_hash' | 'kit_signature' | 'upi' | 'tld';
  indicator_value: string;
  reputation_score: number;
  times_seen: number;
  scam_category?: string;
  targeted_brand?: string;
  metadata?: Record<string, any>;
}

export interface ScamRelationship {
  id: string;
  source: string;
  target: string;
  relation_type: string;
  confidence_score: number;
  relation_reason: string;
}

export interface CommunityReport {
  id: string;
  target_value: string;
  report_type: 'url' | 'sms' | 'qr' | 'phone' | 'upi';
  threat_category: string;
  targeted_brand: string;
  description: string;
  evidence_text?: string;
  upvotes: number;
  status: 'pending_review' | 'verified' | 'dismissed';
  is_public: boolean;
  created_at: string;
}

export interface SystemStatus {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  integrations: {
    gemini_api: { active: boolean; label: string; mode: string };
    virustotal: { active: boolean; label: string; mode: string };
    safe_browsing: { active: boolean; label: string; mode: string };
    supabase_db: { active: boolean; label: string; mode: string };
  };
}

