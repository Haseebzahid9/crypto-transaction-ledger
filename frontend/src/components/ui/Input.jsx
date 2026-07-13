import clsx from 'clsx';
import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, icon, className = '', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          ref={ref}
          className={clsx(
            'w-full glass rounded-xl border bg-transparent px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500',
            'focus:outline-none focus:border-[#00F5D4]/50 focus:ring-1 focus:ring-[#00F5D4]/20 transition-all duration-200',
            error ? 'border-[#EF4444]/50' : 'border-white/10',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#EF4444]">{error}</p>}
    </div>
  );
});

export default Input;
