const LETRAS_NIF = "TRWAGMYFPDXBNJZSQVHLCKE";
const LETRAS_CIF = "ABCDEFGHJNPQRSUVW";

function esNifPersonaFisica(valor: string): boolean {
  const match = /^(\d{8})([A-Z])$/.exec(valor);
  if (!match) return false;
  const [, numero, letra] = match;
  return LETRAS_NIF[Number(numero) % 23] === letra;
}

/** Algoritmo del dígito/letra de control del CIF (sociedades). */
function esCifValido(valor: string): boolean {
  const match = /^([A-Z])(\d{7})([0-9A-Z])$/.exec(valor);
  if (!match) return false;
  const [, letraInicial, numero, control] = match;
  if (!LETRAS_CIF.includes(letraInicial)) return false;

  let sumaPar = 0;
  let sumaImpar = 0;
  for (let i = 0; i < numero.length; i++) {
    const digito = Number(numero[i]);
    if (i % 2 === 0) {
      const doble = digito * 2;
      sumaImpar += doble > 9 ? doble - 9 : doble;
    } else {
      sumaPar += digito;
    }
  }
  const sumaTotal = sumaPar + sumaImpar;
  const digitoControl = (10 - (sumaTotal % 10)) % 10;

  // Organizaciones que controlan con letra en vez de dígito (asociaciones, ONGs, etc.)
  const LETRAS_CONTROL = "JABCDEFGHI";
  return control === String(digitoControl) || control === LETRAS_CONTROL[digitoControl];
}

/** Valida NIF (persona física) o CIF (sociedad) español con su dígito/letra de control real. */
export function esNifOCifValido(valorOriginal: string): boolean {
  const valor = valorOriginal.trim().toUpperCase().replace(/[-\s]/g, "");
  return esNifPersonaFisica(valor) || esCifValido(valor);
}

export function esCifDeEmpresa(valorOriginal: string): boolean {
  const valor = valorOriginal.trim().toUpperCase().replace(/[-\s]/g, "");
  return esCifValido(valor);
}
