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
      <div className="absolute left-[50%] top-[35%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
        <div ref={logoRef} className="mb-6">
          <img 
            src="/assets/Studio Garcia Beauty Academy-logo_Logo Studio Garcia.svg" 
            alt="Studio Garcia Beauty Academy" 
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-contain"
            style={{ 
              filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))' 
            }}
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 
            ref={titleRef} 
            className="font-articulat font-extrabold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center"
            style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' }}
          >
            STUDIO GARCIA
          </h1>
          <p 
            ref={subtitleRef} 
            className="font-articulat font-medium text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-1 text-center"
            style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' }}
          >
            Beauty & Academy
          </p>
        </div>
      </div>


      {/* Text and animated button centered in white space */}
      <div ref={bottomTextRef} className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 left-[15%] -translate-x-1/2 z-50 flex items-center gap-6">
        <h2 className="text-heading text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl uppercase leading-tight max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
          Transforme sua<br />Paixão em Profissão
        </h2>
        <a
          href="#servicos"
          className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full transition-all duration-500 hover:scale-105 group flex-shrink-0"
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