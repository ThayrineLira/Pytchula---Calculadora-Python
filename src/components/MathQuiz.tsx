import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RefreshCw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface Question {
  text: string;
  pyText: string;
  operation: string;
  correctAnswer: number;
  options: number[];
}

export const MathQuiz: React.FC = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  const generateQuestion = useCallback((): Question => {
    const ops = ['+', '-', '×', '÷'];
    const chosenOp = ops[Math.floor(Math.random() * ops.length)];

    let a = 0;
    let b = 0;
    let ans = 0;
    let pyOp = '';

    switch (chosenOp) {
      case '+':
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        ans = a + b;
        pyOp = '+';
        break;
      case '-':
        a = Math.floor(Math.random() * 25) + 5;
        b = Math.floor(Math.random() * a) + 1;
        ans = a - b;
        pyOp = '-';
        break;
      case '×':
        a = Math.floor(Math.random() * 9) + 2;
        b = Math.floor(Math.random() * 9) + 2;
        ans = a * b;
        pyOp = '*';
        break;
      case '÷':
        b = Math.floor(Math.random() * 8) + 2;
        ans = Math.floor(Math.random() * 10) + 1;
        a = b * ans; // Ensure integer division
        pyOp = '/';
        break;
    }

    // Generate 3 fake options close to real answer
    const optionsSet = new Set<number>([ans]);
    while (optionsSet.size < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      const wrong = ans + delta;
      if (wrong >= 0) optionsSet.add(wrong);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return {
      text: `${a} ${chosenOp} ${b}`,
      pyText: `${a} ${pyOp} ${b}`,
      operation: chosenOp,
      correctAnswer: ans,
      options,
    };
  }, []);

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, [generateQuestion]);

  const handleSelectAnswer = (option: number) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.correctAnswer) {
      sounds.playVictory();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6'],
      });
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      setFeedback('Sensacional! Você acertou! 🎉 Pytchula está muito orgulhosa!');
    } else {
      sounds.playOops();
      setStreak(0);
      setFeedback(`Quase lá! A resposta certa era ${currentQuestion.correctAnswer}. No Python: ${currentQuestion.pyText} = ${currentQuestion.correctAnswer}`);
    }
  };

  const handleNext = () => {
    sounds.playPop(550);
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback('');
    setCurrentQuestion(generateQuestion());
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/80 rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-md">
      {/* Header with Score & Streak */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-200/60 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-fun font-bold text-slate-800 text-lg sm:text-xl">
              Desafio Divertido da Pytchula
            </h3>
            <p className="text-xs text-slate-500">
              Treine as 4 operações básicas com alegria!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-sm flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{score} pts</span>
          </div>

          {streak > 1 && (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm text-xs font-bold flex items-center gap-1 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{streak} seguidas!</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block bg-white px-4 py-1.5 rounded-full border border-amber-300 text-amber-900 text-xs font-semibold mb-3">
            Qual é o resultado da operação?
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-inner mb-6 border border-slate-700">
            <div className="font-fun text-4xl sm:text-5xl font-bold text-emerald-400 tracking-wider">
              {currentQuestion.text} = ?
            </div>
            <div className="text-xs text-slate-400 font-code mt-2">
              Expressão Python: <span className="text-amber-300">{currentQuestion.pyText}</span>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.correctAnswer;

              let btnStyle = 'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-2 border-rose-600';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isAnswered}
                  className={`btn-bubbly py-4 rounded-2xl font-fun font-bold text-2xl transition-all shadow-sm ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="animate-fade-in p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                {selectedOption === currentQuestion.correctAnswer ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}
                <p className="font-fun text-sm text-slate-800 font-semibold">{feedback}</p>
              </div>

              <button
                onClick={handleNext}
                className="btn-bubbly w-full bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-base py-3 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Próxima Continha Alegre!
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
