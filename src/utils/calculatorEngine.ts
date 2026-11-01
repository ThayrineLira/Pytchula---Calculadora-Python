/**
 * Math and Python Expression Engine for Pytchula Calculator.
 * Handles the 4 basic operations: Addition, Subtraction, Multiplication, Division.
 */

export type OperationType = '+' | '-' | '×' | '÷';

export interface CalculationRecord {
  id: string;
  num1: number;
  operation: OperationType;
  pythonOp: string;
  num2: number;
  result: number | string;
  isError: boolean;
  errorMessage?: string;
  pythonSnippet: string;
  timestamp: Date;
}

export const OPERATION_META: Record<OperationType, { name: string; pyOp: string; tip: string; color: string }> = {
  '+': {
    name: 'Adição (Soma)',
    pyOp: '+',
    tip: 'No Python, usamos "+" para somar números. Ex: 10 + 5 dá 15!',
    color: 'emerald',
  },
  '-': {
    name: 'Subtração',
    pyOp: '-',
    tip: 'No Python, usamos "-" para diminuir. Ex: 20 - 7 dá 13!',
    color: 'amber',
  },
  '×': {
    name: 'Multiplicação',
    pyOp: '*',
    tip: 'No Python, usamos o asterisco "*" para multiplicar. Ex: 4 * 6 dá 24!',
    color: 'blue',
  },
  '÷': {
    name: 'Divisão',
    pyOp: '/',
    tip: 'No Python, usamos a barra "/" para dividir. Ex: 15 / 3 dá 5.0 (sempre gera float)!',
    color: 'violet',
  },
};

/**
 * Performs accurate 4-operation calculations, preventing JS float glitches (like 0.1 + 0.2 = 0.30000000000000004).
 */
export function calculate(
  a: number,
  op: OperationType,
  b: number
): { result: number | string; isError: boolean; errorMessage?: string; pythonSnippet: string } {
  let res: number = 0;
  let isError = false;
  let errorMessage: string | undefined;

  switch (op) {
    case '+':
      res = a + b;
      break;
    case '-':
      res = a - b;
      break;
    case '×':
      res = a * b;
      break;
    case '÷':
      if (b === 0) {
        return {
          result: 'ZeroDivisionError',
          isError: true,
          errorMessage: 'Ops! No Python, dividir por zero gera ZeroDivisionError! 🐍🚫',
          pythonSnippet: `# Erro em Python:\n>>> ${a} / 0\nZeroDivisionError: division by zero`,
        };
      }
      res = a / b;
      break;
  }

  // Fix precision quirks (max 10 decimals, clean trailing zeros)
  const cleanResult = parseFloat(res.toFixed(10));
  const pyOp = OPERATION_META[op].pyOp;

  const pythonSnippet = `# Operação em Python:
a = ${a}
b = ${b}
resultado = a ${pyOp} b
print(f"{a} ${pyOp} {b} = {resultado}")
# Saída: ${cleanResult}`;

  return {
    result: cleanResult,
    isError: false,
    pythonSnippet,
  };
}

export function formatNumberDisplay(val: string | number): string {
  if (typeof val === 'string') {
    if (val === 'ZeroDivisionError' || val === 'Erro') return val;
    // If it ends with '.', don't parse it yet to allow typing '12.'
    if (val.endsWith('.')) {
      const numPart = parseFloat(val.slice(0, -1));
      if (isNaN(numPart)) return '0.';
      return numPart.toLocaleString('pt-BR') + ',';
    }
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    // Format with commas/dots in Brazilian format if decimal
    const parts = val.split('.');
    const integerPart = parseFloat(parts[0]).toLocaleString('pt-BR');
    return parts.length > 1 ? `${integerPart},${parts[1]}` : integerPart;
  }

  return val.toLocaleString('pt-BR', { maximumFractionDigits: 10 });
}
