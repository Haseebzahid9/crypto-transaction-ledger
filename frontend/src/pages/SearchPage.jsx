import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Eye } from 'lucide-react';
import { useSearch } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import PageTransition from '../components/ui/PageTransition';
import { formatAmount, formatDate, truncateId } from '../utils/formatters';

function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return <>{text.slice(0, idx)}<mark className="bg-[#00F5D4]/25 text-[#00F5D4] rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>;
}

export default function SearchPage() {
  const [urlParams, setUrlParams] = useSearchParams();
  const [input, setInput] = useState(urlParams.get('q') || '');
  const [query, setQuery] = useState(urlParams.get('q') || '');

  const { data: results = [], isLoading, isFetching } = useSearch(query);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(input.trim());
    setUrlParams({ q: input.trim() });
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Search</h1>
          <p className="text-sm text-slate-400">Search transactions by wallet address</p>
        </div>

        <GlassCard gradient>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 glass rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-[#00F5D4]/40 transition-colors">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Enter wallet address (e.g. Alice)"
                className="bg-transparent text-sm text-slate-200 placeholder-slate-500 flex-1 outline-none"
                autoFocus
              />
              {input && <button type="button" onClick={() => { setInput(''); setQuery(''); setUrlParams({}); }}><X size={13} className="text-slate-400 hover:text-slate-200" /></button>}
            </div>
            <Button type="submit" loading={isLoading || isFetching}>
              <Search size={14} /> Search
            </Button>
          </form>
        </GlassCard>

        {query && (
          <div className="text-sm text-slate-400">
            {isLoading ? 'Searching...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {results.length === 0 && query && !isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-slate-500">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No transactions found for "{query}"</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {results.map((tx, i) => (
                <motion.div key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <GlassCard className="!p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[#00F5D4] font-mono text-xs">{truncateId(tx.id)}</span>
                        </div>
                        <div className="text-sm text-slate-200">
                          <Highlight text={tx.sender} query={query} />
                          <span className="text-slate-500 mx-2">→</span>
                          <Highlight text={tx.receiver} query={query} />
                        </div>
                        <div className="text-xs text-slate-400">{formatDate(tx.timestamp)}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-white">${formatAmount(tx.amount)}</div>
                        <Link to={`/transactions/${tx.id}`} className="mt-1 inline-block">
                          <Button variant="ghost" size="sm" className="!px-2 !py-1"><Eye size={13} /> View</Button>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {!query && (
          <GlassCard hover={false} className="text-center py-12">
            <Search size={40} className="mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 text-sm">Enter a wallet address to search transactions</p>
            <p className="text-slate-500 text-xs mt-1">Search is case-insensitive</p>
          </GlassCard>
        )}
      </div>
    </PageTransition>
  );
}
