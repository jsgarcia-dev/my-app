'use client';

import HeroSectionBalatro from '@/components/HeroSectionBalatro';
import WhySection from '@/components/WhySection';
import CoursesSection from '@/components/CoursesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FacilitiesSection from '@/components/FacilitiesSection';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Hero Section with Balatro */}
      <HeroSectionBalatro />

      {/* Why Section */}
      <WhySection />

      {/* Courses Section */}
      <CoursesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Facilities Section */}
      <FacilitiesSection />

      {/* CTA Section */}
      <section className="from-rose-gold to-deep-purple relative overflow-hidden bg-gradient-to-br py-20">
        <div className="relative z-10 mx-auto max-w-4xl px-8 text-center lg:px-12">
          <h2 className="font-playfair mb-6 text-4xl font-bold text-white">
            Pronto para transformar sua vida?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Dê o primeiro passo rumo ao sucesso profissional. Agende sua visita
            hoje!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="text-rose-gold hover:bg-cream rounded-lg bg-white px-8 py-4 font-semibold transition-all hover:shadow-lg">
              Agendar Visita Gratuita
            </button>
            <button className="hover:text-deep-purple rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white">
              Falar no WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal py-12 text-white">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-rose-gold mb-4 text-lg font-semibold">
                Studio Garcia Beauty Academy
              </h3>
              <p className="text-sm text-gray-400">
                Transformando paixão em profissão desde 2009.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">
                Links Rápidos
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-rose-gold transition-colors"
                  >
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-rose-gold transition-colors"
                  >
                    Cursos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-rose-gold transition-colors"
                  >
                    Depoimentos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-rose-gold transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">
                Contato
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  (11) 99999-9999
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  contato@studiogarcia.com.br
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase">
                Localização
              </h4>
              <p className="text-sm text-gray-400">
                Rua das Flores, 456
                <br />
                Centro - Itaquaquecetuba/SP
                <br />
                CEP: 08570-000
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  className="hover:text-rose-gold text-gray-400 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="hover:text-rose-gold text-gray-400 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>
              © 2024 Studio Garcia Beauty Academy. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
