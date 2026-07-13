import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute rounded-full opacity-20 blur-3xl"
        style={{ width: 600, height: 600, background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)', top: '-10%', left: '-10%' }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full opacity-15 blur-3xl"
        style={{ width: 500, height: 500, background: 'radial-gradient(circle, #00F5D4 0%, transparent 70%)', bottom: '10%', right: '-5%' }}
        animate={{ x: [0, -50, 0], y: [0, -60, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full opacity-10 blur-3xl"
        style={{ width: 400, height: 400, background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)', top: '50%', left: '40%' }}
        animate={{ x: [0, 30, -30, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
