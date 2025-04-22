import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Cursor from './components/ui/Cursor';
import MissionSection from './components/MissionSection';
import SpaceTransition from './components/SpaceTransition';
import BlackHoleTransition from './components/BlackHoleTransition';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-dark text-white">
      <Cursor />
      <Navbar />
      <main>
        <HeroSection />
        <SpaceTransition />
        <BlackHoleTransition />
        <MissionSection />
      </main>
    </div>
  );
}

export default App;