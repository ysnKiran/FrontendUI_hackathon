import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SpaceTransition: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create stars
    if (starsRef.current) {
      // Clear existing stars
      starsRef.current.innerHTML = '';
      
      // Create random stars
      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random star size
        const size = Math.random() * 2.5 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random star position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random twinkle animation
        star.style.setProperty('--twinkle-duration', `${Math.random() * 3 + 2}s`);
        
        starsRef.current.appendChild(star);
      }
    }
    
    // GSAP animations
    if (sectionRef.current) {
      const stars = gsap.utils.toArray('.star');
      
      // Scroll triggered animation to move stars
      gsap.to(stars, {
        x: () => `${(Math.random() * 2 - 1) * 100}%`,
        y: '-=100%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
      
      // Parallax effect for section
      gsap.fromTo(sectionRef.current.querySelector('.content'), 
        { y: 0 },
        { 
          y: 100,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }
    
    return () => {
      // Clean up ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <div 
      ref={sectionRef}
      className="relative min-h-[60vh] py-24 flex items-center overflow-hidden bg-gradient-to-b from-[rgb(38,18,79)] to-[rgb(20,12,40)]"
    >
      {/* Stars */}
      <div ref={starsRef} className="star-field absolute inset-0"></div>
      
      {/* Content */}
      <div className="container-custom relative z-10 content">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
            The Journey Begins
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-8">
            As we venture deeper into the cosmic digital realm, prepare yourself for a transformative experience that will change your perception of what's possible.
          </p>
          
          {/* Decorative elements */}
          <div className="relative h-[100px] w-full max-w-md mx-auto my-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[80px] w-[80px] rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 blur-md opacity-60 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Celestial objects (decorative blobs) */}
      <div className="absolute top-[20%] right-[15%] w-[150px] h-[150px] bg-purple-600 celestial-object"></div>
      <div className="absolute bottom-[30%] left-[20%] w-[100px] h-[100px] bg-indigo-600 celestial-object"></div>
    </div>
  );
};

export default SpaceTransition;