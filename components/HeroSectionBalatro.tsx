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
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set text visible immediately
      gsap.set(bottomTextRef.current, {
        opacity: 1,
        x: 0,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden"
    >
      {/* Balatro Background with inverted clip-path */}
      <BalatroBackground />

      {/* Logo SVG centralizado no lado esquerdo */}
      <div className="absolute left-[10%] top-[10%] z-30">
        <img 
          src="/assets/Studio Garcia Beauty Academy-logo_Logo Studio Garcia.svg" 
          alt="Studio Garcia Beauty Academy" 
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-contain brightness-0 invert"
        />
      </div>


      {/* Text in bottom left corner */}
      <div ref={bottomTextRef} className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-20 z-50 max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[480px]">
        <h2 className="font-space-grotesk text-charcoal text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
          Transforme sua <span className="text-rose-gold">Paixão</span> em{' '}
          <span className="text-deep-purple">Profissão</span>
        </h2>
      </div>

    </section>
  );
}