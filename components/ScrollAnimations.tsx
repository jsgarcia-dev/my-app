'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationsProps {
  children: React.ReactNode;
}

export default function ScrollAnimations({ children }: ScrollAnimationsProps) {
  useEffect(() => {
    // Configurações globais do ScrollTrigger
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      markers: false
    });

    // Animação de linha decorativa
    const decorativeLines = gsap.utils.toArray('.decorative-line');
    decorativeLines.forEach((line: any) => {
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 80%'
          }
        }
      );
    });

    // Animação de blur progressivo
    const blurElements = gsap.utils.toArray('.blur-in');
    blurElements.forEach((element: any) => {
      gsap.fromTo(element,
        {
          filter: 'blur(10px)',
          opacity: 0
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 75%'
          }
        }
      );
    });

    // Animação de rotação 3D para cards especiais
    const flipCards = gsap.utils.toArray('.flip-card');
    flipCards.forEach((card: any) => {
      gsap.set(card, { transformPerspective: 1000 });
      gsap.fromTo(card,
        {
          rotateX: -90,
          opacity: 0,
          transformOrigin: 'center bottom'
        },
        {
          rotateX: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%'
          }
        }
      );
    });

    // Animação de texto com efeito de máquina de escrever
    const typewriterElements = gsap.utils.toArray('.typewriter');
    typewriterElements.forEach((element: any) => {
      const text = element.textContent;
      element.textContent = '';
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          once: true
        }
      });

      text.split('').forEach((char: string, index: number) => {
        tl.to(element, {
          duration: 0.05,
          onComplete: function() {
            element.textContent += char;
          }
        }, index * 0.05);
      });
    });

    // Animação de escala com bounce
    const bounceElements = gsap.utils.toArray('.bounce-in');
    bounceElements.forEach((element: any, index: number) => {
      gsap.fromTo(element,
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'back.out(2.5)',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%'
          }
        }
      );
    });

    // Animação de gradiente móvel
    const gradientElements = gsap.utils.toArray('.gradient-shift');
    gradientElements.forEach((element: any) => {
      gsap.to(element, {
        backgroundPosition: '100% 50%',
        duration: 3,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}