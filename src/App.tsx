import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  Brain, 
  MessageSquare, 
  ShieldCheck, 
  Apple, 
  Heart, 
  UserCircle, 
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  LayoutDashboard
} from 'lucide-react';
import { BLOCKS } from './data';
import { UserProgress, Block, Question } from './types';

// Components
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      className="bg-indigo-600 h-full"
    />
  </div>
);

const SectionHeading = ({ children, icon: Icon }: { children: ReactNode, icon: any }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
      <Icon size={24} />
    </div>
    <h2 className="text-2xl font-bold text-gray-900">{children}</h2>
  </div>
);

export default function App() {
  const [view, setView] = useState<'intro' | 'learning' | 'results'>('intro');
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('academy_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validation of the parsed object
        if (parsed && typeof parsed === 'object' && 'completedBlocks' in parsed) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse progress', e);
    }
    return {
      currentBlockId: 1,
      completedBlocks: [],
      quizScores: {},
      answers: {}
    };
  });

  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [step, setStep] = useState<'theory' | 'glossary' | 'quiz'>('theory');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [tempScore, setTempScore] = useState(0);

  useEffect(() => {
    localStorage.setItem('academy_progress', JSON.stringify(progress));
  }, [progress]);

  const currentBlock = BLOCKS[currentBlockIndex];

  const handleStart = () => setView('learning');

  const goToNextBlock = () => {
    if (currentBlockIndex < BLOCKS.length - 1) {
      setCurrentBlockIndex(prev => prev + 1);
      setStep('theory');
      setCurrentQuestionIndex(0);
      setTempScore(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setView('results');
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === currentBlock.questions[currentQuestionIndex].correctIndex) {
      setTempScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentBlock.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // End of quiz for this block
      const finalScore = Math.round((tempScore / currentBlock.questions.length) * 100);
      setProgress(prev => ({
        ...prev,
        completedBlocks: Array.from(new Set([...prev.completedBlocks, currentBlock.id])),
        quizScores: { ...prev.quizScores, [currentBlock.id]: finalScore }
      }));
      goToNextBlock();
    }
  };

  const totalProgress = useMemo(() => {
    return Math.round((progress.completedBlocks.length / BLOCKS.length) * 100);
  }, [progress.completedBlocks]);

  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl w-full grid grid-cols-12 gap-4"
        >
          {/* Main Hero Card */}
          <div className="col-span-12 lg:col-span-8 bg-indigo-600 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-40" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-8">
                  <LayoutDashboard size={40} />
                </div>
                <h1 className="text-5xl font-black tracking-tight leading-[1.1] mb-6">
                  Академія Добробуту: <br />
                  <span className="text-indigo-200">Твій шлях до успіху</span>
                </h1>
                <p className="text-lg text-indigo-100/90 leading-relaxed max-w-xl">
                  Вітаємо у захопливій подорожі! Разом ми повторимо все, що вивчили за рік про здоров'я, 
                  безпеку та добробут.
                </p>
              </div>
              <div className="mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg shadow-lg hover:bg-slate-50 transition"
                >
                  Розпочати навчання
                </motion.button>
              </div>
            </div>
          </div>

          {/* Feature Grid Mini-Cards */}
          <div className="col-span-12 lg:col-span-4 grid grid-rows-3 gap-4">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Brain size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Глибокі знання</h3>
              <p className="text-xs text-slate-500 font-medium">9 інтерактивних блоків з детальною теорією.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Trophy size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Система нагород</h3>
              <p className="text-xs text-slate-500 font-medium">Перевіряй себе та отримуй результати миттєво.</p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
              <div className="w-10 h-10 bg-slate-800 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-lg mb-1">Аналіз прогресу</h3>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Відстежуй свої успіхи та прогалини в реальному часі.</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'results') {
    const scores = Object.values(progress.quizScores) as number[];
    const averageScore = BLOCKS.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / BLOCKS.length)
      : 0;

    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl w-full grid grid-cols-12 gap-4"
        >
          {/* Hero Statistics Card */}
          <div className="col-span-12 lg:col-span-8 bg-indigo-600 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-40" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-white/20 rounded-2xl">
                  <Award size={48} />
                </div>
                <div>
                   <h1 className="text-4xl font-black tracking-tight">Вітаємо з завершенням!</h1>
                   <p className="text-indigo-100 font-medium">Ти успішно пройшов курс "Добробут" для 5 класу.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-8 py-8 border-y border-white/10 mb-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Середній бал</p>
                  <p className="text-5xl font-black">{averageScore}%</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Модулів пройдено</p>
                  <p className="text-5xl font-black">{progress.completedBlocks.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Статус</p>
                  <p className="text-3xl font-black mt-2">{averageScore > 85 ? 'Відмінно' : averageScore > 70 ? 'Добре' : 'Пройдено'}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  localStorage.removeItem('academy_progress');
                  window.location.reload();
                }}
                className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-50 transition"
              >
                <RotateCcw size={20} /> Спробувати ще раз
              </button>
            </div>
          </div>

          {/* Analysis Cards */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
             <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex-1">
                <h3 className="font-black text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Сильні сторони
                </h3>
                <div className="space-y-4">
                   <div className="bg-emerald-50 p-4 rounded-2xl">
                      <p className="text-sm font-bold text-emerald-900">Стабільність навчання</p>
                      <p className="text-xs text-emerald-700 mt-1">Всі 9 блоків опрацьовано системно.</p>
                   </div>
                   <div className="bg-indigo-50 p-4 rounded-2xl">
                      <p className="text-sm font-bold text-indigo-900">Термінологія</p>
                      <p className="text-xs text-indigo-700 mt-1">Високий рівень знань ключових термінів.</p>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl flex-1">
                <h3 className="font-black border-b border-white/10 pb-4 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-indigo-400">
                  <AlertCircle size={16} /> Рекомендації
                </h3>
                <div className="space-y-4">
                   {Object.entries(progress.quizScores).filter(([_, score]) => (score as number) < 70).length > 0 ? (
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-3">Блоки для повторення:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(progress.quizScores)
                            .filter(([_, score]) => (score as number) < 70)
                            .map(([id]) => (
                              <span key={id} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                Блок {id}
                              </span>
                            ))
                          }
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-emerald-400 leading-snug">Ти чудово впорався! Продовжуй підтримувати цей рівень і надалі.</p>
                    )}
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">Порада: перед початком 6 класу переглянь правила фінансової грамотності.</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 leading-normal">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col overflow-hidden">
        <div className="p-6 bg-indigo-600">
          <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                <LayoutDashboard size={18} />
             </div>
             <h1 className="text-white font-black text-lg tracking-tight">Академія</h1>
          </div>
          <p className="text-indigo-100 text-[10px] uppercase font-bold tracking-widest">Курс: Добробут (5 клас)</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {BLOCKS.map((b, i) => (
            <button
              key={b.id}
              onClick={() => {
                setCurrentBlockIndex(i);
                setStep('theory');
              }}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
                i === currentBlockIndex 
                  ? 'bg-indigo-50 border border-indigo-100 shadow-sm' 
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className={`h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                progress.completedBlocks.includes(b.id) 
                  ? 'bg-emerald-500 text-white' 
                  : i === currentBlockIndex ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {progress.completedBlocks.includes(b.id) ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-bold truncate ${i === currentBlockIndex ? 'text-indigo-700' : 'text-slate-600'}`}>{b.title}</span>
                {progress.quizScores[b.id] !== undefined && (
                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{progress.quizScores[b.id]}% виконано</span>
                )}
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Твій Прогрес</span>
            <span className="text-xs font-black text-indigo-600">{totalProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              className="h-full bg-indigo-600 rounded-full"
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-slate-400 text-sm font-medium shrink-0">Блок {currentBlockIndex + 1} /</span>
            <span className="font-bold text-slate-800 text-sm truncate">{currentBlock.title}</span>
          </div>
          
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            {(['theory', 'quiz'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  step === s || (step === 'glossary' && s === 'theory')
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {s === 'theory' ? 'Конспект' : 'Тест'}
              </button>
            ))}
          </div>
        </header>

        {/* Content View Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <AnimatePresence mode="wait">
            {(step === 'theory' || step === 'glossary') && (
              <motion.div 
                key={`${currentBlockIndex}-theory`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-12 gap-4 max-w-7xl mx-auto h-full"
              >
                {/* Main Theory Card */}
                <section className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-10 overflow-hidden relative min-h-[500px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-bl-full opacity-30 -mr-12 -mt-12" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">📘 Глибока Теорія</h2>
                       <div className="flex items-center gap-2">
                        <button 
                          disabled={currentBlockIndex === 0}
                          onClick={() => setCurrentBlockIndex(prev => prev - 1)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{currentBlockIndex + 1} / {BLOCKS.length}</span>
                        <button 
                          disabled={currentBlockIndex === BLOCKS.length - 1}
                          onClick={() => setCurrentBlockIndex(prev => prev + 1)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition"
                        >
                          <ChevronRight size={20} />
                        </button>
                       </div>
                    </div>
                    
                    <h3 className="text-3xl font-black mb-8 text-slate-900 leading-tight">{currentBlock.title}</h3>
                    
                    <article className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed space-y-6">
                      {currentBlock.theory.split('\n\n').map((para, i) => (
                        <p key={i} className={para.startsWith('**') ? 'text-slate-900 font-black text-base mt-8' : ''}>
                          {para}
                        </p>
                      ))}
                    </article>
                  </div>
                </section>

                {/* Sidebar Column: Glossary + Actions */}
                <div className="col-span-12 lg:col-span-4 space-y-4 flex flex-col">
                  {/* Glossary Card (Slate-900 theme) */}
                  <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex-1 flex flex-col">
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">📖 Глосарій</h2>
                    <div className="space-y-8 flex-1">
                      {currentBlock.glossary.map((item) => (
                        <div key={item.term} className="border-l-2 border-indigo-500 pl-4 space-y-2">
                          <p className="font-black text-indigo-200 text-sm tracking-tight">{item.term}</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            {item.definition}
                          </p>
                          <div className="pt-2">
                            <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Приклад</p>
                            <p className="text-[11px] text-indigo-300/80 italic font-medium leading-snug">
                              {item.example}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Test Action Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                          <Brain size={20} />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 text-sm">Перевірка знань</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">5 питань • 1 спроба</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setStep('quiz')}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                    >
                      Перейти до тесту <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'quiz' && (
              <motion.div 
                key={`${currentBlockIndex}-quiz`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl mx-auto grid grid-cols-12 gap-4"
              >
                {/* Quiz Question Card */}
                <section className="col-span-12 lg:col-span-7 bg-indigo-600 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-40" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Питання {currentQuestionIndex + 1} / {currentBlock.questions.length}</span>
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: `${((currentQuestionIndex + 1) / currentBlock.questions.length) * 100}%` }} />
                      </div>
                    </div>
                    <h2 className="text-3xl font-black mb-10 leading-tight">
                      {currentBlock.questions[currentQuestionIndex].text}
                    </h2>
                    
                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-3xl backdrop-blur-md ${
                          selectedAnswer === currentBlock.questions[currentQuestionIndex].correctIndex 
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100' 
                            : 'bg-red-500/20 border border-red-500/30 text-red-100'
                        }`}
                      >
                        <p className="font-black text-sm mb-2 flex items-center gap-2">
                          {selectedAnswer === currentBlock.questions[currentQuestionIndex].correctIndex ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          {selectedAnswer === currentBlock.questions[currentQuestionIndex].correctIndex ? 'Чудово!' : 'Майже...'}
                        </p>
                        <p className="text-xs font-medium leading-relaxed opacity-90">
                          {selectedAnswer === currentBlock.questions[currentQuestionIndex].correctIndex 
                            ? currentBlock.questions[currentQuestionIndex].explanation
                            : currentBlock.questions[currentQuestionIndex].distractorExplanations[
                                selectedAnswer! > currentBlock.questions[currentQuestionIndex].correctIndex 
                                  ? selectedAnswer! - 1 
                                  : selectedAnswer!
                              ]
                          }
                        </p>
                      </motion.div>
                    )}
                  </div>
                </section>

                {/* Question Options Column */}
                <div className="col-span-12 lg:col-span-5 space-y-3">
                  {currentBlock.questions[currentQuestionIndex].options.map((option, idx) => {
                    const isCorrect = idx === currentBlock.questions[currentQuestionIndex].correctIndex;
                    const isSelected = selectedAnswer === idx;
                    
                    let bgClass = "bg-white border-slate-200 text-slate-700 hover:border-indigo-400";
                    if (showExplanation) {
                      if (isCorrect) bgClass = "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-50";
                      else if (isSelected) bgClass = "bg-red-50 border-red-500 text-red-700 ring-2 ring-red-50";
                      else bgClass = "bg-white border-slate-100 text-slate-300 opacity-60";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        className={`w-full p-6 rounded-2xl text-left font-bold border-2 transition-all flex items-center justify-between group ${bgClass}`}
                      >
                        <span className="text-sm">{option}</span>
                        {showExplanation && isCorrect && <CheckCircle2 size={18} />}
                        {showExplanation && isSelected && !isCorrect && <AlertCircle size={18} />}
                        {!showExplanation && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </button>
                    );
                  })}
                  
                  {showExplanation && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleNextQuestion}
                      className="w-full mt-4 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition shadow-xl"
                    >
                      {currentQuestionIndex < currentBlock.questions.length - 1 ? 'Далі' : 'Завершити модуль'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
