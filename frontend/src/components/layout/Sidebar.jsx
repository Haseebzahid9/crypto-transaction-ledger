import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, List, PlusCircle, Wallet, BarChart2,
  ShieldCheck, Search, FileCode, Settings, Info, X, Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/transactions', icon: List, label: 'Transactions' },
  { to: '/create', icon: PlusCircle, label: 'Create Transaction' },
  { to: '/wallets', icon: Wallet, label: 'Wallets' },
  { to: '/statistics', icon: BarChart2, label: 'Statistics' },
  { to: '/verify', icon: ShieldCheck, label: 'Verification' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/api-docs', icon: FileCode, label: 'API Docs' },
  null,
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/about', icon: Info, label: 'About' },
];

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
          isActive
            ? 'bg-gradient-to-r from-[#00F5D4]/15 to-[#7C3AED]/10 text-[#00F5D4] border border-[#00F5D4]/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={17}
            className={clsx('shrink-0 transition-transform duration-200', !isActive && 'group-hover:scale-110')}
          />
          <span className="truncate">{item.label}</span>
          {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00F5D4] shrink-0" />}
        </>
      )}
    </NavLink>
  );
}

function NavContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Mobile-only header with logo + close */}
      {onClose && (
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06] shrink-0 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5D4] to-[#7C3AED] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold gradient-text">Crypto Ledger</div>
              <div className="text-[10px] text-slate-500">Blockchain Dashboard</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
        {navItems.map((item, i) =>
          item === null
            ? <div key={`sep-${i}`} className="my-2 border-t border-white/[0.06]" />
            : <NavItem key={item.to} item={item} />
        )}
      </nav>

      {/* Footer user chip */}
      <div className="px-3 pb-4 pt-3 shrink-0 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl glass">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold shrink-0">
            CL
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-200 truncate">Crypto Ledger</div>
            <div className="text-[10px] text-slate-500">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar — slides in from left, full height */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: -264 }}
            animate={{ x: 0 }}
            exit={{ x: -264 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-64 z-50 glass-strong border-r border-white/[0.06] lg:hidden"
          >
            <NavContent onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar — fixed, starts below navbar (top-16) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 glass-strong border-r border-white/[0.06] z-40">
        <NavContent />
      </aside>
    </>
  );
}
