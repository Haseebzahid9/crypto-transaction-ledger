import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/ui/PageTransition';
import { copyToClipboard } from '../utils/formatters';
import toast from 'react-hot-toast';

const endpoints = [
  { method: 'GET', path: '/transactions', desc: 'Get all transactions sorted newest-first', response: '{ "success": true, "transactions": [...] }' },
  { method: 'POST', path: '/transactions', desc: 'Create a new transaction', body: '{ "sender": "Alice", "receiver": "Bob", "amount": 120 }', response: '{ "success": true, "transaction": { ...tx } }' },
  { method: 'GET', path: '/transactions/:id', desc: 'Get a single transaction by ID', response: '{ "success": true, "transaction": { ...tx } }' },
  { method: 'GET', path: '/transactions/:id/verify', desc: 'Verify hash integrity of a transaction', response: '{ "success": true, "verified": true }' },
  { method: 'DELETE', path: '/transactions/:id', desc: 'Delete a transaction', response: '{ "success": true, "message": "Transaction deleted successfully" }' },
  { method: 'GET', path: '/wallet/:address', desc: 'Get wallet balance and stats', response: '{ "success": true, "wallet": { "wallet": "Alice", "received": 500, "sent": 150, "balance": 350 } }' },
  { method: 'GET', path: '/stats', desc: 'Get aggregate statistics', response: '{ "success": true, "stats": { "totalTransactions": 10, "totalTransferred": 1250, ... } }' },
  { method: 'GET', path: '/search?wallet=Alice', desc: 'Search transactions by wallet (case-insensitive)', response: '{ "success": true, "transactions": [...] }' },
];

const methodColors = { GET: 'accent', POST: 'success', DELETE: 'danger', PUT: 'warning' };

function EndpointCard({ ep }) {
  const [open, setOpen] = useState(false);

  const copySnippet = async () => {
    const snippet = `curl http://localhost:3000${ep.path}`;
    const ok = await copyToClipboard(snippet);
    if (ok) toast.success('Copied!');
  };

  return (
    <GlassCard hover={false} className="!p-0 overflow-hidden">
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpen(o => !o)}>
        <Badge color={methodColors[ep.method] || 'default'} className="shrink-0 font-mono w-16 justify-center">{ep.method}</Badge>
        <code className="text-sm text-slate-200 flex-1 font-mono">{ep.path}</code>
        <span className="text-xs text-slate-400 hidden sm:block mr-2">{ep.desc}</span>
        {open ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-3">
              <p className="text-xs text-slate-400">{ep.desc}</p>
              {ep.body && (
                <div>
                  <div className="text-xs text-slate-500 mb-1">Request Body</div>
                  <pre className="glass rounded-lg p-3 text-xs text-[#00F5D4] font-mono overflow-x-auto">{ep.body}</pre>
                </div>
              )}
              <div>
                <div className="text-xs text-slate-500 mb-1">Response</div>
                <pre className="glass rounded-lg p-3 text-xs text-slate-300 font-mono overflow-x-auto">{ep.response}</pre>
              </div>
              <button onClick={copySnippet} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#00F5D4] transition-colors">
                <Copy size={11} /> Copy curl
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

export default function ApiDocs() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">API Documentation</h1>
          <p className="text-sm text-slate-400">Base URL: <code className="text-[#00F5D4] font-mono">http://localhost:3000</code></p>
        </div>

        <GlassCard gradient hover={false} className="!p-4">
          <div className="flex gap-4 flex-wrap text-xs">
            {[['GET', 'accent'], ['POST', 'success'], ['DELETE', 'danger']].map(([m, c]) => (
              <div key={m} className="flex items-center gap-2"><Badge color={c} className="font-mono w-14 justify-center">{m}</Badge><span className="text-slate-400">{m === 'GET' ? 'Read data' : m === 'POST' ? 'Create data' : 'Remove data'}</span></div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-3">
          {endpoints.map((ep, i) => <EndpointCard key={i} ep={ep} />)}
        </div>

        <GlassCard hover={false} className="text-xs text-slate-500 space-y-1.5">
          <div>All responses include <code className="text-[#00F5D4]">"success": true/false</code> field.</div>
          <div>Error responses include <code className="text-[#00F5D4]">"message"</code> with a human-readable description.</div>
          <div>No authentication required — all endpoints are public.</div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
