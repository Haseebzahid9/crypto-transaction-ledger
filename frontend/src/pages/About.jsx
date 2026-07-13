import { motion } from 'framer-motion';
import { Zap, Code2, Database, Layers, Shield, ExternalLink } from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa';
import GlassCard from '../components/ui/GlassCard';
import PageTransition from '../components/ui/PageTransition';

const stack = [
  { label: 'React 19', desc: 'UI framework', color: '#61DAFB' },
  { label: 'Vite', desc: 'Build tool', color: '#FACC15' },
  { label: 'Tailwind CSS', desc: 'Styling', color: '#38BDF8' },
  { label: 'Framer Motion', desc: 'Animations', color: '#FF4785' },
  { label: 'TanStack Query', desc: 'Data fetching', color: '#EF4444' },
  { label: 'Recharts', desc: 'Charts', color: '#22C55E' },
  { label: 'Express.js', desc: 'Backend API', color: '#7C3AED' },
  { label: 'Node.js', desc: 'Runtime', color: '#8DC63F' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function About() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center py-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00F5D4] to-[#7C3AED] flex items-center justify-center mx-auto mb-4">
            <Zap size={36} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-3xl font-bold mb-2">
            <span className="gradient-text">Crypto Transaction Ledger</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-slate-400 text-sm max-w-md mx-auto">
            A premium blockchain ledger dashboard for tracking and verifying cryptocurrency transactions with hash integrity.
          </motion.p>
        </div>

        <GlassCard gradient hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={16} className="text-[#00F5D4]" />
            <h3 className="font-semibold text-white">Technology Stack</h3>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stack.map(s => (
              <motion.div key={s.label} variants={item}
                className="glass rounded-xl p-3 text-center hover:border-white/15 border border-transparent transition-colors">
                <div className="font-semibold text-sm" style={{ color: s.color }}>{s.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </GlassCard>

        <div className="grid sm:grid-cols-2 gap-4">
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-3"><Layers size={15} className="text-[#7C3AED]" /><h3 className="font-semibold text-white text-sm">Architecture</h3></div>
            <ul className="text-xs text-slate-400 space-y-2">
              {['REST API backend with Express.js', 'JSON flat-file database storage', 'SHA-256 hash generation for each TX', 'UUID-based transaction IDs (TX- prefix)', 'React 19 SPA with React Router', 'TanStack Query for server state'].map(a => (
                <li key={a} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#7C3AED] shrink-0" />{a}</li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-3"><Shield size={15} className="text-[#22C55E]" /><h3 className="font-semibold text-white text-sm">Features</h3></div>
            <ul className="text-xs text-slate-400 space-y-2">
              {['Create & delete transactions', 'Hash integrity verification', 'Wallet balance tracking', 'Real-time statistics & charts', 'JSON / CSV export', 'Global search by wallet address'].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#22C55E] shrink-0" />{f}</li>
              ))}
            </ul>
          </GlassCard>
        </div>

        <GlassCard gradient hover={false} className="text-center">
          <Database size={20} className="mx-auto text-[#FACC15] mb-2" />
          <h3 className="font-semibold text-white mb-1">API Endpoints</h3>
          <div className="text-xs font-mono text-slate-400 space-y-1">
            {['GET /transactions', 'POST /transactions', 'DELETE /transactions/:id', 'GET /transactions/:id/verify', 'GET /wallet/:address', 'GET /stats', 'GET /search?wallet='].map(e => (
              <div key={e} className="glass rounded-lg px-3 py-1.5 text-left">{e}</div>
            ))}
          </div>
        </GlassCard>

        <div className="text-center text-xs text-slate-500 pb-4">
          Built with React 19, Express.js, and Tailwind CSS.{' '}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#00F5D4] hover:underline inline-flex items-center gap-1">
            <Github size={11} /> View on GitHub
          </a>
        </div>
      </div>
    </PageTransition>
  );
}
