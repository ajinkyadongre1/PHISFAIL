import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ThumbsUp, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Lock,
  Globe,
  Phone,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { CommunityReport } from '../types';
import { soundFX } from '../services/sound';

export const CommunityReports: React.FC = () => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [threatFilter, setThreatFilter] = useState('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    target_value: '',
    report_type: 'url',
    threat_category: 'Banking Phishing',
    targeted_brand: '',
    description: '',
    evidence_text: ''
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.getCommunityReports(threatFilter);
      setReports(res.reports || []);
    } catch (e) {
      console.error('Error fetching community reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [threatFilter]);

  const handleUpvote = async (reportId: string) => {
    soundFX.playClick();
    try {
      const res = await api.upvoteReport(reportId);
      if (res.report) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, upvotes: res.report.upvotes } : r))
        );
      }
    } catch (e) {
      console.error('Upvote failed:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.target_value.trim() || !formData.description.trim()) return;

    soundFX.playClick();
    setSubmitting(true);
    setSubmitFeedback(null);

    try {
      const res = await api.submitCommunityReport(formData);
      setSubmitFeedback(res.message || 'Report submitted successfully!');
      soundFX.playSafeSuccess();
      setTimeout(() => {
        setShowSubmitModal(false);
        setSubmitFeedback(null);
        setFormData({
          target_value: '',
          report_type: 'url',
          threat_category: 'Banking Phishing',
          targeted_brand: '',
          description: '',
          evidence_text: ''
        });
        fetchReports();
      }, 1500);
    } catch (e: any) {
      setSubmitFeedback(e.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-[#0c1527] to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              COMMUNITY THREAT INTELLIGENCE EXCHANGE
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Crowdsourced indicators of compromise vetted with privacy scrubbing (PII, OTPs & PANs redacted).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => { soundFX.playClick(); fetchReports(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setShowSubmitModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono transition shadow-lg shadow-cyan-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Report a Scam</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Filter By Type:</span>
          <select
            value={threatFilter}
            onChange={(e) => {
              soundFX.playClick();
              setThreatFilter(e.target.value);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none"
          >
            <option value="all">All Threat Types</option>
            <option value="url">Malicious URLs</option>
            <option value="sms">Smishing / SMS Texts</option>
            <option value="phone">Scam Phone Numbers</option>
            <option value="upi">Mule UPI Handles</option>
          </select>
        </div>

        <span className="text-slate-500">
          Showing <strong>{reports.length}</strong> reports
        </span>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-xs font-mono text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <span>Synchronizing community threat feeds...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-xs font-mono text-slate-500">
            No community reports recorded for this category.
          </div>
        ) : (
          reports.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 relative group hover:border-cyan-500/30 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                      {r.report_type}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {r.threat_category}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold border ${
                    r.status === 'verified'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="font-mono text-xs font-bold text-white break-all p-2 rounded bg-slate-950/80 border border-slate-850">
                  {r.target_value}
                </div>

                {r.targeted_brand && (
                  <div className="text-[11px] font-mono text-slate-400">
                    Target Brand: <strong className="text-slate-200">{r.targeted_brand}</strong>
                  </div>
                )}

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {r.description}
                </p>

                {r.evidence_text && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono italic">
                    "{r.evidence_text}"
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 font-mono text-xs">
                <span className="text-[10px] text-slate-500">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleUpvote(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
                  title="Confirm / Upvote this threat"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{r.upvotes} Confirmations</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0c121e] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 cyber-glow-cyan max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold font-mono tracking-tight text-white mb-2 flex items-center gap-2">
              SUBMIT THREAT TO COMMUNITY DEFENSE
            </h2>
            <p className="text-xs text-slate-400 font-sans mb-4">
              Your report alerts other analysts and users across the network. All sensitive personal information (credit cards, Aadhaar, OTPs) is automatically scrubbed.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Entity (URL, Phone, SMS text, or UPI):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://sbi-fraud-link.com or +91-9876543210"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vector Type:</label>
                  <select
                    value={formData.report_type}
                    onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none"
                  >
                    <option value="url">Malicious URL</option>
                    <option value="sms">SMS / Message</option>
                    <option value="phone">Phone Number</option>
                    <option value="upi">UPI Mule Account</option>
                    <option value="qr">QR Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Threat Category:</label>
                  <select
                    value={formData.threat_category}
                    onChange={(e) => setFormData({ ...formData, threat_category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none"
                  >
                    <option value="Banking Phishing">Banking Phishing</option>
                    <option value="Postal Delivery Scam">Postal Smishing</option>
                    <option value="Electricity Extortion">Electricity Disconnection</option>
                    <option value="Task Scam">Telegram / Job Scam</option>
                    <option value="Lottery Scam">Prize / Lottery Fraud</option>
                    <option value="Other Suspicious Activity">Other Suspicion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Targeted Brand / Institution:</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India, India Post, Netflix"
                  value={formData.targeted_brand}
                  onChange={(e) => setFormData({ ...formData, targeted_brand: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Incident Description (What happened?):</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain how you encountered this threat..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Evidence Message Text (Optional):</label>
                <textarea
                  rows={2}
                  placeholder="Paste raw SMS or email header (sensitive card numbers will be automatically redacted)"
                  value={formData.evidence_text}
                  onChange={(e) => setFormData({ ...formData, evidence_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              {submitFeedback && (
                <div className="p-3 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  {submitFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-cyan-400/20"
                >
                  {submitting ? 'Submitting...' : 'Submit Threat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

