'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const differentials = [
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    title: 'Aprenda + Pratique + Empreenda',
    description:
      'Ecossistema completo que une educação de qualidade, prática supervisionada e mentoria para abrir seu próprio negócio.',
    color: 'rose-gold',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
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
    ),
    title: 'Instrutores Certificados',
    description:
      'Professores com experiência de mercado e certificações internacionais, garantindo aprendizado de alto nível.',
    color: 'deep-purple',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    title: 'Infraestrutura Moderna',
    description:
      'Equipamentos profissionais e ambientes que simulam salões reais, preparando você para o mercado de trabalho.',
    color: 'rose-gold',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
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
    ),
    title: 'Apoio ao Emprego',
    description:
      'Parcerias com salões e spas da região, além de orientação profissional para garantir sua colocação no mercado.',
    color: 'deep-purple',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    title: 'Mentoria de Negócios',
    description:
      'Programa exclusivo de mentoria para alunos que desejam abrir seu próprio salão ou clínica de estética.',
    color: 'rose-gold',
  },
];

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Image parallax
      gsap.to(imageRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Stats animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-20 lg:py-32"
      data-menu-color="black"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-rose-gold/5 absolute top-1/4 -left-20 h-40 w-40 rounded-full blur-3xl" />
        <div className="bg-deep-purple/5 absolute -right-20 bottom-1/4 h-60 w-60 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2
            ref={titleRef}
            className="font-articulat  mb-4 text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Por Que Escolher o{' '}
            <span className="text-charcoal font-bold">Studio Garcia</span>?
          </h2>
          <div className="bg-gradient-beauty mx-auto h-1 w-24 rounded-full" />
        </div>

        <div className="mb-20 grid items-center gap-16 lg:grid-cols-2">
          {/* Differentials */}
          <div ref={cardsRef} className="space-y-6">
            {differentials.map((item, index) => (
              <div
                key={index}
                className="group hover:bg-cream/50 flex gap-4 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className={`h-16 w-16 flex-shrink-0 bg-${item.color}/20 text-${item.color} flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-charcoal mb-2 text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-charcoal/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Image and Stats */}
          <div className="relative">
            <div
              ref={imageRef}
              className="relative h-[600px] overflow-hidden rounded-3xl shadow-2xl"
            >
              <Image
                src="https://via.placeholder.com/600x600/B76E79/FFFFFF?text=Sala+de+Aula"
                alt="Sala de aula Studio Garcia"
                fill
                className="object-cover"
              />
              <div className="from-charcoal/50 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>

            {/* Stats overlay */}
            <div
              ref={statsRef}
              className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 transform gap-4"
            >
              <div className="rounded-2xl bg-white p-6 text-center shadow-xl">
                <p className="text-rose-gold text-3xl font-bold">15+</p>
                <p className="text-charcoal/70 text-sm">Anos de Experiência</p>
              </div>
              <div className="rounded-2xl bg-white p-6 text-center shadow-xl">
                <p className="text-deep-purple text-3xl font-bold">95%</p>
                <p className="text-charcoal/70 text-sm">Taxa de Emprego</p>
              </div>
              <div className="rounded-2xl bg-white p-6 text-center shadow-xl">
                <p className="text-rose-gold text-3xl font-bold">500+</p>
                <p className="text-charcoal/70 text-sm">Alunos Formados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
