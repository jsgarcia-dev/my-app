'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import BalatroBackground from './BalatroBackground';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSectionBalatro() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(overlayRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      gsap.set([subtitleRef.current, ctaRef.current, badgesRef.current], {
        opacity: 0,
        y: 40,
      });

      gsap.set(bottomTextRef.current, {
        opacity: 0,
        x: -50,
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Overlay animation covering from left to right
      tl.to(overlayRef.current, {
        scaleX: 1,
        duration: 1.2,
        ease: 'power3.inOut',
      })
        // Fade out overlay
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        // Animate bottom text
        .to(
          bottomTextRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
          },
          '-=0.8'
        )
        // Animate subtitle
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          '-=0.8'
        )
        // Animate CTA buttons
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        // Animate badges
        .to(
          badgesRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          '-=0.4'
        );
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


      <div className="container relative z-30 mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <p
              ref={subtitleRef}
              className="font-montserrat mx-auto max-w-lg text-lg text-charcoal/80 md:text-xl lg:mx-0"
            >
              Torne-se um profissional certificado de beleza com os melhores
              cursos de Itaquaquecetuba. Aprenda, pratique e empreenda no Studio
              Garcia Beauty Academy.
            </p>

            <div
              ref={ctaRef}
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-rose-gold hover:bg-rose-gold/90 transform px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Agende Sua Visita
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white px-8 py-6 text-lg font-semibold transition-all duration-300"
              >
                Conheça os Cursos
              </Button>
            </div>

            {/* Trust badges */}
            <div
              ref={badgesRef}
              className="flex flex-wrap justify-center gap-6 pt-8 lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="bg-rose-gold/20 flex h-12 w-12 items-center justify-center rounded-full">
                  <svg
                    className="text-rose-gold h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-charcoal text-sm font-medium">
                  Certificado Reconhecido
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-rose-gold/20 flex h-12 w-12 items-center justify-center rounded-full">
                  <svg
                    className="text-soft-pink h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span className="text-charcoal text-sm font-medium">
                  +500 Alunos Formados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-rose-gold/20 flex h-12 w-12 items-center justify-center rounded-full">
                  <svg
                    className="text-rose-gold h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-charcoal text-sm font-medium">
                  95% Empregabilidade
                </span>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center">
            <img 
              src="/assets/Studio Garcia Beauty Academy-logo_Logo Studio Garcia.svg" 
              alt="Studio Garcia Beauty Academy" 
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl brightness-0 invert"
            />
          </div>
        </div>
      </div>

      {/* Overlay for animation */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-r from-black via-[#edf2f4] to-[#343a40]"
      />

      {/* Text in bottom left corner */}
      <div ref={bottomTextRef} className="absolute bottom-20 left-8 md:left-12 lg:left-20 z-50 max-w-sm md:max-w-md">
        <h2 className="font-space-grotesk text-charcoal text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Transforme sua <span className="text-rose-gold">Paixão</span> em{' '}
          <span className="text-deep-purple">Profissão</span>
        </h2>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce z-10">
        <svg
          className="text-charcoal/60 h-6 w-6"
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
      </div>
    </section>
  );
}