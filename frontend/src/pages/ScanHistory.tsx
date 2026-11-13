import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Eye, 
  RefreshCw, 
  Globe, 
  QrCode, 
  MessageSquareWarning 
} from 'lucide-react';
import { api } from '../services/api';
import { ScanResult } from '../types';
import { ScanStatusBadge } from '../components/ScanStatusBadge';
import { soundFX } from '../services/sound';
import { PdfReportModal } from '../components/PdfReportModal';

export const ScanHistory: React.FC = () => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanTypeFilter, setScanTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getScanHistory(scanTypeFilter, searchQuery);
      setScans(res.scans || []);
    } catch (e) {
      console.error('Error fetching scan history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [scanTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-[#0a101f] to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              SCAN AUDIT LOGS & REPORTS
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Search historical evaluations, review indicators of compromise, and export verifiable PDF reports.
            </p>
          </div>
        </div>

        <button
          onClick={() => { soundFX.playClick(); fetchHistory(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700 self-start md:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search URL, phone, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-9 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500">Scan Vector:</span>
          <select
            value={scanTypeFilter}
            onChange={(e) => {
              soundFX.playClick();
              setScanTypeFilter(e.target.value);
            }}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none"
          >
            <option value="all">All Vectors</option>
            <option value="url">URL Targets</option>
            <option value="qr">QR Quishing</option>
            <option value="sms">SMS / Smishing</option>
            <option value="screenshot">Screenshot OCR</option>
          </select>
        </div>
      </div>

      {/* Scans Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <span>Loading telemetry history...</span>
          </div>
        ) : scans.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500">
            No matching scan logs found in storage.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5 pl-5">Timestamp</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Target Entity</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Classification</th>
                  <th className="p-3.5 text-right pr-5">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {scans.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition">
                    <td className="p-3.5 pl-5 text-slate-400 whitespace-nowrap">
                      {new Date(s.created_at || Date.now()).toLocaleDateString()}{' '}
                      <span className="text-slate-500">
                        {new Date(s.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                        {s.scan_type}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate" title={s.target_input}>
                      <span className="text-white font-semibold">{s.target_input}</span>
                      <div className="text-[10px] text-slate-500 truncate">{s.verdict}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-sm font-bold text-white">{s.risk_score}</span>
                      <span className="text-slate-500 text-[10px]">/100</span>
                    </td>
                    <td className="p-3.5">
                      <ScanStatusBadge category={s.risk_category} size="sm" />
                    </td>
                    <td className="p-3.5 text-right pr-5">
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setSelectedScan(s);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition inline-flex items-center gap-1.5 text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PDF Modal */}
      {selectedScan && (
        <PdfReportModal scan={selectedScan} onClose={() => setSelectedScan(null)} />
      )}
    </div>
  );
};

