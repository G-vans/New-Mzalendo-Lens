
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  stepName?: string;
  onReset?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, stepName, onReset }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full max-w-2xl px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-xl">
            M
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Mzalendo Lens</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Civic Literacy</p>
          </div>
        </div>
        {stepName && (
          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {stepName}
          </span>
        )}
      </header>

      <main className="w-full max-w-2xl px-6 pb-20">
        {children}
      </main>

      <footer className="fixed bottom-0 w-full max-w-2xl bg-white/80 backdrop-blur-md border-t border-slate-100 py-4 px-6 flex justify-between items-center lg:left-1/2 lg:-translate-x-1/2">
        <p className="text-[10px] text-slate-400 font-medium italic">
          Powering the next generation of informed Kenyans.
        </p>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-black"></div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
