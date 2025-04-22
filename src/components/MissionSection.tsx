import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Rocket, Zap, Globe, Compass } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MissionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
};

const MissionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !headingRef.current) return;
    
    // Split text animation for heading
    const text = headingRef.current.innerText;
    headingRef.current.innerHTML = '';
    
    // Create wrapper for characters
    const wrapper = document.createElement('span');
    wrapper.classList.add('inline-block');
    
    // Add each character in a span
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.classList.add('inline-block');
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      wrapper.appendChild(span);
    });
    
    headingRef.current.appendChild(wrapper);
    
    // GSAP animation for text reveal
    gsap.to(wrapper.children, {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      ease: "power3.out",
      duration: 0.8,
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
    
    return () => {
      // Clean up ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const missionData = [
    {
      icon: <Rocket className="h-6 w-6 text-white" />,
      title: "Galactic Innovation",
      description: "Pioneering the digital frontier with technology that transcends conventional boundaries."
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Quantum Solutions",
      description: "Harnessing the power of advanced algorithms to solve complex problems with elegant simplicity."
    },
    {
      icon: <Globe className="h-6 w-6 text-white" />,
      title: "Universal Access",
      description: "Creating experiences that are accessible across all dimensions of the digital universe."
    },
    {
      icon: <Compass className="h-6 w-6 text-white" />,
      title: "Cosmic Direction",
      description: "Guiding your journey through the complex digital space with clarity and purpose."
    }
  ];
  
  return (
    <section 
      ref={sectionRef}
      id="mission" 
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-[rgb(15,8,30)] to-[rgb(28,12,60)]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
      </div>
      
      {/* Background grid */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03]"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.span 
            className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Our Cosmic Mission
          </motion.span>
          
          <h2 
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300"
          >
            Exploring Digital Frontiers
          </h2>
          
          <motion.p 
            className="text-lg text-white/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            We're on a mission to transform how you experience the digital realm, 
            creating connections that transcend traditional boundaries and open new possibilities.
          </motion.p>
        </div>
        
        <div 
          ref={cardsRef} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {missionData.map((mission, index) => (
            <MissionCard 
              key={index}
              icon={mission.icon}
              title={mission.title}
              description={mission.description}
              index={index}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-20 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">Join Our Cosmic Journey</h3>
          <p className="text-white/70 mb-8">
            The universe of digital possibilities awaits. Are you ready to embark on this transformative expedition?
          </p>
          <a 
            href="#contact" 
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium 
              hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Connect With Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;