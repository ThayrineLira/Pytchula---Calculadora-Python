import React from 'react';
import { History, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';
import { CalculationRecord, formatNumberDisplay, OPERATION_META } from '../utils/calculatorEngine';
import { sounds } from '../utils/soundEffects';

interface HistoryListProps {
  history: CalculationRecord[];
  onSelectResult: (val: number | string) => void;
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectResult,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [copyErrorId, setCopyErrorId] = React.useState<string | null>(null);

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      sounds.playPop(600);
      setCopyErrorId(null);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Não foi possível copiar o código Python.', error);
      setCopiedId(null);
      setCopyErrorId(id);
      window.setTimeout(() => setCopyErrorId(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-md flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2 text-slate-800 font-fun font-bold text-lg">
          <History className="w-5 h-5 text-emerald-600" />
          <span>Histórico Alegre</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-sans font-semibold">
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              sounds.playClear();
              onClearHistory();
            }}
            className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            title="Limpar histórico"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpar
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
          <span className="text-3xl mb-2">🎈</span>
          <p className="font-fun text-sm text-slate-600 font-medium">Nenhum cálculo recente</p>
          <p className="text-xs text-slate-400 mt-1">
            Faça continhas de somar, subtrair, multiplicar ou dividir para vê-las aqui!
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[380px]">
          {history.map((item) => {
            const meta = OPERATION_META[item.operation];
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all hover:shadow-sm ${
                  item.isError
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{meta?.name || 'Operação'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Equation */}
                <div className="flex items-baseline justify-between mt-1">
                  <div className="font-code text-slate-700 text-sm">
                    {item.num1} {item.operation} {item.num2}
                  </div>
                  <div className="font-fun font-bold text-slate-900 text-base">
                    = {formatNumberDisplay(item.result)}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs">
                  <button
                    onClick={() => handleCopy(item.id, `resultado = ${item.num1} ${item.pythonOp} ${item.num2}`)}
                    className="text-slate-500 hover:text-emerald-700 font-mono flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copiar código em Python"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copiado!</span>
                      </>
                    ) : copyErrorId === item.id ? (
                      <span role="status" className="text-rose-600 font-semibold">
                        Falha ao copiar
                      </span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Python: {item.num1} {item.pythonOp} {item.num2}</span>
                      </>
                    )}
                  </button>

                  {!item.isError && (
                    <button
                      onClick={() => {
                        sounds.playPop(550);
                        onSelectResult(item.result);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="Usar esse resultado na calculadora"
                    >
                      <span>Usar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
