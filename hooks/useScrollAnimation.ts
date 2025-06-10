import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollAnimationOptions {
  animation?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'rotateIn';
  duration?: number;
  delay?: number;
  start?: string;
  end?: string;
  scrub?: boolean;
  pin?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    animation = 'fadeIn',
    duration = 1,
    delay = 0,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    pin = false,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationProps: gsap.TweenVars = {};
    let initialProps: gsap.TweenVars = {};

    switch (animation) {
      case 'fadeIn':
        initialProps = { opacity: 0, y: 50 };
        animationProps = { opacity: 1, y: 0 };
        break;
      case 'slideIn':
        initialProps = { x: -100, opacity: 0 };
        animationProps = { x: 0, opacity: 1 };
        break;
      case 'scaleIn':
        initialProps = { scale: 0.8, opacity: 0 };
        animationProps = { scale: 1, opacity: 1 };
        break;
      case 'rotateIn':
        initialProps = { rotation: -15, opacity: 0 };
        animationProps = { rotation: 0, opacity: 1 };
        break;
    }

    // Ensure element is visible first
    element.style.opacity = '1';
    
    // Use gsap.from instead of gsap.to to avoid initial invisible state
    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: element,
      start,
      end,
      toggleActions: scrub ? undefined : 'play none none none',
      scrub,
      pin,
      once: true,
    };

    // Animate FROM the initial state, so content starts visible
    gsap.from(element, {
      ...initialProps,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: scrollTriggerConfig,
    });

    return () => {
      ScrollTrigger.getById(element.id)?.kill();
    };
  }, [animation, duration, delay, start, end, scrub, pin]);

  return ref;
}
