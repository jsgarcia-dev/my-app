'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CurvedOverlayProps {
  className?: string;
}

export default function CurvedOverlay({ className = '' }: CurvedOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    // Animate the path on mount
    gsap.fromTo(
      pathRef.current,
      { 
        opacity: 0,
        y: -10 
      },
      { 
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.5
      }
    );
  }, []);

  return (
    <div className={`absolute top-16 left-0 right-0 z-20 pointer-events-none ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-16 md:h-20 lg:h-24"
      >
        <defs>
          {/* Gradient for the curved shape */}
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Main curved shape with inverted border radius */}
        <path
          ref={pathRef}
          d="M 0 0 
             L 0 40
             Q 360 80 720 70
             T 1440 40
             L 1440 0
             Z"
          fill="url(#curveGradient)"
        />
      </svg>
    </div>
  );
}