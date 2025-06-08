'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import HamburgerIcon from './hamburger-icon';

// Registrar o plugin GSAP necessário
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const menuLinks = [
  { path: '/', label: 'INÍCIO' },
  { path: '#cursos', label: 'CURSOS' },
  { path: '#sobre', label: 'SOBRE' },
  { path: '#depoimentos', label: 'DEPOIMENTOS' },
  { path: '#contato', label: 'CONTATO' },
];

// Breakpoint similar ao 'lg' do Tailwind (1024px)
const LG_BREAKPOINT = 1024;

export default function Menu() {
  const container = useRef<HTMLDivElement>(null);
  const menuIconContainerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const iconTl = useRef<gsap.core.Timeline | null>(null);
  const isInitialized = useRef(false);

  const toggleMenu = () => {
    if (!isInitialized.current) {
      initializeAnimations();
    }
    setIsMenuOpen((prevState) => !prevState);
  };

  // Função para inicializar as animações separada do useGSAP
  const initializeAnimations = () => {
    if (!container.current || !menuIconContainerRef.current) return;

    // Limpar timelines existentes
    if (tl.current) tl.current.kill();
    if (iconTl.current) iconTl.current.kill();

    // --- Setup Inicial ---
    const menuLinkHolders = container.current.querySelectorAll(
      '.menu-link-item-holder'
    );
    gsap.set(menuLinkHolders, { y: 75 });

    // --- Animação da Forma do Ícone ---
    const iconLines = container.current.querySelectorAll(
      '.hamburger-icon .line'
    );
    if (iconLines.length > 0) {
      gsap.set(iconLines, {
        transformOrigin: 'center center',
        stroke: 'black',
      });

      const topLine = container.current.querySelector('.hamburger-icon .top');
      const bottomLine = container.current.querySelector(
        '.hamburger-icon .bottom'
      );

      if (topLine && bottomLine) {
        gsap.set(topLine, { rotate: 0, y: 0 });
        gsap.set(bottomLine, { rotate: 0, y: 0 });

        iconTl.current = gsap
          .timeline({ paused: true })
          .to(
            topLine,
            {
              duration: 0.3,
              rotate: 45,
              y: 6,
              stroke: 'white',
              ease: 'power2.inOut',
            },
            'cross'
          )
          .to(
            bottomLine,
            {
              duration: 0.3,
              rotate: -45,
              y: -6,
              stroke: 'white',
              ease: 'power2.inOut',
            },
            'cross'
          );
      }
    } else {
      console.error('GSAP não encontrou as linhas do ícone do hamburger!');
    }

    // --- Animação do Overlay (relativamente independente de breakpoint) ---
    const menuOverlay = container.current.querySelector('.menu-overlay');

    if (menuOverlay) {
      // -- Animação do Overlay --
      tl.current = gsap
        .timeline({ paused: true })
        .set(menuOverlay, {
          clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        })
        .to(
          menuOverlay,
          {
            duration: 0.4,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            ease: 'power2.inOut',
          },
          'start'
        )
        .to(
          menuLinkHolders,
          {
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out',
          },
          'start+=0.2'
        );
    }

    // Não usaremos mais a lógica baseada em window.innerWidth
    // Usaremos classes CSS para posicionamento fixo, mais consistente

    // Marcar como inicializado no final da configuração
    isInitialized.current = true;
  };

  // Inicialização após montagem do componente e listener de resize
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initializeAnimations();
    }, 100); // Delay ajustado para garantir renderização inicial

    const handleResize = () => {
      // Reinitialize animations para adaptar ao novo tamanho da viewport
      initializeAnimations();

      // Ajustar estado das timelines após redimensionamento
      if (isInitialized.current && tl.current && iconTl.current) {
        if (isMenuOpen) {
          tl.current.progress(1).pause(); // Vai para o final e pausa
          iconTl.current.progress(1).pause();
        } else {
          tl.current.progress(0).pause(); // Vai para o início e pausa
          iconTl.current.progress(0).pause();
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);

      // Limpar recursos ao desmontar o componente
      if (tl.current) {
        tl.current.kill();
        tl.current = null;
      }
      if (iconTl.current) {
        iconTl.current.kill();
        iconTl.current = null;
      }

      isInitialized.current = false; // Resetar estado de inicialização
    };
  }, []); // Sem dependências, roda apenas na montagem e desmontagem

  // Efeito para as animações quando isMenuOpen muda
  useEffect(() => {
    if (!isInitialized.current || !tl.current || !iconTl.current) {
      return;
    }

    try {
      if (isMenuOpen) {
        tl.current.play();
        iconTl.current.play();
        document.body.style.overflow = 'hidden';
      } else {
        iconTl.current.reverse();
        tl.current.reverse();
        document.body.style.overflow = 'auto';
      }
    } catch (error) {
      console.error('Erro ao animar o menu:', error);
    }
  }, [isMenuOpen]);

  return (
    <div className="h-full w-full" ref={container}>
      {/* Sobreposição do Menu Quadrada e Responsiva */}
      <div
        className="menu-overlay fixed top-4 right-[5%] z-[190] aspect-square w-[calc(100vw-2rem)] rounded-2xl bg-black lg:top-8 lg:aspect-auto lg:h-[500px] lg:w-[520px]"
        style={{
          clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          pointerEvents: isMenuOpen ? 'auto' : 'none',
        }}
      >
        {/* Padding interno responsivo */}
        <div className="flex h-full flex-col px-6 pt-16 pb-10 lg:px-12 lg:pt-20 lg:pb-12">
          <div className="menu-links mb-auto">
            {menuLinks.map((link, index) => (
              <div key={index} className="mb-4 overflow-hidden lg:mb-6">
                <div
                  className="menu-link-item-holder relative"
                  onClick={toggleMenu}
                >
                  {/* Tamanho da fonte responsivo */}
                  <Link
                    href={link.path}
                    className="text-[40px] leading-[110%] font-normal tracking-[-0.02em] text-white transition-colors hover:text-gray-300 lg:text-[48px]"
                  >
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Footer responsivo */}
          <div className="mt-auto border-t border-gray-800 pt-6">
            {/* Layout flexível que empilha no mobile */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:gap-0">
              <div>
                <h1 className="mb-1 text-xs tracking-[0.09em] text-white lg:text-sm">
                  contact@studiogarcia.com
                </h1>
                <p className="text-xs font-normal tracking-[0.1em] text-yellow-500 lg:text-sm">
                  @studiogarcia
                </p>
              </div>
              <div className="text-left lg:text-right">
                <p className="mb-1 text-xs text-white lg:text-sm">
                  Inovação e Tecnologia
                </p>
                <p className="flex items-center justify-start text-xs text-yellow-500 lg:justify-end lg:text-sm">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500"></span>
                  Inovação e Tecnologia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Container do Ícone - posicionamento fixo com classes Tailwind */}
      <div
        ref={menuIconContainerRef}
        className={`fixed top-8 right-[5%] z-[210] flex h-auto w-auto cursor-pointer items-center justify-center`}
        onClick={toggleMenu}
      >
        <HamburgerIcon />
      </div>
    </div>
  );
}
