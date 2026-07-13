import clsx from 'clsx';

const colors = {
  success: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
  danger: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
  warning: 'bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30',
  accent: 'bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30',
  purple: 'bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/30',
  default: 'bg-white/10 text-slate-300 border border-white/10',
};

export default function Badge({ children, color = 'default', className = '' }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium', colors[color], className)}>
      {children}
    </span>
  );
}
