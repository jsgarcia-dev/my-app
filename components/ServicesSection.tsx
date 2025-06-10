'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Cursos Profissionalizantes',
    description: 'Formação completa em diversas áreas da beleza com certificação reconhecida pelo mercado.',
    features: [
      'Cabeleireiro Profissional',
      'Maquiagem & Visagismo', 
      'Manicure & Nail Designer',
      'Estética Facial & Corporal'
    ],
    color: 'rose-gold'
  },
  {
    id: 2,
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Salão Escola',
    description: 'Atendimento ao público com preços especiais realizados por alunos supervisionados.',
    features: [
      'Corte e coloração',
      'Tratamentos capilares',
      'Maquiagem social',
      'Manicure e pedicure'
    ],
    color: 'deep-purple'
  },
  {
    id: 3,
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Serviços Profissionais',
    description: 'Atendimento completo com profissionais certificados e experientes do mercado.',
    features: [
      'Hair styling avançado',
      'Colorimetria especializada',
      'Maquiagem para eventos',
      'Estética avançada'
    ],
    color: 'rose-gold'
  },
  {
    id: 4,
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Workshops & Masterclasses',
    description: 'Atualizações e especializações com profissionais renomados do mercado.',
    features: [
      'Tendências internacionais',
      'Técnicas exclusivas',
      'Networking profissional',
      'Certificação especial'
    ],
    color: 'deep-purple'
  }
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 1 });
        
        gsap.from(
          titleRef.current,
          { 
            y: 50,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              once: true
            },
          }
        );
      }

      // Cards animation
      if (cardsRef.current) {
        const cards = gsap.utils.toArray('.service-card');
        if (cards.length > 0) {
          gsap.set(cards, { opacity: 1 });
          
          gsap.from(
            cards,
            { 
              y: 80, 
              scale: 0.95,
              duration: 0.8,
              stagger: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 85%',
                once: true
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="relative overflow-hidden bg-gradient-to-b from-white to-cream/30 py-20 lg:py-32"
      data-menu-color="black"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-rose-gold/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-deep-purple/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2
            ref={titleRef}
            className="font-space-grotesk text-charcoal mb-4 text-4xl font-bold lg:text-5xl tracking-tight"
          >
            Nossos <span className="text-rose-gold">Serviços</span>
          </h2>
          <p className="text-charcoal/70 mx-auto max-w-2xl text-lg">
            Oferecemos uma gama completa de serviços para sua jornada na beleza, 
            desde a formação profissional até serviços especializados.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid gap-8 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${service.color}/0 to-${service.color}/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`mb-6 inline-flex items-center justify-center rounded-2xl bg-${service.color}/20 p-4 text-${service.color}`}>
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-charcoal mb-3 text-2xl font-bold">
                  {service.title}
                </h3>
                <p className="text-charcoal/70 mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg 
                        className={`h-5 w-5 text-${service.color} flex-shrink-0`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span className="text-charcoal/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={`mt-6 text-${service.color} font-semibold flex items-center gap-2 group/btn`}>
                  Saiba mais
                  <svg 
                    className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-charcoal/70 mb-6 text-lg">
            Não sabe por onde começar? Agende uma visita e conheça todos os nossos serviços!
          </p>
          <button className="bg-gradient-beauty hover:shadow-2xl text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-1">
            Agendar Visita Gratuita
          </button>
        </div>
      </div>
    </section>
  );
}