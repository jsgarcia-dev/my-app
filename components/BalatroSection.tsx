'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Balatro from './balatro';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function BalatroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const balatroWrapperRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(overlayRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      gsap.set(balatroWrapperRef.current, {
        opacity: 0,
        filter: 'blur(40px)',
      });

      gsap.set(contentRef.current, {
        opacity: 0,
        y: 60,
      });

      gsap.set(curveRef.current, {
        opacity: 0,
        scale: 0.8,
      });

      // Create animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Overlay animation covering from left to right
      tl.to(overlayRef.current, {
        scaleX: 1,
        duration: 1.2,
        ease: 'power3.inOut',
      })
        // Reveal balatro with blur animation
        .to(
          balatroWrapperRef.current,
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power2.out',
          },
          '-=0.8'
        )
        // Fade out overlay
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=1'
        )
        // Animate curve shape
        .to(
          curveRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
          },
          '-=1.2'
        )
        // Animate content
        .to(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.8'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Balatro Background */}
      <div ref={balatroWrapperRef} className="absolute inset-0 z-0">
        <Balatro
          spinRotation={-1.5}
          spinSpeed={6.0}
          color1="#00000" // rose-gold
          color2="#2a9d8f" // deep-purple
          color3="#00000" // charcoal
          contrast={3.0}
          lighting={0.5}
          spinAmount={0.3}
          pixelFilter={2000}
          spinEase={0.8}
          isRotate={true}
          mouseInteraction={true}
        />
      </div>

      {/* Curved shape near menu area */}
      <div
        ref={curveRef}
        className="absolute top-0 right-0 left-0 z-10 h-24 opacity-0"
      >
        <svg
          viewBox="0 0 1200 100"
          className="h-full w-full"
          preserveAspectRatio="none"
          style={{
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
          }}
        >
          <defs>
            <linearGradient
              id="menuCurveGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 0 L 1200 0 L 1200 50 Q 900 90 600 85 T 0 50 Z"
            fill="url(#menuCurveGradient)"
          />
        </svg>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 flex h-full items-center justify-center"
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-playfair mb-6 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
            Pronto para transformar sua vida?
          </h2>
          <p className="font-montserrat text-charcoal mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            Dê o primeiro passo rumo ao sucesso profissional. Agende sua visita
            hoje!
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="text-rose-gold hover:bg-cream transform rounded-lg bg-white px-8 py-4 font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              Agendar Visita Gratuita
            </button>
            <button className="hover:text-deep-purple rounded-lg border-2 border-white px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white">
              Falar no WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for animation */}
      <div
        ref={overlayRef}
        className="from-rose-gold via-deep-purple to-charcoal pointer-events-none absolute inset-0 z-30 bg-gradient-to-r"
      />
    </section>
  );
}
