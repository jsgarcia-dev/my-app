'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const slidesData = [
  {
    id: 'section-spaces-1',
    tag: 'Sala Executiva',
    description: 'Espaço de 30m² ideal para consultórios e escritórios',
    image: '/rooms/room-1.jpg',
  },
  {
    id: 'section-spaces-2',
    tag: 'Sala Comercial',
    description: 'Perfeita para pequenos comércios e lojas',
    image: '/rooms/room-2.jpg',
  },
  {
    id: 'section-spaces-3',
    tag: 'Sala Premium',
    description: 'Espaço amplo para clínicas e serviços especializados',
    image: '/rooms/room-3.jpg',
  },
  {
    id: 'section-spaces-4',
    tag: 'Sala Compacta',
    description: 'Ideal para profissionais autônomos e startups',
    image: '/rooms/room-1.jpg',
  },
  {
    id: 'section-spaces-5',
    tag: 'Sala Dupla',
    description: 'Dois ambientes integrados para maior versatilidade',
    image: '/rooms/room-2.jpg',
  },
];

export default function Rooms() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(
      (prev) => (prev - 1 + slidesData.length) % slidesData.length
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
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 1200) return; // Throttle scrolling

      if (e.deltaY > 50) {
        nextSlide();
        lastScrollTimeRef.current = now;
      } else if (e.deltaY < -50) {
        prevSlide();
        lastScrollTimeRef.current = now;
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
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    // Prevent default scroll behavior
    const preventScroll = (e: Event) => {
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
  }, [isTransitioning]);

  return (
    <section
      ref={containerRef}
      id="rooms-section"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Images */}
      {slidesData.map((slide, index) => {
        const isActive = index === currentSlide;
        const isPrev =
          index === currentSlide - 1 ||
          (currentSlide === 0 && index === slidesData.length - 1);
        const isNext =
          index === currentSlide + 1 ||
          (currentSlide === slidesData.length - 1 && index === 0);

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
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${transformClass} ${opacityClass}`}
            style={{
              zIndex: zIndexValue,
            }}
          >
            <Image
              src={slide.image}
              alt={`${slide.tag} background`}
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
                  ? 'bg-gradient-to-b from-black/30 via-black/50 to-black/80'
                  : 'bg-gradient-to-b from-black/60 via-black/70 to-black/90'
              }`}
            />
          </div>
        );
      })}

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-8 text-center text-white">
        <div className="max-w-4xl">
          <h1
            key={`title-${currentSlide}`}
            className="animate-slideInTitle text-stroke mb-6 font-[family-name:var(--font-playfair)] text-4xl leading-none font-bold tracking-tight md:text-6xl lg:text-7xl xl:text-8xl"
            style={{
              textShadow:
                '0 4px 30px rgba(0,0,0,0.9), 0 8px 60px rgba(0,0,0,0.7), 0 0 100px rgba(255,255,255,0.1)',
              animationDelay: '0.2s',
            }}
          >
            {slidesData[currentSlide].tag}
          </h1>
          <div
            key={`divider-${currentSlide}`}
            className="animate-fadeInDivider mx-auto mb-8 h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              animationDelay: '0.8s',
              boxShadow: '0 0 20px rgba(255,255,255,0.5)',
            }}
          ></div>
          <p
            key={`description-${currentSlide}`}
            className="animate-slideInDescription mx-auto max-w-2xl font-[family-name:var(--font-inter)] text-lg leading-relaxed font-light md:text-xl lg:text-2xl"
            style={{
              animationDelay: '1.2s',
              textShadow:
                '0 2px 20px rgba(0,0,0,0.9), 0 4px 40px rgba(0,0,0,0.7)',
              letterSpacing: '0.5px',
            }}
          >
            {slidesData[currentSlide].description}
          </p>
        </div>

        {/* Navigation */}
        <div
          className="animate-fadeInUp absolute top-1/2 right-8 -translate-y-1/2 transform text-center"
          style={{ animationDelay: '1.6s' }}
        >
          <div className="flex flex-col space-y-3">
            {slidesData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full backdrop-blur-sm transition-all duration-500 ${
                  index === currentSlide
                    ? 'scale-125 bg-white shadow-lg shadow-white/30'
                    : 'bg-white/40 hover:scale-110 hover:bg-white/70'
                }`}
                style={{
                  animationDelay: `${1.8 + index * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="animate-fadeInUp absolute bottom-24 left-1/2 -translate-x-1/2 transform text-center"
          style={{ animationDelay: '2s' }}
        >
          <p className="mb-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-wide text-white/80">
            Role para explorar os espaços
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
          className="animate-fadeInUp absolute top-8 left-1/2 -translate-x-1/2 transform rounded-full p-2 text-white/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:text-white"
          style={{ animationDelay: '1.4s' }}
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
          className="animate-fadeInUp absolute bottom-8 left-1/2 -translate-x-1/2 transform rounded-full p-2 text-white/70 backdrop-blur-sm transition-all duration-300 hover:translate-y-1 hover:scale-110 hover:text-white"
          style={{ animationDelay: '1.4s' }}
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
      </div>
    </section>
  );
}
