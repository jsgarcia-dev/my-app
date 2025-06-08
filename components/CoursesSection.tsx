'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: 1,
    category: 'Cabelo',
    title: 'Cabeleireiro Profissional',
    duration: '6 meses',
    price: 'R$ 297/mês',
    description:
      'Corte, coloração, penteados e tratamentos capilares. Certificação reconhecida nacionalmente.',
    image:
      'https://via.placeholder.com/400x300/FFC0CB/B76E79?text=Curso+Cabelo',
    highlights: [
      'Técnicas modernas',
      'Colorimetria avançada',
      'Gestão de salão',
    ],
    color: 'rose-gold',
  },
  {
    id: 2,
    category: 'Maquiagem',
    title: 'Maquiagem & Visagismo',
    duration: '4 meses',
    price: 'R$ 247/mês',
    description:
      'Maquiagem social, artística e para noivas. Aprenda visagismo e harmonização facial.',
    image:
      'https://via.placeholder.com/400x300/6B46C1/FFFFFF?text=Curso+Maquiagem',
    highlights: ['Maquiagem HD', 'Pele negra', 'Noivas e eventos'],
    color: 'deep-purple',
  },
  {
    id: 3,
    category: 'Unhas',
    title: 'Manicure & Nail Designer',
    duration: '3 meses',
    price: 'R$ 197/mês',
    description:
      'Manicure, pedicure, alongamento e nail art. Domine as técnicas mais procuradas.',
    image: 'https://via.placeholder.com/400x300/FFC0CB/B76E79?text=Curso+Unhas',
    highlights: ['Fibra de vidro', 'Gel moldado', 'Decoração 3D'],
    color: 'rose-gold',
  },
  {
    id: 4,
    category: 'Estética',
    title: 'Estética Facial & Corporal',
    duration: '8 meses',
    price: 'R$ 397/mês',
    description:
      'Tratamentos faciais, corporais e terapias estéticas. Formação completa em estética.',
    image:
      'https://via.placeholder.com/400x300/6B46C1/FFFFFF?text=Curso+Estetica',
    highlights: ['Limpeza de pele', 'Massagens', 'Protocolos estéticos'],
    color: 'deep-purple',
  },
  {
    id: 5,
    category: 'Gestão',
    title: 'Gestão para Salões de Beleza',
    duration: '2 meses',
    price: 'R$ 147/mês',
    description:
      'Aprenda a gerenciar seu próprio negócio. Marketing, finanças e atendimento.',
    image:
      'https://via.placeholder.com/400x300/FFC0CB/B76E79?text=Curso+Gestao',
    highlights: ['Marketing digital', 'Gestão financeira', 'Fidelização'],
    color: 'rose-gold',
  },
];

const categories = [
  'Todos',
  'Cabelo',
  'Maquiagem',
  'Unhas',
  'Estética',
  'Gestão',
];

export default function CoursesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [filteredCourses, setFilteredCourses] = useState(courses);

  useEffect(() => {
    if (activeCategory === 'Todos') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) => course.category === activeCategory)
      );
    }
  }, [activeCategory]);

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
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Filter buttons animation
      if (filterRef.current) {
        gsap.fromTo(
          filterRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: filterRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Cards animation
      ScrollTrigger.batch('.course-card', {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            overwrite: true,
          }),
        onLeave: (batch) =>
          gsap.to(batch, {
            opacity: 0,
            y: 100,
            scale: 0.9,
            stagger: 0.15,
            overwrite: true,
          }),
        onEnterBack: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            overwrite: true,
          }),
        onLeaveBack: (batch) =>
          gsap.to(batch, {
            opacity: 0,
            y: -100,
            scale: 0.9,
            stagger: 0.15,
            overwrite: true,
          }),
        start: 'top 85%',
        end: 'bottom 15%',
      });

      // Set initial state for cards
      gsap.set('.course-card', { opacity: 0, y: 100, scale: 0.9 });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredCourses]);

  return (
    <section
      ref={sectionRef}
      className="bg-cream/30 relative overflow-hidden py-20 lg:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-deep-purple/5 absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-rose-gold/5 absolute bottom-0 left-0 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <div className="mb-12 text-center">
          <h2
            ref={titleRef}
            className="font-outfit text-charcoal mb-4 text-4xl font-bold lg:text-5xl tracking-tight"
          >
            Nossos <span className="text-charcoal font-bold">Cursos</span>{' '}
            Profissionalizantes
          </h2>
          <p className="text-charcoal/70 mx-auto max-w-2xl text-lg">
            Escolha sua área de interesse e comece sua jornada rumo ao sucesso
            profissional
          </p>
        </div>

        {/* Filter */}
        <div
          ref={filterRef}
          className="mb-12 flex flex-wrap justify-center gap-4"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#2a9d8f] scale-105 transform text-white shadow-lg'
                  : 'text-charcoal hover:bg-[#2a9d8f]/10 hover:text-[#2a9d8f] bg-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div
          ref={cardsRef}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="course-card group transform overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="from-charcoal/50 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
                  <span className="text-charcoal text-sm font-medium">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-charcoal mb-2 text-2xl font-semibold">
                  {course.title}
                </h3>
                <p className="text-charcoal/70 mb-4">{course.description}</p>

                {/* Highlights */}
                <div className="mb-6 space-y-2">
                  {course.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-[#2a9d8f]"
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
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-charcoal/60 text-sm">Duração</p>
                    <p className="text-charcoal font-semibold">
                      {course.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-charcoal/60 text-sm">Investimento</p>
                    <p className="text-rose-gold text-2xl font-bold">
                      {course.price}
                    </p>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full bg-[#2a9d8f] hover:bg-[#2a9d8f]/90 font-semibold text-white"
                >
                  Saiba Mais
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-charcoal/70 mb-6 text-lg">
            Não encontrou o curso ideal? Temos mais opções!
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-[#2a9d8f] text-[#2a9d8f] hover:bg-[#2a9d8f] hover:text-white"
          >
            Ver Todos os Cursos
          </Button>
        </div>
      </div>
    </section>
  );
}
