'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const facilitiesData = [
  {
    id: 'facility-1',
    title: 'Sala de Corte e Coloração',
    description: 'Equipada com cadeiras profissionais, lavatórios modernos e todos os produtos necessários para aprender as melhores técnicas de cabelo.',
    image: '/rooms/room-1.jpg',
    features: ['8 Estações de trabalho', 'Lavatórios profissionais', 'Iluminação LED', 'Climatização']
  },
  {
    id: 'facility-2',
    title: 'Estúdio de Maquiagem',
    description: 'Ambiente com iluminação perfeita e espelhos Hollywood para o aprendizado de maquiagem profissional e visagismo.',
    image: '/rooms/room-2.jpg',
    features: ['Iluminação Hollywood', 'Cadeiras giratórias', 'Kit completo de produtos', 'Espelhos HD']
  },
  {
    id: 'facility-3',
    title: 'Laboratório de Estética',
    description: 'Macas profissionais e equipamentos de última geração para tratamentos faciais e corporais avançados.',
    image: '/rooms/room-3.jpg',
    features: ['Macas elétricas', 'Vapor de ozônio', 'Alta frequência', 'Produtos profissionais']
  },
  {
    id: 'facility-4',
    title: 'Sala de Nail Design',
    description: 'Espaço dedicado ao aprendizado de manicure, pedicure e nail art com toda estrutura necessária para a prática.',
    image: '/rooms/room-1.jpg',
    features: ['Mesas ergonômicas', 'Aspiradores de pó', 'Cabine UV', 'Esterilizadores']
  },
  {
    id: 'facility-5',
    title: 'Auditório Multimídia',
    description: 'Espaço para aulas teóricas com projeção em alta definição e sistema de som profissional para apresentações.',
    image: '/rooms/room-2.jpg',
    features: ['Capacidade 40 pessoas', 'Projetor 4K', 'Sistema de som', 'Ar condicionado']
  },
  {
    id: 'facility-6',
    title: 'Salão Escola',
    description: 'Ambiente real de salão onde alunos atendem clientes supervisionados por professores experientes.',
    image: '/rooms/room-3.jpg',
    features: ['Atendimento real', 'Supervisão docente', 'Ambiente profissional', 'Experiência prática']
  },
];

