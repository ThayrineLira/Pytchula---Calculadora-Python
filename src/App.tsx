/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calculator as CalcIcon,
  Terminal,
  Trophy,
  Volume2,
  VolumeX,
  Code2,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';
import { CalculatorPad } from './components/CalculatorPad';
import { MascotCard } from './components/MascotCard';
import { HistoryList } from './components/HistoryList';
import { PythonView } from './components/PythonView';
import { MathQuiz } from './components/MathQuiz';
import {
  OperationType,
  CalculationRecord,
  calculate,
  OPERATION_META,
} from './utils/calculatorEngine';
import { sounds } from './utils/soundEffects';
import { PYTHON_GUI_SCRIPT, downloadFile } from './utils/pythonTemplates';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'python' | 'quiz'>('calculator');
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Calculator State
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [historyPreview, setHistoryPreview] = useState<string>('');
  const [history, setHistory] = useState<CalculationRecord[]>([]);

  // Mascot dynamic message
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Olá, seja bem-vindo! Eu sou a Pytchula! Vamos fazer continhas felizes em Python juntas? 🐍✨'
  );

  // Sync sound preference
  useEffect(() => {
    setIsSoundOn(sounds.isEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setIsSoundOn(newState);
  };

  // Digit input
  const handleNumber = (digit: string) => {
    if (displayValue === 'ZeroDivisionError' || waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
    setMascotMessage('Que número legal! Vamos escolher uma operação ou continuar digitando? 🎈');
  };

  // Decimal point
  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  // Operation selection (+, -, ×, ÷)
  const handleOperation = (op: OperationType) => {
    const currentNum = parseFloat(displayValue);

    // If an operation was already selected and user types another number, perform the pending operation first
    if (previousValue !== null && selectedOperation && !waitingForOperand) {
      const calculation = calculate(previousValue, selectedOperation, currentNum);

      if (calculation.isError) {
        setDisplayValue('ZeroDivisionError');
        setMascotMessage(calculation.errorMessage || 'Ops! Erro matemático em Python! 🐍');
        setPreviousValue(null);
        setSelectedOperation(null);
        setWaitingForOperand(true);
        return;
      }

      const resNum = typeof calculation.result === 'number' ? calculation.result : parseFloat(calculation.result);
      setDisplayValue(String(calculation.result));
      setPreviousValue(resNum);
      setHistoryPreview(`${calculation.result} ${op}`);
    } else {
      setPreviousValue(currentNum);
      setHistoryPreview(`${currentNum} ${op}`);
    }

    setSelectedOperation(op);
    setWaitingForOperand(true);

    const meta = OPERATION_META[op];
    setMascotMessage(meta.tip);
  };

  // Equals calculation (=)
  const handleEquals = () => {
    if (previousValue === null || selectedOperation === null) {
      // Just keep current number
      return;
    }

    const currentNum = parseFloat(displayValue);
    const op = selectedOperation;
    const calculation = calculate(previousValue, op, currentNum);

    const newRecord: CalculationRecord = {
      id: `${Date.now()}-${Math.random()}`,
      num1: previousValue,
      operation: op,
      pythonOp: OPERATION_META[op].pyOp,
      num2: currentNum,
      result: calculation.result,
      isError: calculation.isError,
      errorMessage: calculation.errorMessage,
      pythonSnippet: calculation.pythonSnippet,
      timestamp: new Date(),
    };

    setHistory((prev) => [newRecord, ...prev]);

    if (calculation.isError) {
      setDisplayValue('ZeroDivisionError');
      setMascotMessage(calculation.errorMessage || 'ZeroDivisionError: Não é possível dividir por zero! 🐍🚫');
      sounds.playOops();
    } else {
      setDisplayValue(String(calculation.result));
      setHistoryPreview(`${previousValue} ${op} ${currentNum} = ${calculation.result}`);
      setMascotMessage(
        `Ebaaa! No Python: ${previousValue} ${OPERATION_META[op].pyOp} ${currentNum} = ${calculation.result}! 🎉`
      );
    }

    setPreviousValue(null);
    setSelectedOperation(null);
    setWaitingForOperand(true);
  };

  // Clear all
  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setSelectedOperation(null);
    setWaitingForOperand(false);
    setHistoryPreview('');
    setMascotMessage('Prontinho! Quadro limpo para novas continhas felizes! 🧼✨');
  };

  // Backspace
  const handleBackspace = () => {
    if (waitingForOperand || displayValue === 'ZeroDivisionError') {
      setDisplayValue('0');
      return;
    }
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  // Toggle positive/negative
  const handleToggleSign = () => {
    if (displayValue === '0' || displayValue === 'ZeroDivisionError') return;
    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.substring(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  };

  // Percentage
  const handlePercentage = () => {
    const num = parseFloat(displayValue);
    if (!isNaN(num)) {
      const res = num / 100;
      setDisplayValue(String(res));
      setMascotMessage(`Porcentagem calculada: ${num} / 100 = ${res} 📊`);
    }
  };

  // Re-use result from history
  const handleSelectHistoryResult = (val: number | string) => {
    setDisplayValue(String(val));
    setWaitingForOperand(false);
    setMascotMessage(`Carreguei o valor ${val} no visor para você! Vamos continuar? 🚀`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-amber-50/40 to-sky-50/50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Contract (Zone 1: Wordmark, Zone 2: Nav Links, Zone 3: Action) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8 shadow-xs">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            🐍
          </div>
          <span className="font-fun font-bold text-xl text-emerald-800 tracking-tight">
            Pytchula
          </span>
          <span className="hidden sm:inline text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
            Calculadora Python
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-emerald-700'
            }`}
          >
            <CalcIcon className="w-4 h-4" />
            <span>Calculadora</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'python'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-emerald-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Aprenda Python</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-emerald-700'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Desafio Divertido</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Sound & Download) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isSoundOn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
            title={isSoundOn ? 'Som ativado (clique para silenciar)' : 'Som desativado (clique para ativar)'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSoundOn ? 'Sons ON' : 'Mudo'}</span>
          </button>

          <button
            onClick={() => downloadFile('calculadora_pytchula_gui.py', PYTHON_GUI_SCRIPT)}
            className="btn-bubbly hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm whitespace-nowrap shrink-0"
            title="Baixar código Python pronto para rodar no seu computador"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .py</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex items-center justify-around bg-white border-b border-emerald-100 p-1.5 sticky top-[57px] z-20">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold ${
            activeTab === 'calculator'
              ? 'bg-emerald-100 text-emerald-800'
              : 'text-slate-600'
          }`}
        >
          <CalcIcon className="w-3.5 h-3.5" /> Calculadora
        </button>
        <button
          onClick={() => setActiveTab('python')}
          className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold ${
            activeTab === 'python'
              ? 'bg-emerald-100 text-emerald-800'
              : 'text-slate-600'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" /> Modo Python
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold ${
            activeTab === 'quiz'
              ? 'bg-emerald-100 text-emerald-800'
              : 'text-slate-600'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> Desafio
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* Mascot Announcement */}
            <MascotCard message={mascotMessage} />

            {/* Split layout: Calculator + Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: The Joyful Calculator Pad (lg: 7 cols) */}
              <div className="lg:col-span-7">
                <CalculatorPad
                  displayValue={displayValue}
                  previousValue={previousValue}
                  selectedOperation={selectedOperation}
                  historyPreview={historyPreview}
                  onNumber={handleNumber}
                  onOperation={handleOperation}
                  onEquals={handleEquals}
                  onClear={handleClear}
                  onBackspace={handleBackspace}
                  onDecimal={handleDecimal}
                  onToggleSign={handleToggleSign}
                  onPercentage={handlePercentage}
                />

                {/* Keyboard guide helper pill */}
                <div className="mt-4 p-3 rounded-2xl bg-white/70 border border-emerald-100 text-slate-500 text-xs flex items-center justify-between gap-2 max-w-md mx-auto shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dica: Use o teclado numérico do computador (+, -, *, /, Enter, Backspace, Esc)!</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Python Translation & History (lg: 5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Real-time Python Code Box */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-700 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-fun font-bold text-sm text-emerald-300">
                        Código Python em Tempo Real
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      Python 3
                    </span>
                  </div>

                  <div className="font-code text-xs sm:text-sm text-slate-300 space-y-1">
                    <div className="text-slate-500"># 4 Operações Básicas: +, -, *, /</div>
                    {previousValue !== null && selectedOperation ? (
                      <>
                        <div className="text-amber-300">
                          num1 = {previousValue}
                        </div>
                        <div className="text-amber-300">
                          num2 = {displayValue}
                        </div>
                        <div className="text-emerald-400 font-bold">
                          resultado = num1 {OPERATION_META[selectedOperation].pyOp} num2
                        </div>
                        <div className="text-sky-300">
                          print(f&quot;Resultado: &#123;resultado&#125;&quot;)
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-emerald-400">
                          valor_atual = {displayValue}
                        </div>
                        <div className="text-slate-400 text-xs mt-2">
                          💡 Escolha +, -, × ou ÷ para ver o cálculo em Python!
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Calculation History Card */}
                <HistoryList
                  history={history}
                  onSelectResult={handleSelectHistoryResult}
                  onClearHistory={() => setHistory([])}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Python Learning & Script View */}
        {activeTab === 'python' && <PythonView />}

        {/* TAB 3: Math Quiz */}
        {activeTab === 'quiz' && <MathQuiz />}
      </main>

      {/* Cheerful Friendly Footer */}
      <footer className="mt-auto border-t border-emerald-100 bg-white/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-fun text-slate-700">
            🐍 <strong>Pytchula Calculadora</strong> · Criada com alegria e amor pelo Python
          </p>
          <p className="text-slate-500">
            As quatro operações básicas: Adição (+), Subtração (-), Multiplicação (*), Divisão (/)
          </p>
        </div>
      </footer>
    </div>
  );
}
