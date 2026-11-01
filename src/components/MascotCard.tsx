import React, { useState } from 'react';
import { Sparkles, MessageCircle, Heart, Lightbulb } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import mascotImage from '../assets/images/pytchula_mascot_1793566829971.jpg';

interface MascotCardProps {
  message: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'oops';
}

const CURIOSIDADES = [
  'Sabia que no Python o sinal de multiplicação é o asterisco (*)? 🐍✨',
  'No Python, a divisão com uma barra (/) sempre retorna um número decimal (float)! 🧮',
  'Se você dividir por zero no Python, ele avisa com um ZeroDivisionError! 🚫',
  'O nome Python foi inspirado no grupo de comédia britânico Monty Python! 🎭',
  'A adição (+) no Python também serve para juntar palavras! Ex: "Pyt" + "chula"! 🎈',
  'As quatro operações básicas (+, -, *, /) são os pilares de toda a ciência de dados! 🚀',
];

export const MascotCard: React.FC<MascotCardProps> = ({ message }) => {
  const [curiosityIndex, setCuriosityIndex] = useState<number | null>(null);
  const [isWiggling, setIsWiggling] = useState(false);

  const handleMascotClick = () => {
    sounds.playPop(700);
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);

    const nextIndex = curiosityIndex === null ? 0 : (curiosityIndex + 1) % CURIOSIDADES.length;
    setCuriosityIndex(nextIndex);
  };

  const activeMessage = curiosityIndex !== null ? CURIOSIDADES[curiosityIndex] : message;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 p-5 border-2 border-emerald-200/80 shadow-md">
      {/* Decorative joyful background blobs */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200/50 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-200/40 rounded-full blur-xl pointer-events-none" />

      <div className="relative flex items-center gap-4">
        {/* Mascot Avatar with wiggle animation on click */}
        <button
          onClick={handleMascotClick}
          title="Clique na Pytchula para ouvir curiosidades!"
          className={`relative group shrink-0 transition-transform duration-300 cursor-pointer ${
            isWiggling ? 'scale-110 rotate-6' : 'hover:scale-105'
          }`}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-md bg-white p-1">
            <img
              src={mascotImage}
              alt="Pytchula - Mascote Alegre da Calculadora Python"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute -bottom-2 -right-1 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500 shadow-sm flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-900" /> Clique!
          </span>
        </button>

        {/* Speech Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-800 font-fun font-semibold text-sm">
            <span>Pytchula diz:</span>
            <span className="inline-block animate-pulse">💚</span>
          </div>

          <div className="relative bg-white/95 rounded-2xl px-4 py-3 border border-emerald-200/90 shadow-sm text-slate-800 text-sm sm:text-base font-fun leading-snug">
            {/* Bubble pointer */}
            <div className="absolute top-4 -left-2 w-3 h-3 bg-white border-l border-t border-emerald-200/90 rotate-[-45deg]" />
            <p className="transition-all duration-200">{activeMessage}</p>

            {curiosityIndex !== null && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCuriosityIndex(null);
                }}
                className="mt-2 text-xs text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 font-sans"
              >
                <MessageCircle className="w-3 h-3" /> Voltar à conversa da calculadora
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
