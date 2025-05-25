'use client';
import Balatro from '@/components/balatro';
import Image from 'next/image';
import Menu from '@/components/menu/menu'; // Certifique-se que o caminho está correto

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F0F0F0] font-[family-name:var(--font-geist-sans)] text-gray-900">
      {/* Posicione o Menu para se alinhar com a CURVA SUAVE FINAL */}
      {/* O menu deve ser transparente e o conteúdo posicionado com padding */}
      <Menu /> {/* Ajuste o estilo no próprio Menu */}
      <div className="flex flex-1 flex-col">
        <div className="grid flex-1 grid-cols-12">
          <section className="relative col-span-12 h-full">
            {/* Container relativo para o Balatro e o Logo */}
            <div className="relative h-full w-full overflow-hidden">
              {/* Background com Balatro e clip-path de CURVA SUAVE FINAL aplicado */}
              <div className="absolute inset-0 h-full w-full">
                <Balatro
                  isRotate={false}
                  mouseInteraction={false}
                  pixelFilter={8000}
                  color1="#000000"
                  color2="#162325"
                  color3="#a6a2a2"
                />
              </div>

              {/* Logo SVG sobreposto centralizado */}
              <div className="absolute inset-0 z-[2] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={300}
                    height={300}
                    className=""
                  />
                  <div className="text-center text-white select-none">
                    <h2 className="text-7xl font-bold">Studio Garcia</h2>
                    <p className="text-4xl leading-7 font-light">
                      Beauty & Academy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
