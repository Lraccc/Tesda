import { motion } from "motion/react";
import { Sparkles, Terminal } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 fixed top-0 w-full z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg leading-none">R</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">Resume<span className="text-blue-600">AI</span></span>
        <span className="ml-4 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100 hidden sm:block">
          PH Tech Career Coach
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-500">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-slate-700">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            AI Online
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
          <Sparkles size={14} />
          <span>Premium</span>
        </button>
      </div>
    </header>
  );
}
