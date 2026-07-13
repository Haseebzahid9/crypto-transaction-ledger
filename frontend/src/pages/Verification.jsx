import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldX, Search, Hash, Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { transactionApi } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageTransition from '../components/ui/PageTransition';
import { formatDate, formatAmount } from '../utils/formatters';

export default function Verification() {
  const [params] = useSearchParams();
  const [txId, setTxId] = useState(params.get('id') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);

  const verify = async () => {
    if (!txId.trim()) { setError('Please enter a transaction ID'); return; }
    setError(''); setResult(null); setLoading(true); setStep(0);

    try {
      await new Promise(r => setTimeout(r, 400));
      setStep(1);
      const tx = await transactionApi.getById(txId.trim());
      await new Promise(r => setTimeout(r, 500));
      setStep(2);
      const verifyRes = await transactionApi.verify(txId.trim());
      await new Promise(r => setTimeout(r, 300));
      setStep(3);
      setResult({ tx: tx, verified: verifyRes.verified });
    } catch (e) {
      setError(e.message || 'Transaction not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get('id')) verify();
  }, []);

  const steps = [
    'Looking up transaction...',
    'Fetching transaction data...',
    'Recomputing SHA-256 hash...',
    'Comparing hash values...',
  ];

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Verification</h1>
          <p className="text-sm text-slate-400">Verify transaction hash integrity on the blockchain ledger</p>
        </div>

        <GlassCard gradient>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                <ShieldCheck size={16} className="text-[#22C55E]" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Hash Integrity Check</div>
                <div className="text-xs text-slate-400">Enter a Transaction ID to verify</div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  value={txId}
                  onChange={e => { setTxId(e.target.value); setError(''); setResult(null); }}
                  onKeyDown={e => e.key === 'Enter' && verify()}
                  placeholder="TX-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full glass rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00F5D4]/50 transition-colors font-mono"
                />
              </div>
              <Button onClick={verify} loading={loading} className="shrink-0">
                <ShieldCheck size={14} /> Verify
              </Button>
            </div>
            {error && <p className="text-xs text-[#EF4444]">{error}</p>}
          </div>
        </GlassCard>

        {/* Loading steps */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GlassCard hover={false}>
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 size={18} className="text-[#00F5D4] animate-spin" />
                  <span className="text-sm font-medium text-white">Verifying Transaction...</span>
                </div>
                <div className="space-y-2.5">
                  {steps.map((s, i) => (
                    <div key={i} className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${i < step ? 'bg-[#22C55E]/20 text-[#22C55E]' : i === step ? 'bg-[#00F5D4]/20 text-[#00F5D4]' : 'bg-white/5 text-slate-500'}`}>
                        {i < step ? <CheckCircle2 size={12} /> : i === step ? <Loader2 size={11} className="animate-spin" /> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      <span className={i === step ? 'text-[#00F5D4]' : i < step ? 'text-[#22C55E]' : 'text-slate-500'}>{s}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className={`rounded-2xl p-6 border text-center ${result.verified ? 'bg-[#22C55E]/10 border-[#22C55E]/30' : 'bg-[#EF4444]/10 border-[#EF4444]/30'}`}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                  {result.verified
                    ? <CheckCircle2 size={48} className="mx-auto text-[#22C55E] mb-3" />
                    : <XCircle size={48} className="mx-auto text-[#EF4444] mb-3" />}
                </motion.div>
                <h3 className={`text-xl font-bold mb-1 ${result.verified ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {result.verified ? 'Transaction Verified' : 'Verification Failed'}
                </h3>
                <p className="text-sm text-slate-400">
                  {result.verified
                    ? 'The hash matches. This transaction is authentic and unmodified.'
                    : 'Hash mismatch detected. Transaction data may have been altered.'}
                </p>
              </div>

              <GlassCard hover={false}>
                <div className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <Hash size={14} className="text-[#00F5D4]" /> Transaction Data
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Transaction ID', value: result.tx.id, mono: true },
                    { label: 'Sender', value: result.tx.sender },
                    { label: 'Receiver', value: result.tx.receiver },
                    { label: 'Amount', value: `$${formatAmount(result.tx.amount)}`, bold: true },
                    { label: 'Timestamp', value: formatDate(result.tx.timestamp) },
                    { label: 'Hash', value: result.tx.hash, mono: true },
                  ].map(f => (
                    <div key={f.label} className="flex justify-between gap-4 py-1.5 border-b border-white/[0.05] last:border-0">
                      <span className="text-slate-400 text-xs shrink-0">{f.label}</span>
                      <span className={`text-right break-all text-xs ${f.mono ? 'font-mono text-[#00F5D4]' : ''} ${f.bold ? 'font-semibold text-white' : 'text-slate-200'}`}>
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to={`/transactions/${result.tx.id}`}>
                    <Button variant="secondary" size="sm" className="w-full">View Full Details</Button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="glass rounded-2xl p-4 border border-white/[0.06] text-xs text-slate-500 space-y-1.5">
          <div className="flex items-center gap-2"><Hash size={11} className="text-[#00F5D4]" /> Verification recomputes the SHA-256 hash from transaction data and compares against the stored value.</div>
          <div className="flex items-center gap-2"><ShieldCheck size={11} className="text-[#22C55E]" /> A match confirms the record has not been tampered with.</div>
        </div>
      </div>
    </PageTransition>
  );
}
