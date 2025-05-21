
export type DocumentType = 
  | 'compraventa' 
  | 'hipoteca' 
  | 'cancelacionHipoteca'
  | 'donacion'
  | 'herencia'
  | 'poderes'
  | 'sociedades';

interface CalculationBracket {
  limit: number;
  fee: number;
  percentageAbove?: number;
}

// Estas tarifas son aproximadas basadas en el Real Decreto 1426/1989
// En una implementación real, deberían verificarse con un profesional notarial
const CALCULATION_BRACKETS: Record<DocumentType, CalculationBracket[]> = {
  compraventa: [
    { limit: 6000, fee: 90 },
    { limit: 30000, fee: 90, percentageAbove: 0.45 },
    { limit: 60000, fee: 198, percentageAbove: 0.3 },
    { limit: 150000, fee: 288, percentageAbove: 0.2 },
    { limit: 600000, fee: 468, percentageAbove: 0.1 },
    { limit: 6000000, fee: 918, percentageAbove: 0.05 },
    { limit: Infinity, fee: 3168, percentageAbove: 0.025 }
  ],
  hipoteca: [
    { limit: 6000, fee: 90 },
    { limit: 30000, fee: 90, percentageAbove: 0.45 },
    { limit: 60000, fee: 198, percentageAbove: 0.3 },
    { limit: 150000, fee: 288, percentageAbove: 0.2 },
    { limit: 600000, fee: 468, percentageAbove: 0.1 },
    { limit: 6000000, fee: 918, percentageAbove: 0.05 },
    { limit: Infinity, fee: 3168, percentageAbove: 0.025 }
  ],
  cancelacionHipoteca: [
    { limit: 6000, fee: 60 },
    { limit: 30000, fee: 60, percentageAbove: 0.35 },
    { limit: 60000, fee: 144, percentageAbove: 0.2 },
    { limit: 150000, fee: 204, percentageAbove: 0.15 },
    { limit: 600000, fee: 339, percentageAbove: 0.075 },
    { limit: 6000000, fee: 674, percentageAbove: 0.03 },
    { limit: Infinity, fee: 2234, percentageAbove: 0.02 }
  ],
  donacion: [
    { limit: 6000, fee: 90 },
    { limit: 30000, fee: 90, percentageAbove: 0.45 },
    { limit: 60000, fee: 198, percentageAbove: 0.3 },
    { limit: 150000, fee: 288, percentageAbove: 0.2 },
    { limit: 600000, fee: 468, percentageAbove: 0.1 },
    { limit: 6000000, fee: 918, percentageAbove: 0.05 },
    { limit: Infinity, fee: 3168, percentageAbove: 0.025 }
  ],
  herencia: [
    { limit: 6000, fee: 90 },
    { limit: 30000, fee: 90, percentageAbove: 0.45 },
    { limit: 60000, fee: 198, percentageAbove: 0.3 },
    { limit: 150000, fee: 288, percentageAbove: 0.2 },
    { limit: 600000, fee: 468, percentageAbove: 0.1 },
    { limit: 6000000, fee: 918, percentageAbove: 0.05 },
    { limit: Infinity, fee: 3168, percentageAbove: 0.025 }
  ],
  poderes: [
    { limit: Infinity, fee: 60 } // Tarifa fija para poderes
  ],
  sociedades: [
    { limit: 6000, fee: 90 },
    { limit: 30000, fee: 90, percentageAbove: 0.45 },
    { limit: 60000, fee: 198, percentageAbove: 0.3 },
    { limit: 150000, fee: 288, percentageAbove: 0.2 },
    { limit: 600000, fee: 468, percentageAbove: 0.1 },
    { limit: 6000000, fee: 918, percentageAbove: 0.05 },
    { limit: Infinity, fee: 3168, percentageAbove: 0.025 }
  ]
};

// Diccionario para el nombre completo de cada tipo de documento
export const DOCUMENT_TYPE_NAMES: Record<DocumentType, string> = {
  compraventa: "Compraventa",
  hipoteca: "Hipoteca",
  cancelacionHipoteca: "Cancelación de Hipoteca",
  donacion: "Donación",
  herencia: "Herencia",
  poderes: "Poderes",
  sociedades: "Constitución de Sociedades"
};

// Precios por folio, copia simple y copia autorizada
export const FOLIO_PRICE = 3.00;
export const SIMPLE_COPY_PRICE = 3.50;
export const AUTHORIZED_COPY_PRICE = 6.00;

export function calculateNotaryFee(documentType: DocumentType, amount: number): number {
  // Si el monto es 0 o negativo, devolver 0
  if (amount <= 0) {
    return 0;
  }

  const brackets = CALCULATION_BRACKETS[documentType];
  let result = 0;
  let remainingAmount = amount;
  let lastLimit = 0;

  for (const bracket of brackets) {
    if (amount <= lastLimit) {
      break;
    }

    if (amount <= bracket.limit) {
      if (bracket.percentageAbove !== undefined) {
        result += bracket.fee + ((amount - lastLimit) * bracket.percentageAbove / 100);
      } else {
        result += bracket.fee;
      }
      break;
    } else {
      if (bracket.percentageAbove !== undefined) {
        const amountInBracket = bracket.limit - lastLimit;
        result += bracket.fee + (amountInBracket * bracket.percentageAbove / 100);
        lastLimit = bracket.limit;
      } else {
        result += bracket.fee;
        break;
      }
    }
  }

  return Math.round(result * 100) / 100;
}

export function calculateFoliosCost(folios: number): number {
  return folios * FOLIO_PRICE;
}

export function calculateSimpleCopiesCost(copies: number): number {
  return copies * SIMPLE_COPY_PRICE;
}

export function calculateAuthorizedCopiesCost(copies: number): number {
  return copies * AUTHORIZED_COPY_PRICE;
}

export function calculateIVA(amount: number): number {
  // IVA del 21%
  return Math.round(amount * 0.21 * 100) / 100;
}

export function calculateTotal(notaryFee: number, foliosCost: number, simpleCopiesCost: number, authorizedCopiesCost: number): number {
  const subtotal = notaryFee + foliosCost + simpleCopiesCost + authorizedCopiesCost;
  const iva = calculateIVA(subtotal);
  return Math.round((subtotal + iva) * 100) / 100;
}

