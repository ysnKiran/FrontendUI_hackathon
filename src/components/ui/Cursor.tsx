import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseClick = () => {
      // Pulse animation on click
      setIsHovering(true);
      setTimeout(() => setIsHovering(false), 500);
    };

    const checkHoverable = () => {
      const hoverable = document.querySelectorAll('a, button, [role="button"]');
      const mouseX = position.x;
      const mouseY = position.y;

      let isOverHoverable = false;

      hoverable.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom
        ) {
          isOverHoverable = true;
        }
      });

      setIsHovering(isOverHoverable);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleMouseClick);
    
    const checkInterval = setInterval(checkHoverable, 100);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleMouseClick);
      clearInterval(checkInterval);
    };
  }, [position.x, position.y, isVisible]);

  if (typeof window === 'undefined' || !isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-50 rounded-full"
        style={{
          x: position.x - 12,
          y: position.y - 12,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: 0.5,
          mixBlendMode: isHovering ? 'difference' : 'normal',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <div 
          className={`w-full h-full rounded-full bg-white mix-blend-difference
            ${isHovering ? 'opacity-75' : 'opacity-50'}`}
        />
      </motion.div>
      
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 pointer-events-none z-50 rounded-full border border-white/30 mix-blend-difference"
        style={{
          x: position.x - 18,
          y: position.y - 18,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.2 : 0.1,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
    </>
  );
};

export default Cursor;