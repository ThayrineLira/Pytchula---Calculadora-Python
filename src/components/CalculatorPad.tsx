import React, { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Delete, RotateCcw, Sparkles } from 'lucide-react';
import { OperationType, formatNumberDisplay } from '../utils/calculatorEngine';
import { sounds } from '../utils/soundEffects';

interface CalculatorPadProps {
  displayValue: string;
  previousValue: number | null;
  selectedOperation: OperationType | null;
  historyPreview: string;
  onNumber: (digit: string) => void;
  onOperation: (op: OperationType) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onDecimal: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
}

export const CalculatorPad: React.FC<CalculatorPadProps> = ({
  displayValue,
  previousValue,
  selectedOperation,
  historyPreview,
  onNumber,
  onOperation,
  onEquals,
  onClear,
  onBackspace,
  onDecimal,
  onToggleSign,
  onPercentage,
}) => {
  // Fire celebratory joyful confetti
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'],
    });
  }, []);

  const handleEqualsClick = () => {
    sounds.playVictory();
    triggerConfetti();
    onEquals();
  };

  const handleNumberClick = (d: string) => {
    sounds.playPop(500 + parseInt(d, 10) * 30);
    onNumber(d);
  };

  const handleOpClick = (op: OperationType) => {
    sounds.playOperator();
    onOperation(op);
  };

  const handleClearClick = () => {
    sounds.playClear();
    onClear();
  };

  const handleBackspaceClick = () => {
    sounds.playPop(380);
    onBackspace();
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is in an input field (e.g. quiz or search)
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumberClick(e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        handleOpClick('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOpClick('-');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleOpClick('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOpClick('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEqualsClick();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspaceClick();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClearClick();
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        sounds.playPop(480);
        onDecimal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNumberClick,
    handleOpClick,
    handleEqualsClick,
    handleClearClick,
    handleBackspaceClick,
    onDecimal,
  ]);

  // Adjust display font size based on length
  const getDisplayFontSize = (text: string) => {
    if (text.length > 13) return 'text-2xl sm:text-3xl';
    if (text.length > 9) return 'text-3xl sm:text-4xl';
    return 'text-4xl sm:text-5xl';
  };

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-emerald-300/80 max-w-md mx-auto">
      {/* Friendly Display Screen */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-inner mb-4 overflow-hidden border border-slate-700">
        {/* Subtle screen reflection gradient */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 pointer-events-none rounded-t-2xl" />

        {/* Top breadcrumb & Python expression indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-code tracking-wide mb-1.5 h-5">
          <span className="truncate pr-2">
            {historyPreview ||
              (previousValue !== null && selectedOperation
                ? `${previousValue} ${selectedOperation}`
                : 'Pytchula pronta')}
          </span>
          {selectedOperation && (
            <span className="shrink-0 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
              Python:{' '}
              {selectedOperation === '×'
                ? '*'
                : selectedOperation === '÷'
                ? '/'
                : selectedOperation}
            </span>
          )}
        </div>

        {/* Main calculation value */}
        <div
          className={`font-fun font-bold tracking-tight text-right text-emerald-400 select-all overflow-x-auto overflow-y-hidden py-1 transition-all ${getDisplayFontSize(
            displayValue
          )}`}
        >
          {formatNumberDisplay(displayValue)}
        </div>
      </div>

      {/* Cheerful 4-Operation Keypad */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {/* ROW 1: Clear, Backspace, Percentage, Division */}
        <button
          onClick={handleClearClick}
          className="btn-bubbly bg-rose-100 hover:bg-rose-200 text-rose-700 font-fun font-bold text-lg sm:text-xl py-3.5 sm:py-4 rounded-2xl border-2 border-rose-300 flex items-center justify-center gap-1 active:scale-95"
          title="Limpar visor (ESC ou C)"
        >
          <RotateCcw className="w-5 h-5" /> C
        </button>

        <button
          onClick={handleBackspaceClick}
          className="btn-bubbly bg-amber-100 hover:bg-amber-200 text-amber-800 font-fun font-bold text-lg sm:text-xl py-3.5 sm:py-4 rounded-2xl border-2 border-amber-300 flex items-center justify-center active:scale-95"
          title="Apagar dígito (Backspace)"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            sounds.playPop(520);
            onPercentage();
          }}
          className="btn-bubbly bg-slate-100 hover:bg-slate-200 text-slate-700 font-fun font-bold text-lg sm:text-xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-300 active:scale-95"
          title="Porcentagem (%)"
        >
          %
        </button>

        <button
          onClick={() => handleOpClick('÷')}
          className={`btn-bubbly font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 transition-all active:scale-95 ${
            selectedOperation === '÷'
              ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300'
              : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300'
          }`}
          title="Divisão (/) em Python"
        >
          ÷
        </button>

        {/* ROW 2: 7, 8, 9, Multiplication */}
        <button
          onClick={() => handleNumberClick('7')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          7
        </button>
        <button
          onClick={() => handleNumberClick('8')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          8
        </button>
        <button
          onClick={() => handleNumberClick('9')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          9
        </button>
        <button
          onClick={() => handleOpClick('×')}
          className={`btn-bubbly font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 transition-all active:scale-95 ${
            selectedOperation === '×'
              ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300'
          }`}
          title="Multiplicação (*) em Python"
        >
          ×
        </button>

        {/* ROW 3: 4, 5, 6, Subtraction */}
        <button
          onClick={() => handleNumberClick('4')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          4
        </button>
        <button
          onClick={() => handleNumberClick('5')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          5
        </button>
        <button
          onClick={() => handleNumberClick('6')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          6
        </button>
        <button
          onClick={() => handleOpClick('-')}
          className={`btn-bubbly font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 transition-all active:scale-95 ${
            selectedOperation === '-'
              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-300'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300'
          }`}
          title="Subtração (-) em Python"
        >
          -
        </button>

        {/* ROW 4: 1, 2, 3, Addition */}
        <button
          onClick={() => handleNumberClick('1')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          1
        </button>
        <button
          onClick={() => handleNumberClick('2')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          2
        </button>
        <button
          onClick={() => handleNumberClick('3')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          3
        </button>
        <button
          onClick={() => handleOpClick('+')}
          className={`btn-bubbly font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 transition-all active:scale-95 ${
            selectedOperation === '+'
              ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300'
              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300'
          }`}
          title="Adição (+) em Python"
        >
          +
        </button>

        {/* ROW 5: ± (Sign), 0, . (Decimal), = (Equals) */}
        <button
          onClick={() => {
            sounds.playPop(480);
            onToggleSign();
          }}
          className="btn-bubbly bg-slate-100 hover:bg-slate-200 text-slate-700 font-fun font-bold text-lg sm:text-xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-300 active:scale-95"
          title="Inverter positivo/negativo (±)"
        >
          ±
        </button>

        <button
          onClick={() => handleNumberClick('0')}
          className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95"
        >
          0
        </button>

        <button
          onClick={() => {
            sounds.playPop(510);
            onDecimal();
          }}
          className="btn-bubbly bg-slate-100 hover:bg-slate-200 text-slate-800 font-fun font-bold text-2xl py-3.5 sm:py-4 rounded-2xl border-2 border-slate-300 active:scale-95"
          title="Ponto decimal (,)"
        >
          ,
        </button>

        <button
          onClick={handleEqualsClick}
          className="btn-bubbly bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-fun font-bold text-3xl py-3.5 sm:py-4 rounded-2xl border-2 border-emerald-600 shadow-md flex items-center justify-center gap-1 active:scale-95"
          title="Calcular resultado (= ou Enter)"
        >
          <span>=</span>
          <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
