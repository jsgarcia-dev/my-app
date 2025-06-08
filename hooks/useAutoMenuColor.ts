'use client';

import { useEffect, useState, useRef } from 'react';

export function useAutoMenuColor() {
  const [menuColor, setMenuColor] = useState<'black' | 'white'>('black');
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const checkBackgroundColor = () => {
      // Encontrar el contenedor del menú (no el SVG)
      const menuContainer = document.querySelector('.fixed.top-8.right-\\[5\\%\\]');
      if (!menuContainer) return;

      // Obtener la posición del menú
      const menuRect = menuContainer.getBoundingClientRect();
      const menuCenterX = menuRect.left + menuRect.width / 2;
      const menuCenterY = menuRect.top + menuRect.height / 2;

      // Obtener todos los elementos en ese punto
      const elements = document.elementsFromPoint(menuCenterX, menuCenterY);
      
      // Filtrar elementos que no sean el menú mismo o sus contenedores
      const backgroundElements = elements.filter(el => {
        return !el.closest('[class*="menu"]') && 
               !el.closest('.hamburger-icon') &&
               !el.closest('.fixed.top-8');
      });

      // Primero verificar si hay un atributo data-menu-color
      for (const element of backgroundElements) {
        const dataMenuColor = element.getAttribute('data-menu-color');
        if (dataMenuColor) {
          setMenuColor(dataMenuColor === 'dark' || dataMenuColor === 'white' ? 'white' : 'black');
          return;
        }
      }

      // Si no hay data-menu-color, analizar el color de fondo
      for (const element of backgroundElements) {
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        const bgImage = computedStyle.backgroundImage;
        
        // Si hay un color de fondo sólido
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          const brightness = getColorBrightness(bgColor);
          setMenuColor(brightness > 180 ? 'black' : 'white');
          return;
        }
        
        // Si hay una imagen de fondo o gradiente, asumir que necesita texto blanco
        if (bgImage && bgImage !== 'none') {
          setMenuColor('white');
          return;
        }

        // Verificar si el elemento tiene clases que sugieran color oscuro
        const classList = element.className;
        if (typeof classList === 'string') {
          // Fondos oscuros que necesitan texto blanco
          if (classList.includes('bg-black') || 
              classList.includes('bg-charcoal') || 
              classList.includes('bg-deep-purple') ||
              classList.includes('bg-rose-gold') ||
              classList.includes('from-rose-gold') ||
              classList.includes('to-deep-purple') ||
              classList.includes('bg-gradient-to-')) {
            setMenuColor('white');
            return;
          }
          // Fondos claros que necesitan texto negro
          if (classList.includes('bg-white') ||
              classList.includes('bg-cream') ||
              classList.includes('bg-soft-pink') ||
              classList.includes('bg-gray-50') ||
              classList.includes('bg-gray-100')) {
            setMenuColor('black');
            return;
          }
        }
      }

      // Por defecto usar negro
      setMenuColor('black');
    };

    // Función para calcular el brillo de un color
    const getColorBrightness = (color: string): number => {
      let r = 0, g = 0, b = 0;
      
      // Convertir rgb() o rgba() a valores
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        r = parseInt(rgbMatch[1]);
        g = parseInt(rgbMatch[2]);
        b = parseInt(rgbMatch[3]);
      }
      
      // Calcular brillo usando la fórmula estándar
      return (r * 299 + g * 587 + b * 114) / 1000;
    };

    // Verificar el color inicial
    const initialCheck = setTimeout(checkBackgroundColor, 100);

    // Verificar en scroll con throttling usando RAF
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        checkBackgroundColor();
      });
    };

    // Verificar cuando cambia el tamaño de la ventana
    const handleResize = () => {
      checkBackgroundColor();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Observer para detectar cambios en el DOM
    const observer = new MutationObserver(() => {
      checkBackgroundColor();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-menu-color']
    });

    return () => {
      clearTimeout(initialCheck);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return menuColor;
}