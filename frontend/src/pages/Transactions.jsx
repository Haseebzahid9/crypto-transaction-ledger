import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Trash2, Eye, ShieldCheck, Copy,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/ui/PageTransition';
import { SkeletonTable } from '../components/ui/Skeleton';
import Tooltip from '../components/ui/Tooltip';
import { formatAmount, formatDate, truncateHash, truncateId, copyToClipboard } from '../utils/formatters';
import toast from 'react-hot-toast';
import { transactionApi } from '../services/api';

const PAGE_SIZE = 10;

function SortIcon({ col, sortKey, dir }) {
  if (col !== sortKey) return <ChevronUp size={11} className="opacity-20" />;
  return dir === 'asc'
    ? <ChevronUp size={11} className="text-[#00F5D4]" />
    : <ChevronDown size={11} className="text-[#00F5D4]" />;
}

/* highlight matched text */
function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#00F5D4]/25 text-[#00F5D4] rounded px-0.5 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function Transactions() {
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteMutation = useDeleteTransaction();

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  /* ── filter ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (tx) =>
        tx.id.toLowerCase().includes(q) ||
        tx.sender.toLowerCase().includes(q) ||
        tx.receiver.toLowerCase().includes(q) ||
        tx.hash.toLowerCase().includes(q) ||
        String(tx.amount).includes(q)
    );
  }, [transactions, search]);

  /* ── sort ── */
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === 'amount') { av = Number(av); bv = Number(bv); }
      if (sortKey === 'timestamp') { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleCopy = async (text) => {
    const ok = await copyToClipboard(text);
    toast[ok ? 'success' : 'error'](ok ? 'Copied!' : 'Copy failed');
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transactions.json';
    a.click();
  };

  const exportCSV = () => {
    const header = 'id,sender,receiver,amount,timestamp,hash\n';
    const rows = transactions
      .map((t) => `"${t.id}","${t.sender}","${t.receiver}",${t.amount},"${t.timestamp}","${t.hash}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transactions.csv';
    a.click();
  };

  const cols = [
    { key: 'id', label: 'TX ID', width: 'w-[120px]' },
    { key: 'sender', label: 'Sender', width: 'w-[110px]' },
    { key: 'receiver', label: 'Receiver', width: 'w-[110px]' },
    { key: 'amount', label: 'Amount', width: 'w-[100px]' },
    { key: 'hash', label: 'Hash', width: 'w-[180px]' },
    { key: 'timestamp', label: 'Date', width: 'w-[160px]' },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* ── Page header ───────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Transactions</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {transactions.length} total records
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={exportJSON}>
              <Download size={13} /> JSON
            </Button>
            <Button variant="secondary" size="sm" onClick={exportCSV}>
              <Download size={13} /> CSV
            </Button>
          </div>
        </div>

        {/* ── Table card ────────────────────────── */}
        <GlassCard hover={false} className="flex flex-col gap-5">

          {/* Search */}
          <div className="flex items-center gap-2 glass rounded-xl px-3 h-10 border border-white/10 focus-within:border-[#00F5D4]/40 transition-colors">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by ID, wallet, hash, amount…"
              className="bg-transparent text-sm text-slate-200 placeholder-slate-500 flex-1 outline-none min-w-0"
            />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1); }}>
                <X size={13} className="text-slate-400 hover:text-slate-200" />
              </button>
            )}
          </div>

          {isLoading ? (
            <SkeletonTable rows={8} />
          ) : (
            <>
              {/* Horizontally scrollable table */}
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm min-w-[780px]">
                  <thead>
                    <tr className="text-left border-b border-white/[0.06]">
                      {cols.map((c) => (
                        <th
                          key={c.key}
                          onClick={() => handleSort(c.key)}
                          className={`pb-3 pr-4 last:pr-0 text-xs font-medium text-slate-500 whitespace-nowrap cursor-pointer hover:text-slate-300 select-none ${c.width}`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {c.label}
                            <SortIcon col={c.key} sortKey={sortKey} dir={sortDir} />
                          </span>
                        </th>
                      ))}
                      <th className="pb-3 text-xs font-medium text-slate-500 text-right whitespace-nowrap w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginated.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-14 text-slate-500 text-sm">
                            No transactions found.
                          </td>
                        </tr>
                      ) : (
                        paginated.map((tx, i) => (
                          <motion.tr
                            key={tx.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                          >
                            {/* TX ID */}
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  to={`/transactions/${tx.id}`}
                                  className="text-[#00F5D4] hover:underline font-mono text-xs whitespace-nowrap"
                                >
                                  <Highlight text={truncateId(tx.id, 8, 4)} query={search} />
                                </Link>
                                <Tooltip content="Copy ID">
                                  <button
                                    onClick={() => handleCopy(tx.id)}
                                    className="text-slate-500 hover:text-slate-300 shrink-0"
                                  >
                                    <Copy size={11} />
                                  </button>
                                </Tooltip>
                              </div>
                            </td>
                            {/* Sender */}
                            <td className="py-3 pr-4 text-slate-200 max-w-[110px]">
                              <span className="block truncate">
                                <Highlight text={tx.sender} query={search} />
                              </span>
                            </td>
                            {/* Receiver */}
                            <td className="py-3 pr-4 text-slate-200 max-w-[110px]">
                              <span className="block truncate">
                                <Highlight text={tx.receiver} query={search} />
                              </span>
                            </td>
                            {/* Amount */}
                            <td className="py-3 pr-4 font-semibold text-white whitespace-nowrap">
                              ${formatAmount(tx.amount)}
                            </td>
                            {/* Hash */}
                            <td className="py-3 pr-4 max-w-[180px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs text-slate-400 block truncate">
                                  <Highlight text={truncateHash(tx.hash)} query={search} />
                                </span>
                                <Tooltip content="Copy Hash">
                                  <button
                                    onClick={() => handleCopy(tx.hash)}
                                    className="text-slate-500 hover:text-slate-300 shrink-0"
                                  >
                                    <Copy size={11} />
                                  </button>
                                </Tooltip>
                              </div>
                            </td>
                            {/* Date */}
                            <td className="py-3 pr-4 text-xs text-slate-400 whitespace-nowrap">
                              {formatDate(tx.timestamp)}
                            </td>
                            {/* Actions */}
                            <td className="py-3">
                              <div className="flex items-center justify-end gap-0.5">
                                <Tooltip content="View">
                                  <Link to={`/transactions/${tx.id}`}>
                                    <Button variant="ghost" size="sm" className="!px-2 !py-1.5">
                                      <Eye size={13} />
                                    </Button>
                                  </Link>
                                </Tooltip>
                                <Tooltip content="Verify">
                                  <Link to={`/verify?id=${tx.id}`}>
                                    <Button variant="ghost" size="sm" className="!px-2 !py-1.5 hover:!text-[#22C55E]">
                                      <ShieldCheck size={13} />
                                    </Button>
                                  </Link>
                                </Tooltip>
                                <Tooltip content="Delete">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="!px-2 !py-1.5 hover:!text-[#EF4444]"
                                    onClick={() => setDeleteId(tx.id)}
                                  >
                                    <Trash2 size={13} />
                                  </Button>
                                </Tooltip>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
                <span className="text-xs text-slate-400 shrink-0">
                  {sorted.length === 0
                    ? 'No results'
                    : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, sorted.length)} of ${sorted.length}`}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!px-2"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - page) <= 2)
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                          p === page
                            ? 'bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!px-2"
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={page === pageCount}
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </GlassCard>
      </div>

      {/* ── Delete confirmation modal ─────────────── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="font-semibold text-white mb-2">Delete Transaction?</h3>
              <p className="text-sm text-slate-400 mb-4">
                This action cannot be undone.
              </p>
              <p className="font-mono text-xs text-[#EF4444] bg-[#EF4444]/10 px-3 py-2 rounded-lg mb-5 break-all">
                {deleteId}
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  loading={deleteMutation.isPending}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
