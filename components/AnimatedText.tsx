'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

interface AnimatedTextProps {
  text: string;
  className?: string;
  animationType?: 'fadeInChars' | 'marquee';
  marqueeDuration?: number; // Duração em segundos para uma volta completa do marquee
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  animationType = 'fadeInChars', // Default para a animação existente
  marqueeDuration = 20, // Duração padrão para o marquee
}) => {
  const textRef = useRef<HTMLDivElement>(null); // Alterado para HTMLDivElement para marquee
  const h1Ref = useRef<HTMLHeadingElement>(null); // Ref para o H1 interno no marquee

  useEffect(() => {
    if (animationType === 'fadeInChars' && textRef.current) {
      const split = new SplitType(textRef.current, { types: 'chars' });
      const chars = split.chars;

      if (chars) {
        gsap.from(chars, {
          duration: 0.8,
          opacity: 0,
          y: 100,
          ease: 'power4.out',
          stagger: 0.05,
        });
      }
      return () => {
        split.revert();
      };
    } else if (animationType === 'marquee' && h1Ref.current) {
      // Para o marquee, o texto é duplicado para o loop suave
      // A animação move o h1 original para a esquerda.
      // Quando ele sai completamente, a cópia toma seu lugar.
      // xPercent: -100 move uma largura inteira do texto original.
      // Para um loop perfeito com texto duplicado, precisamos que o wrapper seja largo o suficiente ou
      // que a animação seja em um elemento que contenha o texto duplicado.

      // Vamos usar um wrapper para o h1 e animar o h1 dentro dele
      const h1Element = h1Ref.current;
      // Definimos o xPercent inicial para 0 para que a animação comece corretamente
      gsap.set(h1Element, { xPercent: 0 });

      // Animação do marquee
      gsap.to(h1Element, {
        xPercent: -50, // Move 50% porque o texto está duplicado (texto + espaço + texto)
        ease: 'none',
        duration: marqueeDuration,
        repeat: -1, // Loop infinito
      });
    }
  }, [text, animationType, marqueeDuration]);

  if (animationType === 'marquee') {
    return (
      <div
        ref={textRef}
        className={`overflow-hidden whitespace-nowrap ${className || ''}`}
      >
        <h1 ref={h1Ref} className="inline-block">
          {text}&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;{' '}
          {/* Duplicar o texto para loop suave */}
        </h1>
      </div>
    );
  }

  // Animação fadeInChars (comportamento original)
  return (
    <h1 ref={textRef as any} className={`font-gabarito ${className || ''}`}>
      {text}
    </h1>
  );
};

export default AnimatedText;
