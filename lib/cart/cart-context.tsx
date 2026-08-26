"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Producto } from "@/lib/schemas/producto";

export type CartItem = {
  productoId: string;
  slug: string;
  referencia: string;
  nombre: string;
  marca: string;
  precioTarifa: number;
  unidadVenta: string;
  multiploVenta: number;
  imagenUrl: string;
  bajoPedido: boolean;
  cantidad: number;
};

type CartContextValue = {
  items: CartItem[];
  abierto: boolean;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
  añadir: (producto: Producto, cantidad?: number) => void;
  quitar: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  vaciar: () => void;
  subtotal: number;
  totalUnidades: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const CLAVE_STORAGE = "trade:carrito";

function leerCarritoGuardado(): CartItem[] {
  try {
    const guardado = window.localStorage.getItem(CLAVE_STORAGE);
    return guardado ? (JSON.parse(guardado) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    setItems(leerCarritoGuardado());
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
    } catch {
      // Carrito solo en memoria si localStorage no está disponible.
    }
  }, [items, hidratado]);

  const añadir = (producto: Producto, cantidad = producto.multiploVenta) => {
    setItems((actual) => {
      const existente = actual.find((item) => item.productoId === producto.id);
      if (existente) {
        return actual.map((item) =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item,
        );
      }
      const nuevoItem: CartItem = {
        productoId: producto.id,
        slug: producto.slug,
        referencia: producto.referencia,
        nombre: producto.nombre,
        marca: producto.marca,
        precioTarifa: producto.precioTarifa,
        unidadVenta: producto.unidadVenta,
        multiploVenta: producto.multiploVenta,
        imagenUrl: producto.imagenes[0]?.url ?? "/productos/placeholder.svg",
        bajoPedido: producto.stock <= 0,
        cantidad,
      };
      return [...actual, nuevoItem];
    });
    setAbierto(true);
  };

  const quitar = (productoId: string) => {
    setItems((actual) => actual.filter((item) => item.productoId !== productoId));
  };

  const actualizarCantidad = (productoId: string, cantidad: number) => {
    setItems((actual) =>
      actual.map((item) =>
        item.productoId === productoId ? { ...item, cantidad: Math.max(1, cantidad) } : item,
      ),
    );
  };

  const vaciar = () => setItems([]);

  const { subtotal, totalUnidades } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.precioTarifa * item.cantidad,
        totalUnidades: acc.totalUnidades + item.cantidad,
      }),
      { subtotal: 0, totalUnidades: 0 },
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        abierto,
        abrirCarrito: () => setAbierto(true),
        cerrarCarrito: () => setAbierto(false),
        añadir,
        quitar,
        actualizarCantidad,
        vaciar,
        subtotal,
        totalUnidades,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const contexto = useContext(CartContext);
  if (!contexto) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return contexto;
}
