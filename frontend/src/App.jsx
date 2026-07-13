import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import CreateTransaction from './pages/CreateTransaction';
import TransactionDetails from './pages/TransactionDetails';
import Wallets from './pages/Wallets';
import Statistics from './pages/Statistics';
import Verification from './pages/Verification';
import SearchPage from './pages/SearchPage';
import Settings from './pages/Settings';
import About from './pages/About';
import ApiDocs from './pages/ApiDocs';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0E1323',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontSize: 13,
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#0E1323' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#0E1323' } },
        }}
      />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<TransactionDetails />} />
            <Route path="/create" element={<CreateTransaction />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
}
