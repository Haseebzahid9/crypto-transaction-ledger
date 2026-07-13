import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Zap, Bell, Download, RefreshCw, Info, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import PageTransition from '../components/ui/PageTransition';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { transactionApi } from '../services/api';

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-[#00F5D4]' : 'bg-white/15'}`}
    >
      <motion.span
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow block"
      />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-white/[0.05] last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-200">{label}</div>
        {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { animationsEnabled, toggleAnimations } = useApp();
  const qc = useQueryClient();
  const [apiUrl, setApiUrl] = useState('http://localhost:3000');
  const [notifications, setNotifications] = useState(true);

  const handleReset = () => {
    qc.invalidateQueries();
    toast.success('Cache cleared and data refreshed');
  };

  const handleExportAll = async () => {
    try {
      const txs = await transactionApi.export();
      const blob = new Blob([JSON.stringify(txs, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `ledger-export-${Date.now()}.json`; a.click();
      toast.success('Export complete');
    } catch { toast.error('Export failed'); }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F5D4]/20 to-[#7C3AED]/20 flex items-center justify-center">
            <SettingsIcon size={16} className="text-[#00F5D4]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-slate-400">Configure your dashboard preferences</p>
          </div>
        </div>

        <GlassCard gradient hover={false}>
          <h3 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2"><Zap size={14} className="text-[#00F5D4]" /> Appearance</h3>
          <SettingRow label="Animations" description="Enable smooth transitions and motion effects">
            <Toggle value={animationsEnabled} onChange={toggleAnimations} />
          </SettingRow>
          <SettingRow label="Notifications" description="Show toast notifications for actions">
            <Toggle value={notifications} onChange={setNotifications} />
          </SettingRow>
        </GlassCard>

        <GlassCard gradient hover={false}>
          <h3 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2"><ExternalLink size={14} className="text-[#7C3AED]" /> API Configuration</h3>
          <SettingRow label="API Base URL" description="Backend server address">
            <input
              value={apiUrl} onChange={e => setApiUrl(e.target.value)}
              className="glass text-xs text-slate-200 border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-[#00F5D4]/40 w-52 font-mono"
            />
          </SettingRow>
        </GlassCard>

        <GlassCard gradient hover={false}>
          <h3 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2"><Download size={14} className="text-[#FACC15]" /> Data Management</h3>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={handleExportAll}><Download size={13} /> Export All Data</Button>
            <Button variant="ghost" size="sm" onClick={handleReset}><RefreshCw size={13} /> Refresh Cache</Button>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="text-xs text-slate-500 space-y-1">
          <div className="flex items-center gap-2"><Info size={11} /> Settings are stored locally in your browser.</div>
          <div className="flex items-center gap-2"><Info size={11} /> API URL changes take effect on next request.</div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
