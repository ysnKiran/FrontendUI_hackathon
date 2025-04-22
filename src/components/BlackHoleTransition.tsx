import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const BlackHoleTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blackHoleRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !blackHoleRef.current || !textContainerRef.current) return;
    
    // Create random stars for the background
    if (starsRef.current) {
      starsRef.current.innerHTML = '';
      
      for (let i = 0; i < 300; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 2 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
        star.style.setProperty('--twinkle-duration', `${Math.random() * 4 + 2}s`);
        
        starsRef.current.appendChild(star);
      }
    }
    
    // Initial setup
    gsap.set(blackHoleRef.current, {
      scale: 0.5,
      opacity: 0.4,
    });
    
    gsap.set(textContainerRef.current.children, {
      y: 50,
      opacity: 0,
    });
    
    // Create black hole animation
    const blackHoleTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "center center",
        scrub: true,
      }
    });
    
    blackHoleTl
      .to(blackHoleRef.current, {
        scale: 1.5,
        opacity: 0.8,
        rotationZ: 180,
        duration: 1,
      })
      .to(starsRef.current.querySelectorAll('.star'), {
        scale: 2,
        opacity: 0,
        x: '0',
        y: () => -window.innerHeight / 2,
        transformOrigin: 'center center',
        stagger: 0.001,
        ease: "power3.in",
        duration: 1
      }, "<")
      .to(containerRef.current, {
        background: "black",
        duration: 0.5
      }, ">-=0.5");
    
    // Text reveal animation
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center center",
        end: "bottom center",
        scrub: 0.5,
      }
    });
    
    textTl.to(textContainerRef.current.children, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      ease: "power3.out",
      duration: 0.5
    });
    
    return () => {
      // Clean up ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[rgb(20,12,40)] to-[rgb(10,6,20)]"
      id="blackhole"
    >
      <div ref={starsRef} className="star-field"></div>
      
      <div
        ref={blackHoleRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="relative">
          {/* Black hole outer glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full
            bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700
            opacity-30 blur-[40px]"
          ></div>
          
          {/* Black hole accretion disk */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-[180px] h-[180px] md:w-[350px] md:h-[350px] rounded-full border-[15px] md:border-[30px]
            border-violet-600 opacity-40 blur-sm animate-spin"
            style={{ animationDuration: '20s' }}
          ></div>
          
          {/* Black hole center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-[120px] h-[120px] md:w-[250px] md:h-[250px] rounded-full bg-black"
          ></div>
        </div>
      </div>
      
      <div 
        ref={textContainerRef}
        className="relative z-10 text-center max-w-2xl px-4"
      >
        <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 font-medium mb-6">
          Dimensional Shift
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
          Beyond the Event Horizon
        </h2>
        <p className="text-lg md:text-xl text-white/70">
          Where innovation transcends boundaries, and ideas collapse into singular points of perfection. Here, we defy conventional limits.
        </p>
      </div>
    </div>
  );
};

export default BlackHoleTransition;