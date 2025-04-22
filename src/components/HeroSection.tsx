import React, { useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const floatingRef1 = useRef<HTMLDivElement>(null);
  const floatingRef2 = useRef<HTMLDivElement>(null);
  const bgBlobsRef = useRef<HTMLDivElement>(null);
  const shootingStarsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  useEffect(() => {
    if (!globeRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, globeRef.current.clientWidth / globeRef.current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(globeRef.current.clientWidth, globeRef.current.clientHeight)
    globeRef.current.appendChild(renderer.domElement)

    // Create wireframe globe
    const wireframeGeometry = new THREE.SphereGeometry(5, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    })
    const wireframeGlobe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    scene.add(wireframeGlobe)

    // Create constellation effect
    const stars = new THREE.Group();
    scene.add(stars);

    // Create random stars
    for (let i = 0; i < 200; i++) {
      const geometry = new THREE.SphereGeometry(0.03, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(geometry, material);
      
      // Position stars randomly around the globe but within a certain radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5 + (Math.random() * 3 - 1.5); // Base radius of globe + some variance
      
      star.position.x = radius * Math.sin(phi) * Math.cos(theta);
      star.position.y = radius * Math.sin(phi) * Math.sin(theta);
      star.position.z = radius * Math.cos(phi);
      
      stars.add(star);
    }

    // Create connections between some stars (constellation lines)
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.2
    });

    // Connect random stars with lines
    for (let i = 0; i < 30; i++) {
      const randomIndex1 = Math.floor(Math.random() * stars.children.length);
      const randomIndex2 = Math.floor(Math.random() * stars.children.length);
      
      if (randomIndex1 !== randomIndex2) {
        const star1 = stars.children[randomIndex1];
        const star2 = stars.children[randomIndex2];
        
        const points = [];
        points.push(star1.position);
        points.push(star2.position);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        stars.add(line);
      }
    }

    // Add click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });

    const handleGlobeClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(wireframeGlobe);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const glowGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        glowSphere.position.copy(point);
        scene.add(glowSphere);

        // Animate the glow effect
        gsap.to(glowSphere.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            scene.remove(glowSphere);
            glowGeometry.dispose();
          }
        });

        gsap.to(glowMaterial, {
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        });
      }
    };

    renderer.domElement.addEventListener('click', handleGlobeClick);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    camera.position.z = 10

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = false

    const animate = () => {
      requestAnimationFrame(animate)
      wireframeGlobe.rotation.y += 0.001
      stars.rotation.y += 0.0005
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Create shooting stars
    const createShootingStar = () => {
      if (!shootingStarsRef.current) return;
      
      const star = document.createElement('div');
      star.className = 'shooting-star';
      
      // Random position and angle
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 45; // Random angle between 0 and 45 degrees
      
      star.style.left = `${startX}%`;
      star.style.top = `${startY}%`;
      star.style.transform = `rotate(${angle}deg)`;
      
      shootingStarsRef.current.appendChild(star);
      
      // Remove the star after animation
      setTimeout(() => {
        star.remove();
      }, 1000);
    };

    // Create shooting stars periodically
    const shootingStarInterval = setInterval(createShootingStar, 2000);

    // Handle resize
    const handleResize = () => {
      if (!globeRef.current) return;
      camera.aspect = globeRef.current.clientWidth / globeRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(globeRef.current.clientWidth, globeRef.current.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    // Wait for DOM elements to be ready
    const startAnimations = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      if (bgBlobsRef.current?.children.length) {
        tl.from([...bgBlobsRef.current.children], {
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "elastic.out(1, 0.8)"
        })
      }

      if (headingRef.current?.children.length) {
        tl.from([...headingRef.current.children], {
          y: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
        }, "-=1")
      }

      if (textRef.current) {
        tl.from(textRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
        }, "-=0.6")
      }

      if (buttonRef.current?.children.length) {
        tl.from([...buttonRef.current.children], {
          x: -30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
        }, "-=0.4")
      }

      // Continuous floating animation
      if (bgBlobsRef.current?.children.length) {
        gsap.to([...bgBlobsRef.current.children], {
          scale: 1.2,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: {
            each: 0.5,
            repeat: -1
          }
        });
      }
    };

    // Start animations after a short delay to ensure DOM is ready
    const timer = setTimeout(startAnimations, 100);

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(imageRef.current, {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: "power2.out"
      });

      gsap.to([floatingRef1.current, floatingRef2.current], {
        x: xPos * 1.5,
        y: yPos * 1.5,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll-triggered animations
    gsap.to(imageRef.current, {
      y: 100,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    // Add smooth color transition as user scrolls down
    gsap.fromTo(
      document.body,
      { 
        background: "linear-gradient(to bottom, rgb(20, 12, 40), rgb(38, 18, 79))" 
      },
      {
        background: "linear-gradient(to bottom, rgb(38, 18, 79), rgb(58, 28, 110))",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Create a pulse effect for the scroll indicator
    if (floatingRef1.current) {
      gsap.to(floatingRef1.current, {
        scale: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      globeRef.current?.removeChild(renderer.domElement)
      controls.dispose()
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleGlobeClick);
      clearTimeout(timer);
      clearInterval(shootingStarInterval);
      // Cleanup ScrollTrigger when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  return (
    <section 
      ref={sectionRef} 
      id="home" 
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
    >
      {/* Shooting stars container */}
      <div ref={shootingStarsRef} className="shooting-stars-container absolute inset-0 z-0 overflow-hidden"></div>
      
      {/* Background elements */}
      <div ref={bgBlobsRef} className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 h-96 w-96 bg-[#8B5CF6] rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-[#7C3AED] rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 bg-[#6D28D9] rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Background grid */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03]"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.span 
              className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to the Future
            </motion.span>
            
            <motion.h1 
              ref={headingRef}
              className="mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                <span className="relative inline-block">
                  Explore
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 blur-2xl opacity-50 animate-pulse"></span>
                </span>{" "}
                the
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 animate-gradient-x relative">
                Digital Universe
                <span className="absolute -inset-x-4 inset-y-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20 blur-2xl"></span>
              </span>
            </motion.h1>
            
            <motion.p 
              ref={textRef}
              className="text-lg text-white/80 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 5, delay: 1 }}
            >
              Journey through our constellation of digital solutions. Discover a universe of possibilities designed to transform your experience.
            </motion.p>
            
            <motion.div 
              ref={buttonRef} 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a 
                href="#mission" 
                className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium 
                  hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Launch Journey
                <ArrowRight className="ml-2 h-4 w-4 inline-block" />
              </a>
              
              <a 
                href="#about" 
                className="px-8 py-3 rounded-full bg-white/10 text-white font-medium backdrop-blur-sm border border-white/20
                  hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Discover More
              </a>
            </motion.div>
          </div>
          
          <div 
            ref={globeRef}
            className="relative z-10 h-[500px] w-full cursor-pointer"
          />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        ref={floatingRef1}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        style={{ opacity }}
      >
        <span className="text-sm text-white/60 mb-2">Explore More</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="h-5 w-5 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;