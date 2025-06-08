'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Animate title with split text effect
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 100, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 50, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.3'
        )
        .fromTo(
          imageRef.current,
          { opacity: 0, scale: 1.1, x: 100 },
          { opacity: 1, scale: 1, x: 0, duration: 1.4 },
          '-=1'
        )
        .fromTo(
          badgesRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          '-=0.5'
        );

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="from-cream to-soft-pink/10 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br via-white"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-rose-gold/10 absolute top-0 left-0 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-deep-purple/10 absolute right-0 bottom-0 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1
              ref={titleRef}
              className="font-space-grotesk text-charcoal text-4xl leading-tight font-bold md:text-5xl lg:text-6xl tracking-tight"
            >
              Transforme sua <span className="text-rose-gold">Paixão</span> em{' '}
              <span className="text-deep-purple">Profissão</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-charcoal/80 font-montserrat mx-auto max-w-lg text-lg md:text-xl lg:mx-0"
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
                className="bg-rose-gold hover:bg-rose-gold transform px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Agende Sua Visita
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-deep-purple text-deep-purple hover:bg-deep-purple px-8 py-6 text-lg font-semibold transition-all duration-300 hover:text-white"
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
                <div className="bg-deep-purple/20 flex h-12 w-12 items-center justify-center rounded-full">
                  <svg
                    className="text-deep-purple h-6 w-6"
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
                <div className="bg-accent/20 flex h-12 w-12 items-center justify-center rounded-full">
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

          {/* Image */}
          <div ref={imageRef} className="relative h-[600px] lg:h-[700px]">
            <div className="from-rose-gold/20 to-deep-purple/20 absolute inset-0 rounded-3xl bg-gradient-to-br" />
            <Image
              src="https://via.placeholder.com/600x700/FFC0CB/B76E79?text=Beauty+Academy"
              alt="Studio Garcia Beauty Academy"
              fill
              className="rounded-3xl object-cover shadow-2xl"
              priority
            />
            {/* Floating elements */}
            <div className="bg-soft-pink absolute -top-6 -right-6 h-32 w-32 rounded-full opacity-60 blur-2xl" />
            <div className="bg-rose-gold absolute -bottom-6 -left-6 h-40 w-40 rounded-full opacity-50 blur-2xl" />

            {/* Badge overlay */}
            <div className="absolute top-8 right-8 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-sm">
              <p className="text-deep-purple text-2xl font-bold">15+</p>
              <p className="text-charcoal text-sm">Anos de Experiência</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <svg
          className="text-charcoal/50 h-6 w-6"
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
