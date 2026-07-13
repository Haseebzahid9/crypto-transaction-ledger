import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowLeft, Copy, ShieldCheck, Trash2, Hash,
  ArrowRight, Clock, CheckCircle2, XCircle, Loader2,
} from 'lucide-react';
import { useTransaction, useDeleteTransaction, useVerifyTransaction } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import PageTransition from '../components/ui/PageTransition';
import { formatAmount, formatDate, copyToClipboard } from '../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

/* ─── Copy button ───────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success('Copied!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Copy failed');
    }
  };
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1 text-slate-400 hover:text-[#00F5D4] transition-colors text-xs shrink-0"
    >
      <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

/* ─── Hash visualization ────────────────────────────────── */
function HashViz({ hash }) {
  if (!hash) return null;
  const chunks = hash.match(/.{1,8}/g) || [];
  return (
    <div className="flex flex-wrap gap-1.5 py-1">
      {chunks.map((chunk, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.025 }}
          className="font-mono text-[10px] px-2 py-1 rounded-md"
          style={{
            background: `hsl(${(i * 37) % 360}, 60%, 12%)`,
            color: `hsl(${(i * 37) % 360}, 70%, 65%)`,
            border: `1px solid hsl(${(i * 37) % 360}, 50%, 22%)`,
          }}
        >
          {chunk}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tx, isLoading, error } = useTransaction(id);
  const deleteMutation = useDeleteTransaction();
  const verifyMutation = useVerifyTransaction();
  const [deleteModal, setDeleteModal] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await verifyMutation.mutateAsync(id);
      setVerifyResult(result.verified);
      toast[result.verified ? 'success' : 'error'](
        result.verified ? 'Transaction verified!' : 'Verification failed'
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    navigate('/transactions');
  };

  /* Loading */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="text-[#00F5D4] animate-spin" />
      </div>
    );
  }

  /* Not found */
  if (error || !tx) {
    return (
      <div className="text-center py-20 text-slate-400">
        <XCircle size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Transaction not found.</p>
        <Link to="/transactions">
          <Button variant="secondary" size="sm" className="mt-4">
            <ArrowLeft size={14} /> Back
          </Button>
        </Link>
      </div>
    );
  }

  const fields = [
    { label: 'Transaction ID', value: tx.id, mono: true, copy: true },
    { label: 'Sender', value: tx.sender },
    { label: 'Receiver', value: tx.receiver },
    { label: 'Amount', value: `$${formatAmount(tx.amount)}`, bold: true, color: '#00F5D4' },
    { label: 'Timestamp', value: formatDate(tx.timestamp) },
    { label: 'Hash', value: tx.hash, mono: true, copy: true },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/transactions">
              <Button variant="ghost" size="sm" className="shrink-0">
                <ArrowLeft size={14} /> Back
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white">Transaction Details</h1>
              <p className="text-xs text-slate-400 font-mono truncate">{tx.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="success" size="sm" loading={verifying} onClick={handleVerify}>
              <ShieldCheck size={13} /> Verify
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
              <Trash2 size={13} /> Delete
            </Button>
          </div>
        </div>

        {/* Main grid: details (2/3) + sidebar (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left — details */}
          <div className="lg:col-span-2 space-y-5">

            {/* Field table */}
            <GlassCard gradient hover={false} className="flex flex-col gap-0">
              {fields.map((f) => (
                <div
                  key={f.label}
                  className="flex items-start justify-between gap-6 py-3 border-b border-white/[0.05] last:border-0"
                >
                  <span className="text-xs text-slate-400 w-28 shrink-0 pt-0.5">{f.label}</span>
                  <div className="flex-1 min-w-0 text-right flex flex-col items-end gap-1">
                    <span
                      className={`text-sm break-all ${f.mono ? 'font-mono' : ''} ${f.bold ? 'font-semibold' : ''}`}
                      style={f.color ? { color: f.color } : { color: '#e2e8f0' }}
                    >
                      {f.value}
                    </span>
                    {f.copy && <CopyButton text={f.value} />}
                  </div>
                </div>
              ))}
            </GlassCard>

            {/* Hash visualization */}
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <Hash size={14} className="text-[#00F5D4]" />
                <span className="text-sm font-medium text-white">Hash Visualization</span>
              </div>
              <HashViz hash={tx.hash} />
            </GlassCard>

            {/* Verify result */}
            <AnimatePresence>
              {verifyResult !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-2xl p-4 border flex items-center gap-3 ${
                    verifyResult
                      ? 'bg-[#22C55E]/10 border-[#22C55E]/30'
                      : 'bg-[#EF4444]/10 border-[#EF4444]/30'
                  }`}
                >
                  {verifyResult
                    ? <CheckCircle2 size={20} className="text-[#22C55E] shrink-0" />
                    : <XCircle size={20} className="text-[#EF4444] shrink-0" />}
                  <div>
                    <div className={`font-semibold text-sm ${verifyResult ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {verifyResult ? 'Verified' : 'Verification Failed'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {verifyResult
                        ? 'Hash integrity confirmed. Transaction is authentic.'
                        : 'Hash does not match transaction data.'}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — sidebar */}
          <div className="space-y-5">

            {/* Transfer summary */}
            <GlassCard hover={false} className="flex flex-col gap-3">
              <div className="text-sm font-medium text-white flex items-center gap-2">
                <ArrowRight size={14} className="text-[#00F5D4]" /> Transfer Summary
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">From</div>
                <div className="font-semibold text-white truncate">{tx.sender}</div>
              </div>
              <div className="text-center text-[#00F5D4] text-xl leading-none">↓</div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">To</div>
                <div className="font-semibold text-white truncate">{tx.receiver}</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">Amount</div>
                <div className="text-xl font-bold gradient-text tabular-nums">
                  ${formatAmount(tx.amount)}
                </div>
              </div>
            </GlassCard>

            {/* QR Code */}
            <GlassCard hover={false} className="flex flex-col gap-3 items-center text-center">
              <div className="text-sm font-medium text-white self-start">QR Code</div>
              <div className="bg-white p-3 rounded-xl">
                <QRCodeSVG value={tx.id} size={130} bgColor="#ffffff" fgColor="#050816" />
              </div>
              <p className="text-xs text-slate-500">Scan to get Transaction ID</p>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {deleteModal && (
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
              <p className="text-sm text-slate-400 mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setDeleteModal(false)}>
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
