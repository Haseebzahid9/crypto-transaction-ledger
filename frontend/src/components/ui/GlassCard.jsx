import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient = false,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={clsx(
        'glass rounded-2xl p-6 overflow-hidden',
        glow && 'glow-accent',
        gradient && 'gradient-border',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
