'use client';

import React, { useRef } from 'react';
// Importaremos o GSAP quando formos adicionar as animações
// import gsap from 'gsap';

const DynamicBackground = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  // TODO: Adicionar animações com GSAP aqui
  // useEffect(() => {
  //   if (backgroundRef.current) {
  //     // Exemplo de animação simples (a ser substituída)
  //     gsap.to(backgroundRef.current, {
  //       duration: 5,
  //       backgroundPosition: '200% 200%',
  //       repeat: -1,
  //       ease: 'linear',
  //     });
  //   }
  // }, []);

  return (
    <div
      ref={backgroundRef}
      className="absolute inset-0 overflow-hidden" // Garante que o conteúdo não transborde
    >
      {/* Camada de Gradiente */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 opacity-90"
        // O estilo do gradiente pode ser ajustado para corresponder mais precisamente à imagem.
        // Poderíamos usar múltiplos gradientes ou um SVG para as ondas.
      ></div>

      {/* Efeito Granulado (placeholder) */}
      {/* Uma forma de fazer isso é com um SVG filter ou uma imagem de ruído como background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/noise.png)', // Precisaremos adicionar uma imagem de ruído em public/
          backgroundRepeat: 'repeat',
        }}
      ></div>

      {/* Efeito de Vinheta/Sombra Interna para dar profundidade (opcional) */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 100px 20px rgba(0,0,0,0.2)',
        }}
      ></div>

      {/* Placeholder para as ondas SVG (a serem animadas com GSAP) */}
      {/* 
      <svg viewBox="0 0 1440 500" className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(128, 90, 213, 0.5)' }} />
            <stop offset="50%" style={{ stopColor: 'rgba(59, 130, 246, 0.5)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(20, 184, 166, 0.5)' }} />
          </linearGradient>
        </defs>
        <path
          ref={wavePathRef1} // Referência para animar com GSAP
          fill="url(#waveGradient)"
          d="M0,128 C240,192 240,64 480,128 C720,192 720,64 960,128 C1200,192 1200,64 1440,128 L1440,500 L0,500 Z"
        />
        <path
          ref={wavePathRef2} // Referência para animar com GSAP
          fill="url(#waveGradient)"
          opacity="0.7"
          d="M0,160 C200,224 280,96 480,160 C680,224 760,96 960,160 C1160,224 1240,96 1440,160 L1440,500 L0,500 Z"
          transform="translate(0 20)"
        />
      </svg> 
      */}
    </div>
  );
};

export default DynamicBackground;
