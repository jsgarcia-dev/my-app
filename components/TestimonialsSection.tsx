'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'Ana Carolina Silva',
    age: 28,
    course: 'Cabeleireiro Profissional',
    before: 'Desempregada há 2 anos',
    after: 'Proprietária do Salão Ana Hair',
    image: 'https://via.placeholder.com/150x150/B76E79/FFFFFF?text=Ana',
    quote:
      'O Studio Garcia mudou minha vida! Saí de desempregada para proprietária do meu próprio salão em menos de 1 ano. Os professores são incríveis e o apoio que recebi foi fundamental.',
    earnings: 'De R$ 0 para R$ 8.000/mês',
    rating: 5,
    video: true,
  },
  {
    id: 2,
    name: 'Juliana Santos',
    age: 24,
    course: 'Maquiagem & Visagismo',
    before: 'Vendedora em loja',
    after: 'Maquiadora de noivas',
    image: 'https://via.placeholder.com/150x150/6B46C1/FFFFFF?text=Juliana',
    quote:
      'Sempre sonhei em trabalhar com beleza. O curso me deu todas as técnicas que preciso e hoje trabalho em eventos e casamentos. Minha renda triplicou!',
    earnings: 'De R$ 1.200 para R$ 4.500/mês',
    rating: 5,
    video: false,
  },
  {
    id: 3,
    name: 'Marina Costa',
    age: 35,
    course: 'Estética Facial & Corporal',
    before: 'Funcionária de escritório',
    after: 'Esteticista em clínica renomada',
    image: 'https://via.placeholder.com/150x150/FFC0CB/B76E79?text=Marina',
    quote:
      'Mudei de carreira aos 35 anos e não me arrependo. O mercado de estética está em alta e com o conhecimento que adquiri, consegui um ótimo emprego.',
    earnings: 'De R$ 2.500 para R$ 5.800/mês',
    rating: 5,
    video: false,
  },
];

const metrics = [
  { value: '95%', label: 'Taxa de Empregabilidade', icon: '💼' },
  { value: '150%', label: 'Aumento Médio de Renda', icon: '💰' },
  { value: '500+', label: 'Alunos Formados', icon: '🎓' },
  { value: '4.9', label: 'Avaliação Média', icon: '⭐' },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const cardsRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

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

      // Cards animation
      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, y: 100, rotateX: -15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Metrics animation
      gsap.fromTo(
        '.metric-item',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: metricsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-20 lg:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-rose-gold/5 absolute top-1/3 -right-20 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-deep-purple/5 absolute bottom-1/3 -left-20 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2
            ref={titleRef}
            className="font-space-grotesk text-charcoal mb-4 text-4xl font-bold lg:text-5xl tracking-tight"
          >
            Histórias de <span className="text-charcoal font-bold">Transformação</span>
          </h2>
          <p className="text-charcoal/70 mx-auto max-w-2xl text-lg">
            Conheça alguns de nossos alunos que transformaram suas vidas através
            da educação profissional
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="bg-cream/30 relative mb-16 rounded-3xl p-8 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Content */}
            <div>
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonials[activeTestimonial].rating)].map(
                    (_, i) => (
                      <svg
                        key={i}
                        className="h-6 w-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )
                  )}
                </div>
                <blockquote className="text-charcoal mb-6 text-xl leading-relaxed font-medium lg:text-2xl">
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </blockquote>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-white p-4">
                  <span className="text-charcoal/70">Situação Anterior:</span>
                  <span className="text-charcoal font-semibold">
                    {testimonials[activeTestimonial].before}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white p-4">
                  <span className="text-charcoal/70">Situação Atual:</span>
                  <span className="text-rose-gold font-semibold">
                    {testimonials[activeTestimonial].after}
                  </span>
                </div>
                <div className="bg-gradient-beauty-soft flex items-center justify-between rounded-lg p-4">
                  <span className="text-charcoal/70">Evolução de Renda:</span>
                  <span className="text-deep-purple font-bold">
                    {testimonials[activeTestimonial].earnings}
                  </span>
                </div>
              </div>
            </div>

            {/* Image and Info */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="border-rose-gold mx-auto h-48 w-48 overflow-hidden rounded-full border-4 shadow-2xl">
                  <Image
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    width={192}
                    height={192}
                    className="h-full w-full object-cover"
                  />
                </div>
                {testimonials[activeTestimonial].video && (
                  <div className="bg-rose-gold absolute -right-2 -bottom-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="text-charcoal mb-2 text-2xl font-semibold">
                {testimonials[activeTestimonial].name}
              </h3>
              <p className="text-charcoal/70 mb-1">
                {testimonials[activeTestimonial].age} anos
              </p>
              <p className="text-deep-purple font-medium">
                Formada em {testimonials[activeTestimonial].course}
              </p>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="mt-8 flex justify-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === index
                    ? 'bg-rose-gold scale-125'
                    : 'bg-rose-gold/30 hover:bg-rose-gold/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div ref={cardsRef} className="mb-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`testimonial-card transform cursor-pointer rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                activeTestimonial === index ? 'ring-rose-gold ring-2' : ''
              }`}
              onClick={() => setActiveTestimonial(index)}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="border-rose-gold/20 h-16 w-16 overflow-hidden rounded-full border-2">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-charcoal font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-charcoal/70 text-sm">
                    {testimonial.course}
                  </p>
                </div>
              </div>

              <p className="text-charcoal/80 line-clamp-3 text-sm">
                {testimonial.quote}
              </p>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-rose-gold text-xs font-semibold">
                  {testimonial.earnings}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Success Metrics */}
        <div ref={metricsRef} className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="metric-item rounded-2xl bg-white p-6 text-center shadow-lg"
            >
              <div className="mb-3 text-4xl">{metric.icon}</div>
              <div className="text-rose-gold mb-2 text-3xl font-bold">
                {metric.value}
              </div>
              <p className="text-charcoal/70 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
