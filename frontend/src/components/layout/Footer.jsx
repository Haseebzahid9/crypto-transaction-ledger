import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00F5D4] to-[#7C3AED] flex items-center justify-center shrink-0">
              <Zap size={11} className="text-white" />
            </div>
            <span>Crypto Transaction Ledger &copy; 2026</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-[#00F5D4] transition-colors">About</Link>
            <Link to="/api-docs" className="hover:text-[#00F5D4] transition-colors">API Docs</Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00F5D4] transition-colors flex items-center gap-1.5"
            >
              <Github size={12} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
