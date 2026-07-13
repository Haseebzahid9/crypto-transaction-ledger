import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, TrendingUp, Wallet, Hash, Activity,
  Zap, ShieldCheck, PlusCircle, BarChart2,
} from 'lucide-react';
import { useTransactions, useStats } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageTransition from '../components/ui/PageTransition';
import { SkeletonCard } from '../components/ui/Skeleton';
import { formatAmount, formatDate, truncateHash, truncateId } from '../utils/formatters';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip as RechartTooltip,
} from 'recharts';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ─── Stat Card ────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color = '#00F5D4', prefix = '', suffix = '', decimals = 0 }) {
  return (
    <motion.div variants={itemVariant} className="h-full">
      <GlassCard gradient className="h-full flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}1A` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          <Badge color="accent" className="text-[10px] shrink-0">Live</Badge>
        </div>
        {/* Value */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-2xl font-bold text-white tabular-nums truncate">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </div>
          <div className="text-sm font-medium text-slate-300 truncate">{label}</div>
          {sub && <div className="text-xs text-slate-500 truncate">{sub}</div>}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ─── Mini area chart ───────────────────────────────────────── */
function MiniChart({ data }) {
  if (!data?.length) return null;
  return (
    <ResponsiveContainer width="100%" height={72}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="mini" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#00F5D4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#00F5D4"
          strokeWidth={1.5}
          fill="url(#mini)"
          dot={false}
        />
        <RechartTooltip
          contentStyle={{ display: 'none' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────── */
export default function Dashboard() {
  const { data: transactions = [], isLoading: txLoading } = useTransactions();
  const { data: stats, isLoading: statsLoading } = useStats();

  const recent = transactions.slice(0, 6);
  const chartData = transactions.slice().reverse().slice(-20).map((tx) => ({ amount: tx.amount }));
  const uniqueWallets = new Set(transactions.flatMap((tx) => [tx.sender, tx.receiver])).size;

  return (
    <PageTransition>
      {/* ── spacing system: section gap = space-y-8 ── */}
      <div className="space-y-8">

        {/* ── Page header ───────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold leading-tight"
            >
              <span className="gradient-text">Blockchain</span>{' '}
              <span className="text-white">Dashboard</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-slate-400 mt-1"
            >
              Real-time crypto transaction ledger overview
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 shrink-0"
          >
            <Link to="/create">
              <Button size="sm">
                <PlusCircle size={14} /> New Transaction
              </Button>
            </Link>
            <Link to="/statistics">
              <Button size="sm" variant="secondary">
                <BarChart2 size={14} /> Statistics
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ── Stats grid: 4 col desktop / 2 col tablet / 1 col mobile ── */}
        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <StatCard
              icon={Activity}
              label="Total Transactions"
              value={stats?.totalTransactions ?? 0}
              sub="All time"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Volume"
              value={stats?.totalTransferred ?? 0}
              prefix="$"
              decimals={2}
              color="#7C3AED"
              sub="Transferred"
            />
            <StatCard
              icon={Wallet}
              label="Unique Wallets"
              value={uniqueWallets}
              color="#FACC15"
              sub="Active addresses"
            />
            <StatCard
              icon={Hash}
              label="Avg Transaction"
              value={stats?.averageAmount ?? 0}
              prefix="$"
              decimals={2}
              color="#22C55E"
              sub="Per transaction"
            />
          </motion.div>
        )}

        {/* ── Charts + Status: 2/3 + 1/3 ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity chart — takes 2 cols */}
          <GlassCard gradient hover={false} className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white">Transaction Activity</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last 20 transactions by amount</p>
              </div>
              <Badge color="accent" className="shrink-0">Live</Badge>
            </div>

            <MiniChart data={chartData} />

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/[0.06]">
              <div className="text-center">
                <div className="text-lg font-bold text-white tabular-nums">
                  {stats?.totalTransactions ?? 0}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Total TXs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold gradient-text tabular-nums">
                  ${formatAmount(stats?.totalTransferred ?? 0)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold tabular-nums" style={{ color: '#FACC15' }}>
                  ${formatAmount(stats?.highestTransaction?.amount ?? 0)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Highest TX</div>
              </div>
            </div>
          </GlassCard>

          {/* System status — 1 col */}
          <GlassCard hover={false} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-white">System Status</h3>
              <div className="flex items-center gap-1.5 text-[#22C55E] text-xs shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                Online
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { label: 'API Status', value: 'Operational', ok: true },
                { label: 'Hash Engine', value: 'SHA-256 Active', ok: true },
                { label: 'Storage', value: 'JSON File DB', ok: true },
                { label: 'Ledger', value: `${stats?.totalTransactions ?? 0} records`, ok: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className={`text-xs font-medium ${s.ok ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/[0.06] mt-auto">
              <Link to="/verify" className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  <ShieldCheck size={13} /> Verify TX
                </Button>
              </Link>
              <Link to="/transactions" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full">
                  View All <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* ── Recent Transactions ────────────────────── */}
        <GlassCard gradient hover={false} className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold text-white">Recent Transactions</h3>
            <Link to="/transactions">
              <Button variant="ghost" size="sm">
                View All <ArrowRight size={13} />
              </Button>
            </Link>
          </div>

          {txLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 rounded-xl animate-pulse bg-white/5" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Activity size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No transactions yet.</p>
              <Link to="/create">
                <Button size="sm" className="mt-3">Create First Transaction</Button>
              </Link>
            </div>
          ) : (
            /* Scrollable table wrapper — never forces page overflow */
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left border-b border-white/[0.06]">
                    {['TX ID', 'Sender → Receiver', 'Amount', 'Hash', 'Date'].map((h) => (
                      <th key={h} className="pb-3 pr-4 last:pr-0 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((tx, i) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <Link
                          to={`/transactions/${tx.id}`}
                          className="text-[#00F5D4] hover:underline font-mono text-xs whitespace-nowrap"
                        >
                          {truncateId(tx.id, 8, 4)}
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-slate-200 whitespace-nowrap">
                          {tx.sender}
                          <span className="text-slate-500 mx-1.5">→</span>
                          {tx.receiver}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-white whitespace-nowrap">
                        ${formatAmount(tx.amount)}
                      </td>
                      {/* Hash — hard truncate with max-width */}
                      <td className="py-3 pr-4 max-w-[160px]">
                        <span className="font-mono text-xs text-slate-400 block truncate">
                          {truncateHash(tx.hash)}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(tx.timestamp)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        {/* ── Quick actions: 4 col desktop / 2 col tablet / 1 col mobile ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'New Transaction', icon: PlusCircle, to: '/create', color: '#00F5D4' },
            { label: 'View Wallets', icon: Wallet, to: '/wallets', color: '#7C3AED' },
            { label: 'Statistics', icon: BarChart2, to: '/statistics', color: '#FACC15' },
            { label: 'Verify TX', icon: ShieldCheck, to: '/verify', color: '#22C55E' },
          ].map(({ label, icon: Icon, to, color }) => (
            <Link key={to} to={to}>
              <motion.div
                whileHover={{ y: -3 }}
                className="glass rounded-2xl p-5 text-center cursor-pointer border border-transparent hover:border-white/10 transition-all duration-200"
              >
                <div
                  className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="text-sm font-medium text-slate-300">{label}</div>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
