import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-8xl font-bold gradient-text mb-4"
        >404</motion.div>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="text-2xl font-bold text-white mb-2">Page Not Found</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="text-slate-400 text-sm mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="flex gap-3 justify-center">
          <Link to="/"><Button><Home size={14} /> Dashboard</Button></Link>
          <Button variant="secondary" onClick={() => window.history.back()}><ArrowLeft size={14} /> Go Back</Button>
        </motion.div>
      </div>
    </div>
  );
}
