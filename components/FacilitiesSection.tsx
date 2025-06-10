'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FacilitiesSlider from './FacilitiesSlider';
import { useAnimatedTitle } from '@/hooks/useAnimatedTitle';

gsap.registerPlugin(ScrollTrigger);

const facilities = [
  {
    id: 1,
    title: 'Sala de Corte e Coloração',
    description:
      'Equipada com cadeiras profissionais, lavatórios modernos e todos os produtos necessários para aprender as melhores técnicas.',
    image: '/rooms/room-1.jpg',
    features: [
      '8 Estações de trabalho',
      'Lavatórios profissionais',
      'Iluminação LED',
      'Climatização',
    ],
    category: 'cabelo',
  },
  {
    id: 2,
    title: 'Estúdio de Maquiagem',
    description:
      'Ambiente com iluminação perfeita e espelhos Hollywood para o aprendizado de maquiagem profissional.',
    image: '/rooms/room-2.jpg',
    features: [
      'Iluminação Hollywood',
      'Cadeiras giratórias',
      'Kit completo de produtos',
      'Espelhos HD',
    ],
    category: 'maquiagem',
  },
  {
    id: 3,
    title: 'Laboratório de Estética',
    description:
      'Macas profissionais e equipamentos de última geração para tratamentos faciais e corporais.',
    image: '/rooms/room-3.jpg',
    features: [
      'Macas elétricas',
      'Vapor de ozônio',
      'Alta frequência',
      'Produtos profissionais',
    ],
    category: 'estetica',
  },
  {
    id: 4,
    title: 'Sala de Nail Design',
    description:
      'Espaço dedicado ao aprendizado de manicure, pedicure e nail art com toda estrutura necessária.',
    image: '/rooms/room-1.jpg',
    features: [
      'Mesas ergonômicas',
      'Aspiradores de pó',
      'Cabine UV',
      'Esterilizadores',
    ],
    category: 'unhas',
  },
  {
    id: 5,
    title: 'Auditório Multimídia',
    description:
      'Espaço para aulas teóricas com projeção em alta definição e sistema de som profissional.',
    image: '/rooms/room-2.jpg',
    features: [
      'Capacidade 40 pessoas',
      'Projetor 4K',
      'Sistema de som',
      'Ar condicionado',
    ],
    category: 'teoria',
  },
  {
    id: 6,
    title: 'Salão Escola',
    description:
      'Ambiente real de salão onde alunos atendem clientes supervisionados por professores.',
    image: '/rooms/room-3.jpg',
    features: [
      'Atendimento real',
      'Supervisão docente',
      'Ambiente profissional',
      'Experiência prática',
    ],
    category: 'pratica',
  },
];

const categories = [
  { id: 'all', name: 'Todas', icon: '🏢' },
  { id: 'cabelo', name: 'Cabelo', icon: '✂️' },
  { id: 'maquiagem', name: 'Maquiagem', icon: '💄' },
  { id: 'estetica', name: 'Estética', icon: '🧴' },
  { id: 'unhas', name: 'Unhas', icon: '💅' },
  { id: 'teoria', name: 'Teoria', icon: '📚' },
  { id: 'pratica', name: 'Prática', icon: '👥' },
];