export default function FacilitiesSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);
  const currentSlideRef = useRef(currentSlide);
  const isTransitioningRef = useRef(isTransitioning);
  const hasSnappedRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % facilitiesData.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(
      (prev) => (prev - 1 + facilitiesData.length) % facilitiesData.length
    );
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Handle wheel events
    const handleWheel = (e: WheelEvent) => {
      // Solo manejar el scroll si la sección está en vista
      if (!isInView) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 1200) return; // Throttle scrolling

      // Si estamos en el último slide y scrolleamos hacia abajo
      if (currentSlideRef.current === facilitiesData.length - 1 && e.deltaY > 50) {
        // Permitir el scroll normal para continuar a la siguiente sección
        return;
      }

      // Si estamos en el primer slide y scrolleamos hacia arriba
      if (currentSlideRef.current === 0 && e.deltaY < -50) {
        // Permitir el scroll normal para volver a la sección anterior
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (e.deltaY > 50) {
        if (!isTransitioningRef.current) {
          setIsTransitioning(true);
          setCurrentSlide((prev) => (prev + 1) % facilitiesData.length);
          setTimeout(() => setIsTransitioning(false), 1000);
          lastScrollTimeRef.current = now;
        }
      } else if (e.deltaY < -50) {
        if (!isTransitioningRef.current) {
          setIsTransitioning(true);
          setCurrentSlide(
            (prev) => (prev - 1 + facilitiesData.length) % facilitiesData.length
          );
          setTimeout(() => setIsTransitioning(false), 1000);
          lastScrollTimeRef.current = now;
        }
      }
    };

    // Handle touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStartRef.current - touchEnd;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Si estamos en el último slide y deslizamos hacia arriba
          if (currentSlideRef.current === facilitiesData.length - 1) {
            // Permitir el scroll normal para continuar a la siguiente sección
            return;
          }
          if (!isTransitioningRef.current) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev + 1) % facilitiesData.length);
            setTimeout(() => setIsTransitioning(false), 1000);
          }
        } else {
          if (!isTransitioningRef.current) {
            setIsTransitioning(true);
            setCurrentSlide(
              (prev) => (prev - 1 + facilitiesData.length) % facilitiesData.length
            );
            setTimeout(() => setIsTransitioning(false), 1000);
          }
        }
      }
    };

    // Prevent default scroll behavior
    const preventScroll = (e: Event) => {
      // Solo prevenir scroll si la sección está en vista
      if (!isInView) return;
      
      // Si estamos en el último slide, permitir scroll en dispositivos táctiles
      if (currentSlideRef.current === facilitiesData.length - 1) {
        return;
      }
      e.preventDefault();
    };

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchmove', preventScroll);
    };
  }, [isInView]);

  // Auto-advance slides every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioningRef.current && isInView) {
        nextSlide();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isInView]);

  // Intersection Observer para detectar cuando la sección está en vista
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        // Si la sección está entrando en vista desde arriba
        if (entry.isIntersecting && !hasSnappedRef.current && entry.boundingClientRect.top < 100 && entry.boundingClientRect.top > -100) {
          hasSnappedRef.current = true;
          // Hacer scroll suave para centrar la sección
          setTimeout(() => {
            containerRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }, 100);
        }
        
        // Reset hasSnapped cuando salimos de la vista completamente
        if (!entry.isIntersecting && entry.boundingClientRect.top < -window.innerHeight) {
          hasSnappedRef.current = false;
        }
      },
      {
        threshold: [0, 0.1, 0.5, 0.9, 1],
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="facilities-slider"
      className="relative h-screen w-full overflow-hidden"
      data-menu-color="white"
    >
      {/* Background Images */}
      {facilitiesData.map((facility, index) => {
        const isActive = index === currentSlide;
        const isPrev =
          index === currentSlide - 1 ||
          (currentSlide === 0 && index === facilitiesData.length - 1);
        const isNext =
          index === currentSlide + 1 ||
          (currentSlide === facilitiesData.length - 1 && index === 0);

        let transformClass = '';
        let opacityClass = '';
        let zIndexValue = 1;

        if (isActive) {
          transformClass = 'scale-100 translate-y-0';
          opacityClass = 'opacity-100';
          zIndexValue = 10;
        } else if (isPrev) {
          transformClass = 'scale-95 -translate-y-full';
          opacityClass = 'opacity-30';
          zIndexValue = 5;
        } else if (isNext) {
          transformClass = 'scale-95 translate-y-full';
          opacityClass = 'opacity-30';
          zIndexValue = 5;
        } else {
          transformClass = 'scale-110 translate-y-0';
          opacityClass = 'opacity-0';
          zIndexValue = 1;
        }

        return (
          <div
            key={facility.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${transformClass} ${opacityClass}`}
            style={{
              zIndex: zIndexValue,
            }}
          >
            <Image
              src={facility.image}
              alt={`${facility.title} background`}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
              priority={index === 0}
              className="transition-all duration-1000"
            />
            <div
              className={`absolute inset-0 transition-all duration-1000 ${
                isActive
                  ? 'bg-gradient-to-b from-rose-gold/20 via-deep-purple/40 to-charcoal/80'
                  : 'bg-gradient-to-b from-rose-gold/40 via-deep-purple/60 to-charcoal/90'
              }`}
            />
          </div>
        );
      })}

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-8 text-center text-white">
        <div className="max-w-4xl">
          {/* Section Title */}
          <div
            key={`section-title-${currentSlide}`}
            className="animate-slideInTitle mb-4"
            style={{
              animationDelay: '0.1s',
            }}
          >
            <h2 className="font-articulat text-white/90 text-2xl font-medium tracking-wide md:text-3xl lg:text-4xl">
              Nossas <span className="text-soft-pink">Instalações</span>
            </h2>
          </div>

          {/* Facility Title */}
          <h1
            key={`title-${currentSlide}`}
            className="animate-slideInTitle text-stroke mb-6 font-space-grotesk text-4xl leading-none font-bold tracking-tight md:text-6xl lg:text-7xl xl:text-8xl"
            style={{
              textShadow:
                '0 4px 30px rgba(0,0,0,0.9), 0 8px 60px rgba(0,0,0,0.7), 0 0 100px rgba(255,255,255,0.1)',
              animationDelay: '0.3s',
            }}
          >
            {facilitiesData[currentSlide].title}
          </h1>

          {/* Divider */}
          <div
            key={`divider-${currentSlide}`}
            className="animate-fadeInDivider mx-auto mb-8 h-1 w-32 bg-gradient-to-r from-transparent via-rose-gold to-transparent"
            style={{
              animationDelay: '0.8s',
              boxShadow: '0 0 20px rgba(183, 110, 121, 0.5)',
            }}
          ></div>

          {/* Description */}
          <p
            key={`description-${currentSlide}`}
            className="animate-slideInDescription mx-auto max-w-2xl font-montserrat text-lg leading-relaxed font-light md:text-xl lg:text-2xl"
            style={{
              animationDelay: '1.2s',
              textShadow:
                '0 2px 20px rgba(0,0,0,0.9), 0 4px 40px rgba(0,0,0,0.7)',
              letterSpacing: '0.5px',
            }}
          >
            {facilitiesData[currentSlide].description}
          </p>

          {/* Features */}
          <div
            key={`features-${currentSlide}`}
            className="animate-slideInDescription mt-8 flex flex-wrap justify-center gap-4"
            style={{
              animationDelay: '1.6s',
            }}
          >
            {facilitiesData[currentSlide].features.map((feature, index) => (
              <div
                key={index}
                className="rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium"
                style={{
                  animationDelay: `${1.8 + index * 0.1}s`,
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div
          className="animate-fadeInUp absolute top-1/2 right-8 -translate-y-1/2 transform text-center"
          style={{ animationDelay: '2s' }}
        >
          <div className="flex flex-col space-y-3">
            {facilitiesData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full backdrop-blur-sm transition-all duration-500 ${
                  index === currentSlide
                    ? 'scale-125 bg-rose-gold shadow-lg shadow-rose-gold/30'
                    : 'bg-white/40 hover:scale-110 hover:bg-rose-gold/70'
                }`}
                style={{
                  animationDelay: `${2.2 + index * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="animate-fadeInUp absolute bottom-24 left-1/2 -translate-x-1/2 transform text-center"
          style={{ animationDelay: '2.4s' }}
        >
          <p className="mb-2 font-montserrat text-sm font-medium tracking-wide text-white/80">
            Role para explorar as instalações
          </p>
          <div className="flex justify-center">
            <svg
              className="h-5 w-5 animate-bounce text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={prevSlide}
          className="animate-fadeInUp absolute top-8 left-1/2 -translate-x-1/2 transform rounded-full bg-rose-gold/20 backdrop-blur-sm p-3 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-rose-gold/30 hover:text-white"
          style={{ animationDelay: '1.8s' }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 14l5-5 5 5"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="animate-fadeInUp absolute bottom-8 left-1/2 -translate-x-1/2 transform rounded-full bg-rose-gold/20 backdrop-blur-sm p-3 text-white/70 transition-all duration-300 hover:translate-y-1 hover:scale-110 hover:bg-rose-gold/30 hover:text-white"
          style={{ animationDelay: '1.8s' }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 10l-5 5-5-5"
            />
          </svg>
        </button>

        {/* Counter */}
        <div
          className="animate-fadeInUp absolute top-8 right-8 rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center"
          style={{ animationDelay: '2s' }}
        >
          <p className="text-rose-gold text-2xl font-bold">
            {(currentSlide + 1).toString().padStart(2, '0')}
          </p>
          <p className="text-white/70 text-sm">
            de {facilitiesData.length.toString().padStart(2, '0')}
          </p>
        </div>
      </div>
    </section>
  );
}