'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import BalatroBackground from './BalatroBackground';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSectionBalatro() {
  const sectionRef = useRef<HTMLElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(bottomTextRef.current, {
        opacity: 1,
        x: 0,
      });
      
      gsap.set([logoRef.current, titleRef.current, subtitleRef.current], {
        opacity: 0,
      });
      
      gsap.set(logoRef.current, {
        scale: 0.5,
        rotation: -180,
      });
      
      gsap.set(titleRef.current, {
        x: -50,
      });
      
      gsap.set(subtitleRef.current, {
        x: 50,
      });
      
      // Create animation timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
      })
      .to(titleRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
      }, '-=0.6')
      .to(subtitleRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
      }, '-=0.6');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden"
      data-menu-color="white"
    >
      {/* Balatro Background with inverted clip-path */}
      <BalatroBackground />

      {/* Logo acima e textos abaixo centralizados no balatro */}
      <div className="absolute left-[50%] top-[45%] sm:top-[40%] md:top-[35%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center px-4">
        <div ref={logoRef} className="mb-4 sm:mb-6">
          <img 
            src="/assets/Studio Garcia Beauty Academy-logo_Logo Studio Garcia.svg" 
            alt="Studio Garcia Beauty Academy" 
            className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 object-contain"
            style={{ 
              filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))' 
            }}
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 
            ref={titleRef} 
            className="font-articulat font-extrabold text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center"
            style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' }}
          >
            STUDIO GARCIA
          </h1>
          <p 
            ref={subtitleRef} 
            className="font-articulat font-medium text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mt-1 text-center"
            style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' }}
          >
            Beauty & Academy
          </p>
        </div>
      </div>


      {/* Text and animated button centered in white space */}
      <div ref={bottomTextRef} className="absolute bottom-6 sm:bottom-8 md:bottom-12 lg:bottom-16 left-[50%] sm:left-[15%] -translate-x-1/2 sm:-translate-x-0 z-50 flex items-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-0">
        <h2 className="text-heading text-black font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl uppercase leading-tight max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
          Transforme sua<br />Paixão em Profissão
        </h2>
        <a
          href="#servicos"
          className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-black rounded-full transition-all duration-500 hover:scale-105 group flex-shrink-0"
        >
          {/* Wave animations */}
          <span className="absolute inset-0 rounded-full bg-black/20 animate-wave-1" />
          <span className="absolute inset-0 rounded-full bg-black/15 animate-wave-2" />
          <span className="absolute inset-0 rounded-full bg-black/10 animate-wave-3" />
          
          {/* Main circle */}
          <span className="relative flex items-center justify-center w-full h-full bg-black rounded-full">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-float"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </span>
        </a>
      </div>

    </section>
  );
}