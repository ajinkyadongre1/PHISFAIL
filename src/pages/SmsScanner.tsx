import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Bot, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Globe
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { api } from '../services/api';
import { SmsScanResult } from '../types';
import { RiskGauge } from '../components/RiskGauge';
import { ScanStatusBadge } from '../components/ScanStatusBadge';
import { soundFX } from '../services/sound';
import { PdfReportModal } from '../components/PdfReportModal';

interface Props {
  onNavigate: (tab: string) => void;
  onScanUrlDirect?: (url: string) => void;
  onSetInvestigatorContext?: (scan: any) => void;
}

export const SmsScanner: React.FC<Props> = ({ onNavigate, onScanUrlDirect, onSetInvestigatorContext }) => {
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<string | null>(null);
  const [result, setResult] = useState<SmsScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const presets = [
    {
      title: 'Electricity Power Cut (Hindi/Hinglish)',
      text: 'Bijli bill update: Priye grahak, aapka bijli bill update nahi hua hai. Aaj raat 9:30 baje electricity supply disconnect ho jayegi. Turant electricity officer se sampark karein: 9876543210 ya link kholen http://bijli-bill-seva.in'
    },
    {
      title: 'SBI YONO KYC Block',
      text: 'Dear customer, your SBI NetBanking YONO account has been suspended due to pending KYC verification. Please click https://sbi-yono-update-kyc.org/login.php to update your PAN and resume transactions immediately.'
    },
    {
      title: 'India Post Delivery Trap',
      text: 'India Post Alert: Your parcel #IN889271 cannot be delivered due to incomplete street address. Update details within 12 hours at https://indiapost-parcel-tracking.vip or package will be returned to customs.'
    },
    {
      title: 'Telegram Part-Time Task Job',
      text: 'Part-time work from home opportunity! Earn Rs 5,000 to 8,000 daily just by liking YouTube videos and rating hotels on Google Maps. No experience needed. Join Telegram channel: https://t.me/earn-fast-daily'
    }
  ];

  const handleOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFX.playClick();
    setError(null);
    setLoading(true);
    setOcrProgress('Initializing Tesseract OCR Neural Engine...');

    try {
      const worker = await createWorker('eng');
      setOcrProgress('Extracting text characters from screenshot...');
      const ret = await worker.recognize(file);
      const extracted = ret.data.text.trim();
      await worker.terminate();

      if (extracted.length > 5) {
        setMessageText(extracted);
        setOcrProgress(null);
        triggerAnalysis(extracted, 'screenshot');
      } else {
        setError('Could not extract sufficient text from image. Please ensure screenshot is sharp and legible.');
        setLoading(false);
        setOcrProgress(null);
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
      setError('OCR extraction encountered an issue. You can paste the text directly.');
      setLoading(false);
      setOcrProgress(null);
    }
  };

  const triggerAnalysis = async (text: string, source: 'sms' | 'screenshot' = 'sms') => {
    if (!text.trim()) return;
    setError(null);
    setLoading(true);
    soundFX.playScanPing();

    try {
      const res = await api.scanSms(text.trim(), source);
      setResult(res);

      if (res.risk_category === 'MALICIOUS' || res.risk_category === 'CRITICAL') {
        soundFX.playThreatAlert();
      } else if (res.risk_category === 'SAFE') {
        soundFX.playSafeSuccess();
      } else {
        soundFX.playScanPing();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze message content');
      soundFX.playThreatAlert();
    } finally {
      setLoading(false);
      setOcrProgress(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAnalysis(messageText, 'sms');
  };

  // Helper to render text with highlighted danger words
  const renderHighlightedMessage = () => {
    if (!result) return messageText;
    let text = result.target_input;
    const spans = result.highlight_spans || [];

    if (spans.length === 0) {
      return <span>{text}</span>;
    }

    // Split and highlight phrases
    const phrases = spans.map((s) => s.phrase).filter(Boolean);
    const regex = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const match = spans.find((s) => s.phrase.toLowerCase() === part.toLowerCase());
      if (match) {
        const isCritical = match.severity === 'CRITICAL' || match.severity === 'HIGH';
        return (
          <span
            key={i}
            className={`px-1.5 py-0.5 rounded font-bold font-mono ${
              isCritical
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 cyber-glow-red'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
            title={`Flagged: ${match.category} (${match.severity})`}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-[#100d24] to-slate-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <MessageSquareWarning className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              SMS & SCREENSHOT SCAM DETECTOR
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Detects psychological urgency, utility extortion, fake banking impersonation, and Hindi/Hinglish fraud patterns.
            </p>
          </div>
        </div>

        {/* Input Form & Screenshot Dropzone */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              placeholder="Paste suspicious SMS, WhatsApp message, email excerpt, or upload a screenshot below..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950/90 border border-purple-500/30 text-white placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-purple-400 transition"
              disabled={loading}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Screenshot OCR Upload button */}
            <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono cursor-pointer border border-slate-700 transition">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Upload Screenshot (OCR)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleOcrUpload}
                className="hidden"
                disabled={loading}
              />
            </label>

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={loading || !messageText.trim()}
              className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-black font-extrabold font-mono text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/25 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{ocrProgress || 'Analyzing'}</span>
                </>
              ) : (
                <>
                  <span>Analyze Message</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Samples */}
        <div className="flex flex-wrap items-center gap-2 mt-4 font-mono text-xs">
          <span className="text-slate-500">Quick Test Scenarios:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                soundFX.playClick();
                setMessageText(p.text);
                triggerAnalysis(p.text, 'sms');
              }}
              className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-purple-300 border border-slate-700/60 transition"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* OCR Telemetry Progress */}
      {ocrProgress && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono flex items-center gap-3 animate-pulse">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span>{ocrProgress}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Assessment Header Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl glass-panel border border-slate-800">
            {/* Gauge */}
            <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-800">
              <RiskGauge score={result.risk_score} category={result.risk_category} size={190} />
            </div>

            {/* Verdict and Telemetry */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <ScanStatusBadge category={result.risk_category} size="lg" />
                <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/20">
                  {result.detected_language}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold font-mono text-white tracking-tight">
                  {result.verdict}
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  {result.explanation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setShowPdfModal(true);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition border border-slate-700 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Executive PDF Report</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    if (onSetInvestigatorContext) onSetInvestigatorContext(result);
                    onNavigate('ai-investigator');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-purple-950/70 hover:bg-purple-900 text-purple-300 text-xs font-mono transition border border-purple-500/40 flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>Investigate with AI Assistant</span>
                </button>
              </div>
            </div>
          </div>

          {/* Highlighted Text Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-slate-300">
                Psychological Manipulation & High-Risk Phrase Highlighting
              </span>
              <span className="text-[11px] font-mono text-red-400">
                Red = High Risk | Amber = Pressure
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-sm leading-relaxed text-slate-200 font-sans">
              {renderHighlightedMessage()}
            </div>
          </div>

          {/* Extracted Artifacts (URLs & Phone numbers) */}
          {((result.extracted_urls && result.extracted_urls.length > 0) ||
            (result.extracted_phones && result.extracted_phones.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Extracted URLs */}
              {result.extracted_urls && result.extracted_urls.length > 0 && (
                <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Extracted Web Links
                  </span>
                  <div className="space-y-1.5">
                    {result.extracted_urls.map((u, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950 text-xs font-mono">
                        <span className="truncate text-slate-300 max-w-[70%]">{u}</span>
                        <button
                          onClick={() => {
                            if (onScanUrlDirect) onScanUrlDirect(u);
                            else onNavigate('url-scanner');
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] hover:bg-cyan-900 transition"
                        >
                          Scan Target
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Phones */}
              {result.extracted_phones && result.extracted_phones.length > 0 && (
                <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2">
                  <span className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" /> Suspect Contact Numbers
                  </span>
                  <div className="space-y-1.5">
                    {result.extracted_phones.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950 text-xs font-mono text-slate-300">
                        <span>{p}</span>
                        <span className="text-[10px] text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                          Personal Number Lure
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Detected Signals Grid */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Identified Threat Indicators ({result.detected_signals.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.detected_signals.map((sig, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{sig.name}</span>
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                      sig.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-800' :
                      sig.severity === 'HIGH' ? 'bg-orange-950 text-orange-400 border-orange-800' :
                      sig.severity === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-blue-950 text-blue-400 border-blue-800'
                    }`}>
                      {sig.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{sig.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Protective Recommendations */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Incident Response Directives
            </h3>
            <div className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300 font-sans"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PDF Report Modal */}
      {showPdfModal && result && (
        <PdfReportModal scan={result} onClose={() => setShowPdfModal(false)} />
      )}
    </div>
  );
};

