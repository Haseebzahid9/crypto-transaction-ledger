import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AnimatedBackground from '../ui/AnimatedBackground';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#050816]">
      <AnimatedBackground />

      {/* Fixed top navbar — full width, z-50 */}
      <Navbar />

      {/* Fixed left sidebar — starts below navbar */}
      <Sidebar />

      {/* Main content — offset right of sidebar, offset below navbar */}
      <div className="lg:pl-64 pt-16 flex flex-col min-h-screen relative z-10">
        <main className="flex-1 w-full">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
