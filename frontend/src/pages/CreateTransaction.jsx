import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Hash, Send, RotateCcw, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCreateTransaction } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageTransition from '../components/ui/PageTransition';
import { formatAmount } from '../utils/formatters';

const schema = z
  .object({
    sender: z.string().min(1, 'Sender is required').max(50),
    receiver: z.string().min(1, 'Receiver is required').max(50),
    amount: z.string().refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      'Amount must be a positive number'
    ),
  })
  .refine((d) => d.sender.toLowerCase() !== d.receiver.toLowerCase(), {
    message: 'Sender and receiver must be different',
    path: ['receiver'],
  });

/* ─── Hash preview ──────────────────────────────────────── */
function HashPreview({ sender, receiver, amount }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const fake = Array.from(
        { length: 64 },
        () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
      setPreview(fake);
      setLoading(false);
    }, 800);
  };

  if (!sender || !receiver || !amount) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 border border-white/10"
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <Hash size={12} /> Hash Preview
        </span>
        <Button variant="ghost" size="sm" onClick={generate} loading={loading} className="!py-1 shrink-0">
          {loading ? 'Generating…' : 'Generate'}
        </Button>
      </div>
      <AnimatePresence>
        {preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs text-[#00F5D4] break-all leading-relaxed"
          >
            {preview}
          </motion.div>
        ) : (
          <div className="text-xs text-slate-500 text-center py-1">
            Click "Generate" to see a sample hash
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Success animation ─────────────────────────────────── */
function SuccessAnimation({ tx }) {
  return (
    <div className="flex flex-col items-center py-8 text-center gap-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="w-16 h-16 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center"
      >
        <CheckCircle2 size={32} className="text-[#22C55E]" />
      </motion.div>
      <div>
        <h3 className="font-bold text-white text-lg">Transaction Created!</h3>
        <p className="text-sm text-slate-400 mt-0.5">Hash generated and recorded on ledger.</p>
      </div>
      {tx && (
        <div className="w-full glass rounded-xl p-4 text-left space-y-2">
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-slate-400 shrink-0">ID</span>
            <span className="text-[#00F5D4] font-mono truncate">{tx.id}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-slate-400 shrink-0">Hash</span>
            <span className="text-slate-300 font-mono truncate">{tx.hash?.slice(0, 24)}…</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function CreateTransaction() {
  const navigate = useNavigate();
  const createMutation = useCreateTransaction();
  const [success, setSuccess] = useState(false);
  const [createdTx, setCreatedTx] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [sender, receiver, amount] = watch(['sender', 'receiver', 'amount']);

  const onSubmit = async (data) => {
    const tx = await createMutation.mutateAsync({
      sender: data.sender,
      receiver: data.receiver,
      amount: Number(data.amount),
    });
    setCreatedTx(tx);
    setSuccess(true);
    setTimeout(() => navigate(`/transactions/${tx.id}`), 2400);
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Create Transaction</h1>
          <p className="text-sm text-slate-400 mt-0.5">Record a new crypto transaction on the ledger</p>
        </div>

        {/* Form card */}
        <GlassCard gradient hover={false}>
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SuccessAnimation tx={createdTx} />
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Form header */}
                <div className="flex items-center gap-3 pb-2 border-b border-white/[0.06]">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F5D4]/20 to-[#7C3AED]/20 flex items-center justify-center shrink-0">
                    <Zap size={15} className="text-[#00F5D4]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">New Transaction</div>
                    <div className="text-xs text-slate-400">All fields required</div>
                  </div>
                </div>

                {/* Wallet inputs */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Sender Wallet"
                    placeholder="e.g. Alice"
                    error={errors.sender?.message}
                    {...register('sender')}
                  />
                  <Input
                    label="Receiver Wallet"
                    placeholder="e.g. Bob"
                    error={errors.receiver?.message}
                    {...register('receiver')}
                  />
                </div>

                {/* Amount */}
                <Input
                  label="Amount (USD)"
                  placeholder="e.g. 250.00"
                  type="number"
                  step="0.01"
                  min="0.01"
                  error={errors.amount?.message}
                  {...register('amount')}
                />

                {/* Transfer preview */}
                {sender && receiver && amount && Number(amount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="text-center flex-1 min-w-0">
                      <div className="text-xs text-slate-400 mb-1">From</div>
                      <div className="font-semibold text-white text-sm truncate">{sender}</div>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <ArrowRight size={18} className="text-[#00F5D4]" />
                      <span className="text-xs font-bold text-[#00F5D4]">
                        ${formatAmount(Number(amount))}
                      </span>
                    </div>
                    <div className="text-center flex-1 min-w-0">
                      <div className="text-xs text-slate-400 mb-1">To</div>
                      <div className="font-semibold text-white text-sm truncate">{receiver}</div>
                    </div>
                  </motion.div>
                )}

                {/* Hash preview */}
                <HashPreview sender={sender} receiver={receiver} amount={amount} />

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => reset()}
                  >
                    <RotateCcw size={14} /> Reset
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={createMutation.isPending}
                  >
                    <Send size={14} /> Create Transaction
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Info box */}
        <div className="glass rounded-2xl p-4 border border-white/[0.06] space-y-2">
          {[
            { icon: Hash, color: '#00F5D4', text: 'A unique SHA-256 hash is automatically generated for each transaction.' },
            { icon: Zap, color: '#7C3AED', text: 'Transaction IDs are prefixed with TX- followed by a UUID v4.' },
            { icon: Send, color: '#22C55E', text: 'Sender and receiver must be different wallet addresses.' },
          ].map(({ icon: Icon, color, text }) => (
            <div key={text} className="flex items-start gap-2 text-xs text-slate-400">
              <Icon size={12} style={{ color }} className="mt-0.5 shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
