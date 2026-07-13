import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wallet, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useWallet, useTransactions } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import PageTransition from '../components/ui/PageTransition';
import { formatAmount, formatDate, getUniqueWallets } from '../utils/formatters';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#00F5D4', '#7C3AED', '#FACC15', '#22C55E', '#EF4444', '#3B82F6'];
const tooltipStyle = {
  background: '#0E1323',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#e2e8f0',
  fontSize: 12,
  padding: '8px 12px',
};

/* ─── Wallet detail panel ─────────────────────────────────── */
function WalletDetails({ address }) {
  const { data: wallet, isLoading } = useWallet(address);
  const { data: allTxs = [] } = useTransactions();

  const walletTxs = allTxs.filter(
    (tx) =>
      tx.sender.toLowerCase() === address.toLowerCase() ||
      tx.receiver.toLowerCase() === address.toLowerCase()
  );

  const chartData = walletTxs
    .slice()
    .reverse()
    .map((tx, i) => ({
      idx: i + 1,
      amount: tx.amount,
      type: tx.sender.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
    }));

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse bg-white/5 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Balance', value: wallet?.balance ?? 0, color: '#00F5D4', currency: true },
          { label: 'Received', value: wallet?.received ?? 0, color: '#22C55E', currency: true },
          { label: 'Sent', value: wallet?.sent ?? 0, color: '#EF4444', currency: true },
          { label: 'Total TXs', value: walletTxs.length, color: '#7C3AED', currency: false },
        ].map((s) => (
          <GlassCard key={s.label} className="text-center !p-4 flex flex-col gap-1" hover={false}>
            <div className="text-lg font-bold tabular-nums" style={{ color: s.color }}>
              {s.currency ? `$${formatAmount(s.value)}` : s.value}
            </div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Activity bar chart */}
      {chartData.length > 0 && (
        <GlassCard hover={false}>
          <div className="text-sm font-medium text-white mb-4">Transaction History</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="idx" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`$${formatAmount(v)}`, 'Amount']}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.type === 'sent' ? '#EF4444' : '#22C55E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" /> Received
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Sent
            </span>
          </div>
        </GlassCard>
      )}

      {/* Recent activity list */}
      {walletTxs.length > 0 && (
        <GlassCard hover={false}>
          <div className="text-sm font-medium text-white mb-3">Recent Activity</div>
          <div className="space-y-1 max-h-64 overflow-y-auto no-scrollbar">
            {walletTxs.slice(0, 10).map((tx) => {
              const isSent = tx.sender.toLowerCase() === address.toLowerCase();
              return (
                <Link
                  to={`/transactions/${tx.id}`}
                  key={tx.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isSent ? 'bg-[#EF4444]/15' : 'bg-[#22C55E]/15'
                    }`}
                  >
                    {isSent
                      ? <TrendingDown size={14} className="text-[#EF4444]" />
                      : <TrendingUp size={14} className="text-[#22C55E]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-200 truncate">
                      {isSent ? `To: ${tx.receiver}` : `From: ${tx.sender}`}
                    </div>
                    <div className="text-[10px] text-slate-500">{formatDate(tx.timestamp)}</div>
                  </div>
                  <div className={`text-sm font-semibold shrink-0 ${isSent ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                    {isSent ? '−' : '+'} ${formatAmount(tx.amount)}
                  </div>
                </Link>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

/* ─── Wallets page ───────────────────────────────────────── */
export default function Wallets() {
  const { data: allTxs = [] } = useTransactions();
  const [query, setQuery] = useState('');
  const [activeWallet, setActiveWallet] = useState('');

  const allWallets = getUniqueWallets(allTxs);
  const filtered = allWallets.filter(
    (w) => !query || w.toLowerCase().includes(query.toLowerCase())
  );

  const pieData = allWallets.slice(0, 6).map((w) => ({
    name: w,
    value: allTxs.filter((tx) => tx.sender === w || tx.receiver === w).length,
  }));

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Wallets</h1>
          <p className="text-sm text-slate-400 mt-0.5">{allWallets.length} unique wallet addresses</p>
        </div>

        {/* 3-col layout: list (1 col) + detail (2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left — wallet list */}
          <div className="flex flex-col gap-4">

            {/* Search */}
            <div className="flex items-center gap-2 glass rounded-xl px-3 h-10 border border-white/10 focus-within:border-[#00F5D4]/40 transition-colors">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search wallet…"
                className="bg-transparent text-sm text-slate-200 placeholder-slate-500 flex-1 outline-none min-w-0"
              />
              {query && (
                <button onClick={() => setQuery('')}>
                  <X size={13} className="text-slate-400" />
                </button>
              )}
            </div>

            {/* Wallet list */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto no-scrollbar">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">No wallets found</div>
                ) : (
                  filtered.map((w) => (
                    <motion.button
                      key={w}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setActiveWallet(w)}
                      className={`w-full text-left glass rounded-xl p-3 transition-all duration-200 ${
                        activeWallet === w
                          ? 'border border-[#00F5D4]/30 bg-[#00F5D4]/5'
                          : 'border border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F5D4]/20 to-[#7C3AED]/20 flex items-center justify-center shrink-0">
                          <Wallet size={14} className="text-[#00F5D4]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-200 truncate">{w}</div>
                          <div className="text-xs text-slate-500">
                            {allTxs.filter((tx) => tx.sender === w || tx.receiver === w).length} transactions
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Activity distribution donut */}
            {pieData.length > 0 && (
              <GlassCard hover={false} className="!p-4 flex flex-col gap-2">
                <div className="text-xs font-medium text-slate-300">Activity Distribution</div>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ ...tooltipStyle, padding: '6px 10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            )}
          </div>

          {/* Right — wallet detail (2 cols) */}
          <div className="lg:col-span-2">
            {activeWallet ? (
              <GlassCard gradient hover={false} className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#7C3AED] flex items-center justify-center shrink-0">
                      <Wallet size={18} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{activeWallet}</div>
                      <div className="text-xs text-slate-400">Wallet Details</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveWallet('')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                <WalletDetails address={activeWallet} />
              </GlassCard>
            ) : (
              <GlassCard
                hover={false}
                className="flex flex-col items-center justify-center min-h-[320px] text-center"
              >
                <Wallet size={40} className="text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm font-medium">Select a wallet to view details</p>
                <p className="text-slate-500 text-xs mt-1">Click any wallet from the list on the left</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
