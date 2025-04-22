import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ChromaTransition = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !itemsRef.current) return;
    
    // Config values (you can customize these)
    const config = {
      start: 0,
      end: 300,
      animate: true,
    };
    
    // Get all list items
    const items = gsap.utils.toArray('ul li', itemsRef.current);
    
    // Apply initial state
    gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
    
    // Create dimmer timeline for fading items in/out
    const dimmer = gsap
      .timeline()
      .to(items.slice(1), {
        opacity: 1,
        stagger: 0.5,
      })
      .to(
        items.slice(0, items.length - 1),
        {
          opacity: 0.2,
          stagger: 0.5,
        },
        0
      );

    const dimmerScrub = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      animation: dimmer,
      scrub: 0.2,
    });

    // Create color shift based on scroll position
    const scroller = gsap.timeline().fromTo(
      document.documentElement,
      {
        '--hue': config.start,
      },
      {
        '--hue': config.end,
        ease: 'none',
      }
    );

    const scrollerScrub = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      animation: scroller,
      scrub: 0.2,
    });

    // Create chromatic aberration effect on entry
    const chromaEntry = gsap.fromTo(
      document.documentElement,
      {
        '--chroma': 0,
      },
      {
        '--chroma': 0.3,
        ease: 'none',
        scrollTrigger: {
          scrub: 0.2,
          trigger: containerRef.current,
          start: 'top center+=40',
          end: 'center center',
        },
      }
    );
    
    // Reduce chromatic aberration on exit
    const chromaExit = gsap.fromTo(
      document.documentElement,
      {
        '--chroma': 0.3,
      },
      {
        '--chroma': 0,
        ease: 'none',
        scrollTrigger: {
          scrub: 0.2,
          trigger: containerRef.current,
          start: 'center center',
          end: 'bottom center-=40',
        },
      }
    );

    return () => {
      // Clean up all ScrollTrigger instances
      dimmerScrub.kill();
      scrollerScrub.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="chroma-transition min-h-[50vh] flex items-center justify-center relative overflow-hidden"
    >
      <ul ref={itemsRef} className="space-y-12 py-12 relative z-10">
        {[1, 2, 3, 4, 5].map((item) => (
          <li 
            key={item} 
            className="text-4xl md:text-6xl font-bold text-center transform transition-all text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600"
          >
            Digital Exploration {item}
          </li>
        ))}
      </ul>
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 h-96 w-96 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full filter blur-3xl opacity-30 transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-gradient-to-tr from-violet-800 to-purple-800 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
    </div>
  );
};

export default ChromaTransition;