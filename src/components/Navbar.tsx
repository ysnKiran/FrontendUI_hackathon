import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4">
      <motion.div 
        className={`mx-auto mt-4 max-w-5xl rounded-full backdrop-blur-md border border-white/10
          ${isScrolled ? 'bg-black/30' : 'bg-transparent'}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center px-6 py-3">
          <nav className="hidden md:flex items-center justify-center w-full space-x-12">
            {['Home', 'Mission'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/90 hover:text-white font-medium text-lg relative group px-6 py-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Glow effect container */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/0 via-violet-600/0 to-indigo-600/0 
                  group-hover:from-violet-600/20 group-hover:via-violet-600/20 group-hover:to-indigo-600/20 
                  blur-md transition-all duration-500 opacity-0 group-hover:opacity-100"></span>
                
                {/* Text with glow */}
                <span className="relative group-hover:text-transparent group-hover:bg-clip-text 
                  group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-indigo-400
                  transition-all duration-500">
                  {item}
                </span>
              </motion.a>
            ))}
          </nav>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-white/90 hover:text-white transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl backdrop-blur-md bg-black/30 border border-white/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              <nav className="flex flex-col space-y-4">
                {['Home', 'Mission'].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-white/90 hover:text-white transition-colors duration-300 py-2 px-4
                      hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-indigo-600/20 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;