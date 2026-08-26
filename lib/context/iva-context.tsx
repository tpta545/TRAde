"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";

type IvaContextValue = {
  ivaIncluido: boolean;
  toggleIva: () => void;
};

const IvaContext = createContext<IvaContextValue | null>(null);

const CLAVE_STORAGE = "trade:iva-incluido";

export function IvaProvider({ children }: { children: ReactNode }) {
  const [ivaIncluido, setIvaIncluido] = useState<boolean>(siteConfig.comercio.ivaPorDefectoIncluido);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_STORAGE);
      if (guardado !== null) setIvaIncluido(guardado === "1");
    } catch {
      // localStorage no disponible (navegación privada, etc.): se queda el valor por defecto.
    }
  }, []);

  const toggleIva = () => {
    setIvaIncluido((valorAnterior) => {
      const nuevoValor = !valorAnterior;
      try {
        window.localStorage.setItem(CLAVE_STORAGE, nuevoValor ? "1" : "0");
      } catch {
        // Si no se puede persistir, el conmutador sigue funcionando para la sesión actual.
      }
      return nuevoValor;
    });
  };

  return <IvaContext.Provider value={{ ivaIncluido, toggleIva }}>{children}</IvaContext.Provider>;
}

export function useIva(): IvaContextValue {
  const contexto = useContext(IvaContext);
  if (!contexto) {
    throw new Error("useIva debe usarse dentro de <IvaProvider>");
  }
  return contexto;
}
