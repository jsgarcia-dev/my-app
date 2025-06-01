'use client';

import Balatro from '@/components/balatro'; // Importação do componente Balatro
import Menu from '../components/menu/menu';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F0F0F0]">
      {/* SVG com definição do clip-path */}
      <div className="absolute top-50 right-50 z-0 h-22 w-22 overflow-hidden rounded-b-md bg-black/10 blur-md backdrop-blur-3xl">
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="balatroClipPath" clipPathUnits="objectBoundingBox">
              <path
                d="
              M0,0 
              L0.80,0
              Q0.85,0 0.85,0.1
              L0.85,0.2
              Q0.85,0.3 0.95,0.3
              L1,0.3
              L1,1 
              L0,1 
              Z
            "
              />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Balatro como fundo absoluto com clip-path aplicado */}
      <div
        className="absolute inset-0 z-0 backdrop-blur-sm"
        style={{ clipPath: 'url(#balatroClipPath)' }}
      >
        <Balatro
          color1="#000000"
          color2="#76BA99"
          color3="#151515"
          isRotate={false}
          mouseInteraction={false}
          pixelFilter={3000}
        />
      </div>

      {/* Conteúdo principal sobre o Balatro */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <Menu />
        {/* Outro conteúdo da página pode vir aqui se necessário */}
      </div>
    </main>
  );
}