export default function FacilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [filteredFacilities, setFilteredFacilities] = useState(facilities);
  const gridRef = useRef<HTMLDivElement>(null);

  // Use the new animated title hook
  useAnimatedTitle(titleContainerRef, {
    duration: 0.8,
    stagger: 0.2,
    yOffset: 50,
    start: 'top 80%',
  });

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredFacilities(facilities);
    } else {
      setFilteredFacilities(
        facilities.filter((facility) => facility.category === activeCategory)
      );
    }
  }, [activeCategory]);

  useEffect(() => {
    if (viewMode === 'grid') {
      const ctx = gsap.context(() => {
        // Grid items animation
        ScrollTrigger.batch('.facility-card', {
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotation: 0,
              stagger: 0.1,
              duration: 0.8,
              ease: 'power3.out',
              overwrite: true,
            }),
          onLeave: (batch) =>
            gsap.to(batch, {
              opacity: 0,
              y: 100,
              scale: 0.9,
              stagger: 0.1,
              overwrite: true,
            }),
          onEnterBack: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.1,
              overwrite: true,
            }),
          start: 'top 85%',
          end: 'bottom 15%',
        });

        // Set initial state
        gsap.set('.facility-card', {
          opacity: 0,
          y: 100,
          scale: 0.9,
          rotation: 2,
        });
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [viewMode, filteredFacilities]);

  if (viewMode === 'slider') {
    return (
      <div className="relative">
        {/* View Mode Toggle */}
        <div className="absolute top-8 right-8 z-30">
          <button
            onClick={() => setViewMode('grid')}
            className="rounded-full bg-white/20 backdrop-blur-sm p-3 text-white/80 transition-all duration-300 hover:bg-white/30 hover:text-white"
            title="Ver em grade"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
        <FacilitiesSlider />
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="bg-cream/30 relative overflow-hidden py-20 lg:py-32"
      data-menu-color="black"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-rose-gold/5 absolute top-0 left-0 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-deep-purple/5 absolute right-0 bottom-0 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* View Mode Toggle */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setViewMode('slider')}
            className="rounded-full bg-deep-purple/20 backdrop-blur-sm p-3 text-deep-purple transition-all duration-300 hover:bg-deep-purple hover:text-white"
            title="Ver apresentação"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div 
          ref={titleContainerRef}
          className="mb-12 text-center font-space-grotesk text-charcoal text-4xl font-bold lg:text-5xl tracking-tight relative z-10"
        >
          <h2 className="mb-4">
            Nossas <span className="text-rose-gold">Instalações</span>
          </h2>
          <p className="text-charcoal/70 mx-auto max-w-2xl text-lg font-sans font-normal tracking-normal">
            Infraestrutura moderna e equipamentos profissionais para sua melhor
            experiência de aprendizado
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-deep-purple scale-105 transform text-white shadow-lg'
                  : 'text-charcoal hover:bg-deep-purple/10 hover:text-deep-purple bg-white'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div
          ref={gridRef}
          className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="facility-card group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
              onClick={() => setSelectedFacility(facility.id)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="from-charcoal/50 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* View button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button className="text-charcoal rounded-full bg-white/90 px-6 py-3 font-semibold backdrop-blur-sm transition-colors hover:bg-white">
                    Ver Detalhes
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-charcoal mb-3 text-xl font-semibold">
                  {facility.title}
                </h3>
                <p className="text-charcoal/70 mb-4 line-clamp-2">
                  {facility.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {facility.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="text-rose-gold h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-charcoal/70 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                  {facility.features.length > 2 && (
                    <p className="text-rose-gold text-sm font-medium">
                      +{facility.features.length - 2} características
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
          <h3 className="text-charcoal mb-4 text-2xl font-semibold">
            Quer conhecer nossas instalações pessoalmente?
          </h3>
          <p className="text-charcoal/70 mx-auto mb-6 max-w-2xl">
            Agende uma visita guiada e veja de perto toda nossa infraestrutura.
            Nossa equipe estará pronta para tirar todas suas dúvidas.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-rose-gold hover:bg-rose-gold/90 text-white"
            >
              Agendar Visita Gratuita
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-deep-purple text-deep-purple hover:bg-deep-purple hover:text-white"
            >
              Tour Virtual 360°
            </Button>
          </div>
        </div>

        {/* Safety Note */}
        <div className="from-rose-gold/10 to-deep-purple/10 mt-12 rounded-2xl bg-gradient-to-r p-6">
          <div className="flex items-center gap-4">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-charcoal mb-1 font-semibold">
                Protocolos de Segurança e Higiene
              </h4>
              <p className="text-charcoal/70 text-sm">
                Seguimos rigorosamente todos os protocolos de segurança,
                esterilização e higiene exigidos pela ANVISA para garantir sua
                saúde e bem-estar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal placeholder for facility details */}
      {selectedFacility && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedFacility(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-charcoal text-2xl font-semibold">
                  {facilities.find((f) => f.id === selectedFacility)?.title}
                </h3>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* Modal content would go here */}
              <p className="text-charcoal/70">
                Detalhes completos da instalação em breve...
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
