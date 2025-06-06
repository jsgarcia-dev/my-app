'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Balatro from '@/components/balatro';
import Menu from '@/components/menu/menu';
import AnimatedText from '@/components/AnimatedText';
import Rooms from '@/components/rooms';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação fadeIn para elementos gerais
      gsap.utils.toArray('.fade-in').forEach((element: any) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Animação para os stats numbers
      gsap.utils.toArray('.stat-number').forEach((element: any) => {
        const endValue = parseInt(element.textContent);
        const obj = { value: 0 };

        gsap.to(obj, {
          value: endValue,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            once: true,
          },
          onUpdate: () => {
            element.textContent = Math.round(obj.value) + '+';
          },
        });
      });

      // Animação stagger para cards
      gsap.utils
        .toArray('.service-card')
        .forEach((card: any, index: number) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 60,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });

      // Animação para as salas disponíveis
      gsap.utils.toArray('.room-card').forEach((card: any, index: number) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            rotateY: index % 2 === 0 ? -15 : 15,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Parallax effect para o vídeo
      const videoSection = document.querySelector('.video-container');
      if (videoSection) {
        gsap.to(videoSection, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: videoSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Animação de reveal para títulos
      gsap.utils.toArray('.section-title').forEach((title: any) => {
        gsap.fromTo(
          title,
          {
            opacity: 0,
            x: -100,
            skewY: 5,
          },
          {
            opacity: 1,
            x: 0,
            skewY: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Animação para o CTA section
      const ctaSection = document.querySelector('.cta-section');
      if (ctaSection) {
        gsap.fromTo(
          ctaSection,
          {
            scale: 0.9,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaSection,
              start: 'top 70%',
              end: 'bottom 30%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Balatro ocupando toda a largura */}
        <div className="absolute inset-0">
          <Balatro
            color1="#1e293b"
            color2="#3b82f6"
            color3="#60a5fa"
            isRotate={true}
            mouseInteraction={true}
            pixelFilter={1200}
            spinSpeed={1.5}
            contrast={2.5}
            lighting={0.6}
            spinAmount={0.2}
          />
        </div>

        {/* Overlay para conteúdo */}
        <div className="relative z-10 flex min-h-screen">
          {/* Seção de conteúdo */}
          <div className="relative flex flex-1 flex-col">
            {/* Background com curva para o menu */}
            <div 
              className="absolute top-0 right-0 h-32 bg-gray-50/95 backdrop-blur-sm"
              style={{
                width: '60%',
                clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)'
              }}
            />
            
            {/* Background com curva para o texto inferior */}
            <div 
              className="absolute bottom-0 left-0 bg-gray-50/95 backdrop-blur-sm"
              style={{
                width: '70%',
                height: '60%',
                clipPath: 'polygon(0% 40%, 80% 0%, 100% 100%, 0% 100%)'
              }}
            />
            <header className="relative z-20 flex items-center justify-between px-8 py-6 lg:px-12">
              <div className="animate-fadeInLeft flex items-center space-x-3 opacity-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
                  <span className="text-xl font-bold">SG</span>
                </div>
                <span className="text-2xl font-semibold text-gray-900">
                  Studio Garcia
                </span>
              </div>
              <div className="animate-fadeInRight opacity-0">
                <Menu />
              </div>
            </header>

            <div className="flex flex-1 items-center px-8 py-12 lg:px-12">
              <div className="max-w-xl">
                <AnimatedText
                  text="O espaço perfeito para o seu negócio"
                  className="mb-6 text-5xl leading-tight font-bold text-gray-900 lg:text-6xl"
                  animation="fadeInUp"
                  delay={0.1}
                />
                <p
                  className="fade-in mb-8 text-lg text-gray-600"
                  style={{ transitionDelay: '0.2s' }}
                >
                  Um complexo moderno com salas equipadas para profissionais de
                  diversas áreas. Nutricionistas, psicólogos, lojas e muito mais
                  em um único lugar.
                </p>
                <div
                  className="fade-in flex flex-wrap gap-4"
                  style={{ transitionDelay: '0.3s' }}
                >
                  <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-lg">
                    Conhecer Espaços
                  </button>
                  <button className="rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 transition-all hover:scale-105 hover:border-gray-400 hover:bg-gray-100">
                    Falar com Consultor
                  </button>
                </div>

                {/* Stats */}
                <div className="fade-in mt-12 grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <p className="stat-number text-3xl font-bold text-blue-600">
                      15
                    </p>
                    <p className="text-sm text-gray-600">Salas Disponíveis</p>
                  </div>
                  <div className="text-center">
                    <p className="stat-number text-3xl font-bold text-blue-600">
                      20
                    </p>
                    <p className="text-sm text-gray-600">
                      Profissionais Ativos
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">5★</p>
                    <p className="text-sm text-gray-600">Avaliação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre o Studio */}
      <section className="relative bg-white py-20">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="section-title mb-6 text-4xl font-bold text-gray-900">
                Um espaço pensado para o sucesso do seu negócio
              </h2>
              <p className="fade-in mb-6 text-lg text-gray-600">
                O Studio Garcia é um complexo comercial moderno que oferece
                infraestrutura completa para profissionais de diversas áreas.
                Localizado em região privilegiada, nosso espaço conta com:
              </p>
              <ul className="fade-in space-y-3">
                {[
                  'Salas climatizadas e mobiliadas',
                  'Recepção e área de espera compartilhada',
                  'Estacionamento privativo',
                  'Segurança 24 horas',
                  'Internet de alta velocidade',
                  'Salas de reunião disponíveis',
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="mr-3 h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="video-container aspect-video overflow-hidden rounded-2xl bg-gray-200">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                  src="/salao.mp4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profissionais Atuais */}
      <section className="relative bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="section-title mb-4 text-4xl font-bold text-gray-900">
              Profissionais e Serviços Disponíveis
            </h2>
            <p className="fade-in mx-auto max-w-2xl text-lg text-gray-600">
              Conheça alguns dos profissionais que já fazem parte do Studio
              Garcia
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Nutricionista',
                professional: 'Dra. Ana Silva',
                description:
                  'Especialista em nutrição esportiva e emagrecimento',
                icon: '🥗',
              },
              {
                title: 'Psicóloga',
                professional: 'Dra. Maria Santos',
                description: 'Terapia cognitivo-comportamental',
                icon: '🧠',
              },
              {
                title: 'Loja de Bijuterias',
                professional: 'Bella Acessórios',
                description: 'Peças exclusivas e personalizadas',
                icon: '💎',
              },
              {
                title: 'Boutique',
                professional: 'Elegance Store',
                description: 'Moda feminina contemporânea',
                icon: '👗',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="service-card hover-lift group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl"
              >
                <div className="mb-4 text-4xl">{service.icon}</div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>
                <p className="mb-2 text-sm font-medium text-blue-600">
                  {service.professional}
                </p>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-lg text-gray-600">
              + Várias salas disponíveis para novos profissionais
            </p>
            <button
              onClick={() => {
                document
                  .getElementById('rooms-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Ver Salas Disponíveis
            </button>
          </div>
        </div>
      </section>

      {/* Seção Imersiva de Espaços */}
      <Rooms />

      {/* CTA Section */}
      <section className="cta-section relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 py-20">
        <div className="relative z-10 mx-auto max-w-4xl px-8 text-center lg:px-12">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Pronto para fazer parte do Studio Garcia?
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Entre em contato conosco e agende uma visita sem compromisso
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-lg bg-white px-8 py-4 font-medium text-blue-600 transition-all hover:bg-gray-100 hover:shadow-lg">
              Agendar Visita
            </button>
            <button className="rounded-lg border-2 border-white px-8 py-4 font-medium text-white transition-all hover:bg-white hover:text-blue-600">
              WhatsApp
            </button>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <Balatro
            color1="#c1121f"
            color2="#344e41"
            color3="#219ebc"
            isRotate={true}
            mouseInteraction={false}
            pixelFilter={2000}
            spinSpeed={1.0}
            contrast={1.0}
            lighting={0.2}
            spinAmount={0.1}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Studio Garcia</h3>
              <p className="text-sm text-gray-400">
                O espaço ideal para o crescimento do seu negócio.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">
                Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Espaços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">
                Contato
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>(11) 9999-9999</li>
                <li>contato@studiogarcia.com</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">
                Endereço
              </h4>
              <p className="text-sm text-gray-400">
                Rua Example, 123
                <br />
                São Paulo - SP
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Studio Garcia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
