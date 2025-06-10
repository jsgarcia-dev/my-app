import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTitleOptions {
  trigger?: string;
  start?: string;
  duration?: number;
  stagger?: number;
  y?: number;
  once?: boolean;
}

export function useAnimatedTitle(
  containerRef: RefObject<HTMLDivElement>,
  options: AnimatedTitleOptions = {}
) {
  const {
    trigger,
    start = 'top 80%',
    duration = 1,
    stagger = 0.2,
    y = 50,
    once = true,
  } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p');

    if (elements.length === 0) return;

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // Set initial state - prevent flash of content
      gsap.set(elements, {
        opacity: 0,
        y: y,
      });

      // Create animation
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: duration,
        stagger: stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger || container,
          start: start,
          once: once,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, trigger, start, duration, stagger, y, once]);
}