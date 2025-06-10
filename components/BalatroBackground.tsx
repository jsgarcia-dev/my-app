'use client';

import { useEffect, useRef } from 'react';
import Balatro from './balatro';

interface BalatroBackgroundProps {
  className?: string;
}

export default function BalatroBackground({ className = '' }: BalatroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Balatro container with mask - covers full width */}
      <div 
        ref={containerRef}
        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none balatro-inverted"
      >
        <Balatro
          spinRotation={-1.0}
          spinSpeed={5.0}
          offset={[0.0, 0.0]}
          color1="#000000"
          color2="#2a9d8f"
          color3="#343a40"
          contrast={2.8}
          lighting={0.6}
          spinAmount={0.2}
          pixelFilter={2000.0}
          spinEase={0.9}
          isRotate={true}
          mouseInteraction={true}
        />
      </div>
      
    </>
  );
}