import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, Settings, Menu, X, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="hidden sm:block text-xs text-slate-400 font-mono tabular-nums">
      {time.toLocaleTimeString()}
    </span>
  );
}

export default function Navbar() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/[0.06] h-16"
    >
      {/* 3-column grid: [logo] [search] [actions] */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center h-full px-4 gap-4">

        {/* Col 1 — Logo + hamburger */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#00F5D4] hover:bg-white/5 transition-colors lg:hidden shrink-0"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5D4] to-[#7C3AED] flex items-center justify-center shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            <span className="hidden sm:block font-bold text-sm gradient-text whitespace-nowrap">
              Crypto Ledger
            </span>
          </Link>
        </div>

        {/* Col 2 — Search bar (fills remaining space) */}
        <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
          <div
            className={`flex items-center gap-2 glass rounded-xl px-3 h-9 border transition-all duration-200 ${
              searchFocused ? 'border-[#00F5D4]/50' : 'border-white/10'
            }`}
          >
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search wallet, TX ID, hash..."
              className="bg-transparent text-sm text-slate-200 placeholder-slate-500 flex-1 outline-none min-w-0"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-200 shrink-0"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </form>

        {/* Col 3 — Actions (never shrink) */}
        <div className="flex items-center gap-1 shrink-0">
          <LiveClock />

          <div className="w-px h-5 bg-white/10 mx-2 hidden sm:block" />

          <button
            className="p-2 rounded-lg text-slate-400 hover:text-[#00F5D4] hover:bg-white/5 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
          </button>

          <Link
            to="/settings"
            className="p-2 rounded-lg text-slate-400 hover:text-[#00F5D4] hover:bg-white/5 transition-colors"
            aria-label="Settings"
          >
            <Settings size={17} />
          </Link>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold ml-1 shrink-0">
            CL
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
