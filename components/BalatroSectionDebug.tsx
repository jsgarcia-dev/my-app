'use client';

import Balatro from './balatro';

export default function BalatroSectionDebug() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Balatro Background */}
      <div className="absolute inset-0 z-0">
        <Balatro
          spinRotation={-1.5}
          spinSpeed={6.0}
          offset={[0.1, -0.1]}
          color1="#B76E79" // rose-gold
          color2="#6B46C1" // deep-purple
          color3="#333333" // charcoal
          contrast={3.0}
          lighting={0.5}
          spinAmount={0.3}
          pixelFilter={800.0}
          spinEase={0.8}
          isRotate={true}
          mouseInteraction={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-8 text-center">
          <h2 className="font-playfair text-white mb-6 text-4xl font-bold">
            Pronto para transformar sua vida?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Dê o primeiro passo rumo ao sucesso profissional. Agende sua visita hoje!
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
      </div>
    </section>
  );
}