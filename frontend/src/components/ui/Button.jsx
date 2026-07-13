import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  primary: 'bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] text-white font-semibold hover:opacity-90',
  secondary: 'glass border border-[rgba(255,255,255,0.1)] text-slate-200 hover:border-[#00F5D4]/40 hover:text-[#00F5D4]',
  danger: 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20',
  ghost: 'text-slate-400 hover:text-[#00F5D4] hover:bg-white/5',
  success: 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
};

export default function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      disabled={loading || props.disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </motion.button>
  );
}
