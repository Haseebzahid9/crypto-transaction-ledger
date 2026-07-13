import { motion } from 'framer-motion';
import { useStats, useTransactions } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import PageTransition from '../components/ui/PageTransition';
import { SkeletonCard } from '../components/ui/Skeleton';
import { formatAmount, groupByMonth, getUniqueWallets } from '../utils/formatters';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Activity, Wallet, Hash, ArrowUp, ArrowDown, BarChart2 } from 'lucide-react';

const COLORS = ['#00F5D4', '#7C3AED', '#FACC15', '#22C55E', '#EF4444', '#3B82F6'];

const tooltipStyle = {
  background: '#0E1323',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#e2e8f0',
  fontSize: 12,
  padding: '8px 12px',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariant = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function StatTile({ icon: Icon, label, value, prefix = '', suffix = '', decimals = 0, color = '#00F5D4' }) {
  return (
    <motion.div variants={itemVariant} className="h-full">
      <GlassCard gradient className="h-full flex flex-col items-center text-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}1A` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div className="min-w-0 w-full">
          <div className="text-2xl font-bold text-white tabular-nums">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </div>
          <div className="text-xs text-slate-400 mt-1 truncate">{label}</div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function Statistics() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: transactions = [], isLoading: txLoading } = useTransactions();

  const monthlyData = groupByMonth(transactions);
  const uniqueWallets = getUniqueWallets(transactions);

  const sortedByAmount = [...transactions].sort((a, b) => b.amount - a.amount);
  const highestTx = sortedByAmount[0];
  const lowestTx = sortedByAmount[sortedByAmount.length - 1];

  const walletVolume = uniqueWallets
    .map((w) => {
      const vol = transactions
        .filter((tx) => tx.sender === w || tx.receiver === w)
        .reduce((s, tx) => s + tx.amount, 0);
      const count = transactions.filter((tx) => tx.sender === w || tx.receiver === w).length;
      return { name: w, volume: vol, count };
    })
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 6);

  const txAmountDist = [
    { range: '<$100', count: transactions.filter((t) => t.amount < 100).length },
    { range: '$100–500', count: transactions.filter((t) => t.amount >= 100 && t.amount < 500).length },
    { range: '$500–1k', count: transactions.filter((t) => t.amount >= 500 && t.amount < 1000).length },
    { range: '$1k–5k', count: transactions.filter((t) => t.amount >= 1000 && t.amount < 5000).length },
    { range: '>$5k', count: transactions.filter((t) => t.amount >= 5000).length },
  ];

  const EmptyChart = () => (
    <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
      No data yet
    </div>
  );

  return (
    <PageTransition>
      <div className="space-y-8">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Statistics</h1>
          <p className="text-sm text-slate-400 mt-0.5">Comprehensive analytics across all transactions</p>
        </div>

        {/* Stats tiles — 4 col desktop / 2 col tablet / 1 col mobile */}
        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <StatTile icon={Activity} label="Total Transactions" value={stats?.totalTransactions ?? 0} />
            <StatTile icon={TrendingUp} label="Total Volume" value={stats?.totalTransferred ?? 0} prefix="$" decimals={2} color="#7C3AED" />
            <StatTile icon={Wallet} label="Unique Wallets" value={uniqueWallets.length} color="#FACC15" />
            <StatTile icon={Hash} label="Average Amount" value={stats?.averageAmount ?? 0} prefix="$" decimals={2} color="#22C55E" />
            <StatTile icon={ArrowUp} label="Highest Transaction" value={highestTx?.amount ?? 0} prefix="$" decimals={2} color="#EF4444" />
            <StatTile icon={ArrowDown} label="Lowest Transaction" value={lowestTx?.amount ?? 0} prefix="$" decimals={2} color="#3B82F6" />
            <StatTile icon={BarChart2} label="Avg per Wallet" value={uniqueWallets.length ? (stats?.totalTransferred ?? 0) / uniqueWallets.length : 0} prefix="$" decimals={2} color="#F97316" />
            <StatTile icon={Activity} label="Monthly Average" value={monthlyData.length ? (stats?.totalTransactions ?? 0) / Math.max(1, monthlyData.length) : 0} decimals={1} color="#EC4899" />
          </motion.div>
        )}

        {/* Charts — 2-col desktop / 1-col mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Monthly volume */}
          <GlassCard hover={false} gradient className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly Transaction Volume</h3>
              <p className="text-xs text-slate-400 mt-0.5">Total USD transferred per month</p>
            </div>
            {monthlyData.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F5D4" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00F5D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${formatAmount(v)}`, 'Volume']} />
                  <Area type="monotone" dataKey="volume" stroke="#00F5D4" strokeWidth={2} fill="url(#volumeGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* Monthly count */}
          <GlassCard hover={false} gradient className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly Transaction Count</h3>
              <p className="text-xs text-slate-400 mt-0.5">Number of transactions per month</p>
            </div>
            {monthlyData.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* Wallet volume — horizontal bar */}
          <GlassCard hover={false} gradient className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Wallet Transaction Volume</h3>
              <p className="text-xs text-slate-400 mt-0.5">Top 6 wallets by USD volume</p>
            </div>
            {walletVolume.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={walletVolume} layout="vertical" margin={{ top: 0, right: 4, left: 4, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} width={56} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${formatAmount(v)}`, 'Volume']} />
                  <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                    {walletVolume.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* Amount distribution — donut */}
          <GlassCard hover={false} gradient className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Amount Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Transactions grouped by amount range</p>
            </div>
            {transactions.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={txAmountDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="range"
                  >
                    {txAmountDist.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    iconSize={10}
                    wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </GlassCard>
        </div>

        {/* Highest transaction highlight */}
        {highestTx && (
          <GlassCard gradient hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUp size={15} className="text-[#EF4444] shrink-0" />
              <h3 className="text-sm font-semibold text-white">Highest Transaction</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="min-w-0">
                <div className="text-xs text-slate-400 mb-1">ID</div>
                <div className="text-[#00F5D4] font-mono text-xs truncate">{highestTx.id}</div>
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400 mb-1">From → To</div>
                <div className="text-slate-200 text-sm truncate">
                  {highestTx.sender} → {highestTx.receiver}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Amount</div>
                <div className="font-bold text-white">${formatAmount(highestTx.amount)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Date</div>
                <div className="text-slate-300 text-xs">{formatDate(highestTx.timestamp)}</div>
              </div>
            </div>
          </GlassCard>
        )}

      </div>
    </PageTransition>
  );
}
