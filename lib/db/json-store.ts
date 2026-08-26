import "server-only";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Almacén CRUD genérico sobre un fichero JSON en `.data/` (gitignorado).
 *
 * <<PENDIENTE>>: es un mock de desarrollo/demo, no una base de datos. En un
 * despliegue serverless el disco no persiste entre invocaciones. Cuando se
 * conecte Postgres/Prisma o el ERP (Fase 5), solo hay que reescribir estas
 * cuatro funciones — nada que las use en el resto del código cambia, igual
 * que ocurre con /lib/data/productos.ts.
 */

const DIRECTORIO = join(process.cwd(), ".data");

async function leerFichero<T>(nombre: string): Promise<T[]> {
  try {
    const contenido = await readFile(join(DIRECTORIO, `${nombre}.json`), "utf-8");
    return JSON.parse(contenido) as T[];
  } catch {
    return [];
  }
}

async function escribirFichero<T>(nombre: string, datos: T[]): Promise<void> {
  await mkdir(DIRECTORIO, { recursive: true });
  await writeFile(join(DIRECTORIO, `${nombre}.json`), JSON.stringify(datos, null, 2), "utf-8");
}

export function crearColeccion<T extends { id: string }>(nombre: string) {
  return {
    async todos(): Promise<T[]> {
      return leerFichero<T>(nombre);
    },
    async buscar(predicado: (item: T) => boolean): Promise<T[]> {
      return (await leerFichero<T>(nombre)).filter(predicado);
    },
    async buscarUno(predicado: (item: T) => boolean): Promise<T | undefined> {
      return (await leerFichero<T>(nombre)).find(predicado);
    },
    async porId(id: string): Promise<T | undefined> {
      return (await leerFichero<T>(nombre)).find((item) => item.id === id);
    },
    async insertar(datos: Omit<T, "id"> & { id?: string }): Promise<T> {
      const items = await leerFichero<T>(nombre);
      const nuevo = { ...datos, id: datos.id ?? randomUUID() } as T;
      items.push(nuevo);
      await escribirFichero(nombre, items);
      return nuevo;
    },
    async actualizar(id: string, cambios: Partial<T>): Promise<T | undefined> {
      const items = await leerFichero<T>(nombre);
      const indice = items.findIndex((item) => item.id === id);
      if (indice === -1) return undefined;
      items[indice] = { ...items[indice], ...cambios };
      await escribirFichero(nombre, items);
      return items[indice];
    },
    async eliminar(id: string): Promise<void> {
      const items = await leerFichero<T>(nombre);
      await escribirFichero(
        nombre,
        items.filter((item) => item.id !== id),
      );
    },
  };
}
