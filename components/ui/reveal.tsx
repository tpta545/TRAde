"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Envoltorio de aparición al hacer scroll (fade + subida sutil). Sin
 * dependencia externa: un IntersectionObserver que dispara una sola vez.
 * `prefers-reduced-motion` ya está resuelto de forma global en
 * globals.css (colapsa duration a 0.01ms), así que no hace falta lógica
 * aparte aquí. Si el navegador no soporta IntersectionObserver, se
 * muestra directamente visible en vez de quedar oculto para siempre.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        "transition-all duration-700 ease-out " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6") +
        (className ? ` ${className}` : "")
      }
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
