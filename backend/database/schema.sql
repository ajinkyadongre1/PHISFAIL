-- ====================================================================
-- PHISFAIL: AI-POWERED CYBERSECURITY PLATFORM
-- Supabase PostgreSQL Schema & Row-Level Security (RLS) Policies
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users / Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'analyst' CHECK (role IN ('analyst', 'hunter', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scans Table (Stores URL, QR, and SMS/Screenshot analyses)
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    scan_type TEXT NOT NULL CHECK (scan_type IN ('url', 'qr', 'sms', 'screenshot')),
    target_input TEXT NOT NULL,
    sanitized_input TEXT,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_category TEXT NOT NULL CHECK (risk_category IN ('SAFE', 'LOW_RISK', 'SUSPICIOUS', 'MALICIOUS', 'CRITICAL')),
    verdict TEXT NOT NULL,
    detected_signals JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    telemetry JSONB DEFAULT '{}'::jsonb,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Threat Indicators (Scam DNA atomic entities: domain, IP, phone, kit signature, etc.)
CREATE TABLE IF NOT EXISTS public.threat_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indicator_type TEXT NOT NULL CHECK (indicator_type IN ('domain', 'ip', 'phone', 'sender_id', 'url_hash', 'kit_signature', 'tld')),
    indicator_value TEXT NOT NULL,
    reputation_score INTEGER DEFAULT 0,
    times_seen INTEGER DEFAULT 1,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    scam_category TEXT,
    targeted_brand TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT unique_indicator UNIQUE(indicator_type, indicator_value)
);

-- 5. Scam DNA Relationships (Edges linking correlated threats)
CREATE TABLE IF NOT EXISTS public.scam_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_indicator_id UUID REFERENCES public.threat_indicators(id) ON DELETE CASCADE,
    target_indicator_id UUID REFERENCES public.threat_indicators(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL, -- e.g., 'shares_ip', 'same_campaign', 'subdomain_of', 'identical_kit', 'same_sender'
    confidence_score NUMERIC(3, 2) NOT NULL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    relation_reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Community Reports Table
CREATE TABLE IF NOT EXISTS public.community_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_value TEXT NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('url', 'sms', 'qr', 'phone', 'upi')),
    threat_category TEXT NOT NULL,
    targeted_brand TEXT,
    description TEXT NOT NULL,
    evidence_text TEXT,
    upvotes INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'verified', 'dismissed')),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all profiles, update only their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Scans: Users can view their own scans, or public demo scans
CREATE POLICY "Users can read own scans" ON public.scans
    FOR SELECT USING (auth.uid() = user_id OR is_demo = true OR user_id IS NULL);
CREATE POLICY "Users can insert scans" ON public.scans
    FOR INSERT WITH CHECK (true);

-- Threat Indicators: Publicly readable for Scam DNA graph
CREATE POLICY "Threat indicators are viewable by everyone" ON public.threat_indicators
    FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert indicators" ON public.threat_indicators
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Scam Relationships: Publicly readable for graph visualization
CREATE POLICY "Relationships are viewable by everyone" ON public.scam_relationships
    FOR SELECT USING (true);

-- Community Reports: Readable by all, insertable by anyone (including anonymous)
CREATE POLICY "Community reports are readable by everyone" ON public.community_reports
    FOR SELECT USING (is_public = true);
CREATE POLICY "Anyone can report a threat" ON public.community_reports
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can upvote" ON public.community_reports
    FOR UPDATE USING (true);

