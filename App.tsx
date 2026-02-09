
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppState, BillAnalysis, FileData } from './types';
import { analyzeBillSource } from './services/geminiService';
import Layout from './components/Layout';

const StartScreen: React.FC<{ 
  onAnalyze: (text?: string, file?: FileData) => void, 
  isLoading: boolean 
}> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<FileData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setFile({
        base64: base64String,
        mimeType: selectedFile.type
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3 italic tracking-tight">Knowledge is your <span className="text-green-600">Shield.</span></h2>
        <p className="text-slate-600 text-lg">Paste a section or upload a scan/PDF. We'll decode the legalese for you.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border-2 border-slate-100">
        {!file ? (
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text here or upload a file below..."
              className="w-full h-32 p-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-green-500 text-slate-800 placeholder:text-slate-400 resize-none transition-all font-medium text-lg"
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                📄
              </div>
              <p className="font-black text-slate-700 uppercase tracking-tight">Scan or Upload PDF</p>
              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-black">Max 10MB • JPG, PNG, PDF</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="application/pdf,image/*"
              />
            </div>
          </div>
        ) : (
          <div className="p-10 bg-green-50 rounded-[2.5rem] border-4 border-green-100 flex flex-col items-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">📄</div>
            <p className="font-black text-green-800 text-center text-xl line-clamp-1 px-4">{fileName}</p>
            <p className="text-xs text-green-600 mb-8 font-black uppercase tracking-[0.2em]">Document Locked & Loaded</p>
            <button 
              onClick={removeFile}
              className="px-6 py-3 bg-white border-2 border-green-200 text-red-500 rounded-2xl text-xs font-black shadow-sm hover:shadow-md transition-all active:scale-95 uppercase tracking-widest"
            >
              Change File
            </button>
          </div>
        )}

        <button
          onClick={() => onAnalyze(text, file || undefined)}
          disabled={isLoading || (!text.trim() && !file)}
          className={`w-full mt-8 py-6 rounded-[2rem] font-black text-xl transition-all transform active:translate-y-1 shadow-[0_8px_0_0_rgba(0,0,0,1)] active:shadow-none ${
            isLoading || (!text.trim() && !file) ? 'bg-slate-300 shadow-slate-400 text-slate-500 cursor-not-allowed translate-y-1' : 'bg-black text-white hover:bg-slate-800 translate-y-0'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              CRUNCHING DATA...
            </div>
          ) : 'DECODE BILL'}
        </button>
      </div>
    </div>
  );
};

const BreakdownScreen: React.FC<{ analysis: BillAnalysis, onNext: () => void }> = ({ analysis, onNext }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h2 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Executive Summary
        </h2>
        <div className="bg-white border-4 border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:border-green-400 transition-all duration-500">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-slate-800 text-2xl font-bold leading-relaxed italic z-10 relative tracking-tight">
            "{analysis.summary}"
          </p>
        </div>
      </div>

      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Reality Check</h3>
      <div className="grid gap-5 mb-12">
        {analysis.impactCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 flex items-start gap-6 shadow-sm hover:translate-y-[-4px] hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              {card.icon}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{card.title}</h4>
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-xl border-2 border-green-100 uppercase tracking-widest">
                  {card.category}
                </span>
              </div>
              <p className="text-slate-600 text-base leading-relaxed font-medium">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all shadow-[0_8px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-2 group"
      >
        <div className="flex items-center justify-center gap-3">
          ENTER THE ARENA
          <span className="group-hover:translate-x-3 transition-transform">🏃💨</span>
        </div>
      </button>
    </div>
  );
};

const QuizScreen: React.FC<{ quiz: BillAnalysis['quiz'], onComplete: (score: number) => void }> = ({ quiz, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quiz[currentIdx];
  const progress = ((currentIdx + (selectedIdx !== null ? 1 : 0)) / quiz.length) * 100;

  const levels = [
    { title: "STAGE 01: ROOKIE", color: "text-blue-500", bg: "bg-blue-50" },
    { title: "STAGE 02: VETERAN", color: "text-orange-500", bg: "bg-orange-50" },
    { title: "STAGE 03: ELITE", color: "text-purple-500", bg: "bg-purple-50" }
  ];
  const currentLevel = levels[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    if (idx === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
    setTimeout(() => setShowExplanation(true), 350);
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedIdx(null);
      setShowExplanation(false);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col min-h-[70vh]">
      <div className="flex items-center gap-5 mb-12 mt-4">
        <button onClick={() => window.location.reload()} className="text-slate-300 hover:text-red-500 transition-colors">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div className="h-5 bg-slate-200 rounded-full flex-grow overflow-hidden border-2 border-slate-200">
          <div 
            className="h-full bg-green-500 transition-all duration-1000 cubic-bezier(0.65, 0, 0.35, 1) shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-1.5 font-black text-orange-500 bg-orange-50 px-3 py-1.5 rounded-2xl border-2 border-orange-100">
          <span className="text-xl">🔥</span>
          <span className="text-lg">{score}</span>
        </div>
      </div>

      <div className="flex-grow">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-6 border-2 font-black text-[10px] tracking-[0.2em] animate-bounce ${currentLevel.bg} ${currentLevel.color} border-current/20`}>
          <div className={`w-2 h-2 rounded-full bg-current animate-pulse`}></div>
          {currentLevel.title}
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-10 leading-tight animate-in slide-in-from-left-4 duration-500 tracking-tight">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {currentQuestion.options.map((opt, i) => {
            const isCorrect = i === currentQuestion.correctIndex;
            const isSelected = i === selectedIdx;
            const isWrongSelection = isSelected && !isCorrect;
            
            let cardClass = "relative p-7 rounded-[2rem] border-2 font-black text-left transition-all duration-300 flex items-center gap-6 ";
            let shadowClass = "";

            if (selectedIdx === null) {
              cardClass += "border-slate-200 text-slate-700 bg-white hover:border-blue-500 hover:scale-[1.02] ";
              shadowClass = "shadow-[0_8px_0_0_#e2e8f0] active:shadow-none active:translate-y-[8px]";
            } else if (isCorrect) {
              cardClass += "border-green-500 bg-green-50 text-green-700 scale-[1.03] z-10 ";
              shadowClass = "shadow-[0_8px_0_0_#22c55e]";
            } else if (isWrongSelection) {
              cardClass += "border-red-500 bg-red-50 text-red-700 shake-animation ";
              shadowClass = "shadow-[0_8px_0_0_#ef4444]";
            } else {
              cardClass += "border-slate-100 bg-slate-50 text-slate-300 opacity-30 ";
              shadowClass = "shadow-none translate-y-[8px]";
            }

            return (
              <button 
                key={i} 
                onClick={() => handleSelect(i)} 
                className={`${cardClass} ${shadowClass}`}
                disabled={selectedIdx !== null}
              >
                <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-sm transition-all duration-300 shrink-0 ${
                  isSelected ? 'border-transparent bg-white shadow-md scale-110' : 'border-slate-200 text-slate-400 group-hover:border-blue-400'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-lg leading-tight">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className={`fixed bottom-0 left-0 right-0 p-8 pb-14 animate-in slide-in-from-bottom duration-500 z-50 border-t-8 ${
          selectedIdx === currentQuestion.correctIndex 
            ? 'bg-green-100 border-green-300 text-green-900' 
            : 'bg-red-100 border-red-300 text-red-900'
        }`}>
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-xl animate-bounce ${
                selectedIdx === currentQuestion.correctIndex ? 'bg-white text-green-500' : 'bg-white text-red-500'
              }`}>
                {selectedIdx === currentQuestion.correctIndex ? '✅' : '❌'}
              </div>
              <div>
                <h4 className="font-black text-2xl uppercase italic tracking-tighter mb-1">
                  {selectedIdx === currentQuestion.correctIndex ? 'Safi Sana!' : 'Check Vizuri!'}
                </h4>
                <p className="text-base font-bold opacity-90 leading-snug max-w-md italic">
                  "{currentQuestion.explanation}"
                </p>
              </div>
            </div>
            <button
              onClick={handleNext}
              className={`w-full sm:w-auto px-16 py-5 rounded-[2rem] font-black text-xl transition-all shadow-[0_8px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-2 ${
                selectedIdx === currentQuestion.correctIndex ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {currentIdx === quiz.length - 1 ? 'FINISH JOURNEY' : 'NEXT STAGE'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .shake-animation {
          animation: shake 0.25s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

const SummaryScreen: React.FC<{ analysis: BillAnalysis, score: number, total: number, onReset: () => void }> = ({ analysis, score, total, onReset }) => {
  const [showDetailed, setShowDetailed] = useState(false);
  const isWinner = score / total >= 0.6;

  return (
    <div className="text-center animate-in zoom-in duration-700 flex flex-col items-center">
      <div className="relative mb-12">
        <div className="w-48 h-48 bg-white border-8 border-orange-100 rounded-[4rem] flex items-center justify-center text-9xl shadow-2xl rotate-3 animate-in slide-in-from-top-4 duration-1000">
          {isWinner ? '🎓' : '📚'}
        </div>
        <div className="absolute -bottom-4 -right-4 bg-green-500 text-white w-20 h-20 rounded-[2rem] flex flex-col items-center justify-center font-black shadow-2xl border-4 border-white animate-bounce">
          <span className="text-[10px] uppercase opacity-80">SCORE</span>
          <span className="text-2xl">{score}/{total}</span>
        </div>
      </div>
      
      <h2 className="text-5xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter leading-none">
        {isWinner ? 'YOU ARE UNSTOPPABLE!' : 'THE GRIND CONTINUES!'}
      </h2>
      <p className="text-slate-600 text-2xl mb-12 font-medium max-w-sm leading-relaxed tracking-tight">
        {isWinner 
          ? "You decoded the fine print. You're officially harder to manipulate." 
          : "Democracy is a muscle. You just need a few more reps to get sharp."}
      </p>

      <div className="w-full space-y-5">
        <button
          onClick={onReset}
          className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-2xl hover:bg-slate-800 transition-all shadow-[0_10px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-2"
        >
          ANALYZE ANOTHER BILL
        </button>
        <button 
          onClick={() => setShowDetailed(true)}
          className="w-full py-6 bg-white border-4 border-slate-100 text-slate-700 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all shadow-[0_8px_0_0_#f1f5f9] active:shadow-none active:translate-y-2"
        >
          READ EXTENSIVE SUMMARY
        </button>
      </div>

      {/* Detailed Summary Modal */}
      {showDetailed && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-8 border-white animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900 italic uppercase">Extensive Intel</h3>
              <button 
                onClick={() => setShowDetailed(false)}
                className="w-10 h-10 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-10 text-left">
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-slate-700 text-lg leading-relaxed font-medium">
                  {analysis.detailedSummary}
                </p>
              </div>
            </div>
            <div className="p-8 bg-slate-50/80 border-t-2 border-slate-100">
              <button 
                onClick={() => setShowDetailed(false)}
                className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm"
              >
                GOT IT, LOUD AND CLEAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>(AppState.START);
  const [analysis, setAnalysis] = useState<BillAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  const handleAnalyze = async (text?: string, file?: FileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeBillSource(text, file);
      setAnalysis(result);
      setState(AppState.BREAKDOWN);
    } catch (err) {
      console.error(err);
      setError("SYSTEM OVERLOAD: Bill complexity exceeded limits. Try a clearer scan.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setState(AppState.START);
    setAnalysis(null);
    setError(null);
    setFinalScore(0);
  }, []);

  const getStepName = () => {
    switch(state) {
      case AppState.START: return "PHASE 01: INTEL";
      case AppState.BREAKDOWN: return "PHASE 02: DECODE";
      case AppState.QUIZ: return "PHASE 03: SIMULATE";
      case AppState.SUMMARY: return "PHASE 04: MASTERY";
      default: return "";
    }
  };

  return (
    <Layout stepName={getStepName()} onReset={handleReset}>
      {error && (
        <div className="mb-8 p-6 bg-red-50 border-4 border-red-200 text-red-600 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-4 animate-in shake-animation">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-lg">!</div>
          {error}
        </div>
      )}

      {state === AppState.START && (
        <StartScreen onAnalyze={handleAnalyze} isLoading={loading} />
      )}

      {state === AppState.BREAKDOWN && analysis && (
        <BreakdownScreen 
          analysis={analysis} 
          onNext={() => setState(AppState.QUIZ)} 
        />
      )}

      {state === AppState.QUIZ && analysis && (
        <QuizScreen 
          quiz={analysis.quiz} 
          onComplete={(score) => {
            setFinalScore(score);
            setState(AppState.SUMMARY);
          }} 
        />
      )}

      {state === AppState.SUMMARY && analysis && (
        <SummaryScreen 
          analysis={analysis}
          score={finalScore} 
          total={analysis.quiz.length} 
          onReset={handleReset} 
        />
      )}
    </Layout>
  );
}
