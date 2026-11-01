import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, Code2, Play, Sparkles, BookOpen } from 'lucide-react';
import { PYTHON_GUI_SCRIPT, PYTHON_CLI_SCRIPT, downloadFile } from '../utils/pythonTemplates';
import { sounds } from '../utils/soundEffects';

export const PythonView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'gui' | 'cli'>('explanation');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Mini live tester
  const [testNum1, setTestNum1] = useState<number>(12);
  const [testOp, setTestOp] = useState<'+' | '-' | '*' | '/'>('*');
  const [testNum2, setTestNum2] = useState<number>(8);

  const getLiveResult = () => {
    switch (testOp) {
      case '+':
        return testNum1 + testNum2;
      case '-':
        return testNum1 - testNum2;
      case '*':
        return testNum1 * testNum2;
      case '/':
        return testNum2 === 0 ? 'ZeroDivisionError: division by zero' : testNum1 / testNum2;
    }
  };

  const handleCopy = (type: string, code: string) => {
    sounds.playPop(650);
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = (filename: string, code: string) => {
    sounds.playVictory();
    downloadFile(filename, code);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200/90 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Terminal className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-fun font-bold text-slate-800">
              Modo Python: As 4 Operações na Prática
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Veja como o código Python funciona de verdade e baixe os arquivos prontos para rodar no seu computador!
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => {
              sounds.playPop(500);
              setActiveTab('explanation');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'explanation'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aprenda Python
          </button>
          <button
            onClick={() => {
              sounds.playPop(500);
              setActiveTab('gui');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'gui'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Script GUI (Tkinter)
          </button>
          <button
            onClick={() => {
              sounds.playPop(500);
              setActiveTab('cli');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'cli'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Script Terminal
          </button>
        </div>
      </div>

      {/* TAB 1: Educational Explanation & Live Python Simulator */}
      {activeTab === 'explanation' && (
        <div className="mt-6 space-y-6">
          {/* The 4 Basic Operations Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Soma */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-fun font-bold text-emerald-900 flex items-center gap-1.5 text-base">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                    +
                  </span>
                  1. Adição (Soma)
                </span>
                <span className="font-code text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                  símbolo: +
                </span>
              </div>
              <p className="text-xs text-emerald-800 mb-2">
                Soma dois números diretamente. Também serve para concatenar strings!
              </p>
              <pre className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-code text-xs overflow-x-auto">
{`resultado = 15 + 25
print(resultado)  # Saída: 40`}
              </pre>
            </div>

            {/* Subtração */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-fun font-bold text-amber-900 flex items-center gap-1.5 text-base">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                    -
                  </span>
                  2. Subtração
                </span>
                <span className="font-code text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
                  símbolo: -
                </span>
              </div>
              <p className="text-xs text-amber-800 mb-2">
                Diminui o segundo número do primeiro. Suporta números negativos!
              </p>
              <pre className="p-2.5 rounded-xl bg-slate-900 text-amber-400 font-code text-xs overflow-x-auto">
{`resultado = 50 - 18
print(resultado)  # Saída: 32`}
              </pre>
            </div>

            {/* Multiplicação */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-fun font-bold text-blue-900 flex items-center gap-1.5 text-base">
                  <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    *
                  </span>
                  3. Multiplicação
                </span>
                <span className="font-code text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-semibold">
                  símbolo: * (asterisco)
                </span>
              </div>
              <p className="text-xs text-blue-800 mb-2">
                Multiplica valores. No Python, usamos asterisco <code className="font-code font-bold">*</code> em vez de ×.
              </p>
              <pre className="p-2.5 rounded-xl bg-slate-900 text-blue-400 font-code text-xs overflow-x-auto">
{`resultado = 7 * 6
print(resultado)  # Saída: 42`}
              </pre>
            </div>

            {/* Divisão */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-fun font-bold text-purple-900 flex items-center gap-1.5 text-base">
                  <span className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                    /
                  </span>
                  4. Divisão
                </span>
                <span className="font-code text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-semibold">
                  símbolo: / (barra)
                </span>
              </div>
              <p className="text-xs text-purple-800 mb-2">
                Divide valores. <strong>Dica da Pytchula:</strong> No Python, <code className="font-code">/</code> sempre retorna um <code className="font-code">float</code> (com casa decimal)!
              </p>
              <pre className="p-2.5 rounded-xl bg-slate-900 text-purple-400 font-code text-xs overflow-x-auto">
{`resultado = 10 / 2
print(resultado)  # Saída: 5.0 (float)`}
              </pre>
            </div>
          </div>

          {/* Mini Interactive Live Python Tester */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <Play className="w-4 h-4 text-emerald-400" />
              <span className="font-fun font-bold text-sm text-emerald-300">
                Testador Interativo de Expressão Python
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-code">a =</span>
                <input
                  type="number"
                  value={testNum1}
                  onChange={(e) => setTestNum1(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1 text-sm font-code text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-code">operador:</span>
                <select
                  value={testOp}
                  onChange={(e) => setTestOp(e.target.value as '+' | '-' | '*' | '/')}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1 text-sm font-code text-emerald-400 focus:outline-none focus:border-emerald-400 font-bold"
                >
                  <option value="+">+ (Soma)</option>
                  <option value="-">- (Subtração)</option>
                  <option value="*">* (Multiplicação)</option>
                  <option value="/">/ (Divisão)</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-code">b =</span>
                <input
                  type="number"
                  value={testNum2}
                  onChange={(e) => setTestNum2(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1 text-sm font-code text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="p-3 bg-black/50 rounded-xl font-code text-xs sm:text-sm border border-slate-800 text-slate-300">
              <div className="text-emerald-400">
                &gt;&gt;&gt; a = {testNum1}
              </div>
              <div className="text-emerald-400">
                &gt;&gt;&gt; b = {testNum2}
              </div>
              <div className="text-emerald-400">
                &gt;&gt;&gt; resultado = a {testOp} b
              </div>
              <div className="text-emerald-400">
                &gt;&gt;&gt; print(resultado)
              </div>
              <div className="text-white font-bold mt-1 pl-2 border-l-2 border-emerald-500">
                {String(getLiveResult())}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Standalone Tkinter GUI Script */}
      {activeTab === 'gui' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div>
              <h3 className="font-fun font-bold text-emerald-950 text-base">
                Calculadora Gráfica em Python (Tkinter)
              </h3>
              <p className="text-xs text-emerald-800">
                Abra uma janela no seu computador rodando <code className="font-code font-bold">python calculadora_pytchula_gui.py</code>.
                Utiliza a biblioteca padrão do Python, não requer nenhuma instalação adicional!
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy('gui', PYTHON_GUI_SCRIPT)}
                className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {copiedType === 'gui' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'gui' ? 'Copiado!' : 'Copiar'}
              </button>

              <button
                onClick={() => handleDownload('calculadora_pytchula_gui.py', PYTHON_GUI_SCRIPT)}
                className="btn-bubbly bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar .py
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-code text-xs sm:text-sm overflow-x-auto max-h-[420px] leading-relaxed border border-slate-800">
            {PYTHON_GUI_SCRIPT}
          </pre>
        </div>
      )}

      {/* TAB 3: Standalone CLI Script */}
      {activeTab === 'cli' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <div>
              <h3 className="font-fun font-bold text-blue-950 text-base">
                Calculadora de Linha de Comando (CLI)
              </h3>
              <p className="text-xs text-blue-800">
                Um código limpo, didático e bem estruturado com funções separadas para as 4 operações básicas e tratamento de erros.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy('cli', PYTHON_CLI_SCRIPT)}
                className="btn-bubbly bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {copiedType === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'cli' ? 'Copiado!' : 'Copiar'}
              </button>

              <button
                onClick={() => handleDownload('calculadora_pytchula_cli.py', PYTHON_CLI_SCRIPT)}
                className="btn-bubbly bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar .py
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-code text-xs sm:text-sm overflow-x-auto max-h-[420px] leading-relaxed border border-slate-800">
            {PYTHON_CLI_SCRIPT}
          </pre>
        </div>
      )}
    </div>
  );
};
